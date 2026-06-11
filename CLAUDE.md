# CLAUDE.md — Proyecto ALIZEE (automatiostudio)

Este archivo es el contexto persistente del proyecto. Claude Code lo lee al iniciar sesión. No re-expliques nada que ya esté aquí. Si algo no está definido, pregunta antes de inventar.

---

## 0\. Qué es esto (en una frase)

ALIZEE es una web que vende **"el regalo perfecto"**: un funnel de conversión mobile-first, tipo revelación guiada, que arma un **box personalizado** para el festejado/a a partir de un análisis previo (personalidad/arquetipo, y opcionalmente astral). Culmina en el envío de un paquete secreto \+ dossier de análisis \+ pieza de artea.

## 1\. Prioridad de lanzamiento (CRÍTICO)

- **Tema del mes: Día del Padre (México, domingo 21 de junio).**  
- **Se construye PRIMERO la sección masculina / "padre".** La femenina queda para fase 2\.  
- Hay ventana corta hasta el 21\. Optimiza para shippear rápido una sección, no dos a medias.  
- El funnel femenino (bolso por arquetipo → joya → sorpresa) es el **blueprint maestro**; el del padre es esa misma arquitectura adaptada. Diseña los componentes para ser reutilizables entre ambas secciones (data-driven, no hardcodeado por género).

## 2\. Arquitectura del funnel (mobile-first, "revelación guiada")

Experiencia secuencial estilo quiz/historia. **Una decisión por pantalla**, baja carga cognitiva, **auto-avance al confirmar**, **barra de progreso** siempre visible. Nada de formularios largos al inicio. El clímax es el regalo sorpresa desbloqueándose tras el análisis.

Flujo del padre (orden de pantallas):

1. **Portada / intro**  
   - Una sola propuesta de valor \+ un solo CTA primario ("Empezar").  
   - Mensaje corto y transparente de **cómo se usan los datos** (importante: pedimos fecha de nacimiento; decir para qué, arriba del fold). Protege confianza y conversión.  
2. **Quiz: hasta 11 preguntas** (decisión Victor, jun 2026 — antes el tope era 6). Regla viva: cada pregunta debe **alimentar el output** (arquetipo, dossier o producto); si una no cambia nada, va fuera. Las concretas y de baja fricción van primero; las opcionales (fecha/hora) al final y **siempre saltables**. Mantén el flujo ágil: auto-avance + barra de progreso.  
   - Q1 — ¿Para quién es? (papá / abuelo / esposo / suegro / figura paterna) → define relación.  
   - Profesión — ¿A qué se dedica? → personaliza el dossier (y el producto, fase 2). Concreta, temprana, baja fricción.  
   - Personalidad/arquetipo con lenguaje **concreto y masculino**: líder, explorador, creador, clásico, etc. (NO lenguaje esotérico aquí todavía.)  
   - Opcional — Fecha de nacimiento (solo signo solar). Enmarcado como "para desbloquear tu lectura personalizada". **NUNCA obligatorio. Nunca una barrera.**  
   - UI por pregunta: opción se ilumina/cambia color al seleccionar → activa botón → auto-avanza.  
3. **Ancla de estilo** — pieza de piel o reloj según arquetipo. Al elegir, auto-avanza.  
4. **Complemento** — fragancia o destilado curado (este último con asterisco logístico por alcohol).  
5. **Revelación (clímax)** — el "regalo sorpresa" se desbloquea con animación: objeto personalizado impreso en 3D \+ dossier de análisis (lugares que visitar, qué comer, en qué invertir su tiempo) \+ piedra/mineral \+ **vela de copal para protección** (activo de marca más fuerte, culturalmente universal en México).  
   - Aquí SÍ entra el lenguaje de intención/ritual/significado. Encuadre: significado, no predicción.  
6. **Página de resultados (shoppable)**  
   - Lidera con el resultado. **UN solo CTA primario** ("Armar mi regalo" / "Añadir al carrito").  
   - Links secundarios degradados a texto (evitar parálisis de decisión).  
   - 2–3 marcadores de confianza (garantía, envío, reseña/proof).  
   - **Captura de email AQUÍ** ("Guarda tu resultado"), no al inicio.  
7. **Urgencia real** — **contador hacia la fecha-tope de pedido** (antes del 21 jun) visible.

## 3\. Motor de personalización (por niveles)

- **Nivel B (default):** signo solar \+ quiz de personalidad. Es el camino principal.  
- **Nivel A (enriquecimiento opcional):** carta completa si el usuario tiene fecha/hora/lugar exactos. Nunca bloquear el funnel por falta de estos datos.  
- El análisis se presenta como **intención / ritual / significado**, jamás como predicción dura.

## 4\. Stack técnico

- **Next.js (App Router) \+ TypeScript**  
- **Tailwind CSS** para estilos (define design tokens en `tailwind.config`, no colores sueltos)  
- **Framer Motion** para transiciones, swipe y la animación de "desbloqueo" del reveal  
- Estado del quiz: React `useReducer` o **Zustand** (un solo store del funnel)  
- Deploy objetivo: **Vercel**  
- Sin backend pesado por ahora; mock de productos/recomendaciones en archivos locales (`/src/data`). El motor de recomendación es una función pura: respuestas → arquetipo → productos.

## 5\. Estructura sugerida del repo

/src

  /app            \# rutas: /(padre)/... , layout, página de resultados

  /components     \# QuizScreen, ProgressBar, OptionCard, RevealCard, CountdownTimer, ...

  /funnel         \# lógica: máquina de pasos, auto-avance, scoring de arquetipo

  /data           \# preguntas, arquetipos, catálogo de productos (mock), copy

  /lib            \# analytics (eventos), utils

  /styles         \# tokens / globals

/store            \# estado del funnel (zustand)

## 6\. Reglas de diseño / UX

- Mobile-first SIEMPRE. Probar a 375px de ancho. Cada pantalla cabe sin scroll en móvil.  
- Velocidad: la página debe cargar rápido (un retraso de 1s puede tirar conversión móvil).  
- Accesibilidad básica: contraste, foco visible, botones grandes (touch targets ≥ 44px).  
- Componentes reutilizables entre sección padre y futura sección femenina (data-driven).  
- **No** uses `localStorage`/`sessionStorage` para estado crítico del checkout sin avisarme.

## 7\. Branding (PENDIENTE — pedir antes de fijar)

- Aún no se ha entregado la imagen/identidad de referencia. **Deja los design tokens como placeholders claros** (`--brand-primary`, `--brand-accent`, tipografías) en un solo archivo, fáciles de reemplazar cuando llegue la guía visual. No inventes una identidad final.

## 8\. Medición (instrumentar desde el día 1\)

Eventos: `StartQuiz`, `CompleteQuiz`, `ViewRecommendation`, `AddToCart`, `Purchase`. Propiedades: paso, arquetipo, presupuesto, relación con festejado. Métricas que importan:

1. **Drop-off por paso** (dónde se cae la gente).  
2. **% que completa el paso de análisis** (aquí mueren los funnels esotéricos / de captura).  
3. **Add-to-cart tras la revelación.**

## 9\. Cómo trabajar conmigo (Victor)

- Construye por **fases pequeñas y verificables**. No generes todo el proyecto de un golpe.  
- Fase 1 sugerida: scaffold del proyecto \+ portada \+ 1 pantalla de quiz funcional con auto-avance y barra de progreso. Lo reviso y seguimos.  
- Antes de instalar dependencias nuevas o tomar una decisión de arquitectura no listada aquí, dime qué vas a hacer y por qué, en una línea.  
- La estrategia, el copy y la validación de ideas se trabajan en paralelo en otra ventana; si algo de copy no está definido, usa placeholders marcados con `// TODO COPY`.

---

### Primer mensaje sugerido para arrancar en la terminal

Lee CLAUDE.md. Inicializa el proyecto Next.js \+ TS \+ Tailwind \+ Framer Motion en esta carpeta, y construye SOLO la Fase 1: scaffold, portada (intro con CTA y nota de uso de datos) y una primera pantalla de quiz funcional con barra de progreso, selección que cambia color y auto-avance. Déjame un `npm run dev` corriendo para revisar. No avances a más pantallas todavía.  
