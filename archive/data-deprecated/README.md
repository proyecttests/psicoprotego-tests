# Archive: datos sin uso de public/data

## Qué se archivó
- `crisis-phones.json` — teléfonos de crisis por idioma (es/en/pt). Ningún código lo cargaba: la UI
  de crisis usa `src/config/crisisPhones.ts`. Además llamaba «Teléfono de la Esperanza» al 024.
- `disclaimers/` (es, en, pt) — avisos clínicos antiguos. Ningún código los cargaba: los avisos
  salen de `disclaimerBefore`/`disclaimerAfter` en `public/data/tests/{testId}/{lang}.json`.

## Por qué se archivó
Fecha: 2026-11-03. Datos de la época anterior a la consolidación (solo español). Al estar en
`public/` se servían en la web aunque nadie los usara, y el de teléfonos tenía un rótulo incorrecto.

## Cómo restaurarlo
No hay que restaurarlo. Los teléfonos y los avisos tienen ya su fuente en los ficheros citados arriba.
