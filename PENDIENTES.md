# PENDIENTES

## Prioritario

- **Landing conectada a `es.content.json`** (2026-10-24): si el fichero está completo (sin
  `[PENDIENTE]`), la landing, la descripción meta y el FAQ de JSON-LD salen de él; si no, se usa el
  bloque `landing` de `es.json`. Mientras `status` no sea `clinically-approved` se muestra una franja
  «Borrador pendiente de revisión clínica». Hoy: GAD-7 con contenido nuevo y franja; PHQ-9 con la
  landing antigua hasta que se redacte.
- **Ficha técnica vs. contenido:** `metadata.json` del GAD-7 rotula el rango 15–21 como «Severo» y
  el contenido clínico como «Grave»; la ficha dice «Desde 18 años» y las limitaciones hablan de
  adolescentes «con cautela». Unificar al firmar.
- **PHQ-9:** `es.content.json` con 11 `[PENDIENTE]`. Pasar por `/clinical-landing-writer` y revisión
  clínica.

- **Bloque de crisis en móvil:** con resultado de crisis, la barra fija muestra 024 y 112 desde el
  primer momento, pero la lista completa de cuatro teléfonos (`SupportBlock`) queda debajo de
  «Compartir resultados», fuera de la primera pantalla en 375×667. ¿Subirla justo debajo del
  mensaje? Decisión de Emmanuel (orden de la UI de crisis).

## Revisión clínica

- **GAD-7:** primera pasada de Emmanuel aplicada (commit `382023a`). Decisiones cerradas: sin cifra
  de prevalencia, la frase de Psicoprotego en el rango Moderado se queda, 024 en el rango Grave
  (landing y pantalla de resultados). Falta la revisión de Cristina y la firma (`status:
  "clinically-approved"`, `clinicallyApprovedBy`, `clinicallyApprovedAt`). Las secciones que
  Emmanuel no tocó (indicaciones, limitaciones 1–4, rangos Leve/Moderado/Grave, resto de FAQ,
  privacidad) siguen con el texto de la skill. La tabla de auditoría de `es.content.review.md` es
  la original y no se ha repasado sobre el texto nuevo.
- Texto del instrumento (enunciado, ítems y opciones) de GAD-7 y PHQ-9: copiado literal de
  phqscreeners.com, «Spanish for Spain» (aportado por Emmanuel, 2026-10-24). Sustituye a la
  redacción en tuteo que había y a «Menos de la mitad de los días», que no es la oficial.
- Verificado en el texto completo de García-Campayo 2010 (PMC2831043): la muestra fue de Madrid,
  Zaragoza y Barcelona, y los autores piden estudiar la escala antes de usarla en entornos
  hispanohablantes culturalmente distintos de España.

## Producción

- `psicoprotego-tests.vercel.app` publica `main` (commit `9ef6fff`, 2026-10-23): versión anterior
  a la consolidación (en/pt/ku, test de apego, blog…) con el arreglo de teléfonos de crisis y el
  aviso de proyecto piloto en el pie. `feat/clinical-landing-writer` no puede pasar a producción
  mientras el contenido clínico no esté firmado y conectado a la landing (ver arriba).
- Al fusionar `feat/clinical-landing-writer` con `main` habrá conflictos previsibles en
  `src/components/results/ResultCard.tsx`, `src/components/common/Footer.tsx`,
  `src/components/test-framework/TestContainer.tsx`, `LikertScale.tsx`, `src/types/test.ts` y
  `public/data/tests/{gad7,phq9}/es.json` (texto oficial y `responseOptions`, solo en la rama nueva): los mismos
  arreglos se aplicaron por separado en las dos ramas, y en `gad7/es.json` la rama nueva ya tiene
  el 024 en la recomendación de «severe» mientras `main` tiene el 717 003 717. En caso de duda,
  manda la versión de la rama nueva.
- Proxy de `psicoprotego.es/tests` en el VPS Contabo: sin hacer.
- `CLAUDE.md` da como «Live» `tests.psicoprotego.vercel.app`, que no responde (error TLS,
  2026-10-23). La URL real es `psicoprotego-tests.vercel.app`. Corregir.

## Deuda

- Rama remota `migration/nextjs`: no tiene ningún commit que no esté en `main` (verificado
  2026-10-23). Se puede archivar.
- `app/sitemap.ts` sigue publicando páginas indexables en `en`/`pt`/`ku` (`LANGS` hardcodeado,
  línea 5) y `app/[lang]/ayuda-urgente/page.tsx` sigue generando esas rutas por auto-discovery de
  `src/data/help-resources/{en,pt,ku}.json` — contradice `SUPPORTED_LANGS = ['es']` de
  `src/config/brand.ts`. Decisión tomada en la sesión de documentación: no tocar código, solo
  dejarlo anotado (ver también la nota en `CLAUDE.md`). Sigue sin arreglarse.
- `public/data/tests.json` conserva definiciones antiguas de GAD-7/PHQ-9 (con `labels` y textos
  viejos) que ningún código carga (los tests se leen de `public/data/tests/{testId}/es.json`).
  Archivar.
- `src/data/help-resources/{en,pt,ku}.json`: se decidió no borrarlos (están vivos vía
  auto-discovery, ver punto anterior). Sigue pendiente decidir si se quiere seguir sirviendo
  contenido no-ES o desactivar esas rutas.
