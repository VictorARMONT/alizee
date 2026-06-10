import Link from "next/link";
import { fetchShopifyCollection } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { CountdownServer } from "@/components/CountdownServer";
import { Logo } from "@/components/Logo";
import { ScrollReveal } from "@/components/ScrollReveal";

export const revalidate = 300; // revalida cada 5 min

export default async function HomePage() {
  const joyeria = await fetchShopifyCollection(
    "https://www.niceonline.com",
    "mas-vendidos",
    6,
  );

  return (
    <div className="flex flex-col items-center bg-white min-h-[100dvh]">

      {/* ── HEADER ── */}
      <header className="w-full max-w-2xl mx-auto px-5 pt-6 pb-3 flex items-center justify-between">
        <Logo height={20} />
        <nav className="flex items-center gap-4">
          <Link href="/joyeria" className="text-[13px] text-[var(--brand-fg-muted)] hover:text-[var(--brand-fg)] transition-colors hidden sm:block">
            Joyería
          </Link>
          <Link
            href="/quiz"
            className="text-[13px] font-semibold px-4 py-2 rounded-full text-white"
            style={{ background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)" }}
          >
            Test de personalidad
          </Link>
        </nav>
      </header>

      <main className="w-full max-w-2xl mx-auto flex flex-col pb-20">

        {/* ── HERO ── */}
        <section className="mx-5 mt-4 rounded-[var(--radius-lg)] overflow-hidden relative min-h-[480px] flex flex-col justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/portada-hero.jpg"
            alt="ALIZEE — Box ritual para Día del Padre"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 35%" }}
            fetchPriority="high"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.08) 100%)" }}
          />
          <div className="relative z-10 px-6 pb-10 pt-20 flex flex-col gap-4 az-hero-stagger">
            <span
              className="self-start text-[11px] font-semibold uppercase tracking-[0.22em] px-3 py-1 rounded-full"
              style={{ background: "rgba(180,20,90,0.35)", color: "#fff" }}
            >
              Día del Padre · 21 de junio
            </span>
            <h1 className="text-[38px] leading-[1.06] font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display, inherit)" }}
            >
              El regalo que sí<br />
              <em className="az-em not-italic" style={{ color: "#F9A8D4" }}>lo va a sorprender.</em>
            </h1>
            <p className="text-[16px] leading-relaxed text-white/75 max-w-md">
              Responde 7 preguntas sobre cómo es él. Nosotros armamos su box.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center min-h-[52px] px-7 rounded-full text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)" }}
              >
                Test de personalidad →
              </Link>
              <Link
                href="/joyeria"
                className="inline-flex items-center justify-center min-h-[52px] px-7 rounded-full text-[16px] font-semibold border-2 border-white/60 text-white transition-colors hover:border-white"
              >
                Ver catálogo
              </Link>
            </div>
          </div>
        </section>

        {/* ── EDICIÓN LIMITADA — DÍA DEL PADRE ── */}
        <ScrollReveal delay={100}>
        <section
          className="mx-5 mt-6 rounded-[var(--radius-lg)] overflow-hidden"
          style={{ background: "linear-gradient(135deg, #F97316 0%, #E91E8C 100%)" }}
        >
          <div className="px-6 py-7 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/80 font-semibold">
                Edición limitada
              </span>
              <h2 className="text-[26px] font-bold text-white leading-tight">
                Día del Padre 🎁
                <br />
                <span className="text-[18px] font-semibold text-white/90">21 de junio · Pide antes del 17</span>
              </h2>
            </div>
            <CountdownServer onDark />
            <p className="text-[14px] text-white/85 leading-relaxed max-w-sm">
              Box ritual personalizado según su arquetipo. Análisis de patrones numéricos incluido.
            </p>
            <Link
              href="/quiz"
              className="self-start min-h-[48px] px-6 rounded-full flex items-center text-[15px] font-semibold bg-white transition-opacity hover:opacity-90"
              style={{ color: "var(--brand-primary)" }}
            >
              Crear su regalo →
            </Link>
          </div>
        </section>
        </ScrollReveal>

        {/* ── CATEGORÍAS ── */}
        <ScrollReveal delay={80}>
        <section className="px-5 mt-10 flex flex-col gap-4">
          <SectionLabel>Categorías</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CategoryCard
              href="/quiz"
              emoji="✦"
              title="Diseño de Regalo"
              detail="Box personalizado según su arquetipo y análisis de patrones."
              tag="Exclusivo"
            />
            <CategoryCard
              href="/joyeria"
              emoji="◈"
              title="Joyería"
              detail="Piezas seleccionadas. Plata, oro y piedras semipreciosas."
              tag="+Vendidos"
            />
            <CategoryCard
              href="/quiz"
              emoji="◉"
              title="Mistery Box"
              detail="Un box sorpresa curado según tu arquetipo. Contenido revelado al recibirlo."
              tag="Nuevo"
            />
          </div>
        </section>
        </ScrollReveal>

        {/* ── JOYERÍA DESTACADA ── */}
        {joyeria.length > 0 && (
          <ScrollReveal delay={60}>
            <section className="px-5 mt-10 flex flex-col gap-5">
              <div className="flex items-end justify-between">
                <div>
                  <SectionLabel>Joyería</SectionLabel>
                  <h2 className="text-[24px] font-bold tracking-tight leading-tight text-[var(--brand-fg)] mt-1">
                    Lo más vendido.
                  </h2>
                </div>
                <Link
                  href="/joyeria"
                  className="text-[13px] font-medium shrink-0"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Ver todo →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {joyeria.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* ── POR QUÉ ALIZEE ── */}
        <ScrollReveal delay={80}>
          <section className="px-5 mt-10 flex flex-col gap-4">
            <SectionLabel>Por qué ALIZEE</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TrustCard icon="✦" title="Personalización real" detail="No es una tarjeta genérica. Cada regalo responde a quién es la persona." />
              <TrustCard icon="◈" title="Análisis de patrones" detail="Cruzamos 7 tipos de análisis para identificar el regalo exacto." />
              <TrustCard icon="◉" title="Envío a todo México" detail="Empaque cuidado, entrega puntual. Listo para regalar." />
              <TrustCard icon="◊" title="WhatsApp directo" detail="Sin formularios largos. Compra y resuelve dudas en un mensaje." />
            </div>
          </section>
        </ScrollReveal>

      </main>

      {/* ── FOOTER ── */}
      <footer
        className="w-full max-w-2xl mx-auto px-5 py-6 flex items-center justify-between border-t"
        style={{ borderColor: "var(--brand-border)" }}
      >
        <Logo height={36} variant="dark" />
        <span className="text-[12px] text-[var(--brand-fg-muted)]">El regalo perfecto, siempre.</span>
      </footer>

    </div>
  );
}

/* ── Sub-componentes ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.26em] font-semibold" style={{ color: "var(--brand-primary)" }}>
      {children}
    </p>
  );
}

function CategoryCard({
  href, emoji, imageUrl, title, detail, tag,
}: {
  href: string; emoji?: string; imageUrl?: string; title: string; detail: string; tag: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-[var(--radius-md)] border bg-[var(--brand-surface)] p-5 transition-all hover:border-[var(--brand-primary)] group"
      style={{ borderColor: "var(--brand-border)" }}
    >
      <div className="flex items-start justify-between">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" aria-hidden className="w-12 h-12 object-contain" />
        ) : (
          <span className="text-[28px]" style={{ color: "var(--brand-primary)" }}>{emoji}</span>
        )}
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
          style={{ background: "rgba(233,30,140,0.1)", color: "var(--brand-primary)" }}
        >
          {tag}
        </span>
      </div>
      <div>
        <p className="text-[16px] font-semibold text-[var(--brand-fg)] group-hover:text-[var(--brand-primary)] transition-colors">{title}</p>
        <p className="text-[13px] leading-relaxed text-[var(--brand-fg-muted)] mt-1">{detail}</p>
      </div>
    </Link>
  );
}

function TrustCard({ icon, imageUrl, title, detail }: { icon?: string; imageUrl?: string; title: string; detail: string }) {
  return (
    <div
      className="flex gap-4 rounded-[var(--radius-md)] border bg-[var(--brand-surface)] p-4"
      style={{ borderColor: "var(--brand-border)" }}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" aria-hidden className="w-10 h-10 object-contain shrink-0 self-start mt-0.5" />
      ) : (
        <span className="text-[20px] shrink-0 mt-0.5" style={{ color: "var(--brand-primary)" }}>{icon}</span>
      )}
      <div>
        <p className="text-[14px] font-semibold text-[var(--brand-fg)]">{title}</p>
        <p className="text-[13px] leading-relaxed text-[var(--brand-fg-muted)] mt-0.5">{detail}</p>
      </div>
    </div>
  );
}

