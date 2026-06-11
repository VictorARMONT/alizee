"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { DeliveryAddress } from "@/components/CheckoutSummary";

/* ── Google Maps loader (singleton, no re-load) ─────────────────────── */
const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

let _loaded = false;
let _loading = false;
const _queue: (() => void)[] = [];

function loadMaps(cb: () => void) {
  if (_loaded) { cb(); return; }
  _queue.push(cb);
  if (_loading) return;
  _loading = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__gmInit = () => {
    _loaded = true;
    _queue.splice(0).forEach((f) => f());
  };
  const s = document.createElement("script");
  s.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&libraries=places&language=es&region=MX&callback=__gmInit`;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

/* ── Time slots ──────────────────────────────────────────────────────── */
const SLOTS = [
  { id: "manana",   label: "Mañana",  sub: "9 am – 1 pm" },
  { id: "tarde",    label: "Tarde",   sub: "1 pm – 6 pm" },
  { id: "noche",    label: "Noche",   sub: "6 pm – 9 pm" },
  { id: "flexible", label: "Flexible",sub: "Cualquier hora" },
];

/* ── Props ───────────────────────────────────────────────────────────── */
interface Props {
  address: DeliveryAddress;
  onChange: (a: DeliveryAddress) => void;
}

/* ── Main component ──────────────────────────────────────────────────── */
export function AddressAutocomplete({ address, onChange }: Props) {
  if (!GMAPS_KEY) return <ManualForm address={address} onChange={onChange} />;
  return <GoogleForm address={address} onChange={onChange} />;
}

/* ── Google-powered form ─────────────────────────────────────────────── */
function GoogleForm({ address, onChange }: Props) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const mapDivRef  = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef     = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef  = useRef<any>(null);
  const [ready, setReady]     = useState(false);
  const [pinned, setPinned]   = useState(false);
  const [searchVal, setSearchVal] = useState(address.formattedAddress ?? "");

  /* Parse a google.maps.places.PlaceResult into DeliveryAddress */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyPlace = useCallback((place: any, lat?: number, lng?: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const get = (type: string) => place.address_components?.find((c: any) => c.types.includes(type))?.long_name ?? "";
    const streetNum = get("street_number");
    const route     = get("route");
    const colonia   =
      get("sublocality_level_1") ||
      get("sublocality") ||
      get("neighborhood") ||
      get("political");
    const city  = get("locality") || get("administrative_area_level_2");
    const state = get("administrative_area_level_1");
    const zip   = get("postal_code");

    const finalLat = lat ?? place.geometry?.location?.lat?.();
    const finalLng = lng ?? place.geometry?.location?.lng?.();

    onChange({
      ...address,
      street:           [streetNum, route].filter(Boolean).join(" "),
      colonia,
      cityState:        [city, state].filter(Boolean).join(", "),
      zip,
      formattedAddress: place.formatted_address ?? searchVal,
      lat:              finalLat,
      lng:              finalLng,
    });
    setSearchVal(place.formatted_address ?? searchVal);
  }, [address, onChange, searchVal]);

  /* Latest applyPlace en ref — los listeners del mapa se montan 1 vez y de otro
     modo capturarían la primera versión de applyPlace (address/searchVal stale).
     Apuntar a la versión actual evita sobrescribir con datos viejos al arrastrar
     el pin o tocar el mapa, sin re-crear el mapa en cada render. */
  const applyPlaceRef = useRef(applyPlace);
  useEffect(() => { applyPlaceRef.current = applyPlace; }, [applyPlace]);

  /* Reverse-geocode and update address from LatLng */
  const fromLatLng = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (lat: number, lng: number, g: any) => {
      const gc = new g.maps.Geocoder();
      gc.geocode({ location: { lat, lng } }, (results: unknown[], status: string) => {
        if (status !== "OK" || !results?.[0]) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        applyPlaceRef.current(results[0] as any, lat, lng);
      });
    },
    []
  );

  /* Load Maps + init autocomplete + map */
  useEffect(() => {
    loadMaps(() => {
      setReady(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = window as any;
      if (!inputRef.current || !mapDivRef.current) return;

      /* Default center: CDMX */
      const defaultCenter = { lat: 19.4326, lng: -99.1332 };
      const initialCenter = address.lat && address.lng
        ? { lat: address.lat, lng: address.lng }
        : defaultCenter;

      /* Map */
      const map = new g.google.maps.Map(mapDivRef.current, {
        center: initialCenter,
        zoom:   address.lat ? 16 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: { position: g.google.maps.ControlPosition.RIGHT_CENTER },
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        ],
      });
      mapRef.current = map;

      /* Marker */
      const marker = new g.google.maps.Marker({
        map,
        draggable: true,
        position: address.lat && address.lng ? initialCenter : null,
        visible:  !!(address.lat && address.lng),
        icon: {
          path: g.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#E91E8C",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });
      markerRef.current = marker;

      /* Marker drag → reverse geocode */
      marker.addListener("dragend", () => {
        const pos = marker.getPosition();
        if (!pos) return;
        fromLatLng(pos.lat(), pos.lng(), g);
      });

      /* Map click → move marker */
      map.addListener("click", (e: { latLng: { lat: () => number; lng: () => number } }) => {
        marker.setPosition(e.latLng);
        marker.setVisible(true);
        setPinned(true);
        fromLatLng(e.latLng.lat(), e.latLng.lng(), g);
      });

      /* Autocomplete */
      const ac = new g.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "mx" },
        fields: ["address_components", "geometry", "formatted_address"],
      });
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (!place.geometry?.location) return;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        map.setCenter({ lat, lng });
        map.setZoom(17);
        marker.setPosition({ lat, lng });
        marker.setVisible(true);
        setPinned(true);
        applyPlaceRef.current(place, lat, lng);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Keep map in sync if external lat/lng set */
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !address.lat || !address.lng) return;
    const pos = { lat: address.lat, lng: address.lng };
    mapRef.current.setCenter(pos);
    markerRef.current.setPosition(pos);
    markerRef.current.setVisible(true);
    setPinned(true);
  }, [address.lat, address.lng]);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 flex flex-col gap-4">
      <div>
        <p className="text-[16px] font-semibold text-[var(--brand-fg)]">¿Dónde lo entregamos?</p>
        <p className="text-xs text-[var(--brand-fg-muted)] mt-0.5">
          Escribe tu dirección y confirma el pin en el mapa.
        </p>
      </div>

      {/* Search input */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-fg-muted)]">
          Dirección *
        </label>
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Calle, número, colonia…"
          className="min-h-[48px] rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-4 text-[15px] text-[var(--brand-fg)] placeholder:text-[var(--brand-fg-muted)] outline-none focus:border-[var(--brand-primary)] transition-colors"
        />
      </div>

      {/* Map */}
      <div className="relative overflow-hidden rounded-[var(--radius-md)]" style={{ height: 240 }}>
        <div ref={mapDivRef} className="w-full h-full" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--brand-surface)]">
            <span className="text-[13px] text-[var(--brand-fg-muted)]">Cargando mapa…</span>
          </div>
        )}
        {ready && !pinned && (
          <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-sm py-2 px-3 pointer-events-none">
            <p className="text-[11px] text-white text-center">
              Toca el mapa o busca tu dirección para colocar el pin
            </p>
          </div>
        )}
        {pinned && (
          <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 shadow text-[10px] font-medium" style={{ color: "var(--brand-primary)" }}>
            Pin confirmado ✓
          </div>
        )}
      </div>

      {/* References */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-fg-muted)]">
          Referencias (portón, piso, entre calles…)
        </label>
        <input
          type="text"
          autoComplete="off"
          value={address.references}
          onChange={(e) => onChange({ ...address, references: e.target.value })}
          placeholder="Portón azul, 2° piso, entre Álvaro Obregón y Sonora…"
          className="min-h-[44px] rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 text-[15px] text-[var(--brand-fg)] placeholder:text-[var(--brand-fg-muted)] outline-none focus:border-[var(--brand-primary)] transition-colors"
        />
      </div>

      {/* Delivery time */}
      <DeliveryTimeSelector
        value={address.deliveryTime ?? ""}
        onChange={(t) => onChange({ ...address, deliveryTime: t })}
      />
    </div>
  );
}

/* ── Time selector ───────────────────────────────────────────────────── */
function DeliveryTimeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-fg-muted)]">
        ¿A qué hora puede recibirlo?
      </label>
      <div className="grid grid-cols-2 gap-2">
        {SLOTS.map((s) => {
          const active = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              style={active ? {
                borderColor: "var(--brand-primary)",
                background: "rgba(233,30,140,0.06)",
              } : undefined}
              className={`
                flex flex-col items-start rounded-[var(--radius-md)] border px-3 py-3
                text-left transition-colors focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]
                ${active
                  ? "text-[var(--brand-fg)]"
                  : "border-[var(--brand-border)] bg-[var(--brand-bg)] hover:border-[var(--brand-primary)]"
                }
              `}
            >
              <span className="text-[13px] font-semibold leading-tight" style={active ? { color: "var(--brand-primary)" } : { color: "var(--brand-fg)" }}>
                {s.label}
              </span>
              <span className="text-[11px] text-[var(--brand-fg-muted)]">{s.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Manual fallback (no API key) ────────────────────────────────────── */
function ManualForm({ address, onChange }: Props) {
  function field(key: keyof DeliveryAddress) {
    return (value: string) => onChange({ ...address, [key]: value });
  }
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 flex flex-col gap-4">
      <div>
        <p className="text-[16px] font-semibold text-[var(--brand-fg)]">¿Dónde lo entregamos?</p>
        <p className="text-xs text-[var(--brand-fg-muted)] mt-0.5">La enviamos junto con tu pedido por WhatsApp.</p>
      </div>
      <div className="flex flex-col gap-3">
        <Field label="Calle y número *"    placeholder="Reforma 222, Depto. 3"  value={address.street}    onChange={field("street")} />
        <Field label="Colonia *"           placeholder="Roma Norte"              value={address.colonia}   onChange={field("colonia")} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ciudad / Estado *" placeholder="CDMX"                   value={address.cityState} onChange={field("cityState")} />
          <Field label="CP *"              placeholder="06600"                   value={address.zip}       onChange={field("zip")} inputMode="numeric" maxLength={10} />
        </div>
        <Field label="Referencias"         placeholder="Portón azul, entre…"    value={address.references} onChange={field("references")} />
      </div>
      <DeliveryTimeSelector
        value={address.deliveryTime ?? ""}
        onChange={(t) => onChange({ ...address, deliveryTime: t })}
      />
    </div>
  );
}

function Field({
  label, placeholder, value, onChange, inputMode, maxLength,
}: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-fg-muted)]">{label}</label>
      <input
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        inputMode={inputMode}
        maxLength={maxLength ?? 200}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[44px] rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 text-[15px] text-[var(--brand-fg)] placeholder:text-[var(--brand-fg-muted)] outline-none focus:border-[var(--brand-primary)] transition-colors"
      />
    </div>
  );
}
