# CLAUDE.md — Proyecto ALIZEE (automatiostudio)

Contexto persistente del proyecto. Claude Code lo lee al iniciar sesión. No re-expliques lo que ya está aquí. Si algo no está definido, **pregunta antes de inventar**.

---

## Reglas que no se rompen
- La **fecha de nacimiento NUNCA es obligatoria** ni bloquea el funnel. Siempre saltable.
- **NO inventes identidad de marca.** Los design tokens son placeholders hasta que llegue la guía visual (ver §Branding).
- **NO uses `localStorage`.** El store del funnel usa `sessionStorage` (se borra al cerrar pestaña) y `reset()` limpia la PII. La dirección de entrega NO se persiste. No amplíes el storage a más PII sin avisarme.
- **PII fuera de la URL en claro.** La ficha (`/ficha`) va CIFRADA (AES-256-GCM, `FICHA_SECRET`) vía `/api/ficha`. Nunca metas datos personales legibles en una URL.
- Construye por **fases pequeñas y verificables**. Nunca generes todo el proyecto de un golpe.
- Antes de **instalar una dependencia** no listada o tomar una decisión de arquitectura no escrita aquí, dime **qué y por qué en una línea**.
- Antes de tocar formularios o el flujo de datos, lee **`/AUDITORIA.md`**. Los P0 legales (aviso de privacidad, datos de terceros) son requisito de lanzamiento, no opcionales.

---

## Qué es esto (una frase)
ALIZEE vende **"el regalo perfecto"**: un funnel mobile-first tipo revelación guiada que arma un **box personalizado** para el festejado/a a partir de un análisis previo (personalidad/arquetipo, opcionalmente astral). Culmina en un paquete secreto + dossier de análisis + pieza de arte.

## Comandos
- Dev server: `npm run dev` (déjalo corriendo para que yo revise)
- Typecheck: `npm run typecheck` — **córrelo antes de dar por terminada cualquier tarea**
- Lint: `npm run lint`
- Build: `npm run build`
- Después de tocar el funnel, **verifica a 375px de ancho con Playwright MCP** (di "usa playwright mcp" la primera vez en la sesión).

## Documentos de referencia (léelos cuando apliquen)
- **`/docs/FUNNEL.md`** — especificación completa del funnel (orden de pantallas, motor de personalización por niveles). **Léelo antes de tocar `/src/funnel` o `/src/components` del quiz.**
- **`/AUDITORIA.md`** — seguridad, UX/UI, SEO y legal, priorizado en P0/P1/P2. **Léelo antes de tocar datos, formularios o checkout.**

---

## Estado actual de campaña (CADUCA — revisar/borrar después del 21 jun)
- **Tema del mes: Día del Padre (México, domingo 21 de junio).**
- Se construye **PRIMERO la sección masculina / "padre"**. La femenina es fase 2.
- Ventana corta hasta el 21: optimiza para shippear **una** sección bien, no dos a medias.
- Hay un **contador hacia la fecha-tope de pedido** visible en el funnel.
> Nota: todo lo de esta sección es temporal. Después del 21 de junio, este contexto es obsoleto — no lo trates como regla permanente.

---

## Stack técnico
- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** (design tokens en `tailwind.config`, nunca colores sueltos)
- **Framer Motion** (paquete `motion`) para transiciones, swipe y la animación de "desbloqueo" del reveal
- Estado del quiz: **Zustand** (un solo store del funnel) o `useReducer`
- Deploy: **Vercel**
- Sin backend pesado por ahora. Productos/recomendaciones mock en `/src/data`. El motor de recomendación es una **función pura**: respuestas → arquetipo → productos.

## Estructura del repo
```
/src
  /app          # rutas: /(padre)/..., layout, página de resultados
  /components   # QuizScreen, ProgressBar, OptionCard, RevealCard, CountdownTimer, ...
  /funnel       # lógica: máquina de pasos, auto-avance, scoring de arquetipo
  /data         # preguntas, arquetipos, catálogo de productos (mock), copy
  /lib          # analytics (eventos), utils
  /styles       # tokens / globals
/store          # estado del funnel (zustand)
```
Componentes **data-driven y reutilizables** entre la sección padre y la futura femenina. Nada hardcodeado por género.

## Reglas de diseño / UX
- **Mobile-first siempre.** Probar a 375px. Cada pantalla cabe sin scroll en móvil.
- **Velocidad:** carga rápida; 1s de retraso tira conversión móvil.
- **Una decisión por pantalla**, auto-avance al confirmar, barra de progreso siempre visible. Nada de formularios largos al inicio.
- Accesibilidad básica: contraste AA, foco visible, touch targets ≥ 44px, respetar `prefers-reduced-motion` en animaciones.

## Branding (PENDIENTE — pedir antes de fijar)
Aún no hay identidad de referencia. Deja los design tokens como **placeholders claros** (`--brand-primary`, `--brand-accent`, tipografías) en un solo archivo, fáciles de reemplazar. No inventes una identidad final.

## Pagos (CLIP)
- Pasarela elegida: **CLIP** (`developer.clip.mx`). Stub en `src/lib/payment.ts`.
- Env requerida (prod): **`CLIP_API_KEY`**. Decisión pendiente: Payment Links (redirección a pago hosted, más simple) vs Checkout SDK.
- Pago real necesita **webhook** de confirmación → cuando se conecte, probablemente convenga DB (Vercel KV/Supabase) para registrar pedidos y migrar la ficha a `?id=` corto.
- Hoy el checkout cierra por **WhatsApp** (handoff manual). CLIP entra como camino de pago primario; mantener WhatsApp como fallback hasta validar.

## Medición (instrumentar desde el día 1)
Eventos: `StartQuiz`, `CompleteQuiz`, `ViewRecommendation`, `AddToCart`, `InitiateCheckout`, `Purchase`. Propiedades: paso, arquetipo, presupuesto, relación con festejado.
Métricas que importan: (1) drop-off por paso; (2) % que completa el paso de análisis; (3) add-to-cart tras la revelación.
- **Cableado**: GA4 + Meta Pixel en `layout.tsx`, bridge en `__analyticsDispatch` (`src/lib/analytics.ts`). Solo activan con env: **`NEXT_PUBLIC_GA_ID`** (G-…) y **`NEXT_PUBLIC_META_PIXEL_ID`**. Mapeo a eventos estándar de Meta: `CompleteQuiz`→`Lead`, `ViewRecommendation`→`ViewContent`, `AddToCart`/`InitiateCheckout`/`Purchase` directos.

## Variables de entorno
```
NEXT_PUBLIC_GA_ID=G-XXXXXXX            # GA4 (opcional, sin valor no carga)
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX   # Meta Pixel (opcional)
FICHA_SECRET=<cadena larga aleatoria>  # cifra la ficha (PII) — OBLIGATORIA en prod
BREVO_API_KEY=...                      # captura de email
BREVO_LIST_ID=0
NEXT_PUBLIC_GOOGLE_MAPS_KEY=...        # autocompletado dirección (restringir por dominio en GCP)
NEXT_PUBLIC_WHATSAPP_NUMBER=52...      # destino del pedido
NEXT_PUBLIC_BASE_URL=https://alizee.mx
CLIP_API_KEY=...                       # pagos (pendiente)
# Rate limiting (Upstash/Vercel KV). Sin esto cae a memoria (no fiable en serverless)
KV_REST_API_URL=...                    # o UPSTASH_REDIS_REST_URL
KV_REST_API_TOKEN=...                  # o UPSTASH_REDIS_REST_TOKEN
```
> **Provisionar KV**: Vercel dashboard → Storage → Create (Upstash Redis/KV) → conectar al proyecto. Inyecta las envs solo. `src/lib/rate-limit.ts` las detecta solo.

## Cómo trabajar conmigo (Victor)
- Fases pequeñas y verificables. **Fase 1:** scaffold + portada + 1 pantalla de quiz funcional con auto-avance y barra de progreso. Reviso y seguimos.
- Estrategia, copy y validación se trabajan en paralelo en otra ventana. Si falta copy, usa placeholders `// TODO COPY`.

## Navegación del repo (graphify)
Hay un knowledge graph en `graphify-out/`.
- Para preguntas sobre el código, corre primero `graphify query "<pregunta>"` si existe `graphify-out/graph.json`. Usa `graphify path "<A>" "<B>"` para relaciones y `graphify explain "<concepto>"` para conceptos puntuales (devuelven un subgrafo acotado, más chico que el reporte completo).
- Si existe `graphify-out/wiki/index.md`, úsalo para navegación amplia en vez de explorar el código crudo.
- Lee `graphify-out/GRAPH_REPORT.md` solo para revisión de arquitectura amplia.
- Después de modificar código, corre `graphify update .` para mantener el grafo al día (solo AST, sin costo de API).

---

### Primer mensaje para arrancar en la terminal
> Lee CLAUDE.md y /docs/FUNNEL.md. Inicializa Next.js + TS + Tailwind + Framer Motion en esta carpeta y construye SOLO la Fase 1: scaffold, portada (intro con CTA y nota de uso de datos) y una primera pantalla de quiz funcional con barra de progreso, selección que cambia color y auto-avance. Deja `npm run dev` corriendo. No avances a más pantallas todavía.