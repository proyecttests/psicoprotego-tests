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
