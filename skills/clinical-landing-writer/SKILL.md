# Skill: `/clinical-landing-writer`

## Propósito

Genera borradores de contenido clínico para landings de tests
psicológicos en `psicoprotego.es/tests`, a partir de metadata
estructurada (condición médica, validación científica, autoría
clínica) y del patrón editorial establecido en las páginas
`psicoprotego.es/servicios/*`.

**Outputs por test:**
- `public/data/tests/<testId>/es.content.json` (source of truth)
- `public/data/tests/<testId>/es.content.review.md` (canal humano)
- `public/data/tests/<testId>/.dossier.json` (intermedio, uso interno)

**Status siempre:** `draft-pending-clinical-review`. El cambio a
`clinically-approved` es manual tras revisión por Cristina y/o
Emmanuel.

## Cuándo usar

- Tras añadir un test nuevo con `/new-test`, cuando metadata y
  scoring están completos pero la landing no tiene contenido
  redactado.
- Para regenerar borradores si cambia significativamente el
  data model o el patrón editorial.

## Cuándo NO usar

- Para producir contenido final sin revisión clínica humana.
- Para tests de la categoría `screening` no validados (requieren
  flujo editorial distinto por disclaimers específicos —
  pendiente skill futuro).
- Para traducir contenido a otros idiomas (el skill es ES-only
  por diseño; multi-idioma está archivado en v1).

## Uso

```bash
# Pipeline completo (3 fases)
./skills/clinical-landing-writer/scripts/run.sh <testId>

# Fases individuales (para debugging)
./skills/clinical-landing-writer/scripts/run.sh <testId> --phase=research
./skills/clinical-landing-writer/scripts/run.sh <testId> --phase=draft
./skills/clinical-landing-writer/scripts/run.sh <testId> --phase=review
```

Ejemplo: `./skills/clinical-landing-writer/scripts/run.sh gad7`

## Arquitectura: pipeline de 3 fases

### Fase 1 — Research clínica (`phases/01-research.md`)

Input: `metadata.json` del test + `authors.json`.
Proceso: búsqueda y síntesis de evidencia clínica actualizada
sobre el instrumento. Construye dossier con:
- Historia del instrumento (origen, validación original)
- Validación española disponible (prevalencia, población)
- Usos recomendados y limitaciones en la literatura
- Población diana y contextos de aplicación
- Cutoffs estándar y su interpretación clínica
- Advertencias clínicas habituales (falsos positivos/negativos)
- Fuentes consultadas con referencias

Output: `.dossier.json` (no commiteado a git normalmente;
añadir a `.gitignore` dentro de `public/data/tests/*/`).

### Fase 2 — Redacción (`phases/02-draft.md`)

Input: `metadata.json` + `authors.json` + `.dossier.json` + templates.
Proceso: redacta cada sección del `es.content.json` siguiendo
templates + patrón editorial `/servicios/*` + tono establecido en
`checklists/tone-voice.md`.

Output: `es.content.json` preliminar (todavía sin revisión).

### Fase 3 — Auto-revisión clínica (`phases/03-clinical-review.md`)

Input: `es.content.json` preliminar + `checklists/clinical-safety.md`.
Proceso: audita el borrador contra checklist de seguridad clínica,
marca fragmentos dudosos con `[REVISAR: razón]` inline, genera el
markdown espejo `es.content.review.md` para lectura humana cómoda.

Output:
- `es.content.json` final con flags `[REVISAR: ...]` donde proceda
  + campo metadata `drafted: "clinical-landing-writer-v1"` +
  `status: "draft-pending-clinical-review"` + `auditedAt: <timestamp>`.
- `es.content.review.md` (markdown prosa legible por humanos).

## Firma clínica (manual, fuera del skill)

Tras revisión por Cristina y/o Emmanuel:

1. Abrir `es.content.json`.
2. Resolver todos los `[REVISAR: ...]` (eliminar marcadores tras
   edición clínica).
3. Editar metadata del JSON:
   - `status: "clinically-approved"`
   - `clinicallyApprovedBy: "emmanuel" | "cristina"`
   - `clinicallyApprovedAt: "<ISO-8601>"`
   - `lastEditedBy: "emmanuel" | "cristina"`
4. Commit con mensaje `content(<testId>): clinical approval by <autor>`.
5. Actualizar también `es.content.review.md` para reflejar los
   cambios manuales (regenerable con `--phase=review-only` si se
   implementa).

## Integración en el repo

- Skill vive en `skills/clinical-landing-writer/`.
- No toca código fuente del app (solo data files).
- Las referencias de metadata.json y authors.json son read-only:
  el skill no muta nunca esos ficheros.
