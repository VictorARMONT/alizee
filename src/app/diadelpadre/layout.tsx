import type { Metadata } from "next";
import { BackgroundLayers } from "@/components/BackgroundLayers";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DiadelpadreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <BackgroundLayers />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
