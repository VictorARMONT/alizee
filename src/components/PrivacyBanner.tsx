import Link from "next/link";

/**
 * Banner informativo de privacidad (LFPDPPP — consentimiento tácito).
 * La aceptación ocurre al dar clic en cualquier CTA del quiz (ver QuizCTA),
 * por lo que aquí no hay checkbox: solo transparencia + link al aviso completo.
 */
export function PrivacyBanner() {
  return (
    <div
      className="mx-5 mt-4 rounded-[var(--radius-md)] border px-5 py-4"
      style={{ borderColor: "var(--brand-border)", background: "var(--brand-surface)" }}
    >
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-fg-muted)" }}>
        Tus datos y los del festejado se usan solo para personalizar su regalo.
        Los guardamos 90 días y los borramos. Al continuar con el test aceptas el{" "}
        <Link
          href="/aviso-de-privacidad"
          className="underline underline-offset-2"
          style={{ color: "var(--brand-primary)" }}
        >
          Aviso de Privacidad
        </Link>
        .
      </p>
    </div>
  );
}
