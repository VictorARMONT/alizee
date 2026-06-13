import { ScrollReveal } from "@/components/ScrollReveal";
import {
  TESTIMONIALS,
  SOCIAL_PROOF_COUNT,
  SHOW_TESTIMONIALS,
} from "@/data/trust";

/**
 * Prueba social — la sección de mayor impacto en conversión de la auditoría
 * (Spiegel 2017: 0→5 reseñas ≈ +270% probabilidad de compra; Cialdini:
 * bajo incertidumbre la gente copia a personas similares).
 * Los testimonios viven en src/data/trust.ts (TODO COPY hasta tener reales).
 */
export function TestimonialsSection() {
  if (!SHOW_TESTIMONIALS) return null;

  return (
    <ScrollReveal delay={80}>
      <section className="px-5 mt-12 flex flex-col gap-5">
        <p
          className="text-[11px] uppercase tracking-[0.26em] font-semibold"
          style={{ color: "var(--brand-primary)" }}
        >
          Lo que dicen
        </p>
        <div className="flex items-end justify-between -mt-1">
          <h2 className="text-[24px] font-bold tracking-tight leading-tight text-[var(--brand-fg)]">
            Papás difíciles de sorprender, sorprendidos.
          </h2>
        </div>

        {/* Contador de volumen + estrellas agregadas */}
        <div className="flex items-center gap-3 -mt-1">
          <span className="text-[15px] tracking-[0.1em]" style={{ color: "#F59E0B" }} aria-hidden>
            ★★★★★
          </span>
          <span className="text-[13px] font-medium text-[var(--brand-fg-muted)]">
            {SOCIAL_PROOF_COUNT}
          </span>
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col gap-3 rounded-[var(--radius-md)] border bg-[var(--brand-surface)] p-4"
              style={{ borderColor: "var(--brand-border)" }}
            >
              <span
                className="text-[13px] tracking-[0.08em]"
                style={{ color: "#F59E0B" }}
                aria-label={`${t.stars} de 5 estrellas`}
              >
                {"★".repeat(t.stars)}
                {"☆".repeat(5 - t.stars)}
              </span>
              <blockquote className="text-[13px] leading-relaxed text-[var(--brand-fg)]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span
                  className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-[14px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #F97316 0%, #E91E8C 100%)" }}
                  aria-hidden
                >
                  {t.name.charAt(0)}
                </span>
                <span className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[var(--brand-fg)] leading-tight">
                    {t.name} · {t.city}
                  </span>
                  <span className="text-[11px] text-[var(--brand-fg-muted)] leading-snug">
                    {t.relation}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
