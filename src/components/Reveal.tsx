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

  return (
    <div className="flex flex-col items-center text-center gap-6">
      {/* Sello / glifo */}
      <div className="relative h-32 w-32">
        {/* Anillo exterior */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full border border-[var(--brand-primary)]"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={
            phase >= 1
              ? { scale: 1, opacity: 1 }
              : { scale: 0.6, opacity: 0 }
          }
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Anillo interior */}
        <motion.div
          aria-hidden
          className="absolute inset-3 rounded-full border border-[var(--brand-primary)] opacity-50"
          initial={{ scale: 0, rotate: -40 }}
          animate={
            phase >= 1
              ? { scale: 1, rotate: 0 }
              : { scale: 0, rotate: -40 }
          }
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
        {/* Glifo central */}
        <motion.div
          aria-hidden
          className="absolute inset-0 grid place-items-center text-3xl text-[var(--brand-primary)]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          ✦
        </motion.div>
        {/* Glow */}
        <motion.div
          aria-hidden
          className="absolute inset-[-30%] rounded-full bg-[var(--brand-primary)] blur-3xl"
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 0.18 } : { opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </div>

      {/* Eyebrow */}
      <motion.p
        className="text-[11px] uppercase tracking-[0.32em] text-[var(--brand-primary)]"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        Su arquetipo es
      </motion.p>

      {/* Nombre del arquetipo */}
      <motion.h1
        className="text-[44px] leading-[1.02] font-semibold tracking-tight text-[var(--brand-fg)]"
        initial={{ opacity: 0, y: 14 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {archetypeName}
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="text-base italic text-[var(--brand-fg-muted)] -mt-2"
        initial={{ opacity: 0 }}
        animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {archetypeTagline}
      </motion.p>

      {/* Essence */}
      <motion.p
        className="text-[17px] leading-relaxed text-[var(--brand-fg)] max-w-sm"
        initial={{ opacity: 0, y: 8 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        {essence}
      </motion.p>
    </div>
  );
}
