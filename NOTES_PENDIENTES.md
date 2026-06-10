# Pendientes — ALIZEE Pre-Launch

## 🔴 URGENTE (antes del 21 jun)

### 1. Optimizar imágenes del quiz
**Estado:** Bloqueado (requiere herramienta externa)

12 imágenes PNG en `/public/quiz/` pesan ~1.3–1.8 MB cada una (~18 MB total).
- Convertir a WebP (~750px ancho)
- Esperar: ~60–100 KB cada una
- Usar `next/image` en `ImageOptionCard.tsx`

**Impacto:** Reducir tiempo de carga móvil de ~4s a ~0.8s (conversión móvil +30–40%).

```bash
# Comando para convertir (requiere cwebp o similar)
for f in public/quiz/*.png; do cwebp -q 75 "$f" -o "${f%.png}.webp"; done
```

Luego actualizar `ImageOptionCard` para servir .webp en vez de .png.

### 2. GA4: reemplazar ID placeholder
**Estado:** Listo (falta acción)

En `src/app/layout.tsx`, línea ~46–62:
```typescript
// Cambiar: "G-XXXXXXXXXX" → tu ID real de GA4
```

Obtén el ID de Google Analytics 4 y reemplaza en 2 lugares.

### 3. Countdown: verificar fecha tope
**Estado:** 15 jun 2026 23:59 CDMX

En `src/components/Countdown.tsx` línea 10:
```typescript
export const ORDER_DEADLINE_ISO = "2026-06-15T23:59:00-06:00";
```

**Confirma:** ¿Es 15 jun la fecha real de cierre de pedidos? Si no, cambiar.

### 4. WhatsApp: reemplazar número
**Estado:** Placeholder listo

En `src/app/diadelpadre/page.tsx` línea 189:
```typescript
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "523349571689";
```

En `.env.local`, define:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=52XXXXXXXXXX
```

### 5. Brevo: API key + List ID
**Estado:** Código listo

En `.env.local`:
```
BREVO_API_KEY=xxxxxxxxxxxx
BREVO_LIST_ID=123456
```

## 🟡 Recomendado (antes del lanzamiento)

### 6. Portada ALIZEE como og:image real
Portada ALIZEE.png (5.5 MB) está en raíz. 

Opción A: Comprimir a JPG ~1–2 MB, mover a `public/og-image.jpg`, actualizar `layout.tsx`.
Opción B: Usar logo existente (ya configurado como fallback).

### 7. Favicon: crear `.ico` real
Hoy usa `/logo-a.webp`. Crear `public/favicon.ico` para máxima compatibilidad.

### 8. Página /gracias: mejorar post-checkout
Cuando el usuario abre WhatsApp desde checkout, pierde la página. Considerá:
- Mostrar gracias en un modal ANTES de abrir WhatsApp
- O redirigir a /gracias tras 3s con botón "Continuar a WhatsApp"

## 🟢 Limpiezas (post-lanzamiento ok)

### Archivos obsoletos en raíz
- `Portada ALIZEE.png` → mover a `/docs` o comprimir
- `a-blanco-logo.*` → mover a `/docs`
- `alizee_*.png` → mover a `/docs`
- `copy-padre.md` → mover a `/docs`

Actualizar `.gitignore` si no versionas source files.

### Rutas huérfanas (ok por ahora)
- `/bolsas` — para fase 2 femenina
- `/joyeria` — cross-sell (OK)
- `/resultado` — legacy, puede removerse

---

## Checklist de lanzamiento

```
☐ GA4: ID real en layout.tsx (2 lugares)
☐ WHATSAPP_NUMBER en .env.local
☐ BREVO_API_KEY + BREVO_LIST_ID en .env.local
☐ Countdown: fecha 15 jun confirmada
☐ Optimizar imágenes quiz: PNG → WebP
☐ Actualizar ImageOptionCard para webp
☐ Test: funnel completo en móvil (375px)
☐ Test: analytics eventos en GA4 dashboard
☐ Test: checkout → WhatsApp abre
☐ Test: email subscription en Brevo funciona
☐ Commit + push antes del 15 jun
```

---

**Última actualización:** 2026-06-09  
**Deadline:** 2026-06-21 (Día del Padre México)
