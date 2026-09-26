# .claude/rules/safety.md

## Crisis Handling & Safety (Highest Priority)

### Crisis Detection (comportamiento real, verificado en código)
- **Bloque de crisis** (`resultType: 'CRISIS'`, oculta el score): se activa cuando
  `urgency === 'critical'` — `src/utils/scoringFunctions.ts:357`. Hoy el único disparador de
  `urgency: 'critical'` es un red flag crítico; en PHQ-9 eso es cualquier respuesta ≠ 0 en el
  ítem 9 (`public/data/tests/phq9/es.json`, pregunta `q9`, `redFlagValues: [1,2,3]`).
- **Bloque de apoyo** (`SupportBlock`, se añade debajo del resultado normal): se activa con
  `redFlags.length > 0` o `urgency !== 'none'` — `src/components/results/ResultCard.tsx:278-281`.
- **Una puntuación grave sin red flags no activa nada de esto.** GAD-7 no tiene ninguna pregunta
  `isRedFlag` hoy (`public/data/tests/gad7/es.json`), así que una "Ansiedad Grave" (≥15) solo
  cambia el color/categoría y muestra `message.recommendation` — sin bloque de apoyo ni de crisis.
- Cambiar qué dispara el bloque de apoyo o de crisis es una decisión clínica de Emmanuel; no se
  toca sin su instrucción explícita.

### Crisis UI Requirements
When crisis is triggered:
- **Números de ayuda, siempre escritos y visibles:**
  - Peligro inmediato: **112**
  - Crisis / conducta suicida: **024** — Línea de atención a la conducta suicida
  - Apoyo emocional: **717 003 717** — Teléfono de la Esperanza
  - Menores: **900 20 20 10** — ANAR
- **Post-test disclaimer always shown:** "Esto no es un diagnóstico clínico. Consulta a un profesional."
- **Never hide crisis info behind a button** — debe ser visible de inmediato.
- **Optional:** Link to mental health resources (España)

### Psychometric Tests (Validated Instruments)
- NEVER modify scoring cutoffs without Emmanuel's explicit instruction
- ALWAYS include clinical disclaimer
- ALWAYS include validation reference (e.g., "Based on Spitzer et al., 2006")
- Current tests: GAD-7, PHQ-9

### What NOT To Do
- NEVER skip crisis handling, even in dev/testing
- NEVER show crisis phone in tiny text
- Los números de ayuda se muestran siempre escritos y visibles; nunca "llama a tu número de
  emergencias local".
- Nada puede tapar ni retrasar la información de crisis: banners de cookies, modales, CTA ni
  superposiciones.
- NEVER publish without testing crisis flow locally

---

**Enforcement Level:** CRITICAL. Safety violations block deployment.
