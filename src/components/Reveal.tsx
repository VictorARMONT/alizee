"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Animación de "desbloqueo" del regalo sorpresa.
 * Encuadre: intención / ritual / significado — nunca predicción.
 * 3 beats:
 *  1. anillo se abre
 *  2. nombre del arquetipo emerge
 *  3. tagline y essence aparecen
 */
interface RevealProps {
  archetypeName: string;
  archetypeTagline: string;
  essence: string;
  onComplete?: () => void;
}

export function Reveal({
  archetypeName,
  archetypeTagline,
  essence,
  onComplete,
}: RevealProps) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1100);
    const t3 = setTimeout(() => setPhase(3), 1900);
    const t4 = setTimeout(() => onComplete?.(), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  /* Posiciones fijas de los sparkles alrededor del sello */
  const SPARKLES = [
    { top: "8%",  left: "88%",  delay: 0 },
    { top: "82%", left: "85%",  delay: 0.35 },
    { top: "90%", left: "12%",  delay: 0.7 },
    { top: "10%", left: "5%",   delay: 1.05 },
    { top: "48%", left: "96%",  delay: 0.18 },
    { top: "50%", left: "-4%",  delay: 0.55 },
  ];

  return (
    <div className="flex flex-col items-center text-center gap-6">

      {/* Sello / glifo — levita mientras el dossier se lee */}
      <motion.div
        className="relative h-36 w-36"
        animate={phase >= 3 ? { y: [0, -10, 0] } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glow exterior grande */}
        <motion.div
          aria-hidden
          className="absolute rounded-full bg-[var(--brand-primary)] blur-3xl"
          style={{ inset: "-40%" }}
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 0.22 } : { opacity: 0 }}
          transition={{ duration: 1.4 }}
        />

        {/* Anillo exterior */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full border border-[var(--brand-primary)]"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Anillo medio */}
        <motion.div
          aria-hidden
          className="absolute inset-4 rounded-full border border-[var(--brand-primary)] opacity-40"
          initial={{ scale: 0, rotate: -45 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        />

        {/* Anillo interior */}
        <motion.div
          aria-hidden
          className="absolute inset-7 rounded-full border border-[var(--brand-accent)] opacity-30"
          initial={{ scale: 0, rotate: 30 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: 30 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        />

        {/* Glifo central */}
        <motion.div
          aria-hidden
          className="absolute inset-0 grid place-items-center text-[32px]"
          style={{ color: "var(--brand-primary)" }}
          initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.4, rotate: -20 }}
          transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
        >
          ✦
        </motion.div>

        {/* Sparkles — aparecen en phase 3 */}
        {phase >= 3 && SPARKLES.map((s, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              top: s.top,
              left: s.left,
              background: i % 2 === 0 ? "var(--brand-primary)" : "var(--brand-accent)",
              boxShadow: `0 0 8px ${i % 2 === 0 ? "var(--brand-primary)" : "var(--brand-accent)"}`,
              animation: `az-sparkle 2.6s var(--ease-out-expo) ${s.delay}s infinite`,
            }}
          />
        ))}
      </motion.div>

      {/* Eyebrow */}
      <motion.p
        className="text-[11px] uppercase tracking-[0.32em]"
        style={{ color: "var(--brand-primary)" }}
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        Su arquetipo es
      </motion.p>

      {/* Nombre del arquetipo — serif cursiva */}
      <motion.h1
        className="text-[48px] leading-[1.02] font-semibold tracking-tight"
        style={{ color: "var(--brand-fg)", fontFamily: "var(--font-display, inherit)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        {archetypeName}
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="text-base italic -mt-2"
        style={{ color: "var(--brand-fg-muted)" }}
        initial={{ opacity: 0 }}
        animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {archetypeTagline}
      </motion.p>

      {/* Essence */}
      <motion.p
        className="text-[17px] leading-relaxed max-w-sm"
        style={{ color: "var(--brand-fg)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.7, delay: 0.12 }}
      >
        {essence}
      </motion.p>
    </div>
  );
}
