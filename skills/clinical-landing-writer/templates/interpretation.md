# Template: Interpretation

## Función
Traduce rangos de puntuación a orientación práctica accionable,
SIN sustituir juicio clínico.

## Estructura obligatoria

- heading: fijo "Qué hacer con tu resultado"
- body (varios párrafos, uno por rango de cutoff):
  - Para cada cutoff de metadata.cutoffs, explicar qué sugiere ese
    rango y qué acción razonable corresponde (autocuidado,
    monitorización, consulta profesional, urgencia).

## Datos de entrada: cutoffs

El template lee los cutoffs desde dos fuentes, en orden de preferencia:

1. `.dossier.json > cutoffs.standard` (preferido — contiene
   `clinicalInterpretation` y `recommendedAction` ya redactados).
2. `metadata.json > cutoffs` (fallback — solo rangos sin interpretación
   clínica enriquecida).

Para cada rango, el LLM debe producir un párrafo en el `body` que:

- Mencione el rango por su **label** (no por sus números crudos).
- Explique la interpretación clínica orientativa.
- Sugiera la acción recomendada según `recommendedAction`.
- Aplique las reglas de CTA calibrado según rango (ver sección
  "CTA calibrado" más abajo).

Ejemplo de párrafo esperado (rango moderate de GAD-7):

> "Un resultado en el rango Moderado sugiere síntomas que, sin ser
> incapacitantes, pueden estar afectando tu día a día. Es recomendable
> una valoración profesional para entender mejor qué los sostiene.
> Si no tienes un psicólogo de referencia, en Psicoprotego estamos
> disponibles para acompañarte."

## Regla de crisis

- Para rangos marcados como "severe" o con red flags, SIEMPRE
  mencionar el recurso de ayuda urgente (024 en España).
- NO presentar la cifra del cutoff como sentencia ("si sacas 15,
  tienes ansiedad severa"). Presentar como señal orientativa que
  motiva acción ("Un resultado en este rango sugiere malestar
  significativo; es recomendable consultar con un profesional").

## CTA calibrado (regla fija)

- Rango minimal/mild: no incluir CTA a consulta comercial. Solo
  referencia general al autocuidado.
- Rango moderate/moderately severe: nota al cierre tipo
  "Si quieres interpretar este resultado con apoyo profesional,
  puedes consultarlo con tu psicólogo/a de referencia. Si no
  tienes uno, en Psicoprotego estamos disponibles." — SIN botón
  destacado, solo enlace en texto.
- Rango severe/crisis: NUNCA CTA comercial. Solo 024 + recursos
  de emergencia.
