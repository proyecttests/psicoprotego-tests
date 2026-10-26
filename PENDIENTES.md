# PENDIENTES

## Prioritario

- **Landing conectada a `es.content.json`** (2026-10-24): si el fichero está completo (sin
  `[PENDIENTE]`), la landing, la descripción meta y el FAQ de JSON-LD salen de él; si no, se usa el
  bloque `landing` de `es.json`. Mientras `status` no sea `clinically-approved` se muestra una franja
  «Borrador pendiente de revisión clínica». Hoy: GAD-7 con contenido nuevo y franja; PHQ-9 con la
  landing antigua hasta que se redacte.
- **PHQ-9:** `es.content.json` con 11 `[PENDIENTE]`. Pasar por `/clinical-landing-writer` y revisión
  clínica.

## Revisión clínica

- **GAD-7:** primera pasada de Emmanuel aplicada (commit `382023a`). Decisiones cerradas: sin cifra
  de prevalencia, la frase de Psicoprotego en el rango Moderado se queda, 024 en el rango Grave
  (landing y pantalla de resultados). Falta la revisión de Cristina y la firma (`status:
  "clinically-approved"`, `clinicallyApprovedBy`, `clinicallyApprovedAt`). Las secciones que
  Emmanuel no tocó (indicaciones, limitaciones 1–4, rangos Leve/Moderado/Grave, resto de FAQ,
  privacidad) siguen con el texto de la skill. La tabla de auditoría de `es.content.review.md` es
  la original y no se ha repasado sobre el texto nuevo. Decidido por Emmanuel (2026-10-27): rango
  15–21 «Grave» (también en la ficha técnica) y uso desde 18 años (la limitación sobre adolescentes
  se sustituye por «Está pensado para mayores de 18 años…»).
- Texto del instrumento (enunciado, ítems y opciones) de GAD-7 y PHQ-9: copiado literal de
  phqscreeners.com, «Spanish for Spain» (aportado por Emmanuel, 2026-10-24). Sustituye a la
  redacción en tuteo que había y a «Menos de la mitad de los días», que no es la oficial.
- Verificado en el texto completo de García-Campayo 2010 (PMC2831043): la muestra fue de Madrid,
  Zaragoza y Barcelona, y los autores piden estudiar la escala antes de usarla en entornos
  hispanohablantes culturalmente distintos de España.

## Producción

- `psicoprotego-tests.vercel.app` publica `main` (commit `9ef6fff`, 2026-10-23): versión anterior
  a la consolidación (en/pt/ku, test de apego, blog…) con el arreglo de teléfonos de crisis y el
  aviso de proyecto piloto en el pie.
- `main` ya está fusionada en `feat/clinical-landing-writer` (2026-10-27, conflictos resueltos con la
  versión de la rama). `main` puede avanzar a la rama sin conflictos (fast-forward). Lo hace
  Emmanuel.
- Proxy de `psicoprotego.es/tests` en el VPS Contabo: sin hacer.
- `CLAUDE.md` da como «Live» `tests.psicoprotego.vercel.app`, que no responde (error TLS,
  2026-10-23). La URL real es `psicoprotego-tests.vercel.app`. Corregir.

## Deuda

- Rama remota `migration/nextjs`: no tiene ningún commit que no esté en `main` (verificado
  2026-10-23). Se puede archivar.
- Idiomas en/pt/ku: el sitemap, las páginas estáticas y `ayuda-urgente` ya solo generan `es`
  (`SUPPORTED_LANGS`, 2026-10-27). Quedan textos en/pt/ku sin uso dentro de esas páginas, en
  `TestMetadataTable.tsx`, `Footer.tsx` y en `src/data/help-resources/{en,pt,ku}.json`. Limpiar
  cuando se toquen. La nota de `CLAUDE.md` sobre el sitemap está desfasada.
- `public/data/tests.json` conserva definiciones antiguas de GAD-7/PHQ-9 (con `labels` y textos
  viejos) que ningún código carga (los tests se leen de `public/data/tests/{testId}/es.json`).
  Archivar.
