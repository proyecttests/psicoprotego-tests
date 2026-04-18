# Baseline técnica — cierre Fase 0

Fecha: 2026-04-19  
Rama: feat/consolidation-psicoprotego  
Commit HEAD: 88c0d4507a17225c876e030c9c92f2dcf55b5628  
Commits en Fase 0: 14 (Bloque A/A.7: 9 + Bloque B: 5 + este baseline: 15)

```
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
| Páginas SSG generadas | 41 |
| Bundle total (shared JS) | 102 kB |
| First Load JS (/es) | 106 kB |
| First Load JS (/es/test/gad7) | 108 kB |
| First Load JS (/es/test/gad7/start) | 108 kB (ƒ dynamic) |
| First Load JS (/es/test/phq9) | 108 kB |
| node_modules | 546 MB |
| .next | 151 MB |

Warnings: ninguno. tsc --noEmit: ✅ limpio.

**Notas:**
- `/es/test/[testId]/start` y `/play` son rutas dinámicas (ƒ) — Client Components con sessionStorage guard. No aplica SSG.
- Páginas estáticas en en/pt/ku (`acerca-de`, `aviso-legal`, etc.) se generan aún porque no se archivaron las rutas estáticas (solo el contenido de tests). Esto es correcto.

---

## 2. Lighthouse (mobile)

| Página | Perf | A11y | BP | SEO | LCP | CLS | INP |
|---|---|---|---|---|---|---|---|
| /es | [pendiente] | [pendiente] | [pendiente] | [pendiente] | [pendiente] | [pendiente] | [pendiente] |
| /es/test/gad7 | [pendiente] | [pendiente] | [pendiente] | [pendiente] | [pendiente] | [pendiente] | [pendiente] |
| /es/test/gad7/start | [pendiente] | [pendiente] | [pendiente] | [pendiente] | [pendiente] | [pendiente] | [pendiente] |

Origen: [pendiente captura manual]  
Motivo: Chrome/Chromium no instalado en el servidor Contabo. Ejecutar Lighthouse desde máquina local o PageSpeed Insights contra tests.psicoprotego.vercel.app una vez pusheada la rama.

---

## 3. Schema markup actual

### /es (homepage)
Presentes: **ninguno** (0 bloques JSON-LD)  
Faltan (objetivo Fase 3): ItemList de tests disponibles (opcional)

### /es/test/gad7
Presentes:
- `BreadcrumbList` — Inicio → Tests → GAD-7
- `FAQPage` — preguntas del landing (actualmente con FAQ del es.json)
- `MedicalWebPage` — con `citation` (referencia Spitzer 2006 + DOI), `about: [{@type: MedicalCondition, name: "ansiedad"}]`

Faltan (objetivo Fase 3):
- `MedicalTest` schema (tipo específico para instrumentos psicométricos)
- `Psychologist` como `author` + `reviewedBy` (authors.json existe pero no inyectado en JSON-LD)
- `MedicalCondition` tipada con ICD-10: actualmente solo `{name: "ansiedad"}`, pendiente `{@type: MedicalCondition, name: "Trastorno de ansiedad generalizada", code: {codeValue: "F41.1", codingSystem: "ICD-10"}}`

### /es/test/gad7/start (intersticial)
Presentes: **ninguno** (0 bloques JSON-LD) — esperado, es un Client Component

### /es/test/phq9
Presentes:
- `BreadcrumbList`
- `FAQPage`
- `MedicalWebPage` — `about: [{@type: MedicalCondition, name: "depresion"}]`, citation Kroenke 2001 + DOI

Faltan (objetivo Fase 3): mismos que GAD-7

---

## 4. Dependencias finales (npm list --depth=0)

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

**Dependencias eliminadas en Fase 0:** `@upstash/redis`, `@vercel/kv`, `gray-matter`, `marked`

---

## 5. Delta Fase 0 vs inicio

| Métrica | Antes | Ahora |
|---|---|---|
| Páginas SSG | 106 (14 idiomas × páginas) → ~41 post-Bloque A | 41 (ES + rutas estáticas en/pt/ku) |
| Tests activos | 3 (GAD-7, PHQ-9, Apego) | 2 (GAD-7, PHQ-9 — Apego archivado) |
| Idiomas de tests | ES/EN/PT/KU | ES únicamente |
| Archivado | — | archive/ con: ads, group sessions, URL shortener, RemindMe, ScoreHistory, blog, apego, en/pt/ku test files |
| Dependencias eliminadas | — | @upstash/redis, @vercel/kv, gray-matter, marked |
| Commits atómicos Fase 0 | — | 14 (+1 este baseline = 15) |
| Schema markup | MedicalWebPage básico | MedicalWebPage + BreadcrumbList + FAQPage; authors.json listo para Fase 3 |
| Modelo de datos | topicCategory, category:quiz | condition, category:psychometric\|screening; medicalCondition (ICD-10), validation (DOI), authorship |

---

## 6. Próxima fase: Fase 1 — Integración técnica

Objetivos:
1. Apache reverse proxy en Contabo: `psicoprotego.es/tests` → Vercel
2. Next.js `basePath: '/tests'`
3. Routing `/tests/:condition/:slug` (actualmente `/es/test/:testId`)
4. Cloudflare caching rules para `/tests/*`
5. Sitemap unificado en `psicoprotego.es`
6. Rediseño visual heredando look de `psicoprotego.es/servicios/*`

---

## 7. Pendientes manuales (bloqueantes parciales para Fase 2+)

| Pendiente | Propietario | Archivo |
|---|---|---|
| Apellidos exactos de Cristina | Cristina | `public/data/authors.json` → campo `name` |
| Slug de perfil de Cristina | Cristina | `public/data/authors.json` → campo `profileUrl` |
| Apellidos exactos de Emmanuel | Emmanuel | `public/data/authors.json` → campo `name` |
| Foto de Cristina | Cristina | `public/images/team/cristina.jpg` (directorio no existe aún) |
| Foto de Emmanuel | Emmanuel | `public/images/team/emmanuel.jpg` (directorio no existe aún) |
| Referencia española exacta GAD-7 | Emmanuel | `public/data/tests/gad7/metadata.json` → `validation.spanishValidation.note` |
| Referencia española exacta PHQ-9 | Emmanuel | `public/data/tests/phq9/metadata.json` → `validation.spanishValidation.note` |
| Contenido `[PENDIENTE]` en es.content.json GAD-7 | Emmanuel + Cristina | `public/data/tests/gad7/es.content.json` |
| Contenido `[PENDIENTE]` en es.content.json PHQ-9 | Emmanuel + Cristina | `public/data/tests/phq9/es.content.json` |
