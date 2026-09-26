<!-- Pendientes del proyecto. Se importa en CLAUDE.md. Al cerrar un pendiente, se borra en el mismo commit que lo cierra. -->

# PENDIENTES

## Prioritario

- **Arreglo `hotfix/gad7-024`** (717 003 717 en la recomendación de ansiedad grave del GAD-7;
  112 y 024 visibles y con enlace `tel:` en el bloque de apoyo y de crisis): Emmanuel lo prueba
  en la vista previa de Vercel de esa rama —
  - PHQ-9 con el ítem 9 en "varios días" (o más) → debe aparecer el bloque de crisis con 112 y
    024 escritos, que marquen al tocarlos en el móvil.
  - GAD-7 con puntuación máxima (todas las respuestas en "casi todos los días") → debe aparecer
    la recomendación con 717 003 717, sin bloque de crisis (GAD-7 no tiene pregunta red-flag).

  Después de la prueba: `git merge --ff-only hotfix/gad7-024` a `main` y `git push origin main`
  — esto publica en producción. Luego, comprobar producción.

## Producción

- `psicoprotego-tests.vercel.app` publica `main`, que es la versión anterior a la consolidación
  (en/pt/ku, test de apego, blog…). La rama nueva (`feat/clinical-landing-writer`) no puede pasar
  a producción mientras tenga contenido clínico `[PENDIENTE]` sin revisar por Emmanuel y Cristina
  (hoy: PHQ-9 — ver `public/data/tests/phq9/es.content.json`).
- Al fusionar `feat/clinical-landing-writer` con `main`, habrá conflicto previsible en
  `src/components/results/ResultCard.tsx` y `public/data/tests/gad7/es.json`: el mismo cambio de
  `hotfix/gad7-024` se aplicó por separado en las dos ramas (commits `3b32752` en una,
  `ec9492c` en la otra) — no verificado si git lo resuelve solo al ser el mismo diff exacto.
- Proxy de `psicoprotego.es/tests` en el VPS Contabo: sin hacer.

## Deuda

- Los teléfonos de crisis están en dos fuentes: los campos `phones`/`resources` de
  `public/data/tests/{gad7,phq9}/es.json` no los lee ningún componente (verificado por grep); la
  única fuente que se renderiza es `src/data/help-resources/es.json` más los números fijos ya
  añadidos directamente en `ResultCard.tsx`. Unificar en una sola fuente antes de que un test
  nuevo repita el mismo tipo de error de etiqueta que tenía GAD-7.
- Rama remota `migration/nextjs`: sin revisar (no comprobado si diverge de `main` o si ya está
  contenida en alguna otra rama).
- `app/sitemap.ts` sigue publicando páginas indexables en `en`/`pt`/`ku` (`LANGS` hardcodeado,
  línea 5) y `app/[lang]/ayuda-urgente/page.tsx` sigue generando esas rutas por auto-discovery de
  `src/data/help-resources/{en,pt,ku}.json` — contradice `SUPPORTED_LANGS = ['es']` de
  `src/config/brand.ts`. Decisión tomada en la sesión de documentación: no tocar código, solo
  dejarlo anotado (ver también la nota en `CLAUDE.md`). Sigue sin arreglarse.
- `src/data/help-resources/{en,pt,ku}.json`: se decidió no borrarlos (están vivos vía
  auto-discovery, ver punto anterior). Sigue pendiente decidir si se quiere seguir sirviendo
  contenido no-ES o desactivar esas rutas.
