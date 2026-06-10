# ALIZEE — Funnel Addendum v1 (MANDA sobre funnel-v2-addendum.md donde haya conflicto)

Fecha: 2026-06-04. Decisiones tomadas con Victor.

---

## Cambios vs v2-addendum

### Vela — personalizada por arquetipo (NO constante)
- La vela ya NO es igual para todos. Es curada por arquetipo.
- Lanzamiento con 2 variantes: **copal** + **palo santo**.
- Mapeo (confirmado, cambiable en `archetypes.ts` en 4 líneas):
  - Líder → copal (autoridad/protección)
  - Sabio → copal (introspección)
  - Explorador → palo santo (camino/limpia)
  - Creador → palo santo (ritmo de oficio)
- Si se añade más adelante: mirra/laurel para Creador, ámbar para Líder.
- **Fulfillment:** lanzar con 2 variantes es suficiente. Si faltan las 4, los arquetipos sin asignar usan copal como fallback.

### Las 3 capas del box (NO mezclar)
1. **Contenido curado** (incluido en $3,000 MXN base): ancla + complemento + piedra + vela + dossier. Lo que paga.
2. **Detalle sorpresa** (incluido, gratis, NO seleccionable): joyería chica o objeto pequeño por arquetipo — aretes, reloj, corbata, cadena, pulsera, etc., empacados en cajitas impresas en 3D con resina. Opcional: flores. Siempre cierra con sello impreso en 3D. Es el encanto.
3. **Cross-sell / upgrades** (de pago, opt-in, ANTES del total): grabado láser +$250, empaque premium +$150, vela extra +$200. Esto sube AOV.

### Regla operacional de fulfillment
- **Físico → personalizar por arquetipo (4 variantes).** Inventario escalable.
- **Texto/digital → personalizar por signo solar (12 variantes).** El texto del dossier es gratis de variar.
- Nunca personalizar objetos físicos por signo — 12 variantes físicas con 17 días de ventana es operacionalmente inviable.

### Precio
- Box base: **$3,000 MXN plano**.
- Incluye 2 elegidos + 1 sorpresa oculta.
- La selección de variante (ancla A vs B) NO cambia precio.
- Total = $3,000 + upgrades seleccionados.

### Dirección de diseño
- Texto base 18px, `line-height: 1.6`.
- H1 robusto (≥44px). Mucho aire vertical.
- Íconos: slots vacíos que Victor llena con SVG tiernos/cálidos propios. Hoy = emoji placeholder en `src/components/Icon.tsx`.
- Mobile-first 375px. Touch targets ≥ 56px.

---

## Flujo completo (spine Warby Parker, confirmado)

1. `/` portada — CTA "Crear su regalo" + countdown + nota datos
2. `/quiz` Q1–Q6 — relación + 4 arquetipo + fecha opcional (auto-avance en Q1-Q5, manual Q6)
3. `/armar` sub-vista **reveal** — dossier + arquetipo + sección astral si hay fecha
4. `/armar` sub-vista **configurator** — elige ancla + complemento
5. `/armar` sub-vista **crosssell** — upgrades opcionales antes del total
6. `/armar` sub-vista **checkout** — desglose + CTA pago + countdown + trust + email
7. Pago (gateway **[CONFIRMAR]**) — fuera de alcance

Precios ocultos hasta el reveal. StickyFooterSummary desde configurator.

---

## Pendientes [CONFIRMAR]

| Item | Placeholder | Notas |
|:-----|:------------|:------|
| Gateway de pago | alert() en checkout | Stripe MX / Conekta / Mercado Pago |
| Fecha-tope real (countdown) | 15 jun 2026 | Confirmar con ops (fulfillment + envío) |
| SKU catálogo | `[SKU]` en archetypes.ts | Victor los llena |
| Detalle sorpresa por arquetipo | copy provisional con `[CONFIRMAR]` | 4 items chicos |
| Vela extra (precio cross-sell) | $200 MXN | Confirmar |
| Política de privacidad | `href="#"` en portada | Crear y enlazar |
| Íconos de marca | emoji placeholder | Victor diseña SVG tiernos |
| Flores opcionales | no modelado aún | Flag `flowersIncluded` post-lanzamiento |

---

## Decisiones diferidas (roadmap post-lanzamiento)

- Motor de 4 disciplinas (Diseño Humano + Kin Maya — requieren hora exacta).
- Astrocartografía / "lugares sugeridos" reales (hoy = lugares curados por arquetipo en dossierLead).
- Sección femenina (componentes ya son data-driven, arquitectura lista).
- PDF del dossier por email + CRM/remarketing (requiere backend).
- Personalización por signo de objetos físicos (solo viable con más tiempo de producción).
