/**
 * POST /api/group/join
 * Body: { code: string, name?: string, token: string }
 * Returns: { ok: true, participantCount: number }
 */
import { NextRequest, NextResponse } from 'next/server'
import type { GroupSession } from '../route'

const TTL = 60 * 60 * 24

async function kvGet(key: string): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('Upstash not configured')
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json() as { result: string | null }
  if (!data.result) return null
  try { return JSON.parse(data.result) } catch { return data.result }
}

async function kvSet(key: string, value: unknown, exSeconds: number): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('Upstash not configured')
  await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([JSON.stringify(value), 'EX', exSeconds]),
  })
}

export async function POST(req: NextRequest) {
  try {
    const { code, name, token } = await req.json() as {
      code?: string; name?: string; token?: string
    }
    if (!code || !token) {
      return NextResponse.json({ error: 'code and token required' }, { status: 400 })
    }

    const key = `group:${code.toUpperCase()}`
    const session = await kvGet(key) as GroupSession | null
    if (!session) {
      return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 })
    }

    // Deduplicate
    if (session.participants.some((p) => p.token === token)) {
      return NextResponse.json({ ok: true, participantCount: session.participants.length })
    }

    const updated: GroupSession = {
      ...session,
      participants: [
        ...session.participants,
        { name: name?.trim() ?? '', token, joinedAt: new Date().toISOString() },
      ],
    }
    await kvSet(key, updated, TTL)
    return NextResponse.json({ ok: true, participantCount: updated.participants.length })
  } catch (err) {
    console.error('[group/join]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
