import Link from "next/link";
import { Logo } from "@/components/Logo";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "523349571689";
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, me interesan las bolsas de lujo de ALIZEE. ¿Me puedes dar más información?")}`;

export default function BolsasPage() {
  return (
    <div className="flex flex-col items-center bg-white min-h-[100dvh]">

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

      <main className="w-full max-w-2xl mx-auto px-5 pb-20 flex flex-col gap-8 pt-6">

        <div className="flex items-center gap-2 text-[12px] text-[var(--brand-fg-muted)]">
          <Link href="/" className="hover:text-[var(--brand-fg)] transition-colors">Inicio</Link>
          <span>›</span>
          <span className="text-[var(--brand-fg)]">Bolsas de Lujo</span>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] font-semibold" style={{ color: "var(--brand-primary)" }}>
            Catálogo
          </p>
          <h1 className="text-[34px] font-bold tracking-tight leading-tight text-[var(--brand-fg)] mt-1">
            Bolsas de Lujo
          </h1>
        </div>

        <div
          className="rounded-[var(--radius-lg)] border border-dashed border-[var(--brand-border)] px-6 py-14 flex flex-col items-center gap-4 text-center"
        >
          <span className="text-[48px]">◊</span>
          <p className="text-[20px] font-bold text-[var(--brand-fg)]">Curaduría en proceso</p>
          <p className="text-[15px] text-[var(--brand-fg-muted)] max-w-sm leading-relaxed">
            Chanel, Louis Vuitton, Hermès y más.<br />
            Piezas auténticas verificadas. Catálogo disponible pronto.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 min-h-[52px] px-8 rounded-full flex items-center gap-2 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)" }}
          >
            Quiero que me avisen →
          </a>
        </div>

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
