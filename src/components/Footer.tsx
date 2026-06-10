"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--brand-border)] bg-white py-8 px-5 mt-12">
      <div className="mx-auto max-w-md flex flex-col gap-6">
        {/* Info */}
        <div className="flex flex-col gap-3 text-sm text-[var(--brand-fg-muted)]">
          <p>
            <strong className="text-[var(--brand-fg)]">ALIZEE</strong>
            <br />
            El regalo que se vuelve un momento.
          </p>
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--brand-primary)] mb-1">
              Contacto
            </p>
            <p>
              <a href="mailto:hola@alizee.mx" className="hover:text-[var(--brand-primary)]">
                hola@alizee.mx
              </a>
            </p>
            <p>
              <a href="https://wa.me/523349571689?text=Hola" className="hover:text-[var(--brand-primary)]">
                WhatsApp
              </a>
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/aviso-de-privacidad" className="text-[var(--brand-fg-muted)] hover:text-[var(--brand-primary)]">
            Aviso de Privacidad
          </Link>
          <Link href="#" className="text-[var(--brand-fg-muted)] hover:text-[var(--brand-primary)]">
            Política de Envíos y Devoluciones
          </Link>
          <Link href="#" className="text-[var(--brand-fg-muted)] hover:text-[var(--brand-primary)]">
            Términos de Servicio
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-[var(--brand-fg-muted)] border-t border-[var(--brand-border)] pt-4">
          <p>© {currentYear} ALIZEE. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
