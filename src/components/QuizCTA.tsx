"use client";

import { useRouter } from "next/navigation";
import { useFunnel } from "@/store/funnel";

interface QuizCTAProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function QuizCTA({ className, style, children }: QuizCTAProps) {
  const router = useRouter();
  const setPrivacyAccepted = useFunnel((s) => s.setPrivacyAccepted);

  function handleClick() {
    setPrivacyAccepted(true);
    router.push("/quiz");
  }

  return (
    <button type="button" onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}
