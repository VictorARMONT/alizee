import Link from "next/link";
import type { Metadata } from "next";
import { fetchShopifyCollection } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Joyería para regalo — plata y piedras semipreciosas",
  description:
    "Joyería seleccionada para regalar: piezas en plata, oro y piedras semipreciosas. Las más vendidas, con envío a todo México.",
};

export const revalidate = 300;

export default async function JoyeriaPage() {
  const productos = await fetchShopifyCollection(
    "https://www.niceonline.com",
    "mas-vendidos",
    24,
  );

  return (
    <div className="flex flex-col items-center bg-white min-h-[100dvh]">

      {/* ── HEADER ── */}
      <header className="w-full max-w-2xl mx-auto px-5 pt-6 pb-3 flex items-center justify-between">
        <Logo height={52} />
        <Link
          href="/quiz"
          className="text-[13px] font-semibold px-4 py-2 rounded-full text-white"
          style={{ background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)" }}
        >
          Test de personalidad
        </Link>
      </header>

      <main className="w-full max-w-2xl mx-auto px-5 pb-20 flex flex-col gap-8">

        {/* ── BREADCRUMB + TÍTULO ── */}
        <section className="pt-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[12px] text-[var(--brand-fg-muted)]">
            <Link href="/" className="hover:text-[var(--brand-fg)] transition-colors">Inicio</Link>
            <span>›</span>
            <span className="text-[var(--brand-fg)]">Joyería</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] font-semibold" style={{ color: "var(--brand-primary)" }}>
                Catálogo
              </p>
              <h1 className="text-[34px] font-bold tracking-tight leading-tight text-[var(--brand-fg)] mt-1">
                Joyería
              </h1>
            </div>
            {productos.length > 0 && (
              <p className="text-[13px] text-[var(--brand-fg-muted)] mb-1">
                {productos.length} piezas
              </p>
            )}
          </div>
        </section>

        {/* ── GRID DE PRODUCTOS ── */}
        {productos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {productos.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-[var(--radius-lg)] border border-dashed border-[var(--brand-border)] px-6 py-14 flex flex-col items-center gap-3 text-center"
          >
            <span className="text-[36px]" style={{ color: "var(--brand-primary)" }}>◈</span>
            <p className="text-[16px] font-semibold text-[var(--brand-fg)]">Catálogo no disponible</p>
            <p className="text-[14px] text-[var(--brand-fg-muted)]">
              No se pudo cargar el catálogo en este momento. Intenta más tarde.
            </p>
          </div>
        )}

        {/* ── CTA REGALO PERSONALIZADO ── */}
        <section
          className="rounded-[var(--radius-lg)] px-6 py-7 flex flex-col gap-4"
          style={{ background: "var(--brand-surface-alt)" }}
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "var(--brand-primary)" }}>
              Diseño de regalo
            </p>
            <h2 className="text-[22px] font-bold tracking-tight text-[var(--brand-fg)] mt-1">
              ¿Quieres algo más personalizado?
            </h2>
            <p className="text-[14px] leading-relaxed text-[var(--brand-fg-muted)] mt-2">
              Diseñamos un box completo según su arquetipo — incluye joyería, aroma y dossier de análisis.
            </p>
          </div>
          <Link
            href="/quiz"
            className="self-start min-h-[48px] px-6 rounded-full flex items-center text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)" }}
          >
            Test de personalidad →
          </Link>
        </section>

      </main>

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
