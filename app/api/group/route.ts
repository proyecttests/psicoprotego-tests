/**
 * POST /api/group — Create a new group session
 * Body: { testId: string, lang: string }
 * Returns: { code: string }
 *
 * GET /api/group?code=ABC-1234 — Get group session
 * Returns: GroupSession
 *
 * Uses Upstash Redis REST API (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN env vars).
 * Add Upstash from Vercel Marketplace → Storage → Create Database → connect to project.
 */
import { NextRequest, NextResponse } from 'next/server'

const TTL = 60 * 60 * 24  // 24h in seconds
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export interface GroupSession {
  testId: string
  lang: string
  code: string
  createdAt: string
  participants: Array<{ name: string; token: string; joinedAt: string }>
}

// ── Upstash REST helpers ──────────────────────────────────────────────────────

async function upstash(cmd: unknown[]): Promise<unknown> {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('Upstash not configured')
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  })
  const data = await res.json() as { result: unknown; error?: string }
  if (data.error) throw new Error(data.error)
  return data.result
}

async function kvGet(key: string): Promise<unknown> {
  const raw = await upstash(['GET', key]) as string | null
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return raw }
}

async function kvSet(key: string, value: unknown, exSeconds: number): Promise<void> {
  await upstash(['SET', key, JSON.stringify(value), 'EX', exSeconds])
}

async function kvExists(key: string): Promise<boolean> {
  const result = await upstash(['EXISTS', key]) as number
  return result === 1
}

// ── Code generator ────────────────────────────────────────────────────────────

function generateCode(testId: string): string {
  const prefix = testId.slice(0, 3).toUpperCase()
  let suffix = ''
  for (let i = 0; i < 4; i++) suffix += CHARS[Math.floor(Math.random() * CHARS.length)]
  return `${prefix}-${suffix}`
}

// ── Handlers ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { testId, lang } = await req.json() as { testId?: string; lang?: string }
    if (!testId || !lang) {
      return NextResponse.json({ error: 'testId and lang required' }, { status: 400 })
    }

    let code = generateCode(testId)
    for (let i = 0; i < 5; i++) {
      if (!(await kvExists(`group:${code}`))) break
      code = generateCode(testId)
    }

    const session: GroupSession = {
      testId, lang, code,
      createdAt: new Date().toISOString(),
      participants: [],
    }
    await kvSet(`group:${code}`, session, TTL)
    return NextResponse.json({ code })
  } catch (err) {
    console.error('[group/create]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase()
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 })
  try {
    const session = await kvGet(`group:${code}`) as GroupSession | null
    if (!session) return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 })
    return NextResponse.json(session)
  } catch (err) {
    console.error('[group/get]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
