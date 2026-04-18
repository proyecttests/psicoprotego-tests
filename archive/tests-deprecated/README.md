# Archive: Tests Deprecated

## Qué se archivó
- `apego/` — Test de estilos de apego adultos (ES/EN/PT/KU)

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
