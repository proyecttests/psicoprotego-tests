# Archive: Languages Deprecated

## Qué se archivó
- `gad7/en.json` — GAD-7 en inglés
- `gad7/pt.json` — GAD-7 en portugués
- `phq9/en.json` — PHQ-9 en inglés
- `phq9/pt.json` — PHQ-9 en portugués

## Por qué se archivó
Fecha: 2026-04-18. La consolidación hacia psicoprotego.es/tests lanza
únicamente en español para maximizar autoridad clínica local y SEO en España.
Los archivos de idioma están validados y completos — pueden restaurarse cuando
se decida expandir a otros mercados.

## Cómo restaurarlo
1. Mover cada `<testId>/<lang>.json` de vuelta a `public/data/tests/<testId>/<lang>.json`
2. Actualizar `availableLangs` en cada `metadata.json` para incluir el idioma
3. Ejecutar `node scripts/generate-tests-index.js`
4. Restaurar strings de idioma en `TestContainer.tsx`, `ResultCard.tsx`, `brand.ts`
