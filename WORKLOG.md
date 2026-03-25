# WORKLOG - Desarrollo GAD-7 MVP

## SETUP INICIAL: Infraestructura

### Fecha: 2025-03-14

### Tareas completadas

- [x] GitHub repo público
- [x] WSL2 + Node v24.14.0
- [x] Git + SSH GitHub
- [x] VS Code + Remote-WSL
- [x] Claude instalado (ext + CLI)
- [x] .env.example creado
- [x] WORKLOG.md creado

### Próximos pasos

- Conectar Vercel
- FASE 1: React + Vite + Tailwind

## FASE 1: React Base Architecture ✅

### Fecha: 2025-03-14

### Tareas completadas

- [x] React 18 + Vite setup
- [x] React Router v6 configurado
- [x] Tailwind CSS integrado
- [x] TypeScript configurado
- [x] Estructura de carpetas creada
- [x] Vercel desplegado (LIVE)
- [x] URL productiva: psicoprotego-tests.vercel.app

### Stack Confirmado

├─ React 18
├─ Vite 5
├─ Tailwind CSS
├─ TypeScript
└─ React Router v6

### Próxima fase

- FASE 2: Framework de tests (componentes genéricos)
- TestContainer, QuestionRenderer, LikertScale, etc.

## FASE 2: Test Framework ✅

### Fecha: 2025-03-14

### Tareas completadas

- [x] TestContainer.tsx (orquestador genérico)
- [x] QuestionRenderer.tsx (router tipos pregunta)
- [x] LikertScale.tsx (slider 0-3)
- [x] BooleanQuestion.tsx (Sí/No)
- [x] TextQuestion.tsx (texto libre)
- [x] MultipleChoiceQuestion.tsx (opciones)
- [x] ProgressBar.tsx (barra progreso)
- [x] Header.tsx, Footer.tsx, Disclaimer.tsx
- [x] ResultCard.tsx (resultado NORMAL + CRISIS)
- [x] Vercel redeploy automático

### Estado actual

✅ Test GAD-7 COMPLETAMENTE FUNCIONAL

- Preguntas se cargan (hardcodeadas en TestContainer)
- Usuario puede responder
- Cálculo de resultado automático
- Muestra resultado final
- Reset funciona

### Próximos pasos (FASE 3)

- Crear JSONs: tests.json + messages.json
- Mover datos hardcodeados a JSON
- Integrar scoring logic
- Mejoras de textos y formatos

# FASE 3: Datos Dinámicos (JSON) ✅

### Fecha: 2025-03-14

### Tareas completadas

- [x] tests.json creado (estructura GAD-7)
- [x] messages.json creado (mensajes por categoría)
- [x] TestContainer.tsx ajustado (ya leía JSON correctamente)
- [x] JSONs alineados con tipos TypeScript
- [x] Test funciona completamente desde JSON
- [x] Datos separados del código

### Estructura JSON

├─ tests.json: { tests: TestDefinition[] }
│ ├─ lang: "es"
│ ├─ questions: 7 preguntas GAD-7
│ ├─ scoring: categorías 0-21
│ └─ disclaimers: before + after
│
└─ messages.json: MessagesMap
├─ gad7.es.minimal/mild/moderate/severe
├─ crisis (phones, resources)
└─ Listo para multiidioma (Fase futura)

### Estado actual

✅ TEST COMPLETAMENTE DINÁMICO

- Datos en JSON (fácil editar)
- Código agnóstico (mismo funciona para PHQ-9, etc)
- Escalable y mantenible

### Próxima fase

- FASE 4: Scoring logic + red flags detection
- Crear src/utils/scoringFunctions.ts
- Integrar análisis automático

## FASE 4: Scoring Logic + Red Flags ✅

### Fecha: 2025-03-14

### Tareas completadas

- [x] src/utils/scoringFunctions.ts creado
- [x] scoreGAD7() implementado con scoring logic
- [x] Red flags detection system
- [x] ScoringResult types definidos
- [x] getScoringFunction() factory pattern
- [x] TestContainer integrado con scoring
- [x] ResultCard adaptado (NORMAL vs CRISIS)
- [x] Sistema extensible para PHQ-9, etc

### Características

✅ Scoring dinámico desde JSON
✅ Métodos: direct, reverse, redFlag, text_analysis, none
✅ Detección automática de red flags
✅ Manejo de casos críticos
✅ Tipos TypeScript completos
✅ Compatible con multiidioma (Fase futura)

### Flujo completo

Usuario responde → scoreGAD7() calcula → detecta red flags →
determina categoría → busca mensaje → ResultCard renderiza

### Estado actual

✅ TEST COMPLETAMENTE FUNCIONAL CON SCORING

- Preguntas dinámicas (JSON)
- Scoring automático
- Red flags detection
- Resultados inteligentes

### Próxima fase

- FASE 5: Mejorar textos y formatos
- O: Agregar más tests (PHQ-9)
- O: Implementar DNS (tests.psicoprotego.es)

---

## RESUMEN GENERAL - MVP COMPLETADO ✅

### Fecha: 2025-03-14

### Línea de tiempo

- Setup infraestructura: 30 min
- FASE 1: React setup: 30 min
- FASE 2: Framework componentes: 90 min
- FASE 3: JSONs dinámicos: 30 min
- FASE 4: Scoring logic: 45 min
- FASE 5: UX improvements: 90 min
- FASE 5.5: Branding + Analytics: 60 min
  **TOTAL: ~6 horas de desarrollo**

### MVP Conseguido

✅ Test GAD-7 completamente funcional
✅ Scoring dinámico desde JSON
✅ Red flags detection
✅ Crisis handling (teléfono 024)
✅ Branding Psicoprotego integrado
✅ Analytics GTM + GA4
✅ Mobile-first responsive
✅ Live en Vercel
✅ Código limpio y escalable
✅ TypeScript strict mode

### Arquitectura

- Frontend: React 18 + Vite + Tailwind
- Datos: JSON-driven (agnóstico)
- Hosting: Vercel + Apache proxy
- Analytics: GTM-MN3QW7Q7 + GA4
- Code: TypeScript + componentes reutilizables

### Próximas prioridades

1. Refinar textos / DNS (Corto plazo)
2. PHQ-9 + más tests (Mediano plazo)
3. Multiidioma (Largo plazo)
4. SaaS platform (Futuro lejano)

## 2025-03-16 - Sesión UI TDAH Optimized

### Objetivos

- Migrar HTML TDAH Perfect a componentes React
- Implementar animaciones para usuarios con TDAH
- Validar progreso y navegación

### Trabajo Realizado

#### ✅ Completado

1. **ProgressBar mejorada**
   - Muestra "X de Y • Z restantes"
   - Barra progreso 0%→100% (completado)
   - Sticky top con gradient Psicoprotego
   - Altura aumentada para mejor visibilidad

2. **Animaciones CSS TDAH**
   - fadeInQuestion: pregunta aparece suave (0.6s)
   - riseUpAfterReveal: pregunta sube -50px (0.8s delay 0.9s)
   - slideOutUpTikTok: salida dramática -100vh (0.4s)
   - floatUp: opciones flotan si no responde (3s infinito)

3. **Componentes actualizados**
   - TestContainer: layout centrado, pregunta grande (2.3rem)
   - LikertScale: reemplazado por 4 cards con radio buttons
   - Botones: Anterior/Siguiente siempre disponibles (excepto Q1)
   - Auto-advance: 200ms al seleccionar

4. **Flujo visual completo**
   - Pregunta fade suave entrada
   - Pregunta sube después de aparecer
   - Cards aparecen con stagger (1.8s-2.25s)
   - Flotación automática 2.8s+
   - Transición salida: sube -100vh rápido
   - Siguiente: fade suave entrada

#### ⚠️ WIP / Issues

- Spacing pregunta-opciones: se solapan en algunas resoluciones
  - Pendiente: ajustar margins/gaps/flex en TestContainer
  - Solución a refinar en próxima sesión

### Decisiones Tomadas

1. **UI TDAH > UX estándar**: prioridad en usuarios con TDAH
2. **Cards > Slider**: mejor UX para mobile y accesibilidad
3. **Animaciones CSS puras**: 0 dependencias extra, mejor perf
4. **Claude Code**: para ajustes de spacing (acceso código vivo)

### Próximos Pasos

- [x] Arreglar spacing pregunta-opciones (Claude Code)
- [x] Multiidioma router (/es/test/gad7, /en/test/gad7, /pt/)
- [x] PHQ-9 (prueba framework multi-test)
- [ ] Crisis handling UI (teléfono 024 visible post-test)
- [ ] Deployment psicoprotego.es/tests

---

## 2026-03-17 - Sesión Multiidioma + PHQ-9 + i18n

### Objetivos

- Implementar router /:lang/test/:testId
- Añadir test PHQ-9
- Internacionalizar UI strings

### Trabajo Realizado

#### ✅ Completado

1. **Fix spacing pregunta-opciones**
   - Ajuste de márgenes/gaps en TestContainer.tsx
   - Ya no hay solapamiento en desktop ni mobile

2. **Router /:lang/test/:testId implementado**
   - Validación de idiomas: es, en, pt, fr, de, it, ar, he, ku, tr, el, hi, ja, ko
   - Fallback: lang desconocido → /es/test/:testId
   - Redirect legacy: /test/:testId → /es/test/:testId
   - Redirect nuevo: /:lang/test → /:lang/test/gad7

3. **PHQ-9 añadido**
   - 9 preguntas, scoring 5 categorías (minimal → severe)
   - Red flag en q9 (pensamiento suicida)
   - Disponible en ES y EN
   - Validó el factory pattern (sin tocar QuestionRenderer)

4. **UI strings multiidioma en TestContainer**
   - Soporte para es / en / pt
   - Textos: loading, error, botones prev/next/finish, hint
   - Fallback a ES si idioma no soportado

5. **messages.json: traducciones EN**
   - GAD-7 EN: 4 categorías + crisis (988 Lifeline)
   - PHQ-9 EN: 5 categorías + crisis (988 + Crisis Text Line)

6. **tests.json: versiones EN**
   - GAD-7 EN con preguntas y scoring clínico
   - PHQ-9 EN con preguntas y scoring clínico (5 rangos)
   - Fallback en TestContainer: si no existe test para el lang, usa el primero disponible

### Estado Actual

✅ GAD-7 funcional en ES y EN
✅ PHQ-9 funcional en ES y EN
✅ Router multiidioma operativo
✅ UI strings internacionalizados

### Próximos Pasos

- [ ] Crisis handling UI — mostrar teléfono 024/988 visible post-test
- [ ] Versiones PT de tests y mensajes
- [ ] ResultCard mejorada (score visual, barra, share)
- [ ] AdSlot placeholder (reservar espacio CLS-safe)
- [ ] SEO: hreflang tags en <head>

---

## 2026-03-18 - Sesión Landing Pages + Flujo completo + Páginas de ayuda + ResultCard

### Objetivos

- Crear landing pages SEO para cada test
- Implementar flujo completo con subrutas (landing → intersticial → test)
- Crear páginas de recursos de ayuda urgente
- Rediseñar pantalla de resultados con red flags (tono menos alarmante)

### Trabajo Realizado

#### ✅ Completado

1. **TestMetadataTable.tsx** — Ficha técnica del test
   - Renderiza metadata desde `metadata.json` (validación, idiomas disponibles, scoring range, cutoffs)
   - Grid responsivo 1→2 columnas; cutoffs con código de color por severidad
   - Muestra advertencia si el idioma solicitado no tiene traducción validada

2. **TestLandingPage.tsx** — Landing page SEO completa
   - Secciones: Hero (h1 + hook + CTA), Qué mide, Para quién, Cómo funciona, Ficha técnica, FAQ accordion, CTA final
   - AdSlot `leaderboard` entre Hero y contenido
   - SEO completo: `document.title`, `meta[description]`, JSON-LD inject/remove en mount/unmount
   - Schemas: FAQPage, BreadcrumbList, MedicalWebPage (si psychometric + validated)
   - Datos: fetch paralelo de `metadata.json` + `{lang}.json`; fallback a `es.json`

3. **TestInterstitial.tsx** — Pantalla intersticial (disclaimer + ad)
   - Disclaimer clínico limpio (sin rojo, sin ⚠️)
   - AdSlot `pre-test` de mayor valor publicitario
   - Enlace discreto a página de ayuda urgente (en lugar de teléfonos visibles)
   - Botones: "Entiendo y continuar" + "Cancelar, volver atrás"

4. **Flujo completo con subrutas (App.tsx reescrito)**
   - `/:lang/test/:testId` → TestLandingPage (indexable, SEO)
   - `/:lang/test/:testId/start` → TestInterstitial (disclaimer + ad)
   - `/:lang/test/:testId/play` → TestContainer (test real)
   - Protección acceso directo: `location.state` con flags `fromLanding` / `fromInterstitial`
   - Botón Atrás nativo funciona correctamente (historial React Router)
   - RTL wrapper para ar/he/ku
   - Redirects legacy: `/test/:testId`, `/:lang/test`, `/tests`

5. **Datos JSON de tests reorganizados**
   - `public/data/tests/{testId}/metadata.json` — ficha técnica, idiomas, cutoffs
   - `public/data/tests/{testId}/{lang}.json` — contenido por idioma (landing, preguntas, mensajes)
   - Completados: GAD-7 (es/en/pt) y PHQ-9 (es/en/pt)

6. **HelpResourcesPage.tsx** — Páginas de ayuda urgente
   - Rutas: `/es/ayuda-urgente`, `/en/urgent-help`, `/pt/ajuda-urgente`
   - Tono: calmo y profesional (psicólogo que indica dónde ir, no alarma)
   - Secciones: Emergencias, Salud mental (con expandible "otros países"), Otros recursos, Hablar con profesional
   - PhoneCard: área completa tappable en móvil, número prominente
   - Datos en `src/data/help-resources/{es,en,pt}.json`

7. **ResultCard.tsx rediseñado — tono más humano**
   - Eliminado `CrisisResult` (rojo, pulsante, teléfonos prominentes, `animate-pulse`, `role="alert"`)
   - Todos los resultados usan `NormalResult` (score + categoría + recomendación)
   - `SupportBlock` nuevo: se muestra cuando `resultType === 'CRISIS'` o hay red flags o urgencia
     - Fondo crema cálido (`#ede8df`), borde Verde Bosque izquierdo
     - Título: "En tus respuestas hemos detectado algunos aspectos que pueden indicar que necesitas apoyo"
     - Texto: "Te recomendamos que consultes con un profesional lo antes posible."
     - Enlace: "Puedes pedir ayuda en estos recursos →" (a `/ayuda-urgente`)
     - Nota de privacidad: "Esta información está solo en tu navegador y no la verá nadie si tú no la compartes."
     - Nota de emergencia: "Si es una emergencia, llama al 112"
   - Bloque "Recomendación" ahora solo se renderiza si `message.recommendation` existe (fix etiqueta vacía)
   - Prop `type` eliminada de `ResultCardProps` (se deriva del resultado)

8. **AdSlot.tsx ampliado**
   - Nuevas posiciones: `test-intro`, `pre-test`
   - Nuevo tamaño: `leaderboard` (responsivo, max 728×90)

#### ⚠️ Pendiente

- [ ] Footer de pantalla red flags sigue con color rojo — revisar y neutralizar
- [ ] Pantallas de resultados finales: revisar coherencia visual completa
- [ ] PHQ-9: crear landing page + metadata completa (próxima prioridad)
- [ ] Fix spacing bug en TestContainer (h2 / cards) — identificado pero no confirmado resuelto
- [ ] SEO: hreflang tags en `<head>`
- [ ] Shareable results (OG tags, share buttons)

### Commits de la sesión

- `feat: reorganizar datos de tests con metadata y landing para GAD-7 y PHQ-9 en es/en/pt`
- `refactor: change LangSwitcher from pills to dropdown`
- `feat: add PT language and lang switcher on test intro page`
- `feat: add AdSlot component and ad interstitial screens`
- `fix: localize Likert option labels for EN/PT tests`
- `fix: rediseñar pantalla de red flags con enfoque calmo y profesional`
- `fix: tono menos diagnosticador en bloque de apoyo y fix recomendación vacía`

---

## 2026-03-19 — Sesiones 4-5: Migración a Next.js

### Completado

- [x] Migración completa de Vite + React SPA a Next.js App Router
- [x] Root layout (`app/layout.tsx`) con Google Fonts, GTM, y `suppressHydrationWarning`
- [x] Layout por idioma (`app/[lang]/layout.tsx`) con validación lang + RTL support
- [x] Landing pages como Server Components con SSG (`generateStaticParams`)
- [x] `generateMetadata()` con title, description, canonical, hreflang y OG tags por página
- [x] JSON-LD schemas renderizados en servidor (FAQPage, BreadcrumbList, MedicalWebPage)
- [x] Intersticial como Client Component con fetch en cliente y sessionStorage guard
- [x] Test interactivo como Client Component (TestContainer reutilizado sin cambios)
- [x] Homepage por idioma (`app/[lang]/page.tsx`) con listado de tests, badges y CTA
- [x] Página de ayuda urgente como SSG (`app/[lang]/ayuda-urgente/page.tsx`)
- [x] Configuración de deploy para Vercel (sin vercel.json, sin `output: standalone`)
- [x] Fix: bold en disclaimer usaba color rojo (#991b1b) → corregido a `var(--color-primary)`
- [x] Fix: scoringFunction no se pasaba al resolver el test → corregido con ref

### Impacto SEO

- Google ahora recibe HTML completo con todo el contenido (h1, meta, JSON-LD)
- OG tags dinámicos por test y por idioma (antes estaban vacíos en Vite SPA)
- hreflang implementado vía `alternates.languages` en `generateMetadata`
- JSON-LD inline en el HTML estático (sin hydration penalty)
- Tiempo de build: 15 páginas SSG generadas en ~13s

### Stack resultante

- Next.js 16 + React 18 + TypeScript + Tailwind CSS
- Server Components para SEO / Client Components para interactividad
- Vercel (detección automática Next.js, sin configuración manual)

### Commits de la sesión

- `refactor: crear root layout y layout por idioma`
- `feat: landing page como Server Component con SEO dinámico`
- `feat: intersticial como Client Component en Next.js`
- `feat: test interactivo como Client Component en Next.js`
- `feat: página de ayuda urgente como SSG en Next.js`
- `feat: homepage con listado de tests por idioma`
- `chore: configurar Next.js para deploy en Vercel`
- `fix: correcciones post-migración Next.js`

---

## 2026-03-19 — Sesión 6: Fix deploy Vercel (Production Overrides + ESM/CJS)

### Problema

Deploy completaba en ~108ms sin ejecutar `npm install` ni `next build`. Resultado: 404 en todas las rutas.

### Causa Raíz

Vercel Dashboard tenía **Production Overrides** activos con comandos vacíos. Estos overrides tienen prioridad sobre `vercel.json`, causando builds vacíos (sin instalación, sin compilación, sin output).

### Fixes Aplicados

1. **`"type": "module"` eliminado de `package.json`** — incompatible con Next.js 15 tooling (PostCSS, Tailwind)
2. **`next.config.js` → `next.config.mjs`** — ESM explícito sin depender de `"type":"module"`
3. **`postcss.config.js`** — cambiado de `export default` a `module.exports` (CommonJS)
4. **`tailwind.config.js`** — cambiado de `export default` a `module.exports` (CommonJS)
5. **Vercel Production Overrides** — limpiados vía REST API (`PATCH /v9/projects/{id}` con `buildCommand: null, installCommand: null, outputDirectory: null`)

### Verificación

- `/es/test/gad7` → HTTP 200 ✅
- `/en/test/phq9` → HTTP 200 ✅
- `/` → HTTP 307 (redirect correcto) ✅

### Lección Aprendida

Los **Vercel Production Overrides** del dashboard sobreescriben `vercel.json` completamente. Si están activos con valores vacíos, el build no ejecuta nada. Limpiarlos requiere la REST API o el dashboard (UI no muestra el estado activo claramente).

### Commits de la sesión

- `fix: forzar build command en vercel.json`
- `fix: downgrade a Next.js 15 + React 18 para compatibilidad Vercel`
- `chore: trigger Vercel build`

---

## 2026-03-19 — Sesión 7: Fixes de datos, instrucciones validadas y limpieza de paleta

### Trabajo Realizado

#### ✅ Completado

1. **Fix badge duplicado "min"** (`TestLandingPage.tsx`)
   - `durationLabel` añadía " min" pero el JSON ya incluía "3-5 min" / "2-3 min"
   - Corregido: `(t) => \`${t} min\`` → `(t) => t` en los tres idiomas (es/en/pt)

2. **Fix cutoffs sin traducir en ficha técnica** (`TestMetadataTable.tsx`)
   - La clave `moderately_severe` del PHQ-9 aparecía como texto crudo
   - Añadido `moderately_severe` a `cutoffLabels` para ES ("Moderadamente severo"), EN ("Moderately severe"), PT ("Moderadamente grave")
   - Añadido color propio (`#fed7aa`, naranja suave) en `CUTOFF_COLORS` para diferenciarlo de `moderate` y `severe`

3. **Instrucciones validadas del instrumento** (`TestContainer.tsx`, JSONs)
   - GAD-7 (es/en/pt): reemplazado texto multi-párrafo por la instrucción exacta y única del instrumento validado
   - PHQ-9 (es/en/pt): ya tenían la instrucción exacta — sin cambios
   - El bloque de instrucciones ya existía en TestContainer (currentIdx === 0); ajustado estilo: `text-sm`, `opacity: 0.6`, sin fondo — como nota introductoria discreta, no como cartel
   - Tipos TypeScript (`instructions?: string`) ya correctos en `TestLangFile` y `TestDefinition`

4. **Coherencia visual ResultCard — paleta brand completa** (`ResultCard.tsx`, `index.css`)
   - `COLOR_MAP.green` (minimal): sustituido `bg-green-50 text-green-700 border-green-300` (Tailwind built-in, fuera de paleta) por `bg-primary-50 text-primary-600 border-primary-200` (Verde Bosque)
   - `COLOR_MAP.red` (severe): diferenciado de minimal con `bg-primary-100 text-primary-700 border-primary-400 bar:primary-600` (tono más profundo, visualmente grave pero no alarmante)
   - `ScoreBar`: `text-gray-500 bg-gray-200` → `text-neutral-500 bg-neutral-200`
   - Disclaimer: `border-gray-100 text-gray-400` → `border-neutral-100 text-neutral-400`
   - `.card`: `ring-gray-200` → `ring-neutral-200`
   - `.btn-secondary`: `border-gray-300` → `border-neutral-300`
   - Ningún estado usa ahora clases Tailwind `gray-*` o `green-*` fuera de la paleta brand

### Verificación de estados ResultCard (post-fix)

| Estado | color key | Clases bg/text |
|--------|-----------|----------------|
| minimal (0–4) | green | primary-50 / primary-600 |
| mild (5–9) | yellow | accent-50 / accent-600 |
| moderate (10–14) | orange | accent-50 / accent-700 |
| severe (15+) | red | primary-100 / primary-700 |
| crisis | — | Score oculto, SupportBlock |

### Commits de la sesión

- `fix: corregir badge duplicado 'min' y traducir cutoffs`
- `feat: añadir instrucciones validadas antes de primera pregunta`
- `fix: coherencia visual ResultCard en todos los estados`

---

## 2026-03-18 - Sesión Paleta Brand + Coherencia Visual ResultCard

### Objetivos

- Eliminar todos los colores rojos de la pantalla de resultados y footer
- Verificar coherencia visual de ResultCard en todos los estados
- Corregir el bug del estado CRISIS en la tarjeta de score

### Trabajo Realizado

#### ✅ Completado

1. **Footer.tsx — crisis footer neutralizado**
   - `bg-red-600` → `bg-primary-500` (verde bosque `#2d4a3e`)
   - Botones: `text-red-700` → `text-primary-500`, `hover:bg-red-50` → `hover:bg-primary-50`
   - Texto del banner: "⚠️ Necesitas ayuda inmediata" → "Hay apoyo disponible — no estás solo/a" (sin emoji de alarma, tono calmo)

2. **ResultCard.tsx — COLOR_MAP reemplazado por paleta brand**
   - `yellow` (mild): `bg-accent-50 / text-accent-600 / border-accent-200` (dorado suave)
   - `orange` (moderate): `bg-accent-50 / text-accent-600 / border-accent-300` (dorado marcado)
   - `red` (severe/crisis): `bg-primary-50 / text-primary-500 / border-primary-300` (verde bosque)
   - Ningún estado muestra rojo, naranja ni amarillo de alerta

3. **Disclaimer.tsx — todos los red-* sustituidos**
   - `border-l-red-500` → `border-l-primary-500`
   - `text-red-800` (negritas) → `text-primary-600`
   - Links de teléfono: `text-red-700` → `text-primary-500`
   - HR y bordes: `red-*` → `primary-*`

4. **ResultCard.tsx — bug CRISIS state corregido**
   - Problema: `resultType === 'CRISIS'` → `score=null`, `category=null` → componente mostraba "0" en círculo verde con badge vacío
   - Fix: `{!isCrisis && <div className="card ...score...">}` — bloque score oculto en CRISIS
   - En CRISIS se muestra directamente el mensaje de crisis + SupportBlock

### Verificación de estados (ResultCard)

| Estado | Color key | Visual |
|--------|-----------|--------|
| minimal (0–4) | green | Verde estándar ✓ |
| mild (5–9) | yellow → accent | Dorado suave ✓ |
| moderate (10–14) | orange → accent | Dorado marcado ✓ |
| severe (15+) | red → primary | Verde bosque ✓ |
| crisis (red flags) | — | Score oculto, mensaje + SupportBlock ✓ |

### Commits de la sesión

- `fix: eliminar colores rojos de crisis, usar paleta brand`
- `fix: ocultar score card en estado CRISIS (score null con círculo verde)`

## 2026-03-25 — Sesión 8: Auditoría, Escalabilidad y Arquitectura de Ads

### Objetivos de la sesión
- Auditoría completa del proyecto (software, SEO, monetización, escalado)
- Eliminar todos los hardcodeos que bloquean el escalado
- Conectar sistema de ads data-driven

### Cambios realizados

#### 1. Auto-discovery de tests y langs (`src/utils/discoverTests.ts`)
- Nuevo fichero: lee `/public/data/tests/` en build time
- `discoverTests()` → devuelve `[{ testId, langs }]` desde cada `metadata.json`
- `discoverLangs()` → lista única de todos los idiomas disponibles
- `generateStaticParams()` en `[lang]/test/[testId]/page.tsx` y `[lang]/page.tsx` ahora usan este helper
- `VALID_LANGS` en `layout.tsx` ahora es dinámico con cache de módulo
- **Resultado:** añadir test nuevo = solo JSON. Sin tocar código.

#### 2. `scoreStandard` en scoring registry
- Nueva función registrada: alias de `scoreGAD7` (algoritmo genérico suma directa + red flags)
- Tests nuevos pueden declarar `"scoringFunction": "scoreStandard"` en su JSON
- Sin necesidad de modificar `scoringFunctions.ts` para el 90% de los tests

#### 3. Sistema de ads data-driven (`public/data/ads.config.json` + `AdStrategy.tsx`)
- `ads.config.json`: define qué slots se muestran por categoría (psychometric/quiz)
  - psychometric: test-intro + pre-test + pre-result
  - quiz: test-intro + pre-test + pre-result + post-share (mayor densidad)
- `AdStrategy.tsx`: componente que consulta el config y renderiza `AdSlot` solo si procede
- Conectado a: `TestLandingPage`, `start/page.tsx`, `CalculatingScreen`, `SharingScreen`
- `TestContainer` extrae `category` de `metadata.json` y lo pasa a los hijos
- **Resultado:** cambiar densidad o posiciones de ads = solo editar el JSON

#### 4. Fix de rendimiento: GTM
- `layout.tsx`: `strategy="beforeInteractive"` → `strategy="afterInteractive"`
- Impacto: GTM ya no bloquea el renderizado inicial (mejora LCP)

### Commits de la sesión
- `refactor: remove all hardcoded test/lang arrays, add ad config`
- `refactor: connect AdStrategy to all ad placements, fix GTM performance`
