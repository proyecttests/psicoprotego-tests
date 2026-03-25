#!/usr/bin/env node
/**
 * scripts/health-check.js
 *
 * Checks that key routes of the deployed site return HTTP 200.
 * Sends a Telegram notification if any check fails (or on recovery).
 *
 * Usage:
 *   node scripts/health-check.js [--base-url https://psicoprotego.com]
 *
 * Env vars:
 *   HEALTH_BASE_URL       — base URL to check (default: http://localhost:3000)
 *   TELEGRAM_BOT_TOKEN    — bot token (from BotFather)
 *   TELEGRAM_CHAT_ID      — chat ID to notify
 *   HEALTH_STATE_FILE     — path to persist last-known state (default: /tmp/psico-health-state.json)
 */

'use strict'

const https = require('https')
const http  = require('http')
const fs    = require('fs')
const path  = require('path')

// ── Config ────────────────────────────────────────────────────────────────────

const args        = process.argv.slice(2)
const baseUrlArg  = args.find(a => a.startsWith('--base-url='))?.split('=')[1]
                 ?? args[args.indexOf('--base-url') + 1]

const BASE_URL    = baseUrlArg
                 ?? process.env.HEALTH_BASE_URL
                 ?? 'http://localhost:3000'

const BOT_TOKEN   = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID     = process.env.TELEGRAM_CHAT_ID
const STATE_FILE  = process.env.HEALTH_STATE_FILE ?? '/tmp/psico-health-state.json'
const TIMEOUT_MS  = 8000

// Routes to check
const ROUTES = [
  '/',
  '/es',
  '/es/test/apego',
  '/ku/acerca-de',
  '/es/privacidad',
  '/es/cookies',
  '/api/shorten',   // POST — will get 405 Method Not Allowed but that means it's alive
]

// ── HTTP helper ───────────────────────────────────────────────────────────────

function fetchUrl(url) {
  return new Promise((resolve) => {
    const lib    = url.startsWith('https') ? https : http
    const req    = lib.get(url, { timeout: TIMEOUT_MS }, (res) => {
      resolve({ ok: res.statusCode < 500, status: res.statusCode })
      res.resume()
    })
    req.on('error', (e) => resolve({ ok: false, status: 0, error: e.message }))
    req.on('timeout', ()  => { req.destroy(); resolve({ ok: false, status: 0, error: 'timeout' }) })
  })
}

// ── Telegram ──────────────────────────────────────────────────────────────────

function sendTelegram(text) {
  if (!BOT_TOKEN || !CHAT_ID) return Promise.resolve()
  return new Promise((resolve) => {
    const body = JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
    const req  = https.request({
      hostname: 'api.telegram.org',
      path:     `/bot${BOT_TOKEN}/sendMessage`,
      method:   'POST',
      headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => { res.resume(); resolve() })
    req.on('error', resolve)
    req.write(body)
    req.end()
  })
}

// ── State persistence ─────────────────────────────────────────────────────────

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8')) } catch { return {} }
}
function saveState(state) {
  try { fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)) } catch {}
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nHealth check: ${BASE_URL}  [${new Date().toISOString()}]\n`)

  const results = []
  for (const route of ROUTES) {
    const url    = `${BASE_URL}${route}`
    const result = await fetchUrl(url)
    const icon   = result.ok ? '✓' : '✗'
    console.log(`  ${icon}  ${result.status || 'ERR'}  ${route}${result.error ? `  (${result.error})` : ''}`)
    results.push({ route, ...result })
  }

  const failed   = results.filter(r => !r.ok)
  const allOk    = failed.length === 0
  const state    = loadState()
  const wasDown  = state.down === true

  if (!allOk) {
    const failList = failed.map(r => `• ${r.route} → ${r.status || r.error}`).join('\n')
    console.log(`\n⚠ ${failed.length}/${results.length} checks failed`)
    if (!wasDown || JSON.stringify(state.failed) !== JSON.stringify(failed.map(r => r.route))) {
      await sendTelegram(
        `🚨 <b>Psicoprotego — sitio caído</b>\n\n${failList}\n\nURL: ${BASE_URL}`
      )
    }
    saveState({ down: true, failed: failed.map(r => r.route), ts: Date.now() })
    process.exit(1)
  }

  console.log(`\n✓ All ${results.length} checks passed`)
  if (wasDown) {
    await sendTelegram(`✅ <b>Psicoprotego — sitio recuperado</b>\n\nTodos los checks OK\nURL: ${BASE_URL}`)
  }
  saveState({ down: false, ts: Date.now() })
}

main().catch(e => { console.error(e); process.exit(1) })
