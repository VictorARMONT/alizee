import { ScrollReveal } from "@/components/ScrollReveal";
import { GUARANTEE, FAQ_ITEMS } from "@/data/trust";

/**
 * Garantía (reversión de riesgo — Kahneman & Tversky: las pérdidas pesan ~2.25x)
 * + FAQ (manejo de objeciones — Baymard: la desconfianza es causa top de abandono).
 * Acordeón con <details> nativo: cero JS, accesible, funciona server-side.
 */
export function GuaranteeFaqSection() {
  return (
    <>
      {/* ── GARANTÍA ── */}
      <ScrollReveal delay={80}>
        <section className="px-5 mt-12 flex flex-col gap-5">
          <p
            className="text-[11px] uppercase tracking-[0.26em] font-semibold"
            style={{ color: "var(--brand-primary)" }}
          >
            {GUARANTEE.title}
          </p>
          <h2 className="text-[24px] font-bold tracking-tight leading-tight text-[var(--brand-fg)] -mt-1">
            {GUARANTEE.headline}
          </h2>
          <div
            className="rounded-[var(--radius-lg)] overflow-hidden p-5 flex flex-col gap-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(233,30,140,0.08) 100%)",
              border: "1px solid rgba(233,30,140,0.18)",
            }}
          >
            {GUARANTEE.points.map((p) => (
              <div key={p.title} className="flex gap-4 items-start">
                <span
                  className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-[15px] text-white"
                  style={{ background: "linear-gradient(135deg, #F97316 0%, #E91E8C 100%)" }}
                  aria-hidden
                >
                  {p.glyph}
                </span>
                <div className="flex-1 pt-0.5">
                  <p className="text-[15px] font-semibold text-[var(--brand-fg)]">{p.title}</p>
                  <p className="text-[13px] leading-relaxed text-[var(--brand-fg-muted)] mt-0.5">
                    {p.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── FAQ ── */}
      <ScrollReveal delay={80}>
        <section className="px-5 mt-12 flex flex-col gap-5">
          <p
            className="text-[11px] uppercase tracking-[0.26em] font-semibold"
            style={{ color: "var(--brand-primary)" }}
          >
            Preguntas frecuentes
          </p>
          <h2 className="text-[24px] font-bold tracking-tight leading-tight text-[var(--brand-fg)] -mt-1">
            Lo que todos preguntan antes de pedir.
          </h2>
          <div className="flex flex-col gap-2.5">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.q}
                className="group rounded-[var(--radius-md)] border bg-[var(--brand-surface)]"
                style={{ borderColor: "var(--brand-border)" }}
              >
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-4 py-4 min-h-[52px] [&::-webkit-details-marker]:hidden">
                  <span className="text-[14px] font-semibold text-[var(--brand-fg)] leading-snug">
                    {item.q}
                  </span>
                  <span
                    className="shrink-0 text-[18px] leading-none transition-transform group-open:rotate-45"
                    style={{ color: "var(--brand-primary)" }}
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="px-4 pb-4 text-[13px] leading-relaxed text-[var(--brand-fg-muted)]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
