# FUNNEL.md — Especificación del funnel (Proyecto ALIZEE)

Especificación de producto del funnel. Léelo antes de tocar `/src/funnel` o los componentes del quiz. Las reglas operativas y el stack están en `/CLAUDE.md`.

---

## Concepto
Experiencia secuencial estilo quiz/historia, mobile-first: **una decisión por pantalla**, baja carga cognitiva, **auto-avance al confirmar**, **barra de progreso siempre visible**. Nada de formularios largos al inicio. El clímax es el regalo sorpresa desbloqueándose tras el análisis.

El funnel femenino (bolso por arquetipo → joya → sorpresa) es el **blueprint maestro**; el del padre es esa misma arquitectura adaptada. Diseña los componentes data-driven para reutilizarlos entre ambas secciones.

---

## Flujo del padre (orden de pantallas)

### 1. Portada / intro
- Una sola propuesta de valor + un solo CTA primario ("Empezar").
- Mensaje corto y transparente de **cómo se usan los datos**, arriba del fold (pedimos fecha de nacimiento; decir para qué). Protege confianza y conversión.

### 2. Quiz — mantenlo corto
Objetivo **6–7 pasos, nunca más de 8**. Menos preguntas = menos abandono (validado por Victor, jun 2026 — se descartó subir el tope a 11). Cada pregunta debe **alimentar el output** (arquetipo, dossier o producto); si una no cambia nada, va fuera. Las concretas y de baja fricción primero; las opcionales (fecha/hora) al final y **siempre saltables**.

- **Q1 — ¿Para quién es?** (papá / abuelo / esposo / suegro / figura paterna) → define relación.
- **Profesión — ¿A qué se dedica?** → personaliza el dossier (y el producto, fase 2). Concreta, temprana, baja fricción.
- **Personalidad / arquetipo** con lenguaje **concreto y masculino**: líder, explorador, creador, clásico, etc. (NO lenguaje esotérico aquí todavía.)
- **Opcional — Fecha de nacimiento** (solo signo solar). Enmarcado como "para desbloquear tu lectura personalizada". **NUNCA obligatorio. Nunca una barrera.**

UI por pregunta: la opción se ilumina/cambia color al seleccionar → activa el botón → auto-avanza.

### 3. Ancla de estilo
Pieza de piel o reloj según arquetipo. Al elegir, auto-avanza.

### 4. Complemento
Fragancia o destilado curado (el destilado con asterisco logístico por alcohol).

### 5. Revelación (clímax)
El "regalo sorpresa" se desbloquea con animación: objeto personalizado impreso en 3D + dossier de análisis (lugares que visitar, qué comer, en qué invertir su tiempo) + piedra/mineral + **vela de copal para protección** (activo de marca más fuerte, culturalmente universal en México).
- Aquí SÍ entra el lenguaje de intención / ritual / significado. Encuadre: **significado, no predicción**.

### 6. Página de resultados (shoppable)
- Lidera con el resultado. **UN solo CTA primario** ("Armar mi regalo" / "Añadir al carrito").
- Links secundarios degradados a texto (evitar parálisis de decisión).
- 2–3 marcadores de confianza (garantía, envío, reseña/proof).
- **Captura de email AQUÍ** ("Guarda tu resultado"), no al inicio.

### 7. Urgencia real
**Contador hacia la fecha-tope de pedido** (antes del 21 jun) visible.

---

## Motor de personalización (por niveles)
- **Nivel B (default):** signo solar + quiz de personalidad. Es el camino principal.
- **Nivel A (enriquecimiento opcional):** carta completa si el usuario tiene fecha/hora/lugar exactos. **Nunca bloquear el funnel** por falta de estos datos.
- El análisis se presenta como **intención / ritual / significado**, jamás como predicción dura.

---

## Sistema de arquetipos (sección padre)
| Key | Nombre | Tagline | Esencia |
|---|---|---|---|
| `lider` | El Líder | El que guía | Legado, autoridad, lo que ha construido |
| `explorador` | El Explorador | El que descubre | Libertad, movimiento, lo por conocer |
| `creador` | El Creador | El que hace | Oficio, manos, detalle |
| `sabio` | El Sabio | El que acompaña | Calma, conocimiento, introspección |

> El scoring de arquetipo es una función pura en `/src/funnel`: respuestas del quiz → arquetipo → productos recomendados (`/src/data`).