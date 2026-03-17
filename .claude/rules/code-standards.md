# .claude/rules/code-standards.md

## Code Standards & Patterns

### TypeScript
- Strict mode enabled. No `any` except third-party wrappers.
- Functional components with hooks only. No class components.
- File naming: PascalCase components, camelCase utils, kebab-case data files.

### Component Patterns
```tsx
// Import order: React > libraries > local types > local components
import React from 'react'
import { useParams } from 'react-router-dom'
import type { Question, AnswersMap } from '@/types/test'
import QuestionRenderer from './QuestionRenderer'

interface Props {
  question: Question
  answers: AnswersMap
}

const MyComponent: React.FC<Props> = ({ question, answers }) => {
  return <div>{/* ... */}</div>
}

export default MyComponent
```

### Scoring Pattern (Factory)
Never modify QuestionRenderer for new tests. Instead, add scoring function:

```tsx
// src/utils/scoringFunctions.ts
export const phq9Scoring: ScoringFunction = (answers) => {
  const score = Object.values(answers).reduce((sum, v) => sum + Number(v), 0)
  return {
    score,
    category: score < 5 ? 'minimal' : 'mild',
    message: messages[lang][category],
    redFlags: detectRedFlags(answers)
  }
}
```

### Commits (Conventional)
```bash
feat:     new feature
fix:      bug fix
refactor: code restructure (no behavior change)
docs:     documentation only
chore:    dependencies, config, build

# Examples:
git commit -m "feat: add PHQ-9 test with 9 questions"
git commit -m "fix: spacing overlap in TestContainer"
git commit -m "docs: update README with deployment steps"
```

### Files to Update on Every Session
- `WORKLOG.md` — Daily log
- `CLAUDE.md` — Blockers, status, next steps
- Component files — Self-explanatory JSDoc

### What NOT To Do
- NEVER hardcode strings (use JSON data files)
- NEVER commit secrets (use .env.local)
- NEVER import from parent directories (use @/ aliases)
- NEVER mix styled-components with Tailwind
- NEVER skip TypeScript types

---

**Enforcement:** These are not suggestions. Strictly follow.
