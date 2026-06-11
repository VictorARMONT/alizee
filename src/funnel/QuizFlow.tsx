"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { Logo } from "@/components/Logo";
import { OptionCard } from "@/components/OptionCard";
import { ImageOptionCard } from "@/components/ImageOptionCard";
import { BirthDateStep } from "@/components/BirthDateStep";
import { BirthTimeStep } from "@/components/BirthTimeStep";
import { TOTAL_STEPS } from "@/data/questions";
import { useFunnel, useCurrentQuestion } from "@/store/funnel";
import { analytics } from "@/lib/analytics";

export function QuizFlow() {
  const router       = useRouter();
  const question     = useCurrentQuestion();
  const step         = useFunnel((s) => s.step);
  const answers      = useFunnel((s) => s.answers);
  const birthDate    = useFunnel((s) => s.birthDate);
  const setAnswer    = useFunnel((s) => s.setAnswer);
  const setBirthDate = useFunnel((s) => s.setBirthDate);
  const setBirthTime = useFunnel((s) => s.setBirthTime);
  const birthTime    = useFunnel((s) => s.birthTime);
  const selectedTierIdx = useFunnel((s) => s.selectedTierIdx);
  const setTierIdx   = useFunnel((s) => s.setTierIdx);
  const next         = useFunnel((s) => s.next);
  const prev         = useFunnel((s) => s.prev);
  const reset        = useFunnel((s) => s.reset);
  const getArchetype    = useFunnel((s) => s.getArchetype);
  const getRelationship = useFunnel((s) => s.getRelationship);
  const setPrivacyAccepted = useFunnel((s) => s.setPrivacyAccepted);

  const [advancingKey, setAdvancingKey] = useState<string | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Limpia el timer si el componente se desmonta */
  useEffect(() => () => { if (advanceTimer.current) clearTimeout(advanceTimer.current); }, []);

  useEffect(() => {
    if (!question) {
      analytics.completeQuiz(getArchetype(), !!birthDate, getRelationship());
      router.push("/diadelpadre");
    }
  }, [question, router, getArchetype, getRelationship, birthDate]);

  // Auto-acepta aviso si llega directo (bookmark / link externo)
  useEffect(() => { setPrivacyAccepted(true); }, [setPrivacyAccepted]);

  // Paso 8 (hora) solo tiene sentido con fecha — si saltaron la fecha, sáltalo también
  useEffect(() => {
    if (question?.kind === "time" && !birthDate) next();
  }, [question, birthDate, next]);

  if (!question) return null;

  const handleSelect = (questionId: Parameters<typeof setAnswer>[0], key: string) => {
    if (advancingKey) return; // evita doble-tap durante blink
    if (Object.keys(answers).length === 0) analytics.startQuiz();
    const opt = question?.options?.find((o) => o.key === key);
    analytics.answerQuestion(step, questionId, key, opt?.archetype);
    setAnswer(questionId, key);
    setAdvancingKey(key);
    /* 3 parpadeos × 320ms = 960ms + buffer 100ms */
    advanceTimer.current = setTimeout(() => {
      setAdvancingKey(null);
      next();
    }, 1060);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col px-5 pt-6 pb-8">

      {/* ── Header ── */}
      <header className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          {step === 0 ? (
            <Link
              href="/"
              onClick={() => reset()}
              className="text-xs uppercase tracking-[0.22em] text-[var(--brand-fg-muted)] hover:text-[var(--brand-fg)] transition-colors"
            >
              ← Inicio
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => prev()}
              className="text-xs uppercase tracking-[0.22em] text-[var(--brand-fg-muted)] hover:text-[var(--brand-fg)] transition-colors"
              style={{ touchAction: "manipulation" }}
            >
              ← Atrás
            </button>
          )}
          <Logo height={18} href={null} />
        </div>
        <ProgressBar current={question.index} total={TOTAL_STEPS} />
      </header>

      {/* ── Main ── */}
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">

        {/*
          key fuerza remount al cambiar pregunta → animación CSS se reinicia.
          Sin Framer Motion: cero interferencia con eventos táctiles.
        */}
        <div key={`q-${question.id}`} className="quiz-question flex flex-col gap-6">

          {question.kicker && (
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--brand-primary)]">
              {question.kicker}
            </p>
          )}

          <h1 className="text-[36px] font-semibold leading-tight tracking-tight text-[var(--brand-fg)]">
            {question.prompt}
          </h1>

          {question.subtext && (
            <p className="text-[17px] leading-relaxed text-[var(--brand-fg-muted)]">
              {question.subtext}
            </p>
          )}

          {/* Opciones texto */}
          {question.kind === "single" && question.options && (
            <ul className="flex flex-col gap-3" role="radiogroup" aria-label={question.prompt}>
              {question.options.map((opt) => (
                <li key={opt.key}>
                  <OptionCard
                    option={opt}
                    selected={answers[question.id] === opt.key}
                    blinking={advancingKey === opt.key}
                    onSelect={(key) => handleSelect(question.id, key)}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* Opciones imagen */}
          {question.kind === "image" && question.options && (
            <ul className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={question.prompt}>
              {question.options.map((opt) => (
                <li key={opt.key}>
                  <ImageOptionCard
                    option={opt}
                    selected={answers[question.id] === opt.key}
                    blinking={advancingKey === opt.key}
                    onSelect={(key) => handleSelect(question.id, key)}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* Paso 7: Fecha de nacimiento + paquete */}
          {question.kind === "date" && (
            <BirthDateStep
              date={birthDate}
              onDateChange={(iso) => setBirthDate(iso)}
              selectedTierIdx={selectedTierIdx}
              onTierSelect={(idx) => setTierIdx(idx)}
              onSubmit={() => next()}
              onSkip={() => { setBirthDate(null); setBirthTime(null); next(); }}
              skipLabel={question.skipLabel ?? "No la sé / Prefiero saltar"}
            />
          )}

          {/* Paso 8: Hora de nacimiento */}
          {question.kind === "time" && (
            <BirthTimeStep
              time={birthTime}
              onTimeChange={(t) => setBirthTime(t)}
              selectedTierIdx={selectedTierIdx}
              onSubmit={() => next()}
              onSkip={() => { setBirthTime(null); next(); }}
              skipLabel={question.skipLabel ?? "No sé la hora / Saltar"}
            />
          )}

          {/* Sin CTA en single/image — auto-avance via blink */}

        </div>
      </main>
    </div>
  );
}
