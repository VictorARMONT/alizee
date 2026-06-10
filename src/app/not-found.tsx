import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-white px-5 text-center gap-6">
      <Logo height={48} />
      <div className="flex flex-col gap-2">
        <p className="text-[11px] uppercase tracking-[0.26em] font-semibold" style={{ color: "var(--brand-primary)" }}>
          404
        </p>
        <h1 className="text-[32px] font-bold tracking-tight text-[var(--brand-fg)]">
          Esta página no existe.
        </h1>
        <p className="text-[15px] text-[var(--brand-fg-muted)]">
          Pero su regalo perfecto sí.
        </p>
      </div>
      <Link
        href="/"
        className="min-h-[52px] px-8 rounded-full flex items-center text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)" }}
      >
        Ir al inicio →
      </Link>
    </div>
  );
}
