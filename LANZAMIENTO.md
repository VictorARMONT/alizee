# 🚀 LANZAMIENTO ALIZEE — Día del Padre 2026

**Deadline:** 21 de junio 2026  
**Cierre pedidos:** 15 de junio 2026  
**Estado:** 22/22 tasks completadas ✅

---

## CHECKLIST PRE-LANZAMIENTO

### Antes de `npm run dev`

- [ ] Llenar `.env.local` (copiar `.env.example`):
  ```bash
  cp .env.example .env.local
  ```
  - `NEXT_PUBLIC_GA_ID`: obtener de Google Analytics 4 admin
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`: teléfono WhatsApp (ej: 523349571689)
  - `BREVO_API_KEY`: generar en app.brevo.com/account/api
  - `BREVO_LIST_ID`: ID de lista contactos Brevo

- [ ] Instalar dependencias:
  ```bash
  npm install
  ```

### Test Local

- [ ] Ejecutar dev server:
  ```bash
  npm run dev
  ```
  - Abrir http://localhost:3000 en móvil (375px) o DevTools
  - Recorrer quiz completo (11 pasos)
  - Verificar: checkbox privacidad, footer, imágenes WebP cargan
  - Confirmar: checkout → WhatsApp se abre
  - Probar: persistencia (recargar página, estado persiste)

- [ ] Lighthouse check:
  ```bash
  # En Chrome DevTools → Lighthouse (mobile)
  # Target: Performance ≥85, Accessibility ≥90
  ```

- [ ] Contraste AA visual:
  - Abrir contrastchecker.com
  - Verificar magenta (#E91E8C) sobre blanco
  - Debe ser ≥ 4.5:1 (WCAG AA)

### Antes de Deploy

- [ ] Crear repo GitHub (si no existe):
  ```bash
  git remote add origin https://github.com/tu-usuario/alizee.git
  git branch -M main
  git push -u origin main
  ```

- [ ] Verificar env vars en Vercel:
  - NEXT_PUBLIC_GA_ID
  - NEXT_PUBLIC_WHATSAPP_NUMBER
  - BREVO_API_KEY
  - BREVO_LIST_ID

- [ ] Deploy a Vercel:
  ```bash
  # Conectar repo GitHub a Vercel (auto-deploy en push)
  # O: npm run build && vercel --prod
  ```

- [ ] Verificar HTTPS + HSTS en producción
- [ ] Probar funnel completo en prod (mobil real)

### Post-Lanzamiento

- [ ] Monitoreo Google Analytics:
  - Dashboard: tráfico, conversión por paso
  - Alertas: >10% drop-off en algún paso

- [ ] Monitoreo email:
  - Brevo: entregas, bounces, unsubscribes

- [ ] Soporte WhatsApp:
  - Responder pedidos en tiempo real
  - Actualizar orden en internal tracking

---

## ARQUITECTURA FINAL

```
Funnel:       /quiz → checkbox privacidad → 11 pasos → /diadelpadre
Resultado:    Reveal (dossier) → Configurador → Checkout
Seguridad:    Validación servidor + rate limiting + HTTPS + CSP
Compliance:   ✅ LFPDPPP (aviso + checkbox + ARCO + 90d retención)
SEO:          ✅ Schema JSON-LD + og:image + robots.txt + sitemap
Rendimiento:  ✅ WebP (1.3 MB), sessionStorage, lazy-load

Dependencias clave:
- Next.js 16 (App Router)
- Zustand (state + persist)
- Framer Motion (animations)
- Tailwind v4 (CSS)
- Sharp (optimización imágenes)
```

---

## GIT LOG

```
6 commits finales:
- d Privacidad + footer + checkbox (LFPDPPP)
- e Security: validación + rate-limit
- f SEO: Schema JSON-LD + indexación
- g Imágenes: PNG→WebP (93% ↓)
- h .env.example + gitignore
- i Inicial: scaffold + analytics
```

## ACCESO CREDENCIALES

- **Google Analytics 4:** [tu-ga-id]
- **Brevo:** victor.ardesign@gmail.com
- **WhatsApp:** [tu-número]

---

## CONTACTO POST-LANZAMIENTO

- Bugs/issues: GitHub Issues
- Support WhatsApp: [tu-número]
- Analytics dashboard: Google Analytics

---

**Fecha compilación:** 9 de junio 2026  
**Versión:** 1.0.0  
**Estado:** Listo para producción ✅

