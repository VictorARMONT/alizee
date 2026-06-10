"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFunnel } from "@/store/funnel";
import { ARCHETYPES } from "@/data/archetypes";
import { formatMXN } from "@/data/pricing";

export default function GraciasPage() {
  const archetypeKey = useFunnel((s) => s.getArchetype());
  const total = useFunnel((s) => s.getTotal());
  const email = useFunnel((s) => s.email);
  const reset = useFunnel((s) => s.reset);

  const router = useRouter();
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const COUNTDOWN = 10;
  const [remaining, setRemaining] = useState(COUNTDOWN);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase < 2) return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          reset();
          router.push("/");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, reset, router]);

  const arch = archetypeKey ? ARCHETYPES[archetypeKey] : null;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md mx-auto flex flex-col gap-10">

        {/* Sello animado */}
        <div className="flex flex-col items-center gap-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="h-24 w-24 rounded-full border border-[var(--brand-primary)] flex items-center justify-center relative"
          >
            <motion.div
              aria-hidden
              className="absolute inset-3 rounded-full border border-[var(--brand-primary)] opacity-40"
              initial={{ scale: 0, rotate: -30 }}
              animate={phase >= 1 ? { scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            />
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl text-[var(--brand-primary)]"
              aria-hidden
            >
              ✓
            </motion.span>
            <motion.div
              aria-hidden
              className="absolute inset-[-30%] rounded-full bg-[var(--brand-primary)] blur-3xl"
              initial={{ opacity: 0 }}
              animate={phase >= 1 ? { opacity: 0.15 } : {}}
              transition={{ duration: 1.2 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-2"
          >
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--brand-primary)]">
              Pedido recibido
            </p>
            <h1 className="text-[36px] font-semibold tracking-tight leading-tight text-[var(--brand-fg)]">
              Su regalo está en camino.
            </h1>
            {arch && (
              <p className="text-[17px] text-[var(--brand-fg-muted)] leading-relaxed mt-1">
                Box {arch.name} — {formatMXN(total)} MXN
              </p>
            )}
          </motion.div>
        </div>

        {/* Detalles */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col gap-4"
        >
          <div className="rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 flex flex-col gap-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--brand-fg-muted)]">
              Qué sigue
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { n: "01", text: "Recibe confirmación por WhatsApp o email en las próximas horas." },
                { n: "02", text: "Tu box se arma y se envía antes del 15 de junio." },
                { n: "03", text: "Llega a tiempo para el Día del Padre." },
              ].map((item) => (
                <li key={item.n} className="flex gap-3 items-start">
                  <span className="text-[11px] font-bold tabular-nums text-[var(--brand-primary)] shrink-0 mt-[3px]">
                    {item.n}
                  </span>
                  <p className="text-[15px] text-[var(--brand-fg-muted)] leading-relaxed">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {email && (
            <p className="text-[13px] text-center text-[var(--brand-fg-muted)]">
              Confirmación a{" "}
              <span className="font-medium text-[var(--brand-fg)]">{email}</span>
            </p>
          )}
        </motion.div>

        {/* CTA + auto-redirect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <Link
            href="/"
            onClick={() => reset()}
            style={{ background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)" }}
            className="w-full text-center min-h-[52px] flex items-center justify-center rounded-full text-white text-[16px] font-semibold hover:opacity-90 active:opacity-80 transition-opacity"
          >
            Volver al inicio
          </Link>

          {/* Countdown */}
          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-[3px] rounded-full bg-[var(--brand-border)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--brand-primary)" }}
                initial={{ width: "100%" }}
                animate={{ width: `${(remaining / COUNTDOWN) * 100}%` }}
                transition={{ duration: 0.9, ease: "linear" }}
              />
            </div>
            <p className="text-[12px] text-center text-[var(--brand-fg-muted)]">
              Regresando al inicio en {remaining}s…
            </p>
          </div>

          <p className="text-[11px] text-[var(--brand-fg-muted)] uppercase tracking-[0.2em]">
            ALIZEE · México
          </p>
        </motion.div>

      </div>
    </div>
  );
}
