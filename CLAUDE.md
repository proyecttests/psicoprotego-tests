# CLAUDE.md — TestPsycho Suite

## Identity

**Psicoprotego Tests:** Clinical psychometric tool suite — ES only, embedded in psicoprotego.es/tests.  
**Owner:** Emmanuel (M-18523) + Cristina (M-30745), Psicoprotego practice, Pozuelo de Alarcón.  
**Repo:** github.com/proyecttests/psicoprotego-tests  
**Live:** tests.psicoprotego.vercel.app  
**Destination:** psicoprotego.es/tests

> Post-consolidation direction: validated psychometric instruments in Spanish. No ads, no multilingual quizzes.  
> See archive/v1-pre-consolidation branch for previous multilingual/ads architecture.

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

## Direction (Context, Not Instructions)

ES-only clinical tool with validated psychometric instruments (GAD-7, PHQ-9, and more to come).
Priority: clinical quality + SEO E-E-A-T (authorship, DOI references, ICD-10) + clean UX.
No ads. No multilingual quizzes. No group sessions. No URL shortener.
Do not build any of those unless explicitly asked.

---


## ✅ Estado Actual

### Implementado y funcional

- [x] GAD-7 — ES only (landing + intersticial + test + resultados)
- [x] PHQ-9 — ES only
- [x] Router `/:lang/test/:testId` con `/start` y `/play`
- [x] Protección acceso directo (sessionStorage token)
- [x] Landing pages SSG con JSON-LD (FAQPage, BreadcrumbList, MedicalWebPage)
- [x] HelpResourcesPage — `/es/ayuda-urgente`
- [x] ResultCard — paleta brand, crisis UI (score null + SupportBlock)
- [x] ADHD-optimized UI (cards, animaciones, progress bar)
- [x] Analytics GTM + GA4
- [x] PDF descargable (resultados + test en blanco)

### Completado en Bloque A + B (2026-04-18)

- [x] Bloque A: Archived ads, group sessions, URL shortener, RemindMe, ScoreHistory, blog, apego, non-ES langs
- [x] Bloque A: Limpieza de referencias huérfanas, RTL_LANGS a fuente única (brand.ts)
- [x] Bloque B.1: authors.json (Emmanuel M-18523, Cristina M-30745)
- [x] Bloque B.2: metadata.json extendido — condition, slug, medicalCondition (ICD-10), validation (DOI), authorship
- [x] Bloque B.3: es.content.json creado para GAD-7 y PHQ-9 (placeholders [PENDIENTE])
- [x] Bloque B.4: Tipos TypeScript actualizados — topicCategory→condition, quiz→screening (tsc clean)
- [x] Bloque B.5: CLAUDE.md + CONTEXT_OPUS.md actualizados
- [x] Bloque B.6: docs/analytics-plan.md creado

---

## 📋 Próximas Prioridades

1. **Bloque C** → Rellenar `[PENDIENTE]` en `es.content.json` (GAD-7 + PHQ-9) — revisión clínica requerida
2. **Shareable results con OG dinámicos** → API route `/api/og?testId=&score=&lang=` con @vercel/og
3. **Más tests psicométricos** → instrumentos validados en ES (PHQ-A, AUDIT, PCL-5…)
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
