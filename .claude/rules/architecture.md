# .claude/rules/architecture.md

## Architecture Rules

### Routing Pattern
```
/:lang/test/:testId

Examples:
/es/test/gad7
/en/test/gad7
/ar/test/gad7
/pt/test/gad7
```

**Validation:** Only accept es, en, pt, fr, de, it, ar, he, ku, tr, el, hi, ja, ko  
**Fallback:** Unknown lang → redirect to `/es/test/:testId`  
**Default:** `/tests` → `/es/test/gad7`

**RTL Languages:** ar, he, ku require `dir="rtl"` on root container  
**SEO:** Include hreflang tags in `<head>` for all language variants

### Data Model (JSON-Driven)
- **tests.json** — Test definitions (questions, metadata, scoring function reference)
- **messages.json** — Result messages per language + category
- **disclaimers/ folder** — Clinical disclaimers per country
- **crisis-phones.json** — Emergency numbers per language/country

Example test.json entry:
```json
{
  "gad7": {
    "id": "gad7",
    "name": "Generalized Anxiety Disorder - 7",
    "length": 7,
    "scoring": "gad7",
    "questions": [
      {
        "id": "q1",
        "type": "likert",
        "text": "Over the past two weeks, how often have you been bothered by...",
        "scale": 4,
        "labels": ["Not at all", "Several days", "More than half", "Nearly every day"]
      }
    ]
  }
}
```

### Component Structure
```
src/components/
├─ test-framework/
│  ├─ TestContainer.tsx  (Orchestrates flow: answering → results)
│  ├─ ProgressBar.tsx    (Sticky, "X of Y • Z remaining")
│  ├─ QuestionRenderer.tsx (Dispatches by type)
│  ├─ MultipleChoiceQuestion.tsx (Cards + radio)
│  └─ LikertScale.tsx, BooleanQuestion.tsx, TextQuestion.tsx
├─ results/ (TO BUILD)
│  ├─ ResultCard.tsx
│  ├─ ShareableResult.tsx (OG image + buttons)
│  └─ PercentileBar.tsx (needs DB)
├─ ads/ (TO BUILD)
│  └─ AdSlot.tsx (reserve space, inject code)
└─ pages/
   └─ TestPage.tsx
```

### Scoring is Agnostic (Factory Pattern)
- Add new test = add entry to tests.json + new function in scoringFunctions.ts
- NEVER modify QuestionRenderer or TestContainer for new tests
- ScoringFunction interface:
```tsx
type ScoringFunction = (answers: AnswersMap) => ScoringResult

interface ScoringResult {
  score: number
  category: 'normal' | 'mild' | 'moderate' | 'severe' | 'crisis'
  message: string
  redFlags: string[]
}
```

### Question Types Supported
- `likert` — Scale 0-X (e.g., GAD-7)
- `boolean` — Yes/No
- `text` — Free text input
- `multipleChoice` — Single select from options

### Environment Variables
```
VITE_ANTHROPIC_API_KEY  (if using Claude API in frontend)
VITE_GTM_ID             (Google Tag Manager)
VITE_GA4_ID             (Google Analytics 4)
```

Never commit `.env.local` to git.

---

**Status:** These rules define extensibility. Follow them or new tests/languages will break.
