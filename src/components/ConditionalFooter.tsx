"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

const NO_FOOTER = ["/quiz", "/diadelpadre"];

export function ConditionalFooter() {
  const pathname = usePathname();
  if (NO_FOOTER.some((p) => pathname.startsWith(p))) return null;
  return <Footer />;
}
