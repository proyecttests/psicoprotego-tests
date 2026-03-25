# Skill: Añadir idioma (add-language)

Proceso completo para incorporar un nuevo idioma a Psicoprotego.

## Uso

```bash
node scripts/add-language.js <langCode> [--rtl]
```

Ejemplo:
```bash
node scripts/add-language.js fr
node scripts/add-language.js ar --rtl
```

## Qué automatiza el script

1. Verifica que el código de idioma sea válido (ISO 639-1, 2 letras).
2. Añade `langCode` a `availableLangs` en todos los `public/data/tests/*/metadata.json`.
3. Crea archivo stub `public/data/tests/*/<lang>.json` para cada test que no lo tenga (copia de `es.json` con prefijo `[TRADUCIR] ` en `name`/`hook`).
4. Regenera `public/data/tests-index.json` y `src/generated/validLangs.ts` ejecutando `scripts/generate-tests-index.js`.
5. Imprime checklist de pasos manuales pendientes.

## Pasos manuales tras el script

### 1. Traducir archivos stub de tests
Por cada archivo `public/data/tests/<testId>/<lang>.json` generado:
- Traducir `name`, `hook`, `instructions`, `disclaimers`
- Traducir texto de cada pregunta (`questions[].text`) y sus opciones (`options[].text`)
- Traducir `scoring.categories` (label, description, advice, results.*)
- Traducir secciones `landing` y `faq`
- Eliminar el prefijo `[TRADUCIR] ` cuando esté listo

### 2. Traducir páginas estáticas
Añadir objeto de contenido en idioma `<lang>` en cada página:
- `app/[lang]/acerca-de/page.tsx`
- `app/[lang]/contacto/page.tsx`
- `app/[lang]/aviso-legal/page.tsx`
- `app/[lang]/cookies/page.tsx`
- `app/[lang]/privacidad/page.tsx`

Patrón a seguir: ver el bloque `ku` añadido en el commit de sorani.

### 3. Añadir strings UI en componentes
Buscar todos los diccionarios de strings y añadir la clave nueva:
```bash
grep -r "ku:" src/ --include="*.tsx" -l
```
Componentes clave:
- `src/components/test-framework/TestContainer.tsx` (CRISIS_STRINGS, UI_STRINGS)
- `src/components/test-framework/SharingScreen.tsx`
- `src/components/results/ResultCard.tsx`
- `src/components/results/DownloadPDF.tsx`
- `src/components/results/DownloadCard.tsx`
- `src/components/results/RemindMe.tsx`
- `src/components/results/ScoreHistory.tsx`
- `src/components/pdf/DownloadBlankLanding.tsx`
- `src/views/TestLandingPage.tsx`
- `src/components/test-framework/CalculatingScreen.tsx`
- `src/components/common/Footer.tsx`
- `src/components/common/CookieBanner.tsx`

### 4. RTL (si aplica)
Si el idioma es RTL (árabe, hebreo, persa, urdu, kurdo sorani):
- Añadir el código a `RTL_LANGS` en `src/config/brand.ts`
- Los componentes PDF ya leen `RTL_LANGS` de brand.ts — automático.
- Verificar `dir="rtl"` en el HTML root: `app/[lang]/layout.tsx` usa `LangHtmlUpdater`.

### 5. Ruta de ayuda urgente
Si el idioma necesita ruta propia:
- Añadir entrada en `app/[lang]/ayuda-urgente/page.tsx`
- Añadir la ruta en `ResultCard.tsx` → `HELP_ROUTES`

### 6. Build y verificación
```bash
npm run build
# Confirmar que aparece /ku/acerca-de etc. en la tabla de rutas SSG
```

### 7. Commit
```
feat(i18n): añadir idioma <lang> — <NombreIdioma>
```

## Convenciones

| Campo | Regla |
|---|---|
| Código | ISO 639-1 (2 letras) en minúsculas |
| Dirección | RTL si el script se invoca con `--rtl` |
| Stub prefix | `[TRADUCIR] ` en name/hook indica que falta traducción |
| Ruta ayuda urgente | `/<lang>/ayuda-urgente` (añadir si hay número de crisis local) |

## Referencia

- Idiomas activos: `src/generated/validLangs.ts`
- Idiomas RTL: `src/config/brand.ts` → `RTL_LANGS`
- Ejemplo completo añadido: Sorani kurdo (`ku`) — commit `9f70845`
