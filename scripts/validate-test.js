#!/usr/bin/env node
/**
 * scripts/validate-test.js <testId>
 *
 * Validates a test's JSON structure and scoring registration.
 * Exits 0 if valid, 1 if errors found.
 */

'use strict'

const fs   = require('fs')
const path = require('path')

const testId = process.argv[2]
if (!testId) {
  console.error('Usage: node scripts/validate-test.js <testId>')
  process.exit(1)
}

const ROOT     = path.join(__dirname, '..')
const TEST_DIR = path.join(ROOT, 'public/data/tests', testId)
const SCORING  = path.join(ROOT, 'src/utils/scoringFunctions.ts')

let errors   = 0
let warnings = 0

function err(msg)  { console.error(`  ✗ ${msg}`); errors++ }
function warn(msg) { console.warn (`  ⚠ ${msg}`); warnings++ }
function ok(msg)   { console.log  (`  ✓ ${msg}`) }

console.log(`\nValidating test: ${testId}\n`)

// ── 1. Directory exists ───────────────────────────────────────────────────────

if (!fs.existsSync(TEST_DIR)) {
  err(`Directory not found: public/data/tests/${testId}`)
  console.log(`\nErrors: ${errors}  Warnings: ${warnings}`)
  process.exit(1)
}
ok('Test directory found')

// ── 2. metadata.json ─────────────────────────────────────────────────────────

const metaPath = path.join(TEST_DIR, 'metadata.json')
if (!fs.existsSync(metaPath)) {
  err('metadata.json not found')
  process.exit(1)
}

let meta
try {
  meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
  ok('metadata.json is valid JSON')
} catch (e) {
  err(`metadata.json parse error: ${e.message}`)
  process.exit(1)
}

// Required metadata fields
for (const field of ['id', 'availableLangs', 'category']) {
  if (!meta[field]) err(`metadata.json missing required field: ${field}`)
  else ok(`metadata.${field}: ${JSON.stringify(meta[field])}`)
}

if (meta.id !== testId) {
  err(`metadata.id ("${meta.id}") doesn't match directory name ("${testId}")`)
}

// ── 3. Language files ─────────────────────────────────────────────────────────

const langs = meta.availableLangs || ['es']
for (const lang of langs) {
  const langPath = path.join(TEST_DIR, `${lang}.json`)
  if (!fs.existsSync(langPath)) {
    err(`Missing translation file: ${lang}.json`)
    continue
  }

  let data
  try {
    data = JSON.parse(fs.readFileSync(langPath, 'utf-8'))
    ok(`${lang}.json is valid JSON`)
  } catch (e) {
    err(`${lang}.json parse error: ${e.message}`)
    continue
  }

  // Required fields
  for (const field of ['id', 'lang', 'name', 'questions', 'scoring']) {
    if (!data[field]) err(`${lang}.json missing required field: ${field}`)
  }

  if (data.name?.startsWith('[TRADUCIR]')) {
    warn(`${lang}.json name starts with [TRADUCIR] — translation incomplete`)
  }

  // Questions
  const questions = data.questions || []
  if (questions.length === 0) {
    err(`${lang}.json has no questions`)
  } else {
    ok(`${lang}.json: ${questions.length} questions`)
  }

  for (const q of questions) {
    if (!q.id)   err(`${lang}.json: question missing 'id'`)
    if (!q.type) err(`${lang}.json: question ${q.id} missing 'type'`)
    if (!q.text) err(`${lang}.json: question ${q.id} missing 'text'`)
    if (q.type === 'multipleChoice' && (!q.options || q.options.length === 0)) {
      err(`${lang}.json: question ${q.id} is multipleChoice but has no options`)
    }
  }

  // Check itemCount matches
  if (meta.itemCount && questions.length !== meta.itemCount) {
    warn(`${lang}.json: ${questions.length} questions but metadata.itemCount=${meta.itemCount}`)
  }

  // Scoring categories — supports two formats:
  //   a) { scoring: { categories: [...] } }  (standard)
  //   b) { scoring: [...] }                  (legacy flat array, e.g. apego)
  const scoringRaw = data.scoring
  const cats = Array.isArray(scoringRaw)
    ? scoringRaw
    : (scoringRaw?.categories || [])
  if (cats.length === 0) {
    err(`${lang}.json: scoring has no categories (checked scoring[] and scoring.categories[])`)
  } else {
    ok(`${lang}.json: ${cats.length} scoring categories`)
  }

  // Check categories have required fields (flexible for both formats)
  for (const cat of cats) {
    const catId = cat.id || cat.typeKey || cat.messageKey
    if (!catId) err(`${lang}.json: scoring entry missing 'id' or 'typeKey'`)
    if (!cat.color) err(`${lang}.json: scoring entry missing 'color'`)
  }

  // scoringFunction declared
  if (!data.scoringFunction) {
    err(`${lang}.json: missing 'scoringFunction' field`)
  }
}

// ── 4. Scoring function registered ───────────────────────────────────────────

if (fs.existsSync(SCORING)) {
  const scoringCode = fs.readFileSync(SCORING, 'utf-8')
  // Get scoringFunction name from es.json
  const esPath = path.join(TEST_DIR, 'es.json')
  if (fs.existsSync(esPath)) {
    const esData = JSON.parse(fs.readFileSync(esPath, 'utf-8'))
    const fnName = esData.scoringFunction
    if (fnName) {
      const registered = scoringCode.includes(`${fnName}:`) || scoringCode.includes(`${fnName},`) || scoringCode.includes(`${fnName} `)
    if (registered) {
        ok(`Scoring function "${fnName}" registered in scoringFunctions.ts`)
      } else {
        err(`Scoring function "${fnName}" NOT found in scoringFunctions.ts — implement and register it`)
      }
    }
  }
} else {
  warn('src/utils/scoringFunctions.ts not found — skipping scoring check')
}

// ── 5. Summary ────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`)
console.log(`Errors: ${errors}  |  Warnings: ${warnings}`)
if (errors === 0 && warnings === 0) {
  console.log('All checks passed ✓')
} else if (errors === 0) {
  console.log('No errors — review warnings above')
} else {
  console.log('Fix errors before continuing')
}
console.log()

process.exit(errors > 0 ? 1 : 0)
