# .claude/rules/safety.md

## Crisis Handling & Safety (Highest Priority)

### Crisis Detection
A test result triggers crisis UI if ANY of these is true:
1. `score >= severe` (test-specific, e.g., GAD-7 score >= 15)
2. `redFlags.length > 0` (behavioral red flags detected)
3. `category === 'crisis'` (explicit scoring result)

### Crisis UI Requirements
When crisis is triggered:
- **Prominently display emergency phone** (localized per language/country)
  - Spain: 024
  - USA: 988
  - Germany: 0800-1110111
  - France: 3114
  - And so on...
- **Post-test disclaimer always shown:** "This is not a clinical diagnosis. Consult a professional."
- **Never hide crisis info behind a button** — it must be immediately visible
- **Optional:** Link to mental health resources per country

### Psychometric Tests (Validated Instruments)
- NEVER modify scoring cutoffs without explicit instruction
- ALWAYS include clinical disclaimer
- ALWAYS include validation reference (e.g., "Based on Spitzer et al., 2006")
- Example tests: GAD-7, PHQ-9, PCL-5, AUDIT

### Psychology Quizzes (Non-Clinical)
- Scoring is custom, results are identity-affirming ("You are 78% emotionally available")
- Still include disclaimer: "For entertainment purposes, not diagnostic"
- Still include crisis detection (red flags array can be empty, but logic must exist)

### Clinical Disclaimers (Per Country)
Adapt per region, not just translate:
- Spain: Mention Colegio de Psicólogos de Madrid
- France: Reference Code de la Santé Publique
- USA: Note this is not a medical diagnosis
- Keep locale-specific advisory boards in mind

### What NOT To Do
- NEVER skip crisis handling, even in dev/testing
- NEVER show crisis phone in tiny text
- NEVER assume user knows their language's emergency number
- NEVER publish without testing crisis flow locally
- NEVER allow ads to cover crisis information

---

**Enforcement Level:** CRITICAL. Safety violations block deployment.
