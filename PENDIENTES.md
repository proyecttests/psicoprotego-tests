# PENDIENTES

## Prioritario

- **La landing no muestra el contenido clínico.** Ningún código lee `es.content.json` (verificado
  por grep en `src/` y `app/` el 2026-10-23): la página de cada test se monta con el bloque
  `landing` de `public/data/tests/{testId}/es.json` vía `src/views/TestLandingPage.tsx`. Hay que
  conectar la landing a `es.content.json` (hero, qué mide, a quién va dirigido, cómo funciona,
  validación con referencias, interpretación, FAQ, privacidad). Tarea de código aparte; sin esto,
  la revisión clínica no llega a la web.
- **PHQ-9, pregunta de dificultad funcional.** La versión oficial (phqscreeners.com, «Spanish for
  Spain») acaba con «Si ha marcado alguno de los problemas de este cuestionario, ¿hasta qué punto
  estos problemas le han creado dificultades…?» (Ninguna / Algunas / Muchas / Muchísimas
  dificultades). La app no la incluye. No puntúa: si se añade, tiene que quedar fuera de la suma
  (hoy el scoring suma todas las respuestas). Decisión clínica de Emmanuel.
- **PHQ-9:** `es.content.json` con 11 `[PENDIENTE]`. Pasar por `/clinical-landing-writer` y revisión
  clínica.

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

- Los teléfonos de crisis están en dos fuentes: los campos `phones`/`resources` de
  `public/data/tests/{gad7,phq9}/es.json` no los lee ningún componente (verificado por grep); la
  única fuente que se renderiza es `src/data/help-resources/es.json` más los números fijos de
  `ResultCard.tsx` y de `CrisisBar` en `TestContainer.tsx`. Unificar en una sola fuente antes de
  que un test nuevo repita el mismo tipo de error de etiqueta que tenía GAD-7.
- `Footer.tsx` conserva una rama `showCrisisFooter` que nadie activa (el layout siempre pasa
  `false`) y que rotula el 024 como «Esperanza». Código muerto: eliminarlo.
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
