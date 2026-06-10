"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { Logo } from "@/components/Logo";
import { OptionCard } from "@/components/OptionCard";
import { ImageOptionCard } from "@/components/ImageOptionCard";
import { DateTimeInput } from "@/components/DateTimeInput";
import { TOTAL_STEPS } from "@/data/questions";
import { BOX_TIERS } from "@/data/pricing";
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
  const next         = useFunnel((s) => s.next);
  const prev         = useFunnel((s) => s.prev);
  const reset        = useFunnel((s) => s.reset);
  const getArchetype    = useFunnel((s) => s.getArchetype);
  const getRelationship = useFunnel((s) => s.getRelationship);
  const privacyAccepted = useFunnel((s) => s.privacyAccepted);
  const setPrivacyAccepted = useFunnel((s) => s.setPrivacyAccepted);

  useEffect(() => {
    if (!question) {
      analytics.completeQuiz(getArchetype(), !!birthDate, getRelationship());
      router.push("/diadelpadre");
    }
  }, [question, router, getArchetype, getRelationship, birthDate]);

  // Mostrar checkbox privacidad si no ha sido aceptado
  if (!privacyAccepted) {
    return (
      <div className="flex min-h-[100dvh] flex-col px-5 pt-6 pb-8">
        <header className="mx-auto w-full max-w-md mb-8">
          <Logo height={18} href="/" />
        </header>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-[36px] font-semibold leading-tight tracking-tight text-[var(--brand-fg)]">
              Un momento
            </h1>

            <p className="text-[17px] leading-relaxed text-[var(--brand-fg-muted)]">
              Antes de continuar, necesitamos que conozcas y aceptes nuestro aviso de privacidad.
              Tus datos (y los del festejado) se usan solo para personalizar su regalo.
            </p>

            <div className="rounded-[var(--radius-md)] border border-[var(--brand-border)] p-4 bg-[var(--brand-surface-alt)]">
              <p className="text-sm text-[var(--brand-fg)]">
                Leemos datos de nacimiento, nombre y respuestas del cuestionario para hacer el análisis.
                Los guardamos 90 días tras la entrega, luego los borramos.
              </p>
              <p className="text-xs text-[var(--brand-fg-muted)] mt-3">
                <a href="/aviso-de-privacidad" className="text-[var(--brand-primary)] hover:underline">
                  Leer aviso completo →
                </a>
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1.5 w-5 h-5 accent-[var(--brand-primary)]"
                style={{ touchAction: "manipulation" }}
              />
              <span className="text-sm text-[var(--brand-fg)]">
                He leído y acepto el Aviso de Privacidad. Declaro contar con el consentimiento
                de la persona festejada para compartir sus datos.
              </span>
            </label>

            <button
              type="button"
              disabled={!privacyAccepted}
              onClick={() => analytics.startQuiz()}
              style={{
                touchAction: "manipulation",
                background: privacyAccepted
                  ? "var(--brand-gradient)"
                  : "var(--brand-border)",
              }}
              className={[
                "w-full min-h-[58px] rounded-full",
                "text-base font-semibold select-none",
                "transition-opacity duration-200",
                "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] focus-visible:outline-offset-2",
                privacyAccepted
                  ? "text-white cursor-pointer"
                  : "text-[var(--brand-fg-muted)] opacity-50 cursor-not-allowed",
              ].join(" ")}
            >
              {privacyAccepted ? "Empezar →" : "Acepta para continuar"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!question) return null;

  const hasAnswer = !!answers[question.id];
  const requireTime = selectedTierIdx > 0; // non-Lite requiere hora
  const tier = BOX_TIERS[selectedTierIdx];

  const handleSelect = (questionId: Parameters<typeof setAnswer>[0], key: string) => {
    if (Object.keys(answers).length === 0) analytics.startQuiz();
    const opt = question?.options?.find((o) => o.key === key);
    analytics.answerQuestion(step, questionId, key, opt?.archetype);
    setAnswer(questionId, key);
  };

  const handleContinue = () => {
    if (hasAnswer) next();
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
                    onSelect={(key) => handleSelect(question.id, key)}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* Fecha + Hora de nacimiento */}
          {question.kind === "datetime" && (
            <DateTimeInput
              date={birthDate}
              time={birthTime}
              onDateChange={(iso) => setBirthDate(iso)}
              onTimeChange={(t) => setBirthTime(t)}
              onSubmit={() => next()}
              onSkip={() => { setBirthDate(null); setBirthTime(null); next(); }}
              skipLabel={question.skipLabel ?? "Saltar análisis astral"}
              requireTime={requireTime}
              tierName={tier.name}
            />
          )}

          {/* CTA: visible siempre, se activa al seleccionar */}
          {question.kind !== "date" && question.kind !== "datetime" && (
            <button
              type="button"
              disabled={!hasAnswer}
              onClick={handleContinue}
              style={{
                touchAction: "manipulation",
                background: hasAnswer
                  ? "var(--brand-gradient)"
                  : "var(--brand-border)",
              }}
              className={[
                "w-full min-h-[58px] rounded-full",
                "text-base font-semibold select-none",
                "transition-opacity duration-200",
                "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] focus-visible:outline-offset-2",
                hasAnswer
                  ? "text-white cursor-pointer"
                  : "text-[var(--brand-fg-muted)] opacity-50 cursor-not-allowed",
              ].join(" ")}
            >
              {hasAnswer ? "Continuar →" : "Elige una opción"}
            </button>
          )}

        </div>
      </main>
    </div>
  );
}
