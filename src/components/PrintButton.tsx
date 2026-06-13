"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
      style={{ background: "linear-gradient(90deg, #F97316, #E91E8C)" }}
    >
      Imprimir / Guardar PDF
    </button>
  );
}
