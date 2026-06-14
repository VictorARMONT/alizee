/**
 * ALIZEE — Ficha de diseño (uso interno: producción)
 * Ruta: /ficha?d=<token>
 *
 * Server component: descifra el payload del URL (AES-256-GCM, ver
 * ficha.server.ts), calcula todos los sistemas de identidad y renderiza el
 * reporte completo. Victor lo abre desde WhatsApp y lo imprime a PDF.
 *
 * El link llega en el mensaje de WhatsApp al confirmar pedido.
 * noindex + bloqueado en robots.ts (lleva PII).
 */

import { notFound } from "next/navigation";
import type { FichaPayload, FichaAddress } from "@/lib/ficha";
import { decodeFichaPlain } from "@/lib/ficha";
import { decryptFicha, isEncryptedToken } from "@/lib/ficha.server";
import { ARCHETYPES } from "@/data/archetypes";
import { BOX_TIERS, formatMXN } from "@/data/pricing";
import { QUESTIONS } from "@/data/questions";
import { SIGN_INFO } from "@/data/zodiac";
import { getTotemProfile } from "@/data/totem";
import { getChineseZodiac, getKinMaya } from "@/data/birthProfile";
import { getGeneration } from "@/data/generational";
import { getProfesion } from "@/data/profesion";
import { getAffirmations } from "@/lib/affirmations";
import { getArchetypeQuote } from "@/data/quotes";
import type { ArchetypeKey } from "@/data/questions";
import { PrintButton } from "@/components/PrintButton";

/* ── Helpers ──────────────────────────────────────────────────────── */

function decode(encoded: string): FichaPayload | null {
  // Token cifrado (prod): descifrar con FICHA_SECRET.
  if (isEncryptedToken(encoded)) {
    const secret = process.env.FICHA_SECRET;
    if (!secret) return null;
    return decryptFicha(encoded, secret);
  }
  // Fallback dev / links legacy: base64 sin cifrar.
  return decodeFichaPlain(encoded);
}

function fmtAddress(a: FichaAddress): string {
  if (a.formattedAddress) return a.formattedAddress;
  return [a.street, `Col. ${a.colonia}`, a.cityState, `CP ${a.zip}`]
    .filter(Boolean)
    .join(", ");
}

function getLabel(qId: string, key: string): string {
  const q = QUESTIONS.find((x) => x.id === qId);
  return q?.options?.find((o) => o.key === key)?.label ?? key;
}

const ARCHETYPE_ANIMALS: Record<string, string> = {
  lider: "Águila Real",
  explorador: "Lobo Gris",
  creador: "Jaguar",
  sabio: "Búho Cornudo",
};

const ARCHETYPE_DESIGN: Record<string, { colors: string; mood: string }> = {
  lider:     { colors: "Terracota, siena, marrón oscuro, dorado opaco",       mood: "Presencia, autoridad, construcción" },
  explorador:{ colors: "Verde bosque, gris pizarra, azul noche, café terroso", mood: "Movimiento, naturaleza, libertad" },
  creador:   { colors: "Morado profundo, negro, ocre, dorado brillante",       mood: "Expresión, originalidad, fuego" },
  sabio:     { colors: "Ámbar, café oscuro, verde olivo, crema antigua",       mood: "Profundidad, pausa, conocimiento" },
};

const SLOT_LABELS: Record<string, string> = {
  morning: "Mañana (9–13h)",
  afternoon: "Tarde (13–18h)",
  evening: "Noche (18–21h)",
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  papa: "Mi papá", abuelo: "Mi abuelo", pareja: "Mi esposo o pareja",
  suegro: "Mi suegro", otra: "Otra figura paterna",
};

/* ── Metadata ─────────────────────────────────────────────────────── */

export const metadata = { robots: "noindex, nofollow" };

/* ── Página ───────────────────────────────────────────────────────── */

export default async function FichaPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const params = await searchParams;
  if (!params.d) notFound();

  const p = decode(params.d);
  if (!p) notFound();

  const arch = ARCHETYPES[p.archetypeKey as ArchetypeKey];
  if (!arch) notFound();

  const tier = BOX_TIERS[p.tierIdx] ?? BOX_TIERS[1];
  const design = ARCHETYPE_DESIGN[p.archetypeKey] ?? null;
  const animalDiseno = ARCHETYPE_ANIMALS[p.archetypeKey] ?? "—";

  // Sistemas de identidad (solo si hay fecha)
  const chinese    = p.birthDate ? getChineseZodiac(p.birthDate) : null;
  const kinMaya    = p.birthDate ? getKinMaya(p.birthDate)       : null;
  const generation = p.birthDate ? getGeneration(p.birthDate)    : null;
  const signInfo   = p.sign     ? SIGN_INFO[p.sign as keyof typeof SIGN_INFO] ?? null : null;
  const totem      = p.birthDate ? getTotemProfile(p.birthDate, p.answers, "sol") : null;

  // Afirmaciones (requieren kinMaya y signo)
  let affirmations = null;
  if (kinMaya) {
    try {
      // element: "fire"|"earth"|"air"|"water" — derivamos del signo; fallback "earth"
      const SIGN_ELEMENTS: Record<string, string> = {
        aries:"fire", leo:"fire", sagitario:"fire",
        tauro:"earth", virgo:"earth", capricornio:"earth",
        geminis:"air", libra:"air", acuario:"air",
        cancer:"water", escorpio:"water", piscis:"water",
      };
      const element = (p.sign ? SIGN_ELEMENTS[p.sign] : null) ?? "earth";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      affirmations = getAffirmations(p.archetypeKey as ArchetypeKey, kinMaya.sealIndex, element as any);
    } catch { /* sin datos suficientes */ }
  }

  // Quote
  let quote = null;
  try {
    const seed = p.birthDate ? new Date(p.birthDate).getDate() : 0;
    quote = getArchetypeQuote(p.archetypeKey as ArchetypeKey, seed);
  } catch { /* sin quotes */ }

  // Profesión
  const profesion = getProfesion(p.answers?.profesion ?? null);

  // Fecha formateada
  const createdAt = new Date(p.createdAt).toLocaleString("es-MX", {
    dateStyle: "long", timeStyle: "short", timeZone: "America/Mexico_City",
  });

  const birthDateFmt = p.birthDate
    ? new Date(p.birthDate + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
    : null;

  // Quiz answers a mostrar (orden del quiz Q1-Q11)
  const quizRows = [
    p.answers.relationship && { label: "¿Para quién?",    value: getLabel("relationship", p.answers.relationship) },
    p.answers.profesion    && { label: "Profesión",        value: profesion?.label ?? p.answers.profesion },
    p.answers.proyeccion   && { label: "Proyección",       value: getLabel("proyeccion",   p.answers.proyeccion)   },
    p.answers.decision     && { label: "Lugar ideal",      value: getLabel("decision",     p.answers.decision)     },
    p.answers.presion      && { label: "Bajo presión",     value: getLabel("presion",      p.answers.presion)      },
    p.answers.energia      && { label: "Energía social",   value: getLabel("energia",      p.answers.energia)      },
    p.answers.apertura     && { label: "Ante lo nuevo",    value: getLabel("apertura",     p.answers.apertura)     },
    p.answers.valores      && { label: "Valora en otros",  value: getLabel("valores",      p.answers.valores)      },
    p.answers.mascotas     && { label: "Animales",         value: getLabel("mascotas",     p.answers.mascotas)     },
    p.answers.sobreEl      && { label: "En sus palabras",  value: p.answers.sobreEl },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      {/* Print button — oculto al imprimir */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <PrintButton />
      </div>

      <div
        className="min-h-screen bg-white text-gray-900 font-sans antialiased"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        {/* ── CABECERA ─────────────────────────────────────────────── */}
        <header
          className="w-full px-8 py-5 flex items-center justify-between print:py-4"
          style={{ background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)" }}
        >
          <div>
            <p className="text-white/70 text-[10px] uppercase tracking-[0.25em] font-semibold">ALIZEE</p>
            <h1 className="text-white text-2xl font-bold tracking-tight mt-0.5">Ficha de Diseño</h1>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs">{createdAt}</p>
            <p className="text-white font-semibold text-sm mt-0.5">{tier.name} · {formatMXN(p.total)}</p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-8 py-8 flex flex-col gap-8 print:py-5 print:gap-6">

          {/* ── PEDIDO ─────────────────────────────────────────────── */}
          <Section label="Pedido">
            <Grid>
              <Field label="Box" value={tier.name} />
              <Field label="Total" value={formatMXN(p.total)} />
              <Field label="Para" value={p.relationship ? (RELATIONSHIP_LABELS[p.relationship] ?? p.relationship) : "—"} />
              {p.address.deliveryTime && (
                <Field label="Horario entrega" value={SLOT_LABELS[p.address.deliveryTime] ?? p.address.deliveryTime} />
              )}
            </Grid>
            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-1">Dirección de entrega</p>
              <p className="text-sm font-medium text-gray-800">{fmtAddress(p.address)}</p>
              {p.address.references && (
                <p className="text-xs text-gray-500 mt-1">📍 {p.address.references}</p>
              )}
              {p.address.lat && p.address.lng && (
                <a
                  href={`https://maps.google.com/?q=${p.address.lat},${p.address.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-600 underline mt-1 block print:hidden"
                >
                  Ver en Google Maps →
                </a>
              )}
            </div>
          </Section>

          {/* ── ARQUETIPO ──────────────────────────────────────────── */}
          <Section label="Arquetipo" accent>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold" style={{ color: "#E91E8C" }}>{arch.name}</h2>
                <p className="text-sm text-gray-500 italic mt-0.5">{arch.tagline}</p>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">{arch.essence}</p>
                {arch.dossierLead && (
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed border-l-2 pl-3" style={{ borderColor: "#F97316" }}>
                    {arch.dossierLead}
                  </p>
                )}
              </div>
            </div>
            {quote && (
              <blockquote className="mt-3 rounded-lg px-4 py-3 italic text-sm text-gray-700"
                style={{ background: "rgba(233,30,140,0.05)", borderLeft: "3px solid #E91E8C" }}>
                &ldquo;{quote.text}&rdquo;
                {quote.author && <cite className="block text-xs text-gray-400 mt-1 not-italic">— {quote.author}</cite>}
              </blockquote>
            )}
          </Section>

          {/* ── ESPECIFICACIÓN DE PIEZA ───────────────────────────── */}
          <Section label="Pieza personalizada — Especificación de diseño">
            <Grid>
              <Field label="Animal de diseño" value={animalDiseno} highlight />
              {profesion && <Field label="Profesión" value={profesion.label} />}
            </Grid>
            {design && (
              <div className="mt-3 flex flex-col gap-2">
                <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500 mb-1">Paleta de color</p>
                  <p className="text-sm font-medium text-gray-800">{design.colors}</p>
                </div>
                <div className="rounded-lg border border-pink-200 bg-pink-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-pink-500 mb-1">Mood / Dirección</p>
                  <p className="text-sm font-medium text-gray-800">{design.mood}</p>
                </div>
              </div>
            )}
            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-1.5">Contenido del box</p>
              <ul className="flex flex-col gap-1">
                {tier.includes.map((item) => (
                  <li key={item} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="text-pink-500 shrink-0 mt-px">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          {/* ── SISTEMAS DE IDENTIDAD ─────────────────────────────── */}
          <Section label="Sistemas de identidad">
            <Grid>
              {signInfo && <Field label={`Signo solar ${signInfo.glyph}`} value={signInfo.name} />}
              {chinese   && <Field label="Animal chino" value={`${chinese.name} ${chinese.glyph}`} />}
              {kinMaya   && <Field label="Nahual (Cholq'ij)" value={`${kinMaya.sealName} · tono ${kinMaya.tone} ${kinMaya.toneName} · día ${kinMaya.kin}/260`} />}
              {generation && <Field label="Generación" value={generation.name} />}
              {birthDateFmt && <Field label="Fecha de nacimiento" value={birthDateFmt} />}
              {p.birthTime && <Field label="Hora de nacimiento" value={p.birthTime} />}
            </Grid>
            {!p.birthDate && (
              <p className="text-xs text-gray-400 mt-2 italic">Sin fecha de nacimiento — signo y sistemas lunares no disponibles.</p>
            )}
          </Section>

          {/* ── PIEDRAS ───────────────────────────────────────────── */}
          {totem ? (
            <Section label="Piedras del box">
              {totem.convergence && (
                <div className="mb-3 rounded-lg px-4 py-3 border"
                  style={{ background: "rgba(249,115,22,0.04)", borderColor: "rgba(249,115,22,0.25)" }}>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500 mb-0.5">Convergencia</p>
                  <p className="text-sm font-bold text-gray-900">
                    {totem.convergence.dominantStone} · familia {totem.convergence.dominantFamily}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {totem.convergence.agreement} de {totem.convergence.total} sistemas coinciden
                    · fuerza: {totem.convergence.strength}
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-2">
                {[
                  { tier: "Mes de nacimiento", s: totem.stone.primary },
                  { tier: "Signo solar",       s: totem.stone.secondary },
                  { tier: "Intención",         s: totem.stone.intention },
                ].map(({ tier: t, s }) => (
                  <div key={t} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 flex gap-3 items-start">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-gray-400 shrink-0 mt-0.5 w-28">{t}</span>
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                      <span className="text-xs text-gray-400 ml-1.5">[{s.source}]</span>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{s.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          ) : (
            <Section label="Piedras del box">
              <Field label="Piedra base por arquetipo" value={arch.piedra.label} />
              {arch.piedra.detail && <p className="text-xs text-gray-500 mt-1">{arch.piedra.detail}</p>}
              <p className="text-xs text-gray-400 mt-2 italic">Sin fecha — convergencia no calculada. Usar piedra de arquetipo como base.</p>
            </Section>
          )}

          {/* ── LUGAR DE PODER ────────────────────────────────────── */}
          {totem?.sacredPlace && (
            <Section label="Lugar de poder">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 flex gap-3 items-start">
                <span className="text-xl" style={{ color: "#E91E8C" }}>⊕</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{totem.sacredPlace.type}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{totem.sacredPlace.examples.join(" · ")}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Incluir en el dossier como sección de recomendación.</p>
            </Section>
          )}

          {/* ── AFIRMACIONES ──────────────────────────────────────── */}
          {affirmations && (
            <Section label="Afirmaciones para el dossier">
              <div className="flex flex-col gap-2">
                {affirmations.lines.map((line, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 italic">
                    &ldquo;{line}&rdquo;
                  </div>
                ))}
              </div>
              {affirmations.ritual && (
                <div className="mt-2 rounded-lg border border-pink-100 bg-pink-50 px-4 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-pink-400 mb-0.5">Ritual sugerido</p>
                  <p className="text-sm text-gray-700">{affirmations.ritual}</p>
                </div>
              )}
              {affirmations.printNote && (
                <p className="text-xs text-gray-400 mt-2">Nota de impresión: {affirmations.printNote}</p>
              )}
            </Section>
          )}

          {/* ── ANCLA + COMPLEMENTO ───────────────────────────────── */}
          <Section label="Ancla y complemento (por arquetipo)">
            <Grid>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-1.5">Ancla (elegir 1)</p>
                {arch.ancla.map((s) => (
                  <p key={s.label} className="text-sm text-gray-700">· {s.label}{s.detail ? ` — ${s.detail}` : ""}</p>
                ))}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-1.5">Complemento (elegir 1)</p>
                {arch.complemento.map((s) => (
                  <p key={s.label} className="text-sm text-gray-700">· {s.label}</p>
                ))}
              </div>
            </Grid>
            <div className="mt-3 flex gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-1">Vela</p>
                <p className="text-sm text-gray-700">{arch.vela.label}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-1">Detalle sorpresa</p>
                <p className="text-sm text-gray-700">{arch.detalleSorpresa.label}</p>
                {arch.detalleSorpresa.detail && (
                  <p className="text-xs text-gray-400">{arch.detalleSorpresa.detail}</p>
                )}
              </div>
            </div>
          </Section>

          {/* ── ENTREVISTA COMPLETA ───────────────────────────────── */}
          <Section label="Entrevista completa">
            <div className="flex flex-col gap-1.5">
              {quizRows.map(({ label, value }) => (
                <div key={label} className="flex gap-3 items-start py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-xs text-gray-400 w-36 shrink-0 pt-px">{label}</span>
                  <span className="text-sm text-gray-800 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </Section>

        </main>

        {/* ── PIE ──────────────────────────────────────────────────── */}
        <footer className="max-w-3xl mx-auto px-8 py-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">ALIZEE — Documento interno. No compartir con el cliente.</p>
          <p className="text-xs text-gray-400">{createdAt}</p>
        </footer>
      </div>

    </>
  );
}

/* ── Sub-componentes ─────────────────────────────────────────────── */

function Section({
  label,
  children,
  accent = false,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section>
      <p
        className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-3"
        style={{ color: accent ? "#E91E8C" : "#F97316" }}
      >
        {label}
      </p>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Field({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-0.5">{label}</p>
      <p
        className="text-sm font-semibold"
        style={{ color: highlight ? "#E91E8C" : "#111" }}
      >
        {value}
      </p>
    </div>
  );
}

