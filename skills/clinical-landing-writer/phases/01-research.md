# Fase 1 — Research clínica

## Objetivo
Generar `.dossier.json` con contexto clínico actualizado y
referenciado para el test indicado. No se redacta contenido de
landing aún.

## Input disponible
- `public/data/tests/<testId>/metadata.json`
- `public/data/authors.json`
- Acceso a búsqueda web (PubMed, Google Scholar, guías clínicas)

## Instrucciones para el LLM

Eres un investigador clínico con acceso a literatura psicométrica
actualizada. Tu tarea es construir un dossier sintético para el
test identificado por su `metadata.json`.

Para cada bloque del dossier, cita fuentes. Si no encuentras fuente
para una afirmación, NO la incluyas — prefiere un dossier más
corto y riguroso que uno exhaustivo pero inventado.

## Estructura esperada del dossier

```json
{
  "testId": "<testId>",
  "researchDate": "<ISO-8601>",
  "instrument": {
    "origin": "...",
    "originalValidation": {
      "authors": "...",
      "year": 0,
      "doi": "...",
      "population": "...",
      "n": 0,
      "psychometrics": {
        "sensitivity": 0,
        "specificity": 0,
        "cronbachAlpha": 0
      }
    },
    "spanishValidation": {
      "available": true,
      "reference": "...",
      "population": "...",
      "notes": "..."
    }
  },
  "condition": {
    "icd10": "<desde metadata>",
    "prevalenceSpain": "... (con fuente)",
    "prevalenceGlobal": "... (con fuente)"
  },
  "clinicalUse": {
    "primaryContexts": ["atención primaria", "salud mental especializada"],
    "populations": ["adultos 18-65"],
    "notApplicableIn": ["crisis aguda", "descompensación psicótica"]
  },
  "cutoffs": {
    "standard": {},
    "interpretation": "..."
  },
  "commonPitfalls": [
    "Falsos positivos comunes en ...",
    "Falsos negativos en ..."
  ],
  "sources": [
    { "citation": "Autor et al., año, revista", "doi": "...", "url": "...", "doiVerified": true }
  ]
}
```

## Reglas
- Fechas recientes > antiguas. Priorizar estudios últimos 10 años
  para prevalencia y uso clínico. El estudio original del instrumento
  puede ser antiguo (correcto).
- Idioma de las fuentes: español preferido para datos de
  prevalencia española; inglés aceptado para validaciones
  originales y literatura internacional.
- Si una cita no tiene DOI verificable, marcarla como
  `"doiVerified": false` y explicar.
