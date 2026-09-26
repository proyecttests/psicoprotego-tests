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

## CTA calibrado (regla fija) — encuadre herramienta clínica

El CTA NUNCA debe sugerir que el resultado del test es lo que
dispara la decisión de consultar. La decisión la dispara el
sufrimiento, la duda o la sintomatología; el test ayuda a llevar
esa duda al profesional con un punto de partida orientativo.

### Por rango

**Mínimo / Leve:** sin CTA comercial. Lenguaje neutro de proceso:
- "Si tienes un profesional de referencia, puedes comentarle el
  resultado en tu próxima consulta o seguimiento."
- "Si en algún momento sientes que algo no encaja, puedes hablarlo
  con un profesional de salud mental, aunque la puntuación sea baja."

**Moderado:** CTA muy suave, en lenguaje de proceso clínico, no de
venta. Plantilla recomendada:

> "Un resultado en este rango es información útil para llevar a
> consulta. Si ya estás en seguimiento profesional, compártelo en
> tu próxima sesión. Si aún no tienes psicólogo/a de referencia y
> quieres comentar este resultado con alguien, en Psicoprotego
> podemos acompañarte a dar los primeros pasos."

**Grave:** sin CTA comercial alguno. Información de derivación
clínica neutra:

> "Una puntuación en este rango sugiere malestar significativo. Es
> recomendable hablar con un profesional sanitario (psicólogo/a,
> psiquiatra o médico/a de familia) para valorar tu situación con
> contexto. Si en este momento el malestar es muy intenso, en
> España puedes llamar al **024** (línea de atención a la conducta
> suicida y crisis de salud mental, gratuita, 24h)."

### Texto de cierre del bloque (común a todos los rangos)

Tras los párrafos por rango, el bloque debe cerrar con una idea de
que el test orienta pero no diagnostica:

> "Los rangos son orientativos. Una misma puntuación puede tener
> significados clínicos distintos según el contexto vital de cada
> persona. Solo un/una profesional de salud mental puede establecer
> un diagnóstico tras una evaluación completa."
