# Checklist de seguridad clínica (Fase 3)

Aplicar este checklist al `es.content.json` preliminar. Para cada
item:
- ✅ Cumple → no acción.
- ⚠️ Dudoso → marcar fragmento con `[REVISAR: <razón breve>]`.
- 🛑 Incumple → reescribir el fragmento antes de producir output.

## A. Lenguaje diagnóstico

- [ ] No se afirma que el usuario "tiene" una condición.
- [ ] No se usa "diagnóstico" como algo que el test produce.
- [ ] Los rangos de cutoff se describen como orientativos, nunca
  como categorías diagnósticas rígidas.

## B. Alarmismo y emocionalidad

- [ ] El hero no usa apelación emocional intensa ("¿te sientes
  agobiado?", "descubre la verdad").
- [ ] Las secciones de interpretación no usan "grave" en contexto
  que pueda asustar sin acompañamiento.
- [ ] El lenguaje es calmado incluso en rangos severos.

## C. Crisis handling

- [ ] El rango severe/crisis menciona el recurso de ayuda urgente
  (024 en España).
- [ ] NO hay CTA comercial en contenido dirigido a rango severe.
- [ ] El disclaimer de "no sustituye evaluación profesional"
  aparece como limitación explícita en `whoIsItFor`.

## D. Referencias científicas

- [ ] Cada afirmación científica (prevalencia, validación, uso)
  tiene fuente localizable.
- [ ] Las citas usan formato "Autor et al., año".
- [ ] El DOI del estudio original aparece en el bloque
  `validation` (no en el hero ni en FAQ).
- [ ] No hay frases-muletilla vacías tipo "numerosos estudios
  demuestran" sin cita concreta.

## E. Limitaciones honestas

- [ ] `whoIsItFor.limitations` tiene mínimo 3 items.
- [ ] Una de las limitaciones es explícitamente "no es
  diagnóstico".
- [ ] Si la validación en español es limitada o ausente, se menciona.
- [ ] Si la población original del estudio no coincide con la
  población diana española (edad, cultura), se señala.

## F. Privacidad

- [ ] El bloque `privacy` mantiene la redacción base (no se añaden
  excepciones ni condiciones de uso de datos).
- [ ] No hay otros bloques que contradigan el mensaje de
  privacidad (ej. no decir "guardamos tu progreso" en algún
  ejemplo).

## G. CTA calibrado

- [ ] El `interpretation.body` para rango minimal/mild NO contiene
  CTA comercial.
- [ ] El CTA para rango moderate es texto enlazado, no botón.
- [ ] El rango severe NO tiene CTA comercial alguno.

## H. Firma clínica visible (metadata)

- [ ] `authorship.author` y `authorship.reviewedBy` existen y
  referencian IDs válidos de `authors.json`.
- [ ] El autor firma contenido de un test clínicamente dentro de
  sus especialidades declaradas (ej. EMDR/Trauma → Cristina para
  tests de trauma; Adultos generalista → Emmanuel).
- [ ] Si hay mismatch especialidad/autor, flag
  `[REVISAR: asignación autor puede no encajar con especialidad]`.

## I. Marcas `[REVISAR]`

- [ ] El skill marca con `[REVISAR: <razón>]` CUALQUIER fragmento
  donde haya duda, aunque el resto del texto sea correcto.
- [ ] Un flag [REVISAR] NO es un error del skill — es una petición
  explícita de atención humana clínica.
