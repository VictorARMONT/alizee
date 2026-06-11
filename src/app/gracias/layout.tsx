import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gracias por tu pedido",
  robots: { index: false, follow: false },
};

export default function GraciasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
