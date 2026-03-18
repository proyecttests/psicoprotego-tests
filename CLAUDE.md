# CLAUDE.md — TestPsycho Suite

## Identity

**testpsycho:** Suite of psychological tests (psychometric + quizzes).  
**Owner:** Emmanuel, clinical psychologist, Psicoprotego practice (Madrid).  
**Repo:** github.com/proyecttests/psicoprotego-tests  
**Live:** tests.psicoprotego.vercel.app  
**Destination:** testpsycho.com (future) or psicoprotego.es/tests (current)

> Original Psicoprotego child project, evolving into independent product with multilingual reach & ad monetization.

---

## Stack (Current)

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Hosting:** Vercel (serverless)
- **CDN:** Cloudflare (edge caching, DNS)
- **Proxy:** Apache on Hetzner (reverse proxy to Vercel)
- **DNS:** Piensa Solutions
- **Repo:** github.com/proyecttests/psicoprotego-tests

> ⚠️ Possible future migration to Next.js (SSR for SEO, API routes). Current: Vite+React.

---

## Vision (Context, Not Instructions)

Suite of 60+ psychological tools (30 psychometric + 30 quizzes) in 14 languages,
monetized with ads, growing organically through shareable results and SEO.
Future: percentile comparisons, OG image generation, embed codes, header bidding.
Do not build for these unless explicitly asked.

---

## ⚠️ Pendiente (Sesión 3)

### 1. Footer de red flags — sigue rojo

- **Archivo:** `src/components/common/Footer.tsx` (o componente equivalente)
- **Issue:** Cuando hay red flags, el footer de la pantalla de resultados mantiene color rojo
- **Fix:** Neutralizar color — usar paleta Psicoprotego en lugar de rojo

### 2. Pantallas de resultados — revisión visual completa

- **Issue:** Revisar coherencia visual de ResultCard en todos los estados (normal, severe, crisis)
- **Status:** SupportBlock implementado pero pendiente revisión visual end-to-end

### 3. Spacing bug TestContainer — por confirmar

- **File:** `src/components/test-framework/TestContainer.tsx`
- **Issue:** h2 question + option cards podrían seguir solapando en desktop
- **Status:** Parcialmente corregido; pendiente verificación visual definitiva

---

## ✅ Estado Actual

### Funciona

- [x] GAD-7 — funcional en ES / EN / PT (landing + intersticial + test + resultados)
- [x] PHQ-9 — funcional en ES / EN / PT
- [x] Router multiidioma `/:lang/test/:testId` con subrutas `/start` y `/play`
- [x] Protección acceso directo (location.state)
- [x] Landing pages SEO con JSON-LD (FAQPage, BreadcrumbList, MedicalWebPage)
- [x] TestInterstitial — disclaimer + AdSlot + enlace a ayuda (sin teléfonos alarmantes)
- [x] HelpResourcesPage — `/es/ayuda-urgente`, `/en/urgent-help`, `/pt/ajuda-urgente`
- [x] ResultCard — tono calmado, SupportBlock con nota de privacidad
- [x] Mensajes de apoyo: tono menos diagnosticador ("hemos detectado" vs "tu resultado sugiere"), nota de privacidad incluida
- [x] AdSlot — posiciones: intro, pre-test, leaderboard
- [x] ADHD-optimized UI (cards, animaciones, progress bar)
- [x] Analytics GTM + GA4

### Pendiente

- [ ] Footer rojo en pantalla red flags — **neutralizar**
- [ ] Revisión visual completa ResultCard (todos los estados)
- [ ] **Crear landing + metadata para PHQ-9** ← próxima prioridad
- [ ] Shareable results (OG tags, share buttons)
- [ ] SEO: hreflang tags en `<head>`
- [ ] Versiones FR / DE / IT / AR de tests

---

## 📋 Próximas Prioridades

1. **Arreglar footer rojo** → pantalla de red flags / crisis
2. **PHQ-9 landing + metadata** → `public/data/tests/phq9/metadata.json` + landing en es/en/pt
3. **Revisión visual ResultCard** → coherencia end-to-end en todos los estados

---

## 🔗 Reglas y Arquitectura

Ver `.claude/rules/`:

- **ux-rules.md** → Diseño ADHD-optimizado (bloqueado)
- **code-standards.md** → TypeScript, commits, patrones
- **safety.md** → Crisis handling, disclaimers
- **architecture.md** → Routing, modelo de datos, componentes

---

## 📂 Archivos Clave

- `src/components/test-framework/TestContainer.tsx`
- `src/components/results/ResultCard.tsx` ← SupportBlock de red flags
- `src/pages/TestLandingPage.tsx` ← Landing SEO
- `src/pages/TestInterstitial.tsx` ← Disclaimer + ad pre-test
- `src/pages/HelpResourcesPage.tsx` ← Recursos de ayuda urgente
- `src/data/help-resources/{es,en,pt}.json` ← Contenido páginas de ayuda
- `public/data/tests/{testId}/{lang}.json` ← Contenido de cada test
- `public/data/tests/{testId}/metadata.json` ← Ficha técnica
- `src/utils/scoringFunctions.ts` ← Lógica de scoring (factory)
- `src/index.css` ← Animaciones ADHD
- `.env.local` ← Secrets (nunca commitear)

---

## ⚡ Comandos Rápidos

```bash
npm run dev          # Vite dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview build locally
git commit -m "..."  # Conventional commits
```

---

**Última actualización:** 2026-03-18
**Foco:** Footer rojo → PHQ-9 landing → revisión visual ResultCard
