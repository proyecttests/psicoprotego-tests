# TestPsycho Suite — Context Document for Opus 4.7

> **Purpose:** Complete context for an AI assistant starting from zero knowledge of this project.  
> **Generated:** 2026-04-15 from live codebase audit.  
> **Do not commit** — this is an operational reference, not project documentation.

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| **Name** | TestPsycho Suite |
| **Owner** | Emmanuel (clinical psychologist, Psicoprotego practice, Pozuelo de Alarcón, Madrid) |
| **Repo** | github.com/proyecttests/psicoprotego-tests |
| **Live (production)** | tests.psicoprotego.vercel.app |
| **Domain destination** | testpsycho.com (future) or psicoprotego.es/tests |
| **Local path** | /home/devops/projects/psicoprotego/psicoprotego-tests/ |

### Vision (not instructions — context only)

Suite of 60+ psychological tools (30 psychometric + 30 quizzes) in 14 languages, monetized with ads, growing organically through shareable results and SEO. Future: percentile comparisons, OG image generation, embed codes, header bidding. **Do not build for these unless explicitly asked.**

---

## 2. Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15.5.13 + React 18 + TypeScript + Tailwind CSS |
| **Rendering** | Server Components (SSG) for SEO landing pages + Client Components for test interactivity |
| **Hosting** | Vercel (auto-detected Next.js) |
| **CDN** | Cloudflare (edge caching, DNS) |
| **Proxy** | Apache on Hetzner (reverse proxy to Vercel) |
| **DNS** | Piensa Solutions |
| **Database** | Upstash Redis (serverless, for group sessions — KV_REST_API_URL + KV_REST_API_TOKEN) |
| **Analytics** | GTM + GA4 + Vercel Analytics |
| **CSS** | Tailwind CSS (CommonJS config: `module.exports` in tailwind.config.js and postcss.config.js) |
| **Module system** | ESM explicit in next.config.mjs; no `"type":"module"` in package.json |

---

## 3. Brand Configuration

**Source of truth:** `src/config/brand.ts` → `app/globals.css` → `tailwind.config.js`

| Token | Color | Usage |
|-------|-------|-------|
| `primary` | `#2d4a3e` | Verde Bosque — main buttons, headers |
| `accent` | `#c8a96e` | Dorado — highlights, accent elements |
| `light` | `#e8f4f0` | Verde muy claro — backgrounds |
| `text` | `#1a2e26` | Verde muy oscuro — body text |
| Background | `#f5f0eb` | Crema — page background |
| Accent (UX rules) | `#8b6914` | Dorado oscuro — interactive states |

**Typography:** Source Serif 4 (headings) + Montserrat (body)

**RTL Languages:** `RTL_LANGS` array in `src/config/brand.ts`. Current RTL: ar, he, ku (sorani). Add new RTL langs here — PDF components read this automatically.

---

## 4. Routing Architecture

```
/:lang/test/:testId          → Landing page SSG (Server Component)
/:lang/test/:testId/start    → Interstitial + disclaimer (Client Component)
/:lang/test/:testId/play     → Interactive test (Client Component)
/:lang/test/:testId/resultado → Results (inline in TestContainer)
/:lang/grupo/:testId         → Group session results page
/:lang/ayuda-urgente         → Emergency help page (localized)
/:lang/blog/[slug]           → Blog articles
/:lang/acerca-de             → About
/:lang/contacto              → Contact
/:lang/aviso-legal           → Legal notice
/:lang/cookies               → Cookie policy
/:lang/privacidad            → Privacy policy
/app/api/group/              → Group session API (Upstash Redis)
/app/api/shorten/            → URL shortener API
```

**Valid lang codes:** es, en, pt, fr, de, it, ar, he, ku, tr, el, hi, ja, ko  
**Fallback:** unknown lang → redirect to `/es/test/:testId`  
**SSG:** `generateStaticParams()` auto-discovers tests from `/public/data/tests/`

---

## 5. Tests Currently Implemented

### 5.1 GAD-7 — Generalized Anxiety Disorder Scale

| Field | Value |
|-------|-------|
| ID | `gad7` |
| Category | `psychometric` (validated clinical instrument) |
| Topic | `ansiedad` |
| Languages | ES, EN, PT |
| Items | 7 Likert-4 questions (0–3 scale) |
| Score range | 0–21 |
| Time | 2–3 min |
| Reference | Spitzer et al., 2006. Archives of Internal Medicine. doi:10.1001/archinte.166.10.1092 |

**Cutoffs:**
- Minimal: 0–4
- Mild: 5–9
- Moderate: 10–14
- Severe (CRISIS): 15–21

**Crisis trigger:** score ≥ 15

---

### 5.2 PHQ-9 — Patient Health Questionnaire Depression Scale

| Field | Value |
|-------|-------|
| ID | `phq9` |
| Category | `psychometric` (validated clinical instrument) |
| Topic | `depresion` |
| Languages | ES, EN, PT |
| Items | 9 Likert-4 questions (0–3 scale) |
| Score range | 0–27 |
| Time | 3–5 min |
| Reference | Kroenke et al., 2001. J General Internal Medicine. doi:10.1046/j.1525-1497.2001.016009606.x |

**Cutoffs:**
- Minimal: 0–4
- Mild: 5–9
- Moderate: 10–14
- Moderately severe: 15–19
- Severe (CRISIS): 20–27

**Crisis trigger:** score ≥ 20

---

### 5.3 Apego — Attachment Style Quiz

| Field | Value |
|-------|-------|
| ID | `apego` |
| Category | `quiz` (non-clinical, NOT validated) |
| Topic | `relaciones` |
| Languages | ES, EN, PT, KU (kurdo sorani — RTL) |
| Items | 10 multipleChoice-4 questions |
| Time | 3–4 min |
| Validated | No — identity-affirming results, entertainment purposes |

---

## 6. Data Model

### 6.1 File Structure per Test

```
public/data/tests/<testId>/
  metadata.json          ← Test config (langs, scoring, cutoffs, validation references)
  es.json                ← Questions + scoring messages in Spanish
  en.json                ← English
  pt.json                ← Portuguese
  ku.json                ← Kurdish Sorani (RTL)
```

### 6.2 Test Language File Schema (es.json / en.json / etc.)

```json
{
  "id": "testId",
  "lang": "es",
  "version": "1.0.0",
  "name": "Nombre del test",
  "hook": "Subtítulo motivador en 1 línea",
  "scoringFunction": "scoreGad7",
  "instructions": "Instrucciones para el usuario antes de empezar.",
  "disclaimerBefore": "...",
  "disclaimerAfter": "...",
  "questions": [
    {
      "id": "q1",
      "type": "likert | multipleChoice | boolean | text",
      "text": "Pregunta...",
      "options": [{ "value": 0, "label": "Nunca" }, ...]
    }
  ],
  "scoring": {
    "categories": [
      {
        "id": "mild",
        "label": "Ansiedad leve",
        "range": { "min": 5, "max": 9 },
        "description": "...",
        "advice": "...",
        "results": { "title": "...", "body": "..." }
      }
    ]
  },
  "landing": {
    "title": "SEO title (60 chars)",
    "description": "Meta description (160 chars)",
    "sections": [{ "heading": "¿Qué mide este test?", "body": "..." }]
  },
  "faq": [{ "q": "¿Es diagnóstico?", "a": "No, es orientativo." }]
}
```

### 6.3 Scoring Function Interface

```typescript
// src/utils/scoringFunctions.ts — factory pattern
type ScoringFunction = (answers: AnswersMap) => ScoringResult;

interface ScoringResult {
  score: number;
  category: "normal" | "mild" | "moderate" | "severe" | "crisis";
  message: string;
  redFlags: string[];
}
```

**To add a new test:** Create data files + add scoring function. **NEVER modify `TestContainer.tsx` or `QuestionRenderer.tsx`** — the factory pattern makes them test-agnostic.

---

## 7. Component Architecture

```
src/components/
├── test-framework/
│   ├── TestContainer.tsx       ← Orchestrates flow: answers → results
│   ├── ProgressBar.tsx         ← Sticky "X of Y • Z remaining"
│   ├── QuestionRenderer.tsx    ← Dispatches by question type
│   ├── MultipleChoiceQuestion.tsx
│   ├── LikertScale.tsx
│   ├── BooleanQuestion.tsx
│   └── TextQuestion.tsx
├── results/
│   ├── ResultCard.tsx          ← Score display + SupportBlock for red flags
│   ├── DownloadCard.tsx        ← Card-format share image
│   ├── DownloadPDF.tsx         ← PDF results + blank test download
│   ├── GroupSession.tsx        ← Group comparison (Upstash Redis)
│   ├── RelatedTests.tsx
│   ├── RemindMe.tsx
│   └── ScoreHistory.tsx
├── ads/
│   └── AdSlot.tsx              ← Ad placeholder (position-based)
├── common/
│   ├── Footer.tsx              ← RTL-aware, crisis link in footer
│   └── CookieBanner.tsx        ← RGPD/GDPR consent
├── landing/                    ← Landing page components
├── pdf/                        ← PDF generation components
└── blog/                       ← Blog article components

src/views/
├── TestLandingPage.tsx         ← Server-safe landing view
└── HelpResourcesPage.tsx       ← Ayuda urgente page
```

**App routes (Next.js App Router):**
```
app/
├── [lang]/
│   ├── layout.tsx              ← Lang-specific layout (RTL detection, hreflang)
│   ├── page.tsx                ← Homepage per language (test list)
│   ├── test/[testId]/
│   │   ├── page.tsx            ← SSG landing (Server Component)
│   │   ├── start/page.tsx      ← Interstitial (Client Component)
│   │   └── play/page.tsx       ← Interactive test (Client Component)
│   ├── grupo/[testId]/page.tsx ← Group session results
│   ├── ayuda-urgente/          ← Emergency help
│   ├── blog/[slug]/page.tsx    ← Blog articles
│   └── [static pages]/
├── api/
│   ├── group/                  ← Group session CRUD (Upstash Redis)
│   └── shorten/                ← URL shortener
└── globals.css                 ← Animations + ADHD-optimized transitions
```

---

## 8. Features Implemented (Complete List)

### 8.1 Core Test Flow
- One question per screen (ADHD-optimized)
- Auto-advance 200ms after answer (TikTok-style slide-out animation)
- Progress bar: sticky, "X of Y • Z remaining"
- Session token protection (sessionStorage) — blocks direct URL access to /play
- Crisis detection in ResultCard — hides score, shows emergency number + SupportBlock

### 8.2 SEO & Metadata
- Landing pages: full SSG with `generateMetadata()` + JSON-LD server-side
- JSON-LD schemas: FAQPage + BreadcrumbList + MedicalWebPage per test
- hreflang: all language variants via generateMetadata alternates
- Sitemap (app/sitemap.ts) + robots.ts
- Blog with static generation

### 8.3 Sharing & Social
- Story image sharing for Instagram and TikTok (card format)
- WhatsApp, Twitter/X share buttons
- Copy link button
- Short URL via /api/shorten/

### 8.4 Group Sessions (Upstash Redis)
- Live group sessions for quizzes — participants see each other's scores
- Session CRUD via /app/api/group/
- Group results page: /[lang]/grupo/[testId]
- Compare scores with group average
- Button in ResultCard: "Ver resultados del grupo"
- **Env vars required:** `KV_REST_API_URL` + `KV_REST_API_TOKEN` (Vercel KV naming)

### 8.5 PDF Download
- Results PDF (score + breakdown + clinical disclaimer)
- Blank test PDF (printable instrument)
- RTL support in PDF for Arabic/Hebrew/Kurdish
- Language selector on download
- Print-optimized layout

### 8.6 Monetization
- AdSlot component: positions `intro`, `pre-test`, `leaderboard`
- Empty divs with reserved dimensions (prevents CLS)
- **RULE:** Never show ads during test-taking (between questions)
- Cookie consent (RGPD/GDPR) with CookieBanner component
- Cookie preferences button in footer

### 8.7 Analytics
- GTM + GA4 via `VITE_GTM_ID` / `VITE_GA4_ID`
- Vercel Analytics
- Blog interaction tracking events

### 8.8 Help Resources
- `/[lang]/ayuda-urgente` — localized emergency help page
- Emergency numbers per language: ES 024, USA 988, DE 0800-1110111, FR 3114
- HELP_ROUTES map in ResultCard.tsx

### 8.9 Blog
- Static blog at /[lang]/blog/[slug]
- Content in /app/[lang]/blog/[slug]/ or content directory
- Categories and tags pages

### 8.10 Monitoring
- health-check.js + build-check.js scripts
- Telegram notifications for build failures/health issues

---

## 9. Critical Safety Rules (HIGHEST PRIORITY)

**From `.claude/rules/safety.md` — violations block deployment.**

### Crisis Detection
A result triggers crisis UI if ANY of these is true:
1. `score >= severe` threshold (test-specific, e.g., GAD-7 ≥ 15, PHQ-9 ≥ 20)
2. `redFlags.length > 0`
3. `category === 'crisis'`

### Crisis UI Requirements
- Prominently display emergency phone (localized per language/country)
- Never hide crisis info behind a button — immediately visible
- Score card hidden when crisis (score shown as null)
- SupportBlock: cream background, green border, calm tone
- Footer: verde bosque, "Hay apoyo disponible" (not alarming)

### Emergency Numbers by Country
| Country | Number |
|---------|--------|
| Spain | 024 |
| USA | 988 |
| Germany | 0800-1110111 |
| France | 3114 |

### What Never To Do
- NEVER skip crisis handling, even in dev/testing
- NEVER show crisis phone in tiny text
- NEVER allow ads to cover crisis information
- NEVER modify scoring cutoffs without explicit instruction
- NEVER publish without testing crisis flow locally

---

## 10. Architecture Rules (Non-Negotiable)

**From `.claude/rules/architecture.md`**

1. **Factory pattern for tests:** Add new test = JSON files + scoring function. Never modify `TestContainer.tsx` or `QuestionRenderer.tsx`.
2. **RTL support:** ar, he, ku need `dir="rtl"` — handled via `LangHtmlUpdater` in `app/[lang]/layout.tsx` and `RTL_LANGS` in `src/config/brand.ts`.
3. **Data files only:** NEVER hardcode strings. All test content in JSON files under `public/data/tests/`.
4. **Environment variables:** Never commit `.env.local`. Never commit secrets.

---

## 11. UX Rules (LOCKED — Do Not Modify)

**From `.claude/rules/ux-rules.md` — clinical decision, not aesthetic preference.**

1. One question per screen — never show multiple questions
2. 4 option cards maximum — radio button left, label right, no sliders
3. Progress bar always visible — sticky top
4. Auto-advance — 200ms after selection (visual feedback required)
5. Mobile first — always test mobile before desktop
6. NEVER show ads during test-taking (between questions)
7. NEVER skip progress indicator
8. NEVER use sliders instead of cards

**Animation timings (functional, not decorative):**
- Question fadeIn: 0.6s ease-out (delay 0.2s)
- Question translateY: -50px, 0.8s ease-out (delay 0.9s)
- Options stagger: 1.8s–2.25s
- Float after 2.8s no response: infinite gentle bounce
- Answer selected: slideOutUp 0.4s (TikTok-style exit)

---

## 12. Code Standards

**From `.claude/rules/code-standards.md`**

- TypeScript strict mode. No `any` except third-party wrappers.
- Functional components with hooks only. No class components.
- File naming: PascalCase components, camelCase utils, kebab-case data files.
- Import aliases: `@/` for src/ (no relative imports crossing directory boundaries)
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Never mix styled-components with Tailwind.

---

## 13. Skills (Automation Scripts for Claude)

### `/new-test` — Add a complete psychological test

**Skill file:** `skills/new-test/SKILL.md`

Steps:
1. Create `public/data/tests/<testId>/metadata.json`
2. Create `public/data/tests/<testId>/es.json` (base language)
3. Add scoring function in `src/utils/scoringFunctions.ts`
4. Register in `public/data/tests-index.json` (or run `scripts/generate-tests-index.js`)
5. Test crisis flow before marking complete

### `/add-language` — Add a new language to all tests

**Skill file:** `skills/add-language/SKILL.md`

```bash
node scripts/add-language.js <langCode> [--rtl]
```

Automates: metadata.json updates, stub JSON files, tests-index regeneration.

Manual steps after: translate stub files, add UI strings in all components (CRISIS_STRINGS, UI_STRINGS, share buttons, PDF, footer, cookie banner), add static pages (acerca-de, contacto, privacidad, etc.), add ayuda-urgente page, add to HELP_ROUTES.

**Key components with UI strings to update:**
- `src/components/test-framework/TestContainer.tsx` (CRISIS_STRINGS, UI_STRINGS)
- `src/components/test-framework/SharingScreen.tsx`
- `src/components/results/ResultCard.tsx`
- `src/components/results/DownloadPDF.tsx`, `DownloadCard.tsx`, `RemindMe.tsx`, `ScoreHistory.tsx`
- `src/views/TestLandingPage.tsx`
- `src/components/common/Footer.tsx`, `CookieBanner.tsx`

### `/branding` — Change visual identity

**Skill file:** `skills/branding/SKILL.md`

Source of truth: `src/config/brand.ts` → `app/globals.css` → `tailwind.config.js`

---

## 14. Scripts

```bash
npm run dev                           # Next.js dev server (localhost:3000)
npm run build                         # Production build (runs SSG)
node scripts/validate-test.js <testId>  # Validate test data files
node scripts/generate-tests-index.js  # Regenerate tests-index.json
node scripts/add-language.js <lang> [--rtl]  # Add new language
```

---

## 15. Environment Variables

| Variable | Purpose |
|----------|---------|
| `KV_REST_API_URL` | Upstash Redis REST URL (group sessions) |
| `KV_REST_API_TOKEN` | Upstash Redis REST token (group sessions) |
| `NEXT_PUBLIC_SITE_URL` | Site URL for OG/canonical tags |
| `VITE_GTM_ID` | Google Tag Manager ID |
| `VITE_GA4_ID` | Google Analytics 4 ID |

Never commit `.env.local`.

---

## 16. Deployment

- **Vercel:** Auto-deploys on push to main branch. No `"type":"module"` in package.json (causes conflicts). ESM only via `.mjs` extension.
- **Build output:** ~106 SSG pages (last clean build verified).
- **vercel.json:** Only defines `installCommand` and `buildCommand`. Do not add Vercel Production Overrides (caused 108ms builds without npm install in the past).
- **Cloudflare:** DNS + CDN in front of Vercel. Edge caching active.

---

## 17. Recent Development History (git log)

Most recent commits (newest first):

```
8dbf6de fix: use KV_REST_API_URL/TOKEN env var names (Vercel KV naming)
3ee7579 fix: use body-based Upstash REST API format (more reliable)
500b3dd chore: trigger redeploy (Upstash env vars)
02b198e feat: live group sessions for quizzes (Upstash Redis)
2e6e364 feat: story image sharing for Instagram and TikTok
5a7cbec fix: robots.ts + sitemap.xml, ayuda-urgente ku, testsIndex generado
063127c feat: skill branding, boton preferencias cookies en footer (RGPD)
c157460 feat: monitoring scripts health-check y build-check con notificacion Telegram
c98c982 feat: skills add-language/new-test, validate-test script, CSP headers
9f70845 feat: cookie consent RGPD, paginas estaticas ku, brand config centralizado
a412d17 feat: resultados grupales, URL corta, comparativa de scores, PDF limpio
4db0361 feat(1B+1E): stories rediseñadas + PDF modo impresión
e17df5a feat(i18n): UI completa en kurdo sorani en todos los componentes
fda8102 feat(content): traducción kurdo sorani (ku) del quiz apego
2c04555 feat(pdf): add RTL language support for Arabic/Hebrew/Farsi/Urdu/Kurdish
703fc39 feat: PDF download con resultados, test en blanco, selector idioma
```

**Last session:** 2026-03-19 (session 7) — CLAUDE.md updated

---

## 18. Open Priorities (From CLAUDE.md)

Ordered by priority in CLAUDE.md:

1. **Shareable results with dynamic OG images**  
   API route `/api/og?testId=&score=&lang=` using `@vercel/og`  
   Dynamic title/description/image per result for social sharing.

2. **More tests**  
   Quizzes: personality, wellbeing, attachment style variations, etc.  
   Psychometric: additional validated instruments.

3. **More languages**  
   FR / DE / IT / AR — JSON test files + UI string translations + static pages.  
   AR is RTL — add to `RTL_LANGS` in brand.ts.

4. **Production domain**  
   Configure Apache reverse proxy + Cloudflare + DNS for `psicoprotego.es/tests` or `testpsycho.com`.  
   Current production is on tests.psicoprotego.vercel.app.

---

## 19. Known Technical Debt / Decision Points

### 19.1 Scoring function naming convention
Currently: `scoreGad7`, `scorePhq9` (camelCase). Ensure new tests follow this pattern when registering in `scoringFunctions.ts`.

### 19.2 Group sessions (Upstash Redis) — stability
The last 3 commits were fixes to Upstash integration (env var naming, body format). Feature is live but recently stabilized. Monitor for Redis connection issues.

### 19.3 No OG dynamic images yet
Priority 1 in backlog. `@vercel/og` is the recommended approach. Route would be `/api/og` returning PNG. Needed for WhatsApp/Twitter previews to show actual result.

### 19.4 Blog is bare
App structure for blog exists (`/[lang]/blog/[slug]`). Content likely sparse. Could be leveraged for SEO if more articles added.

### 19.5 Ad network not connected
AdSlot component exists and reserves space. No ad network code injected yet. Monetization is aspirational — do not ask about this unless Emmanuel raises it.

### 19.6 Percentile comparison not built
Mentioned in vision (DB needed). No infrastructure for it. Skip unless asked.

### 19.7 testpsycho.com domain
Not yet configured. Current live URL is on Vercel subdomain. Apache reverse proxy and DNS migration to production domain is an open task (Priority 4).

---

## 20. Decisions Emmanuel Would Need to Make

These are open questions that require product/business direction, not engineering:

1. **Next test to add:** Which psychological test or quiz to implement next? (Priority: quizzes for virality vs. validated clinical instruments for credibility?)
2. **Language priority:** FR/DE/IT vs. AR? AR requires RTL work. DE/FR have validated instruments (lower disclaimer risk).
3. **OG image design:** What should a shareable result card look like? (Score + category + test name + Psicoprotego branding)
4. **Domain timing:** When to migrate from Vercel subdomain to testpsycho.com or psicoprotego.es/tests?
5. **Monetization activation:** When to actually inject AdSense code into AdSlot components?
6. **Group sessions UX:** Currently users can start a session and share a link. Is the UX clear enough or does it need onboarding?

---

## 21. Key File Paths Quick Reference

| File | Purpose |
|------|---------|
| `src/config/brand.ts` | Color tokens, RTL_LANGS, typography — source of truth |
| `src/utils/scoringFunctions.ts` | All test scoring logic (factory) |
| `public/data/tests/` | All test data (questions, metadata, translations) |
| `public/data/tests-index.json` | Auto-generated index of all tests |
| `src/generated/validLangs.ts` | Auto-generated valid lang codes |
| `app/[lang]/test/[testId]/page.tsx` | SSG landing page (Server Component) |
| `app/[lang]/test/[testId]/play/page.tsx` | Interactive test (Client Component) |
| `src/components/test-framework/TestContainer.tsx` | Core test orchestrator (do not modify for new tests) |
| `src/components/results/ResultCard.tsx` | Results + crisis UI + SupportBlock |
| `src/components/test-framework/QuestionRenderer.tsx` | Question type dispatcher (do not modify for new tests) |
| `app/api/group/` | Group session API (Upstash) |
| `.claude/rules/safety.md` | Crisis handling rules (critical) |
| `.claude/rules/architecture.md` | Data model + routing rules |
| `.claude/rules/ux-rules.md` | ADHD UI rules (locked) |
| `skills/new-test/SKILL.md` | Full process for adding a test |
| `skills/add-language/SKILL.md` | Full process for adding a language |
