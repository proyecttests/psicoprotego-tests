# Archive: Tests Deprecated

## Qué se archivó
- `apego/` — Test de estilos de apego adultos (ES/EN/PT/KU)
- `tests.json` — definiciones antiguas de GAD-7/PHQ-9 (con `labels` y textos viejos), estaba en
  `public/data/`. Ningún código lo cargaba: los tests se leen de `public/data/tests/{testId}/`.
  Archivado el 2026-11-02; no hay que restaurarlo.
- `messages.json` — mensajes de resultado antiguos de GAD-7/PHQ-9 en es/en/pt, con los títulos
  diagnósticos («Ansiedad Moderada», «Depresión Grave»…). Estaba en `public/data/`. Ningún código
  lo cargaba: los mensajes salen de `results` en `public/data/tests/{testId}/{lang}.json`.
  Archivado el 2026-11-03; no hay que restaurarlo.

## Por qué se archivó
Fecha: 2026-04-18. El test de apego es un quiz no-validado clínicamente.
En la consolidación hacia psicoprotego.es/tests se priorizan instrumentos
validados (GAD-7, PHQ-9). El test de apego puede retomarse en una futura
categoría "screening" con framing clínico adecuado.

## Cómo restaurarlo
1. Mover `apego/` de vuelta a `public/data/tests/apego/`
2. Ejecutar `node scripts/generate-tests-index.js`
3. Revisar si se necesita actualizar la scoring function en `src/utils/scoringFunctions.ts`
4. Añadir metadata y contenido en los idiomas deseados
