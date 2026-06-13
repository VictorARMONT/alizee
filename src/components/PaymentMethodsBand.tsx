import { PAYMENT_METHODS, PAYMENT_NOTE } from "@/data/trust";

/**
 * Señales de pago — factor decisivo de conversión en e-commerce MX (AMVO).
 * Banda compacta, reutilizable: home (bajo edición limitada) y funnel
 * (bajo el selector de tier). `compact` quita la nota larga para el funnel.
 */
export function PaymentMethodsBand({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="rounded-[var(--radius-md)] border bg-[var(--brand-surface)] px-4 py-3 flex flex-col gap-2"
      style={{ borderColor: "var(--brand-border)" }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--brand-fg-muted)]">
          Pagos
        </span>
        {PAYMENT_METHODS.map((m) => (
          <span key={m.label} className="inline-flex items-baseline gap-1.5">
            <span className="text-[13px] font-semibold text-[var(--brand-fg)]">{m.label}</span>
            {m.detail && (
              <span className="text-[11px] text-[var(--brand-fg-muted)]">{m.detail}</span>
            )}
          </span>
        ))}
        <span className="inline-flex items-center gap-1 text-[11px] text-[var(--brand-fg-muted)]">
          <span style={{ color: "var(--brand-primary)" }} aria-hidden>🔒</span> Compra protegida
        </span>
      </div>
      {!compact && (
        <p className="text-[12px] leading-snug text-[var(--brand-fg-muted)]">{PAYMENT_NOTE}</p>
      )}
    </div>
  );
}
