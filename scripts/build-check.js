#!/usr/bin/env node
/**
 * scripts/build-check.js
 *
 * Runs `npm run build` and reports the result.
 * Sends a Telegram notification on failure (or on recovery after failure).
 *
 * Usage:
 *   node scripts/build-check.js
 *
 * Env vars:
 *   TELEGRAM_BOT_TOKEN   — bot token
 *   TELEGRAM_CHAT_ID     — chat ID
 *   BUILD_STATE_FILE     — path to persist last-known build state (default: /tmp/psico-build-state.json)
 */

'use strict'

const { execSync } = require('child_process')
const https        = require('https')
const fs           = require('fs')
const path         = require('path')

const BOT_TOKEN  = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID    = process.env.TELEGRAM_CHAT_ID
const STATE_FILE = process.env.BUILD_STATE_FILE ?? '/tmp/psico-build-state.json'
const ROOT       = path.join(__dirname, '..')

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

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8')) } catch { return {} }
}
function saveState(s) {
  try { fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2)) } catch {}
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nBuild check  [${new Date().toISOString()}]\n`)

  const state    = loadState()
  const wasFail  = state.failed === true

  let output = ''
  let ok     = false

  try {
    output = execSync('npm run build 2>&1', { cwd: ROOT, encoding: 'utf-8', timeout: 300_000 })
    ok = true
    console.log(output.slice(-1500))   // print last 1500 chars
    console.log('\n✓ Build passed')
  } catch (e) {
    output = e.stdout ?? e.message ?? ''
    console.error(output.slice(-2000))
    console.error('\n✗ Build failed')
  }

  if (!ok) {
    const snippet = output.slice(-800).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    if (!wasFail) {
      await sendTelegram(
        `🔴 <b>Psicoprotego — build fallido</b>\n\n<pre>${snippet}</pre>`
      )
    }
    saveState({ failed: true, ts: Date.now() })
    process.exit(1)
  }

  if (wasFail) {
    await sendTelegram('✅ <b>Psicoprotego — build recuperado</b>\n\nBuild pasó sin errores.')
  }
  saveState({ failed: false, ts: Date.now() })
}

main().catch(e => { console.error(e); process.exit(1) })
