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

## 🚨 CRITICAL BLOCKERS (Session 2)

### 1. Spacing Bug (BLOCKING)
- **File:** `src/components/test-framework/TestContainer.tsx`
- **Issue:** h2 question + option cards overlap on desktop
- **Impact:** Broken UX, visual confusion
- **Fix:** Increase vertical gap/margin between h2 and QuestionRenderer
- **Status:** Identified, needs manual fix

### 2. Router Not Implemented
- **Pattern:** `/:lang/test/:testId` (es/en/pt/...)
- **Fallback:** `/tests` → `/es/test/gad7`
- **Languages:** es, en, pt (then fr, de, it, ar, he, etc.)

### 3. Crisis Handling Incomplete
- **Trigger:** score >= severe OR red flags non-empty
- **Show:** Phone 024 (Spain), localized per country
- **Required:** Post-test disclaimer always
- **Status:** Structure ready, UI pending

---

## ✅ Current Status

### Working
- [x] GAD-7 test (7 questions, scoring, results)
- [x] ADHD-optimized UI (cards, animations, progress bar)
- [x] Brand colors and typography
- [x] Header + breadcrumb
- [x] Navigation buttons (Previous/Next)

### Pending
- [ ] Fix spacing bug (BLOCKING)
- [ ] Multiidioma router
- [ ] PHQ-9 test (validate framework extensibility)
- [ ] Crisis UI (024, disclaimers)
- [ ] AdSlot component (reserve space for ads)
- [ ] Shareable results (OG tags, share buttons)

---

## 📋 Next 3 Steps (Priority Order)

1. **Fix spacing** → h2/cards overlap in TestContainer.tsx
2. **Implement router** → /:lang/test/:testId with validation
3. **Add PHQ-9** → 9 questions, validate scoring agnostic pattern

---

## 🔗 Rules & Architecture

See `.claude/rules/`:
- **ux-rules.md** → ADHD-optimized design (locked)
- **code-standards.md** → TypeScript, commits, patterns
- **safety.md** → Crisis handling, disclaimers
- **architecture.md** → Routing, data model, components

---

## 📂 Key Files

- `src/components/test-framework/TestContainer.tsx` ← SPACING ISSUE HERE
- `src/config/tests.json` ← Test definitions
- `src/utils/scoringFunctions.ts` ← Scoring logic (agnostic factory)
- `src/index.css` ← ADHD animations
- `.env.local` ← Secrets (never commit)

---

## ⚡ Quick Commands

```bash
npm run dev          # Vite dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview build locally
git commit -m "..."  # Conventional commits
```

---

**Last Updated:** 2026-03-17  
**Focus:** Fix spacing, then router, then PHQ-9
