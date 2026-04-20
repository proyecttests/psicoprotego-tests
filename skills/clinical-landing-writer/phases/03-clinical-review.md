# Fase 3 — Auto-revisión clínica

## Objetivo
Revisar el `es.content.json` preliminar contra el checklist de
seguridad clínica, marcar fragmentos dudosos, y generar el
markdown espejo `es.content.review.md`.

## Input disponible
- `es.content.json` preliminar (salida de fase 2)
- `skills/clinical-landing-writer/checklists/clinical-safety.md`
- `skills/clinical-landing-writer/checklists/eeat-signals.md`

## Instrucciones para el LLM

Eres un revisor clínico severo. Tu trabajo NO es elogiar el
borrador — es encontrar fragmentos problemáticos y marcarlos.

Para cada item del checklist `clinical-safety.md`:
- ✅ Si cumple, no hacer nada.
- ⚠️ Si hay duda, añadir `[REVISAR: <razón específica>]` inline
  en el fragmento del JSON (dentro del string afectado).
- 🛑 Si incumple claramente, reescribir el fragmento a una
  versión segura y añadir `[REVISADO: <razón>]` para trazabilidad.

Aplicar también `eeat-signals.md` como checklist secundario.

## Output

1. `es.content.json` final con:
   - Marcadores `[REVISAR: ...]` donde aplique.
   - Campo `auditedAt: <ISO-8601>` en metadata raíz.
   - Status sigue siendo `"draft-for-clinical-review"`.

2. `es.content.review.md`: markdown de prosa legible que muestra
   cada sección renderizada en un formato que Cristina o Emmanuel
   puedan leer cómodamente, con los `[REVISAR]` destacados
   visualmente al principio del documento como lista de acciones
   pendientes.

## Estructura del markdown espejo

```markdown
# Revisión clínica: <nombre del test>

**Status:** draft-for-clinical-review
**Borrador:** clinical-landing-writer-v1
**Auditado:** <timestamp>
**Autor firmante (pendiente):** <author name desde authors.json>
**Revisor firmante (pendiente):** <reviewedBy name>

---

## ⚠️ Acciones pendientes de revisión humana

1. **[Sección: <section>]** <razón REVISAR>
2. ...

(Si no hay flags, decir "Sin acciones pendientes; revisar globalmente.")

---

## Contenido en prosa

### Hero
<title>
*<subtitle>*
`<badges>`

### ¿Qué mide este test?
<body de whatItMeasures>

### ¿A quién está dirigido?
<body>

**Indicaciones:**
- <indication 1>
- ...

**Limitaciones:**
- <limitation 1>
- ...

### Cómo funciona
<body>

<steps>

### Validación científica
<body>

### Qué hacer con tu resultado
<body>

### Preguntas frecuentes
**<q1>**
<a1>

...

### Privacidad
<body>

---

## Firma clínica pendiente

Para aprobar, editar `es.content.json` con:
- status: "clinically-approved"
- clinicallyApprovedBy: "<id autor>"
- clinicallyApprovedAt: "<ISO-8601>"

Y resolver TODOS los `[REVISAR: ...]` antes de firmar.
```
