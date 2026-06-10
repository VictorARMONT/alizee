# ALIZEE — Copy y modelo de personalización (sección PADRE)

Para Claude Code: traduce esto a `src/data/questions.ts` y `src/data/archetypes.ts`. Es contenido/estrategia; no cambies la arquitectura ya construida en Fase 1\. Donde diga `[CONFIRMAR]` es decisión de negocio de Victor: deja TODO marcado, no inventes.

---

## A. PORTADA (`src/app/page.tsx`)

- **Eyebrow:** EDICIÓN DÍA DEL PADRE  
- **Headline:** El regalo perfecto para él no se compra. Se diseña.  
- **Subhead:** Responde unas preguntas sobre él y creamos un regalo ritual hecho a su medida: una pieza personalizada, su lectura, y una vela de copal para protegerlo.  
- **CTA primario:** Crear su regalo  
- **Nota de datos (arriba del fold, texto chico):** Te preguntaremos algunas cosas sobre él para personalizar su regalo. Usamos tus respuestas solo para diseñar la experiencia. [Política de privacidad](#) ← enlazar cuando exista.  
- **Contador:** Pedidos hasta el **15 de junio** \[CONFIRMAR fecha-tope real con ops\].

---

## B. QUIZ — 6 pantallas (`src/data/questions.ts`)

Progress bar X/6. Una pregunta por pantalla. Selección → dorado → auto-avance. SIN pantalla intermedia de "anotado": al elegir, pasa directo a la siguiente pregunta.

### Q1 — Relación (YA VIVA)

**¿Para quién es el regalo?**

- Mi papá  
- Mi abuelo  
- Mi esposo o pareja  
- Mi suegro  
- Otra figura paterna

(No puntúa arquetipo; se guarda para personalizar copy del dossier y la revelación.)

### Q2 — Arquetipo

**En una reunión familiar, él es…**

- El que organiza y dirige todo → `lider`  
- El que llega con una historia o un lugar nuevo que contar → `explorador`  
- El que arregló algo o trajo algo hecho por él → `creador`  
- El que escucha y suelta el consejo justo → `sabio`

### Q3 — Arquetipo

**Su domingo ideal sería…**

- Ponerse al día con sus planes y proyectos → `lider`  
- Salir a la carretera, al monte o a un lugar que no conoce → `explorador`  
- Meterse a su taller, su cocina o lo que esté construyendo → `creador`  
- Un buen libro, un café y calma → `sabio`

### Q4 — Arquetipo

**Si le sobrara tiempo y dinero, lo gastaría en…**

- Algo que represente lo que ha logrado → `lider`  
- Un viaje o una experiencia nueva → `explorador`  
- Herramientas o materiales para hacer algo → `creador`  
- Aprender algo o coleccionar algo con significado → `sabio`

### Q5 — Arquetipo

**Lo que más lo describe:**

- Determinado y protector → `lider`  
- Curioso e inquieto → `explorador`  
- Hábil y detallista → `creador`  
- Sereno y reflexivo → `sabio`

### Q6 — Fecha de nacimiento (OPCIONAL — nunca bloquea)

**¿Conoces su fecha de nacimiento?** Subtexto: La usamos para añadir su lectura personalizada a la sorpresa.

- Date picker (día / mes / año)  
- Botón secundario: "No la sé / Prefiero no ponerla" → continúa sin penalización.

---

## C. MODELO DE ARQUETIPOS (`src/data/archetypes.ts`)

Scoring: suma los pesos de Q2–Q5 (1 punto por opción a su arquetipo). El arquetipo con más puntos gana. **Desempate:** la respuesta de Q5. Cada arquetipo mapea a tipos de producto; los SKU concretos los llena Victor `[CONFIRMAR]`.

La **vela de copal** y el **dossier de análisis** son constantes en TODOS los arquetipos.

### 1\. El Líder — "El que guía"

Legado, autoridad, lo que ha construido.

- Ancla: reloj clásico/elegante `[SKU]` · pieza de piel estructurada (cinturón, portafolio, tarjetero) `[SKU]`  
- Complemento: fragancia amaderada/ámbar `[SKU]` · destilado añejo/reserva `[SKU]`  
- Piedra: ojo de tigre o pirita

### 2\. El Explorador — "El que descubre"

Libertad, movimiento, lo que está por conocer.

- Ancla: reloj de campo/deportivo `[SKU]` · piel resistente (duffel, mochila, llavero robusto) `[SKU]`  
- Complemento: fragancia fresca/cítrica-amaderada `[SKU]` · mezcal joven `[SKU]`  
- Piedra: turquesa o ágata

### 3\. El Creador — "El que hace"

Oficio, manos, detalle.

- Ancla: pieza de piel artesanal (funda, estuche, mandil de cuero) `[SKU]` · reloj minimalista `[SKU]`  
- Complemento: fragancia herbal/especiada `[SKU]` · destilado artesanal de lote pequeño `[SKU]`  
- Piedra: cuarzo o amatista

### 4\. El Sabio — "El que acompaña"

Calma, conocimiento, introspección.

- Ancla: cartera fina o funda de libreta de piel `[SKU]` · reloj de líneas limpias `[SKU]`  
- Complemento: fragancia amaderada-incienso `[SKU]` · reposado suave `[SKU]`  
- Piedra: amatista o cuarzo blanco

---

## D. SIGNO SOLAR (lookup local, sin API)

Si hay fecha en Q6, deriva el signo por rango de fecha. Tabla simple en `src/data`:

| Signo | Desde | Hasta |
| :---- | :---- | :---- |
| Aries | 21 mar | 19 abr |
| Tauro | 20 abr | 20 may |
| Géminis | 21 may | 20 jun |
| Cáncer | 21 jun | 22 jul |
| Leo | 23 jul | 22 ago |
| Virgo | 23 ago | 22 sep |
| Libra | 23 sep | 22 oct |
| Escorpio | 23 oct | 21 nov |
| Sagitario | 22 nov | 21 dic |
| Capricornio | 22 dic | 19 ene |
| Acuario | 20 ene | 18 feb |
| Piscis | 19 feb | 20 mar |

El signo solo enriquece el copy del dossier en la revelación. NO cambia la recomendación de producto (esa la define el arquetipo). Sin fecha → el dossier omite la sección astral sin avisar que falta.

---

## E. REVELACIÓN \+ RESULTADOS (Fase 2, copy base)

- Animación de desbloqueo del "regalo sorpresa".  
- Encuadre: **intención, ritual, significado** — nunca predicción.  
- Página de resultados shoppable: UN CTA primario ("Armar su regalo"), 2-3 marcadores de confianza, captura de email ("Guarda su regalo"). Links secundarios degradados a texto.  
- Add-on opcional aquí (cross-sell) en lugar de pregunta de presupuesto. `[CONFIRMAR add-on]`

