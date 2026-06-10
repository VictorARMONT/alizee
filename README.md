# ALIZEE — El Regalo Perfecto

> Un regalo ritual, hecho a su medida. Análisis personalizado + objeto impreso en 3D.

**Campaña:** Día del Padre México (21 de junio 2026)  
**Cierre pedidos:** 15 de junio 2026  
**Status:** ✅ Listo para producción

---

## 🎯 Qué es ALIZEE

Funnel mobile-first que guía al comprador a través de un análisis de personalidad para crear un regalo personalizado:

1. **Quiz de 11 pasos** — personalidad + arquetipos
2. **Reveal** — dossier con análisis, tótem 3D, piedra mineral, vela copal
3. **Configurador** — elige tier (Esencial, Ritual, Ceremonia, Legado)
4. **Checkout** — vía WhatsApp (sin integración de pago en esta versión)

---

## 🚀 Quick Start

```bash
# 1. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con:
#  - NEXT_PUBLIC_GA_ID
#  - NEXT_PUBLIC_WHATSAPP_NUMBER
#  - BREVO_API_KEY
#  - BREVO_LIST_ID

# 2. Instalar + dev
npm install
npm run dev
# Abrir http://localhost:3000

# 3. Test completo (móvil 375px)
# Recorrer quiz 11 pasos → verify privacidad ✓, WebP ✓, checkout ✓
```

---

## 📊 Stack

- **Frontend:** Next.js 16 App Router + TypeScript
- **UI:** Tailwind CSS v4 + Framer Motion
- **State:** Zustand + sessionStorage persist
- **Images:** WebP (93% reducción vs PNG: 18.5 MB → 1.3 MB)
- **Security:** HTTPS + CSP + validación servidor + rate limiting
- **Compliance:** LFPDPPP (aviso + checkbox + ARCO + 90d)

---

## ✅ Cobertura

| Aspecto | Status | Detalle |
|---------|--------|---------|
| **Seguridad (P0)** | ✅ | Privacidad LFPDPPP, validación servidor, rate limit |
| **SEO (P1)** | ✅ | Schema JSON-LD, og:image, robots, sitemap |
| **A11y (P1)** | ✅ | Contraste AA, labels, zoom |
| **Rendimiento (P1)** | ✅ | WebP, LCP <2.5s, sessionStorage |
| **Imágenes** | ✅ | 24 WebP (avg 54KB), 93% reducción |
| **Analytics** | ⚠️ | GA4 stub (falta ID real en .env) |

---

## 📁 Estructura

```
src/
├── app/              # Rutas: /, /quiz, /diadelpadre, /aviso-privacidad, /gracias
├── components/       # Quiz, footer, reveal, checkout, schema, etc.
├── funnel/          # QuizFlow, scoring
├── data/            # Preguntas, arquetipos, zodiacos, precios
├── lib/             # Analytics, validators, rate-limit, etc.
└── store/           # Zustand state + persist

scripts/
└── convert-images.js  # PNG → WebP (ya ejecutado)

public/quiz/          # 24 imágenes WebP
```

---

## 🔐 Env Vars

```bash
# .env.local (NO commitear, ver .env.example)
NEXT_PUBLIC_GA_ID=G-...              # Google Analytics 4
NEXT_PUBLIC_WHATSAPP_NUMBER=52...    # WhatsApp destino
BREVO_API_KEY=...                    # Email marketing
BREVO_LIST_ID=123456                 # Lista contactos
```

---

## 📚 Docs

- **LANZAMIENTO.md** — Pre-prod checklist, test, deploy
- **NOTES_PENDIENTES.md** — Notas técnicas
- **CLAUDE.md** — Contexto inicial

---

## 🎬 Deploy (Vercel)

```bash
# 1. Conectar repo a Vercel
#    github.com/VictorARMONT/alizee

# 2. Agregar env vars en Vercel settings

# 3. Auto-deploy en push
git push origin master
```

---

## 📈 Métricas Finales

- **8 commits** (scaffold + privacidad + security + SEO + images)
- **2.1 MB** total (HTML/CSS/JS + WebP)
- **22/22 tasks** completadas
- **Lighthouse target:** 85+ Performance, 90+ A11y
- **Deadline:** 21 jun 2026 (Día del Padre)

---

**v1.0.0** — 9 de junio 2026 — ✅ Listo para producción
