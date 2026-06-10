"use client";

import Link from "next/link";
import { useFunnel } from "@/store/funnel";

export function PrivacyBanner() {
  const privacyAccepted    = useFunnel((s) => s.privacyAccepted);
  const setPrivacyAccepted = useFunnel((s) => s.setPrivacyAccepted);

  if (privacyAccepted) return null;

  return (
    <div
      className="mx-5 mt-4 rounded-[var(--radius-md)] border px-5 py-4 flex flex-col gap-3"
      style={{ borderColor: "var(--brand-border)", background: "var(--brand-surface)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-fg-muted)" }}>
          Tus datos y los del festejado se usan solo para personalizar su regalo.
          Los guardamos 90 días y los borramos.{" "}
          <Link
            href="/aviso-de-privacidad"
            className="underline underline-offset-2"
            style={{ color: "var(--brand-primary)" }}
          >
            Aviso completo
          </Link>
        </p>
      </div>

      <label
        className="flex items-center gap-3 cursor-pointer select-none"
        style={{ touchAction: "manipulation" }}
      >
        <input
          type="checkbox"
          onChange={(e) => { if (e.target.checked) setPrivacyAccepted(true); }}
          className="w-4 h-4 shrink-0 rounded accent-[var(--brand-primary)] cursor-pointer"
          style={{ accentColor: "var(--brand-primary)" }}
        />
        <span className="text-[13px] font-medium" style={{ color: "var(--brand-fg)" }}>
          He leído y acepto el Aviso de Privacidad
        </span>
      </label>
    </div>
  );
}
