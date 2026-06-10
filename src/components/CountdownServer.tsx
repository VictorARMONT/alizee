"use client";

import { Countdown } from "@/components/Countdown";

export function CountdownServer({ onDark = false }: { onDark?: boolean }) {
  return <Countdown onDark={onDark} />;
}
