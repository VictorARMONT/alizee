"use client";

import { useState } from "react";
import { BOX_TIERS, formatMXN } from "@/data/pricing";
import { Countdown } from "@/components/Countdown";
import type { ArchetypeKey } from "@/data/questions";
import { ARCHETYPES } from "@/data/archetypes";

export interface DeliveryAddress {
  street: string;
  colonia: string;
  cityState: string;
  zip: string;
  references: string;
}

function isAddressComplete(a: DeliveryAddress) {
  return a.street.trim() !== "" && a.colonia.trim() !== "" && a.cityState.trim() !== "" && a.zip.trim() !== "";
}

interface CheckoutSummaryProps {
  archetypeKey: ArchetypeKey;
  selectedTierIdx: number;
  upgradesSelected: Record<string, boolean>;
  total: number;
  initialEmail: string | null;
  onEmailSave: (email: string) => void;
  onCheckout: (address: DeliveryAddress) => void;
}

export function CheckoutSummary({
  archetypeKey,
  selectedTierIdx,
  upgradesSelected,
  total,
  initialEmail,
  onEmailSave,
  onCheckout,
}: CheckoutSummaryProps) {
  const arch = ARCHETYPES[archetypeKey];
  const tier = BOX_TIERS[selectedTierIdx];
  const [address, setAddress] = useState<DeliveryAddress>({
    street: "", colonia: "", cityState: "", zip: "", references: "",
  });
  const addressReady = isAddressComplete(address);

  return (
    <div className="flex flex-col gap-8 pb-32">
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--brand-primary)]">
          Resumen
        </p>
        <h2 className="text-[32px] font-semibold tracking-tight mt-2">
          Su regalo está listo.
        </h2>
      </div>

      {/* Desglose */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface)] overflow-hidden">
        <LineItem label={`Box ${tier.name}`} sublabel={`${arch.name} · ${tier.tagline}`} amount={tier.priceMXN} />

        {/* Contenido del box según tier */}
        {tier.includes.map((item) => (
          <LineItem key={item} label={item} amount={0} included />
        ))}

        {/* Total */}
        <div className="flex items-center justify-between px-5 py-4 border-t-2 border-[var(--brand-border)]">
          <p className="text-[17px] font-semibold text-[var(--brand-fg)]">Total</p>
          <p className="text-[22px] font-semibold tabular-nums text-[var(--brand-primary)]">
            {formatMXN(total)}
          </p>
        </div>
      </div>

      {/* Trust + urgencia */}
      <div className="flex flex-col gap-3 items-center">
        <Countdown />
        <ul className="grid grid-cols-3 gap-2 w-full text-[11px] uppercase tracking-[0.18em] text-[var(--brand-fg-muted)] text-center">
          <li>Hecho a mano</li>
          <li>Garantía</li>
          <li>Envío MX</li>
        </ul>
      </div>

      {/* Dirección de entrega */}
      <AddressForm address={address} onChange={setAddress} />

      {/* CTA principal */}
      <button
        type="button"
        disabled={!addressReady}
        onClick={() => onCheckout(address)}
        style={addressReady ? {
          background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)",
        } : undefined}
        className={`
          w-full min-h-[60px] rounded-full
          text-[19px] font-semibold select-none
          transition-[filter,transform,opacity] active:scale-[0.99]
          ${addressReady
            ? "text-white hover:opacity-90 active:opacity-80"
            : "bg-[var(--brand-border)] text-[var(--brand-fg-muted)] cursor-not-allowed opacity-60"
          }
        `}
      >
        Confirmar por WhatsApp →
      </button>
      {!addressReady && (
        <p className="text-[12px] text-center text-[var(--brand-fg-muted)] -mt-4">
          Completa tu dirección de entrega para continuar.
        </p>
      )}

      {/* Captura email — solo aquí, después del reveal */}
      <EmailCapture initial={initialEmail} onSave={onEmailSave} />

      <p className="text-[11px] text-center text-[var(--brand-fg-muted)]">
        ALIZEE · Significado, no predicción · México
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function LineItem({
  label,
  sublabel,
  amount,
  included,
}: {
  label: string;
  sublabel?: string;
  amount: number;
  included?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--brand-border)] last:border-b-0">
      <div className="flex flex-col leading-tight">
        <span className="text-[15px] text-[var(--brand-fg)]">{label}</span>
        {sublabel && (
          <span className="text-xs text-[var(--brand-fg-muted)]">{sublabel}</span>
        )}
      </div>
      <span className="text-[14px] tabular-nums shrink-0 ml-4"
        style={{ color: included ? "var(--brand-success)" : "var(--brand-fg)" }}
      >
        {included ? "incluido" : `+${formatMXN(amount)}`}
      </span>
    </div>
  );
}

function AddressForm({
  address,
  onChange,
}: {
  address: DeliveryAddress;
  onChange: (a: DeliveryAddress) => void;
}) {
  function field(key: keyof DeliveryAddress) {
    return (value: string) => onChange({ ...address, [key]: value });
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 flex flex-col gap-4">
      <div>
        <p className="text-[16px] font-semibold text-[var(--brand-fg)]">Dirección de entrega</p>
        <p className="text-xs text-[var(--brand-fg-muted)] mt-0.5">
          La enviamos junto con tu pedido por WhatsApp.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <AddressInput
          label="Calle y número *"
          placeholder="Ej. Reforma 222, Depto. 3"
          value={address.street}
          onChange={field("street")}
        />
        <AddressInput
          label="Colonia / Alcaldía *"
          placeholder="Ej. Roma Norte"
          value={address.colonia}
          onChange={field("colonia")}
        />
        <div className="grid grid-cols-2 gap-3">
          <AddressInput
            label="Ciudad y Estado *"
            placeholder="Ej. CDMX"
            value={address.cityState}
            onChange={field("cityState")}
          />
          <AddressInput
            label="Código postal *"
            placeholder="5 dígitos"
            value={address.zip}
            onChange={field("zip")}
            inputMode="numeric"
            maxLength={10}
          />
        </div>
        <AddressInput
          label="Referencias"
          placeholder="Ej. portón azul, entre calles..."
          value={address.references}
          onChange={field("references")}
        />
      </div>
    </div>
  );
}

function AddressInput({
  label,
  placeholder,
  value,
  onChange,
  inputMode,
  maxLength,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] uppercase tracking-[0.16em] text-[var(--brand-fg-muted)]">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        inputMode={inputMode}
        maxLength={maxLength ?? 200}
        onChange={(e) => onChange(e.target.value)}
        className="
          min-h-[44px] rounded-[var(--radius-md)]
          border border-[var(--brand-border)] bg-[var(--brand-bg)]
          px-3 text-[15px] text-[var(--brand-fg)]
          placeholder:text-[var(--brand-fg-muted)]
          outline-none focus:border-[var(--brand-primary)]
          transition-colors
        "
      />
    </div>
  );
}

function EmailCapture({
  initial,
  onSave,
}: {
  initial: string | null;
  onSave: (email: string) => void;
}) {
  const [value, setValue] = useState(initial ?? "");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // silencioso — el lead igual queda en estado local
    } finally {
      setLoading(false);
      onSave(email);
      setSaved(true);
    }
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 flex flex-col gap-3">
      <div>
        <p className="text-[16px] font-medium text-[var(--brand-fg)]">Guarda su regalo</p>
        <p className="text-xs text-[var(--brand-fg-muted)] mt-0.5">
          Te mandamos el dossier por email. Sin spam.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          value={value}
          onChange={(e) => { setValue(e.target.value); setSaved(false); }}
          className="
            flex-1 min-h-[48px] rounded-full
            border border-[var(--brand-border)] bg-[var(--brand-bg)]
            px-4 text-[16px] text-[var(--brand-fg)]
            placeholder:text-[var(--brand-fg-muted)]
            outline-none focus:border-[var(--brand-primary)]
          "
        />
        <button
          type="submit"
          disabled={loading}
          className="
            min-h-[48px] rounded-full px-5
            border border-[var(--brand-primary)] text-[var(--brand-primary)]
            hover:bg-[var(--brand-primary)] hover:text-[var(--brand-primary-fg)]
            transition-colors text-[15px] font-medium
            disabled:opacity-50
          "
        >
          {saved ? "✓ Listo" : loading ? "..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
