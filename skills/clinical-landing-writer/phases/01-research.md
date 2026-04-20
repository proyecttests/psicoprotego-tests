# Fase 1 — Research clínica

> **Estado:** pendiente de integración con motor `clinical-research`
> (ver `/home/devops/tools/clinical-research/`). Fase actualmente
> no ejecutable.

## Objetivo
Generar `.dossier.json` con contexto clínico actualizado y
referenciado para el test indicado. No se redacta contenido de
landing aún.

## Input disponible

- `public/data/tests/<testId>/metadata.json`
- `public/data/authors.json`
- Markdown generado por el motor `clinical-research`:
  `public/data/tests/<testId>/.research/*.md`
  (pendiente de construcción — ver G.3; hasta entonces, este prompt
  NO se ejecuta en pipeline real.)

**⚠️ NO EJECUTAR este prompt hasta que el motor clinical-research
esté construido y haya generado markdown para el test. Una vez exista,
este aviso se retira.**

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
    "standard": {
      "<id_rango>": {
        "id": "minimal|mild|moderate|moderately_severe|severe",
        "min": 0,
        "max": 4,
        "label": "Mínimo",
        "clinicalInterpretation": "<1-2 frases describiendo qué sugiere este rango>",
        "recommendedAction": "autocuidado|monitorización|consulta_profesional|urgencia"
      }
    },
    "interpretation": "<prosa: visión global de cómo leer los rangos>",
    "notes": "<consideraciones especiales: falsos positivos/negativos por rango>"
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

## Ejemplo de cutoffs para GAD-7 (referencia)

```json
{
  "standard": {
    "minimal": {
      "id": "minimal",
      "min": 0,
      "max": 4,
      "label": "Mínimo",
      "clinicalInterpretation": "Ausencia o niveles muy bajos de síntomas de ansiedad generalizada.",
      "recommendedAction": "autocuidado"
    },
    "mild": {
      "id": "mild",
      "min": 5,
      "max": 9,
      "label": "Leve",
      "clinicalInterpretation": "Síntomas leves que pueden estar presentes de forma intermitente.",
      "recommendedAction": "monitorización"
    },
    "moderate": {
      "id": "moderate",
      "min": 10,
      "max": 14,
      "label": "Moderado",
      "clinicalInterpretation": "Síntomas moderados que justifican evaluación profesional.",
      "recommendedAction": "consulta_profesional"
    },
    "severe": {
      "id": "severe",
      "min": 15,
      "max": 21,
      "label": "Grave",
      "clinicalInterpretation": "Síntomas intensos; recomendada evaluación profesional prioritaria.",
      "recommendedAction": "consulta_profesional"
    }
  },
  "interpretation": "Los rangos son orientativos y no diagnósticos. La misma puntuación puede reflejar realidades clínicas distintas según el contexto vital del paciente.",
  "notes": "Falsos positivos frecuentes en periodos de estrés agudo transitorio; falsos negativos posibles en personas con alta deseabilidad social."
}
```
