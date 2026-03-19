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

### También resuelto en sesión 7 (2026-03-19)

- [x] Badge duración "3-5 min min" corregido (durationLabel no añade " min" si el JSON ya lo incluye)
- [x] Cutoff `moderately_severe` traducido en ficha técnica (ES / EN / PT)
- [x] Instrucciones exactas del instrumento validado mostradas encima de la primera pregunta
- [x] ResultCard — paleta brand completa: eliminados todos los `gray-*` y `green-*` de Tailwind built-in
- [x] COLOR_MAP.green (minimal) → `primary-*`; COLOR_MAP.red (severe) → `primary-*` más oscuro

---

## 📋 Próximas Prioridades

1. **Shareable results con OG dinámicos** → API route `/api/og?testId=&score=&lang=` con @vercel/og
2. **Más tests** → quizzes virales (personalidad, bienestar, estilo de apego…)
3. **Más idiomas** → JSON de tests + páginas de ayuda en FR / DE / IT / AR
4. **Dominio definitivo** → configurar reverse proxy Apache, Cloudflare y DNS para psicoprotego.es/tests

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

**Última actualización:** 2026-03-19 (sesión 7)
**Foco:** Shareable results con OG dinámicos → Más tests → Más idiomas → Dominio definitivo
