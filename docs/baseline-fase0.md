# Baseline técnica — cierre Fase 0

**Fecha:** 2026-04-19  
**Rama:** feat/consolidation-psicoprotego  
**Commit HEAD:** 20f4aa3ba668364579fe8de6e1817142c33c72dc  
**Commits Fase 0:** 18

```
20f4aa3 feat(data): complete authors.json with real clinical credentials
2f880f0 feat(assets): add clinical team photos for author bylines
1e54516 fix(types): commit TestMetadata updates that were orphan in working tree
3f26d76 docs: baseline metrics at end of Phase 0
88c0d45 docs: update CLAUDE.md + CONTEXT_OPUS.md for consolidation; add analytics plan
0db46c5 refactor(types): rename topicCategory→condition, quiz→screening across all consumers
a949968 feat(data): add es.content.json placeholders for clinical landings
2906069 feat(data): extend GAD-7 and PHQ-9 metadata with clinical taxonomy
eb22564 feat(data): add centralized authors.json with clinical credentials
e650c64 refactor(pdf): import RTL_LANGS from brand.ts (single source of truth)
2f1586f chore: clean 8 orphan references to deprecated features
951439c fix(home): remove apego redirect, show only available tests
079b68f chore: remove orphan dependencies post-deprecation
1f848a3 refactor: archive blog, apego test, and non-ES languages
ab5eff7 refactor: deprecate group sessions, URL shortener, Upstash
2a50c35 refactor: deprecate RemindMe and ScoreHistory (privacy-first)
93a2787 refactor: deprecate ads (removed AdSlot and all positions)
1cc6251 feat(skills): add /deprecate-feature for ordered code removal
```

---

## 1. Build production

| Métrica | Valor |
|---|---|
| Páginas SSG | 41 |
| Bundle total (shared JS) | 102 kB |
| First Load JS (/es) | 106 kB |
| First Load JS (/es/test/gad7) | 108 kB |
| First Load JS (/es/test/gad7/start) | 108 kB (ƒ dynamic) |
| First Load JS (/es/test/phq9) | 108 kB |
| First Load JS (/es/test/phq9/start) | 108 kB (ƒ dynamic) |
| node_modules | 546 MB |
| .next | 121 MB |
| public/images/team | 96 KB (emmanuel.jpg 28KB + cristina.webp 63KB + 5KB overhead) |

Warnings build: ninguno  
tsc --noEmit: ✅ limpio

**Notas:**
- `/es/test/[testId]/start` y `/play` son rutas dinámicas (ƒ) — Client Components con sessionStorage guard.
- Páginas estáticas en en/pt/ku (`acerca-de`, `aviso-legal`, etc.) se mantienen aunque el contenido de tests es ES-only.

---

## 2. Lighthouse

Ejecutado localmente en Contabo con Google Chrome 131 (headless) + Lighthouse CLI 13.1.0.  
Script reutilizable: `/home/devops/tools/lighthouse-audit.sh`  
URL auditada: `https://psicoprotego-tests.vercel.app` (alias de producción en Vercel)

### Mobile

| Página | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| /es | 70 | 92 | 100 | 92 | 1.9 s | 0 | 2,710 ms |
| /es/test/gad7 | 66 | 93 | 100 | 92 | 2.8 s | 0 | 3,370 ms |
| /es/test/gad7/start | n/a | n/a | n/a | n/a | — | — | — |

### Desktop

| Página | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| /es | 54 | 92 | 100 | 92 | 2.6 s | 0 | 1,820 ms |
| /es/test/gad7 | n/a | n/a | n/a | n/a | — | — | — |
| /es/test/gad7/start | n/a | n/a | n/a | n/a | — | — | — |

**Notas:**
- `/es/test/gad7/start` no es auditable en headless: es un Client Component con sessionStorage guard que redirige a la landing si no hay token de sesión previo. Esperado.
- `/es/test/gad7` desktop y `/es/test/gad7/start`: Vercel devuelve 403 desde IP de datacenter (Contabo) tras las primeras peticiones. Pendiente captura manual vía pagespeed.web.dev o desde IP doméstica.
- **Punto de atención:** TBT elevado en mobile (2,710–3,370 ms) indica trabajo en el hilo principal durante carga. Investigar en Fase 1 (posible React hydration o GTM).
- **CLS = 0** en todas las páginas auditadas. ✅

---

## 3. Schema markup actual

### /es (homepage)
Presente: **ninguno** (0 bloques JSON-LD)

### /es/test/gad7
Presente:
- `BreadcrumbList` — Inicio → Tests → GAD-7
- `FAQPage`
- `MedicalWebPage` — `citation`: Spitzer RL et al. (2006) + DOI; `about`: `[{@type: MedicalCondition, name: "ansiedad"}]`

### /es/test/gad7/start
Presente: **ninguno** (Client Component, esperado)

### /es/test/phq9
Presente:
- `BreadcrumbList`
- `FAQPage`
- `MedicalWebPage` — citation: Kroenke K et al. (2001) + DOI; about: `[{@type: MedicalCondition, name: "depresion"}]`

### Gap hacia objetivo Fase 3

| Schema | Estado hoy | Datos disponibles |
|---|---|---|
| `MedicalTest` | ausente | pendiente implementar |
| `Psychologist` author/reviewedBy con colegiación | ausente | ✅ en `authors.json` listo |
| `MedicalCondition` tipada con ICD-10 | parcial (solo name) | ✅ en `metadata.medicalCondition` listo |
| `FAQPage` | presente ✅ | — |
| `BreadcrumbList` | presente ✅ | — |

---

## 4. Dependencias finales

```
psicoprotego-tests@0.1.0
├── @react-pdf/renderer@4.3.2
├── @types/node@25.5.0
├── @types/react-dom@18.3.7
├── @types/react@18.3.28
├── @vercel/analytics@2.0.1
├── autoprefixer@10.4.27
├── next@15.5.13
├── postcss@8.5.8
├── react-dom@18.3.1
├── react@18.3.1
├── tailwindcss@3.4.19
└── typescript@5.9.3
```

Dependencias eliminadas en Fase 0: `gray-matter`, `marked`, `@upstash/redis`, `@vercel/kv`

---

## 5. Delta Fase 0 vs estado inicial

| Métrica | Inicio Fase 0 | Cierre Fase 0 |
|---|---|---|
| SSG pages | 106 (14 idiomas × rutas) | 41 (ES + páginas estáticas) |
| Tests activos | 3 (GAD-7, PHQ-9, Apego) | 2 (GAD-7, PHQ-9; Apego archivado) |
| Idiomas de tests | ES/EN/PT/KU | ES únicamente |
| Archivado | — | archive/: ads, group sessions, URL shortener, RemindMe, ScoreHistory, blog, apego, en/pt/ku test files |
| Deps removidas | — | gray-matter, marked, @upstash/redis, @vercel/kv |
| Commits atómicos Fase 0 | — | 18 |
| Schema markup | básico | BreadcrumbList + FAQPage + MedicalWebPage con DOI |
| Modelo de datos | topicCategory, category:quiz | condition, category:psychometric\|screening; medicalCondition (ICD-10), validation (DOI), authorship |
| Autoría clínica | — | authors.json completo: Emmanuel Rodríguez de Vera Ríos (M-18523) + Cristina Domingo Gutiérrez (M-30745) |
| Fotos de equipo | — | public/images/team/: emmanuel.jpg (28KB) + cristina.webp (63KB) |

---

## 6. Verificación F.1 — Exclusión archive/ en discoverTests

**Mecanismo:** `TESTS_DIR = path.join(process.cwd(), 'public', 'data', 'tests')`

`archive/` vive en la raíz del proyecto, fuera de `public/data/tests/`. La exclusión es **estructural** — `fs.readdir(TESTS_DIR)` nunca ve `archive/`. No se necesitó filtro explícito. Confirmado con build completo: 2 tests en tests-index.json (gad7, phq9).

---

## 7. Próxima fase: Fase 1 — Integración técnica

Objetivos:
1. Apache reverse proxy en Contabo: `psicoprotego.es/tests` → Vercel
2. Next.js `basePath: '/tests'`
3. Routing `/tests/:condition/:slug` (hoy `/es/test/:testId`)
4. Cloudflare caching rules para `/tests/*`
5. Sitemap unificado en `psicoprotego.es`
6. Rediseño visual heredando look de `psicoprotego.es/servicios/*`

---

## 8. Pendientes manuales

### Resueltos durante cierre Fase 0
- [x] Apellidos de Cristina: Cristina Domingo Gutiérrez
- [x] Colegiación Cristina: M-30745
- [x] Perfil Cristina: `/equipo/cristina-domingo/` (HTTP 200 verificado)
- [x] Nombre completo Emmanuel: Emmanuel Rodríguez de Vera Ríos
- [x] Fotos de equipo: `public/images/team/emmanuel.jpg` + `cristina.webp`
- [x] Build Vercel en verde tras fix de tipos huérfanos (deploy DPrfMk3Y4, commit 1e54516)

### Abiertos — no bloqueantes para Fase 1
- [ ] Referencias españolas exactas de validación GAD-7 (`metadata.validation.spanishValidation`)
- [ ] Referencias españolas exactas de validación PHQ-9
- [ ] Lighthouse scores vía pagespeed.web.dev (captura manual)
- [ ] Optimización de fotos de equipo si se considera necesario en Fase 1

### Abiertos — Fase 2
- [ ] Redacción clínica de `es.content.json` GAD-7 y PHQ-9 con skill `/clinical-landing-writer` + revisión Cristina + Emmanuel

---

## 9. Incidente registrado

Durante Bloque B.4, `src/types/test.ts` quedó en working tree sin stagear mientras todos sus consumidores sí fueron commiteados. El build local con `tsc --noEmit` pasó (lee working tree) pero Vercel falló al construir desde el commit (donde `TestMetadata` aún tenía `topicCategory` y no `condition`). Resuelto en commit `1e54516`.

**Lección aplicada:** tras cada bloque, validar explícitamente `git status` limpio y `git diff HEAD..origin/<rama> --stat` tras push. `tsc --noEmit` no es suficiente — lee el working tree, no el commit.
