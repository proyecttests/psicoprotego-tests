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
│  ├─ lang: "es"
│  ├─ questions: 7 preguntas GAD-7
│  ├─ scoring: categorías 0-21
│  └─ disclaimers: before + after
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
