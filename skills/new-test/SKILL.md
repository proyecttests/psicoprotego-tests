# Skill: Nuevo test psicométrico (new-test)

Proceso completo para añadir un test psicológico/psicométrico a Psicoprotego.

## Estructura de archivos

```
public/data/tests/<testId>/
  metadata.json          ← Configuración del test
  es.json                ← Contenido en español (idioma base)
  en.json                ← (opcional) Traducción inglés
  pt.json                ← (opcional) Traducción portugués
  ku.json                ← (opcional) Traducción kurdo sorani
```

## Pasos

### 1. Crear metadata.json

```json
{
  "id": "<testId>",
  "availableLangs": ["es"],
  "category": "quiz | psychometric | screening",
  "topicCategory": "relaciones | ansiedad | depresion | autoestima | trauma",
  "tags": ["tag1", "tag2"],
  "validated": false,
  "selfAdministrable": true,
  "timeToComplete": "5-7 min",
  "itemCount": 10,
  "itemType": "likert_5 | multipleChoice_4 | binary | mixed",
  "copyright": "free_use | CC-BY | clinical_validated"
}
```

### 2. Crear es.json (idioma base)

```json
{
  "id": "<testId>",
  "lang": "es",
  "version": "1.0.0",
  "name": "Nombre del test",
  "hook": "Subtítulo motivador en 1 línea",
  "scoringFunction": "score<TestId>",
  "instructions": "Instrucciones para el usuario antes de empezar.",
  "disclaimerBefore": "Este test es orientativo y no constituye un diagnóstico.",
  "disclaimerAfter": "Si los resultados te generan malestar, consulta un profesional.",
  "questions": [
    {
      "id": "q1",
      "type": "multipleChoice",
      "text": "Texto de la pregunta...",
      "options": [
        { "value": "A", "label": "Opción A" },
        { "value": "B", "label": "Opción B" },
        { "value": "C", "label": "Opción C" },
        { "value": "D", "label": "Opción D" }
      ]
    }
  ],
  "scoring": {
    "categories": [
      {
        "id": "green",
        "label": "Resultado positivo",
        "range": { "min": 0, "max": 25 },
        "color": "#27ae60",
        "description": "Descripción del resultado.",
        "advice": "Consejo para el usuario.",
        "results": {
          "title": "Título en la pantalla de resultados",
          "body": "Texto de resultado..."
        }
      }
    ]
  },
  "landing": {
    "title": "Título para SEO / landing page",
    "description": "Meta description del test (160 chars max)",
    "sections": [
      { "heading": "¿Qué mide este test?", "body": "Explicación..." }
    ]
  },
  "faq": [
    { "q": "¿Es diagnóstico?", "a": "No, es orientativo." }
  ]
}
```

### 3. Implementar función de scoring

En `src/utils/scoringFunctions.ts`, añadir:

```typescript
// ── Score<TestId> ─────────────────────────────────────────────────────────────

function score<TestId>(
  answers: Record<string, Answer>,
  questions: Question[],
  testData: TestData
): ScoringResult {
  // Option A: Suma directa de valores numéricos
  let total = 0
  for (const q of questions) {
    const ans = answers[q.id]
    if (ans?.value !== undefined) total += Number(ans.value)
  }

  // Option B: Conteo de respuestas por categoría (ej: apego)
  // const counts: Record<string, number> = {}
  // for (const q of questions) {
  //   const v = String(answers[q.id]?.value ?? '')
  //   counts[v] = (counts[v] ?? 0) + 1
  // }
  // const dominant = Object.entries(counts).sort((a,b) => b[1]-a[1])[0][0]

  const cats = testData.scoring?.categories ?? []
  const cat  = cats.find(c => total >= c.range.min && total <= c.range.max)
               ?? cats[cats.length - 1]

  return {
    score:    total,
    category: cat ? { id: cat.id, label: cat.label, color: cat.color } : null,
    result:   cat?.results ?? null,
    redFlags: [],
  }
}
```

Registrar en `SCORING_REGISTRY`:
```typescript
score<TestId>: score<TestId>,
```

### 4. Validar con el script

```bash
node scripts/validate-test.js <testId>
```

El script verifica:
- Todos los idiomas en metadata.json tienen su archivo JSON
- Todas las preguntas tienen las claves obligatorias
- La función de scoring está registrada en scoringFunctions.ts
- Las categorías tienen rangos continuos y no solapados
- El JSON es parseable sin errores

### 5. Regenerar índice

```bash
node scripts/generate-tests-index.js
```

### 6. Traducir a otros idiomas

```bash
node scripts/add-language.js <langCode>
# Luego traducir los stubs generados
```

### 7. Build y commit

```bash
npm run build
git add public/data/tests/<testId>/ src/utils/scoringFunctions.ts
git commit -m "feat(test): añadir test <testId> — <NombreTest>"
```

## Tipos de scoring soportados

| scoringFunction | Descripción |
|---|---|
| `scoreApego` | Mayoría de respuestas por categoría (A/S/E/D) |
| `scoreGAD7` | Suma directa likert 0-3 (7 preguntas) |
| `scorePHQ9` | Suma directa + red flag q9 (suicidio) |
| `scorePCL5` | Suma directa + red flags múltiples |
| Nuevo | Implementar siguiendo el patrón de arriba |

## Convenciones de color por categoría

| Nivel | Color | Uso |
|---|---|---|
| green | `#27ae60` | Sin síntomas / positivo |
| yellow | `#f39c12` | Leve / bajo |
| orange | `#e67e22` | Moderado / atención |
| red | `#e74c3c` | Severo / buscar ayuda |
