# ALIZEE — Guía de variables de entorno y servicios externos

Configura en este orden. Cada variable va en **Vercel → Settings → Environment Variables** (Production + Preview) **y** en `.env.local` para dev local.

> ⚠️ **Nunca pongas secretos en el chat, en commits ni en archivos trackeados por git.**

---

## 1. FICHA_SECRET (crítico — cifra la PII de pedidos)

Sin esta variable, la ficha de diseño viaja en base64 sin cifrar (visible para quien tenga el link).

**Generar:**
```bash
openssl rand -base64 32
# En Windows sin openssl:
pwsh -c "[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))"
```

**Agregar a Vercel:** `FICHA_SECRET` = *(cadena generada)*

⚠️ No la cambies después de tener pedidos activos — los links viejos dejan de descifrar.

---

## 2. KV / Rate-limiter (Upstash Redis)

Sin esto el rate-limiter corre en memoria (no fiable en serverless — Vercel reinicia instancias).

**Provisionar:**
1. Vercel → pestaña **Storage** → **Create Database → Upstash → Redis**
2. Región: `us-east-1` (o la más cercana)
3. **Connect Project** → `alizee-mx` → Production + Preview
4. Vercel inyecta automáticamente: `KV_REST_API_URL` + `KV_REST_API_TOKEN`

Para dev local: copia esas 2 vars del dashboard de Vercel a `.env.local`.

**Tier gratuito:** 10 k comandos/día — suficiente para MVP.

---

## 3. GA4 (analytics)

1. [analytics.google.com](https://analytics.google.com) → Admin → **Create → Property** → nombre "ALIZEE", zona México / MXN
2. **Data Stream → Web** → URL `https://alizee.mx`
3. Copia el **Measurement ID** (formato `G-XXXXXXX`)
4. Vercel: `NEXT_PUBLIC_GA_ID` = `G-XXXXXXX`

Eventos que ya se disparan solos (ver `src/lib/analytics.ts`): `StartQuiz`, `AnswerQuestion`, `CompleteQuiz`, `ViewRecommendation`, `ConfiguratorComplete`, `AddToCart`, `InitiateCheckout`, `WhatsAppContact`.

---

## 4. Meta Pixel

1. [business.facebook.com](https://business.facebook.com) → **Events Manager → Connect Data Sources → Web → Meta Pixel** → Create
2. Copia el **Pixel ID** (número largo)
3. Vercel: `NEXT_PUBLIC_META_PIXEL_ID` = *(número)*

Verifica con la extensión **Meta Pixel Helper** (Chrome) tras desplegar.

**Mapeo automático** (ver `layout.tsx`):
| Evento ALIZEE | Evento Meta estándar |
|---|---|
| `CompleteQuiz` | `Lead` |
| `ViewRecommendation` | `ViewContent` |
| `AddToCart` | `AddToCart` |
| `InitiateCheckout` | `InitiateCheckout` |
| Resto | Custom event (mismo nombre) |

---

## 5. Google Maps key (Places API — autocompletado de dirección)

**Restringir para evitar factura abierta:**
1. [console.cloud.google.com](https://console.cloud.google.com) → tu proyecto → **APIs & Services → Credentials**
2. Clic en la key de `NEXT_PUBLIC_GOOGLE_MAPS_KEY`
3. **Application restrictions → Websites** → agregar:
   - `https://alizee.mx/*`
   - `https://*.vercel.app/*`
   - `http://localhost:3000/*`
4. **API restrictions → Restrict key** → marcar solo: **Maps JavaScript API** + **Places API**
5. Save (tarda ~5 min)

**Alerta de billing:** GCP → Billing → Budgets & alerts → crear alerta a $10 USD.

Vercel: `NEXT_PUBLIC_GOOGLE_MAPS_KEY` = *(tu key)*

---

## 6. WhatsApp y URL base

```
NEXT_PUBLIC_WHATSAPP_NUMBER=52XXXXXXXXXX   # número completo con código país, sin +
NEXT_PUBLIC_BASE_URL=https://alizee.mx
```

---

## 7. Brevo (captura de email)

```
BREVO_API_KEY=...       # Brevo → Settings → API Keys
BREVO_LIST_ID=3         # ID de la lista de contactos en Brevo
```

---

## 8. CLIP (pagos — pendiente)

Pasarela elegida. Stub en `src/lib/payment.ts`. Pendiente de credenciales y decisión de producto (Payment Links vs Checkout SDK).

```
CLIP_API_KEY=...
```

---

## Resumen de todas las vars

```bash
# .env.local — copiar y rellenar
FICHA_SECRET=

NEXT_PUBLIC_GA_ID=G-
NEXT_PUBLIC_META_PIXEL_ID=

NEXT_PUBLIC_GOOGLE_MAPS_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=52
NEXT_PUBLIC_BASE_URL=https://alizee.mx

BREVO_API_KEY=
BREVO_LIST_ID=3

KV_REST_API_URL=
KV_REST_API_TOKEN=

CLIP_API_KEY=
```

---

## Redeploy tras cargar envs

Vercel → Deployments → `⋯` del último → **Redeploy**. O empuja cualquier commit.
