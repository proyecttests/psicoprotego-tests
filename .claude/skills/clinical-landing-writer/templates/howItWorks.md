# Template: How It Works

## Función
Explica el procedimiento: cuántas preguntas, qué tipo de respuesta,
cuánto tarda, cómo se puntúa, rango total, qué pasa después.

## Estructura obligatoria

- heading: fijo "Cómo funciona"
- body (1-2 párrafos): descripción en prosa.
- steps (array de strings cortos, 4-5 pasos): lista numerable del
  flujo del usuario.

## Regla de datos

- Cifras (número de ítems, rango de puntuación, escala Likert,
  cutoffs) deben venir SIEMPRE de metadata.json, nunca inventadas.
- Si hay discrepancia entre lo que el LLM asume y lo que dice
  metadata, gana metadata.

### Encuadre clínico

El bloque `body` debe incluir UNA frase que sitúe el uso del test en
flujo clínico. Ejemplos válidos:

- "Esta herramienta se usa típicamente en el marco de un proceso
  de evaluación o seguimiento. Si ya estás en consulta, tu
  profesional puede decirte si te conviene completarlo; si todavía
  no has consultado, el resultado puede servirte para llevar un
  registro orientativo a una primera cita."

- "Es una herramienta de apoyo clínico, no un diagnóstico
  automatizado. La interpretación más útil siempre se hace junto
  con un profesional que conozca tu contexto."

Si el body actual no incluye esta idea, el LLM debe añadirla.

## Ejemplo de steps esperado (GAD-7)

```json
[
  "Respondes a 7 preguntas sobre cómo te has sentido las últimas 2 semanas.",
  "Cada pregunta tiene 4 opciones (de 'Nunca' a 'Casi cada día').",
  "Marcas la que mejor describe tu experiencia. Puedes volver atrás si cambias de opinión.",
  "El sistema calcula automáticamente tu puntuación total (rango 0-21).",
  "Ves el resultado interpretado según rangos clínicos establecidos, con orientación clara y privada."
]
```
