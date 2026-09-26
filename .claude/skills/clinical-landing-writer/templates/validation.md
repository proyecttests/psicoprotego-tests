# Template: Validation

## Función
Justifica CIENTÍFICAMENTE por qué este test es creíble. E-E-A-T puro.

## Estructura obligatoria

- heading: fijo "Validación científica"
- body (2-4 párrafos):
  1. Estudio original con autor(es), año, revista, DOI (sacado de
     metadata.validation.references[0]).
  2. Propiedades psicométricas resumidas (sensibilidad, especificidad,
     consistencia interna si disponible en dossier).
  3. Validación española si disponible (metadata.validation.spanishValidation).
  4. (Opcional) uso en guías clínicas reconocidas.

## Sistema de referencias numeradas (Wikipedia-style)

Las referencias en el `body` usan numeración inline `[1]`, `[2]`, etc. — NO enlaces
Markdown en el propio texto del body. Las referencias se listan en el campo
`references[]` al final del bloque `validation`.

### Reglas

- Numeración secuencial por orden de aparición en el body.
- Cada número en el body corresponde a una entrada en `references[]`.
- Si una afirmación no tiene fuente, NO se incluye. El skill prefiere omitir que inventar.
- Evitar frases de relleno tipo "numerosos estudios avalan" sin cita concreta.

### Estructura JSON de cada referencia

```json
{
  "id": 1,
  "authors": "Spitzer RL, Kroenke K, Williams JBW, Löwe B",
  "year": 2006,
  "title": "A Brief Measure for Assessing Generalized Anxiety Disorder",
  "journal": "Archives of Internal Medicine",
  "doi": "10.1001/archinte.166.10.1092",
  "url": "https://doi.org/10.1001/archinte.166.10.1092"
}
```

### Ejemplo de uso en body

> "El GAD-7 fue desarrollado por Spitzer et al. (2006) en población de atención
> primaria, con una sensibilidad del 89% y especificidad del 82% para el
> trastorno de ansiedad generalizada [1]. En España, García-Campayo et al.
> (2010) validaron el instrumento en consultas de atención primaria,
> confirmando sus propiedades psicométricas en población española [2]."

### Campos JSON resultantes

```json
{
  "heading": "Validación científica",
  "body": "... [1] ... [2] ...",
  "references": [
    {
      "id": 1,
      "authors": "Spitzer RL, Kroenke K, Williams JBW, Löwe B",
      "year": 2006,
      "title": "A Brief Measure for Assessing Generalized Anxiety Disorder",
      "journal": "Archives of Internal Medicine",
      "doi": "10.1001/archinte.166.10.1092",
      "url": "https://doi.org/10.1001/archinte.166.10.1092"
    },
    {
      "id": 2,
      "authors": "García-Campayo J et al.",
      "year": 2010,
      "title": "Cultural adaptation into Spanish of the generalized anxiety disorder 7 (GAD-7) scale as a screening tool",
      "journal": "Health and Quality of Life Outcomes",
      "doi": "10.1186/1477-7525-8-8",
      "url": "https://doi.org/10.1186/1477-7525-8-8"
    }
  ]
}
```
