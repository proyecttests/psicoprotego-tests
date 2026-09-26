# .claude/rules/architecture.md

## Architecture Rules

### Routing Pattern

```
/:lang/test/:testId

Examples:
/es/test/gad7
```

**Validation:** Only accept `es` (`SUPPORTED_LANGS` en `src/config/brand.ts`)
**Fallback:** Unknown lang → redirect to `/es/test/:testId`
**Default:** `/tests` → `/es/test/gad7`

### Data Model (JSON-Driven)

- **tests.json** — Test definitions (questions, metadata, scoring function reference)
- **messages.json** — Result messages per category
- **disclaimers/ folder** — Clinical disclaimers (Spain)
- **crisis-phones.json** — Emergency number (Spain: 024)

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
        "labels": [
          "Not at all",
          "Several days",
          "More than half",
          "Nearly every day"
        ]
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
└─ pages/
   └─ TestPage.tsx
```

### Scoring is Agnostic (Factory Pattern)

- Add new test = add entry to tests.json + new function in scoringFunctions.ts
- NEVER modify QuestionRenderer or TestContainer for new tests
- ScoringFunction interface:

```tsx
type ScoringFunction = (answers: AnswersMap) => ScoringResult;

interface ScoringResult {
  score: number;
  category: "normal" | "mild" | "moderate" | "severe" | "crisis";
  message: string;
  redFlags: string[];
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

### Shareable Results

- Unique result URL: /:lang/test/:testId/result?s=XX&t=category
- Dynamic OG tags per result (title, description, image)
- Share buttons: WhatsApp (primary), Twitter/X, copy link
- "Send to someone" button: viral loop mechanism

**Status:** These rules define extensibility. Follow them or new tests will break.
