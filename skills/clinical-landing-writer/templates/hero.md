# Template: Hero

## Función
Presentación de primer pantallazo. Debe responder en 3 segundos
qué es el test, a quién sirve, y qué promete (orientativo, no
diagnóstico).

## Estructura obligatoria

- **title** (string, ~60 chars): formato "[NombreTest]: [función clínica clara]"
  - Ejemplo: "Test GAD-7: evaluación orientativa de ansiedad generalizada"
  - NO usar: "Descubre si tienes ansiedad", "¿Estás ansioso?"
- **subtitle** (string, ~140 chars): una frase humana que conecta
  con el síntoma percibido por el usuario. Tono heredado de
  /servicios/* ("vives en alerta constante", "el pecho apretado...").
  Sin diagnóstico, sin hype.
- **badges** (array de 4-5 strings cortos, sin puntos): señales de
  credibilidad + expectativa realista.
  - "Instrumento validado" (si metadata.validation.isValidated)
  - "7 preguntas" (desde metadata.itemCount)
  - "2-3 min" (desde metadata.timeToComplete)
  - "Sin registro"
  - "Datos en tu navegador"

## Ejemplo esperado

```json
{
  "hero": {
    "title": "Test GAD-7: evaluación orientativa de ansiedad generalizada",
    "subtitle": "Si vives con una tensión que no se va, preocupaciones que no puedes frenar o el pecho apretado sin motivo claro, este cuestionario puede ayudarte a ponerle palabras.",
    "badges": ["Instrumento validado", "7 preguntas", "2-3 min", "Sin registro", "Datos en tu navegador"]
  }
}
```
