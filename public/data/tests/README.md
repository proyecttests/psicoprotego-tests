# public/data/tests — Convenciones

## Campos de metadata.json

### `category`
Tipo clínico del test. Valores permitidos: `"psychometric"` | `"screening"`.
El valor `"quiz"` está **deprecado** — ningún test activo lo usa.

### `validation` vs `validationDetails`
Estos dos campos coexisten con propósitos diferentes:

- **`validation`** — Referencias bibliográficas para SEO y JSON-LD schema.
  Contiene DOI, autores, año, journal, páginas. Se usa en metatags y
  schema.org para autoridad clínica en buscadores (E-E-A-T).

- **`validationDetails`** — Data clínica interna de validación.
  Contiene tamaño de muestra, sensibilidad/especificidad, referencias
  por traducción. Se usa en la ficha técnica del test (UI).

### `condition`
Silo SEO de la condición clínica (antes llamado `topicCategory`).
Destino: routing `/tests/:condition/:slug`. Ej: `"ansiedad"`, `"depresion"`.

### `authorship`
Referencias a `public/data/authors.json`. `author` = quien redactó
el contenido clínico; `reviewedBy` = quien revisó y co-firma.
