"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useFunnel, FLOW_STEPS } from "@/store/funnel";
import { ARCHETYPES } from "@/data/archetypes";
import { DossierReveal } from "@/components/DossierReveal";
import { BoxTierSelector } from "@/components/BoxTierSelector";
import { CheckoutSummary, type DeliveryAddress } from "@/components/CheckoutSummary";
import { StickyFooterSummary } from "@/components/StickyFooterSummary";
import { ProgressBar } from "@/components/ProgressBar";
import { Logo } from "@/components/Logo";
import { analytics } from "@/lib/analytics";
import { BOX_TIERS } from "@/data/pricing";
import { getTotemProfile } from "@/data/totem";
import { getChineseZodiac, getKinMaya } from "@/data/birthProfile";
import { SIGN_INFO } from "@/data/zodiac";
import { QUESTIONS } from "@/data/questions";
import { SLOT_LABELS } from "@/components/CheckoutSummary";

export default function ArmarPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const archetypeKey  = useFunnel((s) => s.getArchetype());
  const answers       = useFunnel((s) => s.answers);
  const sign          = useFunnel((s) => s.getSunSign());
  const relationship  = useFunnel((s) => s.getRelationship());
  const birthDate     = useFunnel((s) => s.birthDate);
  const birthTime     = useFunnel((s) => s.birthTime);
  const flowStep      = useFunnel((s) => s.flowStep);
  const email         = useFunnel((s) => s.email);
  const total         = useFunnel((s) => s.getTotal());

  const nextFlowStep    = useFunnel((s) => s.nextFlowStep);
  const prevFlowStep    = useFunnel((s) => s.prevFlowStep);
  const selectedTierIdx = useFunnel((s) => s.selectedTierIdx);
  const setTierIdx      = useFunnel((s) => s.setTierIdx);
  const setEmail        = useFunnel((s) => s.setEmail);
  const reset           = useFunnel((s) => s.reset);

  // Sin arquetipo después de montar (storage leído) → redirigir
  useEffect(() => {
    if (mounted && !archetypeKey) router.replace("/");
  }, [mounted, archetypeKey, router]);

  // ViewRecommendation — solo al entrar en reveal (1 vez)
  const revealFired = useRef(false);
  useEffect(() => {
    if (flowStep === "reveal" && archetypeKey && !revealFired.current) {
      revealFired.current = true;
      analytics.viewRecommendation(archetypeKey, !!sign);
    }
  }, [flowStep, archetypeKey, sign]);

  if (!mounted || !archetypeKey) return null;

  const arch = ARCHETYPES[archetypeKey];
  const flowIdx = FLOW_STEPS.indexOf(flowStep);
  const showSticky = flowStep !== "reveal";
  const stickyLabel =
    flowStep === "configurator" ? "Continuar →" : "Ver resumen →";

  function handleStickyClick() {
    if (flowStep === "checkout") return;

    if (flowStep === "configurator") {
      analytics.addToCart(archetypeKey!, total, []);
    }

    nextFlowStep();
  }

  function handleCheckout(address: DeliveryAddress) {
    const tier = BOX_TIERS[selectedTierIdx];

    const RELATIONSHIP_COPY: Record<string, string> = {
      papa: "Mi papá", abuelo: "Mi abuelo", pareja: "Mi esposo o pareja",
      suegro: "Mi suegro", otra: "Otra figura paterna",
    };
    const relationLabel = relationship ? (RELATIONSHIP_COPY[relationship] ?? relationship) : "—";

    const boxContents = tier.includes.map((item) => `• ${item}`).join("\n");
    const formatMXN = (n: number) =>
      new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(n);

    /* ── Ficha de identidad ── */
    const ARCHETYPE_ANIMALS: Record<string, string> = {
      lider: "Águila Real", explorador: "Lobo Gris", creador: "Jaguar", sabio: "Búho Cornudo",
    };
    const animalPoder = archetypeKey ? (ARCHETYPE_ANIMALS[archetypeKey] ?? "—") : "—";
    const piezaNote = animalPoder;

    /* señal cross-sell: escultura 3D perro / altar Día de Muertos */
    const mascotaAnswer = answers.mascotas ?? "no";
    const tienePerro = mascotaAnswer === "perro" || mascotaAnswer === "varios";
    const leGustandAnimales = mascotaAnswer !== "no";

    const chinese = birthDate ? getChineseZodiac(birthDate) : null;
    const kinMaya  = birthDate ? getKinMaya(birthDate)       : null;
    const signInfo = sign     ? SIGN_INFO[sign]              : null;
    const totemProfile = birthDate ? getTotemProfile(birthDate, answers, "sol") : null;

    /* ── Quiz: etiquetas legibles ── */
    function getLabel(qId: string, key: string): string {
      const q = QUESTIONS.find((x) => x.id === qId);
      return q?.options?.find((o) => o.key === key)?.label ?? key;
    }

    const quizLines = [
      answers.relationship && `• ¿Para quién?    → ${getLabel("relationship", answers.relationship)}`,
      answers.proyeccion   && `• Proyección      → ${getLabel("proyeccion",   answers.proyeccion)}`,
      answers.decision     && `• Decisiones      → ${getLabel("decision",     answers.decision)}`,
      answers.presion      && `• Bajo presión    → ${getLabel("presion",      answers.presion)}`,
      answers.valores      && `• Valora en otros → ${getLabel("valores",      answers.valores)}`,
      answers.mascotas     && `• Animales        → ${getLabel("mascotas",     answers.mascotas)}`,
    ].filter(Boolean).join("\n");

    const sistemaLines = [
      `• Arquetipo: ${arch.name}`,
      signInfo  && `• Signo solar: ${signInfo.name} ${signInfo.glyph}`,
      chinese   && `• Animal chino: ${chinese.name} ${chinese.glyph}`,
      kinMaya   && `• Nahual Maya: ${kinMaya.sealName} (Kin ${kinMaya.kin}) · Tono ${kinMaya.tone} ${kinMaya.toneName}`,
      birthDate && `• Fecha: ${new Date(birthDate + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}`,
      birthTime && `• Hora: ${birthTime}`,
    ].filter(Boolean).join("\n");

    const piedrasLines = totemProfile
      ? [
          `• Mes: ${totemProfile.stone.primary.name} — ${totemProfile.stone.primary.reason} [${totemProfile.stone.primary.source}]`,
          `• Signo: ${totemProfile.stone.secondary.name} — ${totemProfile.stone.secondary.reason} [${totemProfile.stone.secondary.source}]`,
          `• Intención: ${totemProfile.stone.intention.name} — ${totemProfile.stone.intention.reason} [${totemProfile.stone.intention.source}]`,
        ].join("\n")
      : `• ${arch.piedra.label} — ${arch.piedra.detail ?? ""}`;

    const lugarLine = totemProfile
      ? `${totemProfile.sacredPlace.type} (${totemProfile.sacredPlace.examples.join(", ")})`
      : "—";

    const msg = [
      `🎁 *PEDIDO ALIZEE — Día del Padre*`,
      `────────────────────`,
      `Paquete: *${tier.name}*  ·  Arquetipo: *${arch.name}*`,
      `Para: ${relationLabel}  ·  Total: *${formatMXN(total)}*`,
      `────────────────────`,
      `📦 *Contenido del box:*`,
      boxContents,
      `────────────────────`,
      `🚚 *Dirección de entrega:*`,
      address.formattedAddress
        ? address.formattedAddress
        : `${address.street}, Col. ${address.colonia}, ${address.cityState} CP ${address.zip}`,
      ...(address.references.trim() ? [`📍 Ref: ${address.references.trim()}`] : []),
      ...(address.lat && address.lng
        ? [`🗺 Maps: https://maps.google.com/?q=${address.lat},${address.lng}`]
        : []),
      ...(address.deliveryTime
        ? [`🕐 Horario: ${SLOT_LABELS[address.deliveryTime] ?? address.deliveryTime}`]
        : []),
      `────────────────────`,
      `🔧 *FICHA DE CREACIÓN*`,
      `Pieza 3D: ${piezaNote}`,
      ``,
      `Sistema de identidad:`,
      sistemaLines,
      ``,
      `Piedras para el box:`,
      piedrasLines,
      ``,
      `Lugar de poder: ${lugarLine}`,
      `────────────────────`,
      `📋 *Entrevista completa:*`,
      quizLines,
      `────────────────────`,
      `📅 Entregar antes del 21 jun.`,
    ].join("\n");

    const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "523349571689";
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    analytics.initiateCheckout(archetypeKey!, total, []);
    window.location.href = waUrl;
  }

  const subStep = flowIdx + 1;
  const subTotal = FLOW_STEPS.length;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="px-5 pt-6 pb-4 mx-auto w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          {flowStep === "reveal" ? (
            <button
              type="button"
              onClick={() => { reset(); router.push("/"); }}
              className="text-xs uppercase tracking-[0.22em] text-[var(--brand-fg-muted)] hover:text-[var(--brand-fg)] transition-colors"
            >
              ← Inicio
            </button>
          ) : (
            <button
              type="button"
              onClick={prevFlowStep}
              className="text-xs uppercase tracking-[0.22em] text-[var(--brand-fg-muted)] hover:text-[var(--brand-fg)] transition-colors"
            >
              ← Atrás
            </button>
          )}
          <Logo height={18} href={null} />
        </div>
        <ProgressBar current={subStep} total={subTotal} label="Su regalo" />
      </header>

      <main className="flex-1 px-5 pb-8 mx-auto w-full max-w-md">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={flowStep}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="py-6"
          >
            {flowStep === "reveal" && (
              <DossierReveal
                archetypeKey={archetypeKey}
                sign={sign}
                relationship={relationship}
                birthDate={birthDate}
                birthTime={birthTime}
                answers={answers}
                onContinue={nextFlowStep}
              />
            )}

            {flowStep === "configurator" && (
              <div className="flex flex-col gap-6">
                <div
                  className="relative w-full aspect-[16/7] rounded-[var(--radius-md)] overflow-hidden border"
                  style={{ borderColor: "var(--brand-border)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/quiz/q7-${archetypeKey}.webp`}
                    alt={`Material del arquetipo ${arch.name}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--brand-primary)]">
                    {arch.name}
                  </p>
                  <h1 className="text-[34px] font-semibold tracking-tight mt-2 leading-tight">
                    Elige su box.
                  </h1>
                  <p className="text-[14px] text-[var(--brand-fg-muted)] mt-2 leading-relaxed">
                    El arquetipo determina el contenido. El nivel, la profundidad.
                  </p>
                </div>
                <BoxTierSelector
                  selectedIdx={selectedTierIdx}
                  onSelect={setTierIdx}
                />
              </div>
            )}

            {flowStep === "checkout" && (
              <CheckoutSummary
                archetypeKey={archetypeKey}
                selectedTierIdx={selectedTierIdx}
                total={total}
                initialEmail={email}
                onEmailSave={setEmail}
                onCheckout={handleCheckout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {showSticky && flowStep !== "checkout" && (
        <StickyFooterSummary
          total={total}
          ctaLabel={stickyLabel}
          onCta={handleStickyClick}
          disabled={false}
        />
      )}
    </div>
  );
}
