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

- **Frontend:** Next.js 15.5.13 + React 18 + TypeScript + Tailwind CSS
- **Rendering:** Server Components (SSG) para SEO + Client Components para interactividad
- **Hosting:** Vercel (detección automática Next.js; `vercel.json` solo define installCommand + buildCommand)
- **CDN:** Cloudflare (edge caching, DNS)
- **Proxy:** Apache on Hetzner (reverse proxy to Vercel)
- **DNS:** Piensa Solutions
- **Repo:** github.com/proyecttests/psicoprotego-tests

---

## Vision (Context, Not Instructions)

Suite of 60+ psychological tools (30 psychometric + 30 quizzes) in 14 languages,
monetized with ads, growing organically through shareable results and SEO.
Future: percentile comparisons, OG image generation, embed codes, header bidding.
Do not build for these unless explicitly asked.

---


## ✅ Estado Actual

### Funciona

- [x] GAD-7 — funcional en ES / EN / PT (landing + intersticial + test + resultados)
- [x] PHQ-9 — funcional en ES / EN / PT
- [x] Router multiidioma `/:lang/test/:testId` con subrutas `/start` y `/play`
- [x] Protección acceso directo (sessionStorage token)
- [x] Landing pages SEO con JSON-LD (FAQPage, BreadcrumbList, MedicalWebPage)
- [x] TestInterstitial — disclaimer + AdSlot + enlace a ayuda (sin teléfonos alarmantes)
- [x] HelpResourcesPage — `/es/ayuda-urgente`, `/en/urgent-help`, `/pt/ajuda-urgente`
- [x] ResultCard — paleta brand en todos los estados, sin rojos ni naranjas
- [x] SupportBlock — fondo crema, borde verde bosque, tono calmo
- [x] Estado CRISIS — score card oculto (score null), muestra mensaje + SupportBlock
- [x] Footer crisis — verde bosque, tono "Hay apoyo disponible" (no alarmante)
- [x] Disclaimer — paleta brand (primary-*), sin red-*
- [x] AdSlot — posiciones: intro, pre-test, leaderboard
- [x] ADHD-optimized UI (cards, animaciones, progress bar)
- [x] Analytics GTM + GA4

### Completado (migración + deploy)

- [x] Migración a Next.js (SSG, SSR, App Router)
- [x] Landing pages con SSG + generateMetadata + JSON-LD server-side
- [x] Homepage por idioma con listado de tests
- [x] hreflang implementado vía generateMetadata alternates
- [x] Deploy en Vercel funcionando (HTTP 200 en /es/test/gad7, /en/test/phq9)
- [x] Fix: `postcss.config.js` y `tailwind.config.js` usan CommonJS (`module.exports`)
- [x] Fix: `next.config.mjs` (ESM explícito sin `"type":"module"` en package.json)
- [x] Fix: Vercel Production Overrides limpiados vía API (causaban builds de 108ms sin npm install)

### Pendiente

- [ ] PHQ-9 landing con metadata completa (ya funciona; falta SEO específico)
- [ ] Shareable results con OG dinámicos (API route /api/og)
- [ ] Versiones FR / DE / IT / AR de tests

---

## 📋 Próximas Prioridades

1. **PHQ-9 landing + metadata** → SEO específico del PHQ-9 (ya funciona en el framework; añadir landing.description específica para SEO)
2. **Shareable results con OG dinámicos** → API route `/api/og?testId=&score=&lang=` con @vercel/og
3. **Añadir idiomas FR / DE / IT / AR** → JSON de tests + páginas de ayuda urgente

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
- `app/[lang]/test/[testId]/page.tsx` ← Landing page SSG (Server Component)
- `app/[lang]/test/[testId]/start/page.tsx` ← Intersticial (Client Component)
- `app/[lang]/test/[testId]/play/page.tsx` ← Test interactivo (Client Component)
- `app/[lang]/page.tsx` ← Homepage por idioma (SSG)
- `src/views/TestLandingPage.tsx` ← Vista de landing (Server-safe)
- `src/views/HelpResourcesPage.tsx` ← Recursos de ayuda urgente
- `src/data/help-resources/{es,en,pt}.json` ← Contenido páginas de ayuda
- `public/data/tests/{testId}/{lang}.json` ← Contenido de cada test
- `public/data/tests/{testId}/metadata.json` ← Ficha técnica
- `src/utils/scoringFunctions.ts` ← Lógica de scoring (factory)
- `src/index.css` ← Animaciones ADHD
- `.env.local` ← Secrets (nunca commitear)

---

## ⚡ Comandos Rápidos

```bash
npm run dev          # Next.js dev server (localhost:3000)
npm run build        # Production build
npm run preview      # Preview build locally
git commit -m "..."  # Conventional commits
```

---

**Última actualización:** 2026-03-19
**Foco:** PHQ-9 SEO específico → Shareable results con OG dinámicos → Nuevos idiomas
