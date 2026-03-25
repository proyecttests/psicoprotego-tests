#!/usr/bin/env node
/**
 * scripts/add-language.js <langCode> [--rtl]
 *
 * Automates the mechanical steps of adding a new language to Psicoprotego:
 *  1. Validates lang code (2 lowercase letters)
 *  2. Adds langCode to availableLangs in all test metadata.json files
 *  3. Creates stub translation files for tests that lack them
 *  4. Regenerates tests-index.json + validLangs.ts
 *  5. Prints manual checklist
 */

'use strict'

const fs   = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// ── Parse args ───────────────────────────────────────────────────────────────

const args    = process.argv.slice(2)
const lang    = args.find(a => !a.startsWith('-'))
const isRTL   = args.includes('--rtl')

if (!lang || !/^[a-z]{2,3}$/.test(lang)) {
  console.error('Usage: node scripts/add-language.js <langCode> [--rtl]')
  console.error('Example: node scripts/add-language.js fr')
  process.exit(1)
}

const ROOT       = path.join(__dirname, '..')
const TESTS_DIR  = path.join(ROOT, 'public/data/tests')
const BRAND_FILE = path.join(ROOT, 'src/config/brand.ts')

console.log(`\nAdding language: ${lang}${isRTL ? ' (RTL)' : ''}\n`)

// ── 1. Update test metadata.json files ───────────────────────────────────────

const testDirs = fs.readdirSync(TESTS_DIR).filter(d =>
  fs.statSync(path.join(TESTS_DIR, d)).isDirectory()
)

let stubsCreated = 0
let metaUpdated  = 0

for (const testId of testDirs) {
  const dir      = path.join(TESTS_DIR, testId)
  const metaPath = path.join(dir, 'metadata.json')
  if (!fs.existsSync(metaPath)) continue

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
  const langs = meta.availableLangs || ['es']

  if (!langs.includes(lang)) {
    langs.push(lang)
    meta.availableLangs = langs
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n')
    metaUpdated++
    console.log(`  [metadata] ${testId}: added ${lang}`)
  } else {
    console.log(`  [metadata] ${testId}: ${lang} already present — skipped`)
  }

  // ── 2. Create stub translation file ─────────────────────────────────────────

  const langPath = path.join(dir, `${lang}.json`)
  if (!fs.existsSync(langPath)) {
    // Try to copy from 'es' (fallback to first available lang)
    const srcLang = langs.includes('es') ? 'es' : langs.find(l => l !== lang)
    const srcPath = srcLang ? path.join(dir, `${srcLang}.json`) : null

    if (srcPath && fs.existsSync(srcPath)) {
      const src = JSON.parse(fs.readFileSync(srcPath, 'utf-8'))
      // Mark as needing translation
      src.name = `[TRADUCIR] ${src.name}`
      src.hook = src.hook ? `[TRADUCIR] ${src.hook}` : '[TRADUCIR]'
      fs.writeFileSync(langPath, JSON.stringify(src, null, 2) + '\n')
      stubsCreated++
      console.log(`  [stub]     ${testId}/${lang}.json created (copy of ${srcLang})`)
    } else {
      console.log(`  [stub]     ${testId}/${lang}.json — no source found, create manually`)
    }
  } else {
    console.log(`  [stub]     ${testId}/${lang}.json already exists — skipped`)
  }
}

console.log(`\nMetadata updated: ${metaUpdated}  |  Stubs created: ${stubsCreated}`)

// ── 3. Regenerate index ───────────────────────────────────────────────────────

console.log('\nRegenerating tests-index.json + validLangs.ts...')
execSync(`node ${path.join(__dirname, 'generate-tests-index.js')}`, { stdio: 'inherit' })

// ── 4. RTL hint ───────────────────────────────────────────────────────────────

if (isRTL) {
  console.log(`\n[RTL] Remember to add '${lang}' to RTL_LANGS in src/config/brand.ts`)
  if (fs.existsSync(BRAND_FILE)) {
    const content = fs.readFileSync(BRAND_FILE, 'utf-8')
    if (content.includes(`'${lang}'`)) {
      console.log(`      → Already present in brand.ts`)
    } else {
      console.log(`      → NOT yet in brand.ts — add manually`)
    }
  }
}

// ── 5. Manual checklist ───────────────────────────────────────────────────────

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECKLIST MANUAL PENDIENTE para '${lang}'
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] 1. Traducir stub JSON files en public/data/tests/*/${lang}.json
       (eliminar el prefijo [TRADUCIR] cuando estén listos)

[ ] 2. Añadir contenido en páginas estáticas:
       - app/[lang]/acerca-de/page.tsx
       - app/[lang]/contacto/page.tsx
       - app/[lang]/aviso-legal/page.tsx
       - app/[lang]/cookies/page.tsx
       - app/[lang]/privacidad/page.tsx

[ ] 3. Añadir strings UI (grep: grep -r "ku:" src/ --include="*.tsx" -l)

[ ] 4. Añadir strings en CookieBanner.tsx (UI dict)${isRTL ? '''

[ ] 5. Añadir \'''' + lang + '''\' a RTL_LANGS en src/config/brand.ts''' : ''}

[ ] ${isRTL ? '6' : '5'}. npm run build  →  verificar rutas SSG

[ ] ${isRTL ? '7' : '6'}. git commit -m "feat(i18n): añadir idioma ${lang}"

Lee skills/add-language/SKILL.md para instrucciones completas.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
