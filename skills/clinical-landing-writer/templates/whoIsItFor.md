# Template: Who Is It For

## Función
Delimita con honestidad para quién es útil el test y para quién NO.
Este template es el más importante para seguridad clínica — si está
mal, el skill falla en su razón de ser.

## Estructura obligatoria

> **Encuadre crítico:** este bloque define para QUIÉN es útil la
> herramienta. La regla es: los usuarios reales del test son personas
> que YA están en proceso clínico, o que YA han decidido consultar,
> o profesionales/estudiantes. NO son personas que "quieren saber
> si tienen ansiedad sin haber consultado". Si una indicación
> sugiere ese encuadre, está mal.

- heading: fijo "¿A quién está dirigido?"
- body (2-3 párrafos): población diana general.
- indications (array de bullets, 3-5 items): perfiles concretos
  para los que el instrumento es útil.
- limitations (array de bullets, 3-5 items): EXPLÍCITAS y honestas.

## Reglas de seguridad

- SIEMPRE incluir como limitación: "No es una herramienta
  diagnóstica. No sustituye una evaluación profesional."
- SIEMPRE incluir como limitación: mencionar contextos clínicos
  específicos donde el test no se aplica (ej. crisis agudas,
  descompensación psicótica, población pediátrica si aplica).
- Si el test tiene una validación limitada en español o en cierta
  población, mencionarlo.

## Shape JSON esperado

El LLM debe producir el siguiente objeto en `es.content.json.whoIsItFor`:

```json
{
  "heading": "¿A quién está dirigido?",
  "body": "<prosa de 2-3 párrafos>",
  "indications": ["<item 1>", "<item 2>", "..."],
  "limitations": ["<item 1>", "<item 2>", "..."]
}
```

Tipo TypeScript de referencia (no modificar desde el skill):
`src/types/test.ts` → `TestContent.whoIsItFor`

## Ejemplo de indications esperado (encuadre correcto)

```json
[
  "Personas en seguimiento por un profesional de salud mental que quieran apoyar la valoración o llevar un registro entre sesiones.",
  "Personas que han decidido pedir ayuda y quieren llevar un registro orientativo a una primera consulta.",
  "Personas con dudas sobre cómo se están sintiendo que quieren poner palabras a su experiencia antes de hablar con un profesional.",
  "Profesionales clínicos, estudiantes de Psicología/Medicina o investigadores que quieren consultar la herramienta y su validación."
]
```

## Ejemplo de indications INCORRECTO (autocribado)

```json
[
  "Personas que quieren saber si tienen ansiedad generalizada.",
  "Quien quiera comprobar su nivel de ansiedad.",
  "Personas que se preguntan si necesitan ayuda profesional."
]
```

(Estos tres ejemplos están MAL porque desplazan la decisión clínica
al usuario y posicionan el test como sustituto de consulta.)

## Ejemplo de limitations esperado (GAD-7)

```json
[
  "No es una herramienta diagnóstica. No sustituye una evaluación por un profesional de la salud mental.",
  "No es adecuado para episodios agudos de ansiedad en contexto de crisis (en cuyo caso la prioridad es la intervención, no el cribado).",
  "En personas con comorbilidad psiquiátrica compleja la interpretación requiere contexto clínico adicional.",
  "Los puntos de corte se basan en población adulta; en adolescentes la interpretación debe hacerse con cautela."
]
```
