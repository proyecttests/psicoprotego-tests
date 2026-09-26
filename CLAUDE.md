# CLAUDE.md — TestPsycho Suite

## Identidad

**Psicoprotego Tests:** suite de tests psicométricos clínicos — solo español, embebida en psicoprotego.es/tests.
**Propietarios:** Emmanuel (M-18523) y Cristina (M-30745), consulta Psicoprotego, Pozuelo de Alarcón.
**Repo:** github.com/proyecttests/psicoprotego-tests
**Live (Vercel):** tests.psicoprotego.vercel.app
**Destino final:** psicoprotego.es/tests (pendiente de proxy — ver Infraestructura)

## Dirección (no negociable)

Herramienta clínica solo en español, con instrumentos psicométricos validados (GAD-7, PHQ-9, y más
por venir). Sin anuncios, sin quizzes no clínicos, sin sesiones de grupo, sin acortador de URL.
No construir nada de eso sin instrucción explícita de Emmanuel.

`src/config/brand.ts` → `SUPPORTED_LANGS = ['es']` es la fuente de verdad de esta dirección.

**Incidencia abierta (no es historial, es un bug activo):** `app/sitemap.ts` tiene hardcodeado
`LANGS = ['es', 'en', 'pt', 'ku']` y sigue publicando en el sitemap real páginas estáticas
(`acerca-de`, `contacto`, `privacidad`, `cookies`, `aviso-legal`) y `ayuda-urgente` en inglés/
portugués/kurdo, generadas vía auto-discovery de `src/data/help-resources/{en,pt,ku}.json` en
`app/[lang]/ayuda-urgente/page.tsx`. Esto contradice "solo español" y sigue indexándose en
buscadores. Pendiente de decidir y arreglar como tarea de código aparte (no tocado aquí).

## Estado actual de los tests

- **GAD-7** — contenido clínico redactado (`clinical-landing-writer` v2), `status:
  draft-pending-clinical-review`, pendiente de firma clínica de Emmanuel/Cristina.
- **PHQ-9** — `es.content.json` todavía con placeholders `[PENDIENTE]`, pendiente de redacción y
  revisión clínica.

## Stack

- **Frontend:** Next.js 15.5.13 + React 18 + TypeScript + Tailwind CSS
- **Rendering:** Server Components (SSG) para SEO + Client Components para interactividad
- **Hosting:** Vercel (detección automática de Next.js; `vercel.json` solo define
  `installCommand` + `buildCommand` — **si hay Production Overrides activos y vacíos en el panel
  de Vercel, mandan sobre `vercel.json` y el build no ejecuta nada**, ver
  `.claude/rules/deploy.md`)

## Infraestructura

- **VPS:** Contabo (no Hetzner). Sirve `psicoprotego.es` (WordPress) vía Apache; la app de tests
  no se sirve desde ahí, se despliega en Vercel.
- **Destino `psicoprotego.es/tests`:** pendiente de configurar el reverse proxy en el Apache de
  ese VPS hacia el deployment de Vercel.
- **DNS:** Piensa Solutions — verificado (`dig NS psicoprotego.es` → `ns97/ns98.piensasolutions.com`).
- **CDN/Cloudflare:** no verificado. `curl -sI https://psicoprotego.es` devuelve `Server: Apache`
  sin cabeceras de Cloudflare — no parece estar delante del sitio hoy. Confirmar con Emmanuel
  antes de dar por hecho ningún rol de Cloudflare.

## Comandos

```bash
npm run dev     # Next.js dev server (localhost:3000) — predev regenera el índice de tests
npm run build   # Production build — prebuild regenera el índice de tests
npm run start   # Sirve el build de producción
npm run lint    # next lint
```

`prebuild`/`predev` ejecutan `scripts/generate-tests-index.js` (genera
`public/data/tests-index.json` y `src/generated/validLangs.ts`). No hay `npm run preview`.

## Skills (`.claude/skills/`, invocación manual con `/nombre`)

- **`/new-test`** — proceso completo para añadir un test psicométrico nuevo.
- **`/add-language`** — proceso para incorporar un idioma nuevo (usar solo con instrucción
  explícita de Emmanuel; contradice la dirección actual de "solo español").
- **`/branding`** — cambio de paleta, fuentes y logos.
- **`/deprecate-feature`** — eliminar o archivar una feature ordenadamente.
- **`/clinical-landing-writer`** — pipeline de 3 fases (research → redacción → auto-revisión) para
  generar el borrador de `es.content.json` de un test, siempre pendiente de firma clínica humana.

## Reglas y arquitectura

Ver `.claude/rules/`:

- **ux-rules.md** → diseño ADHD-optimizado (bloqueado)
- **code-standards.md** → TypeScript, commits, patrones, `.env.local`
- **safety.md** → gestión de crisis, disclaimers clínicos
- **architecture.md** → routing, modelo de datos, componentes
- **deploy.md** → checklist antes de desplegar (build local, Production Overrides de Vercel)

## Archivos clave

- `src/components/test-framework/TestContainer.tsx`
- `src/components/results/ResultCard.tsx` ← SupportBlock de red flags
- `app/[lang]/test/[testId]/page.tsx` ← landing SSG (Server Component)
- `app/[lang]/test/[testId]/start/page.tsx` ← intersticial (Client Component)
- `app/[lang]/test/[testId]/play/page.tsx` ← test interactivo (Client Component)
- `src/utils/scoringFunctions.ts` ← lógica de scoring (factory)
- `public/data/tests/{testId}/{lang}.json` ← contenido de cada test
- `public/data/tests/{testId}/metadata.json` ← ficha técnica
- `public/data/tests/{testId}/es.content.json` ← contenido clínico de landing (source of truth)
- `.env.local` ← secrets (nunca commitear)

Historial de sesiones, decisiones y progreso: `git log`, no este fichero.
