/**
 * POST /api/shorten
 * Body: { url: string }
 * Returns: { slug: string }
 *
 * Stores slug→url mapping in /data/short_urls.json (persists on self-hosted).
 * No personal data stored — only the original URL (contains only encoded answers).
 */
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_DIR  = join(process.cwd(), 'data')
const DATA_FILE = join(DATA_DIR, 'short_urls.json')
const SLUG_LEN  = 6
const CHARS     = 'abcdefghjkmnpqrstuvwxyz23456789'  // unambiguous chars

function loadMap(): Record<string, string> {
  try {
    if (!existsSync(DATA_FILE)) return {}
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Record<string, string>
  } catch {
    return {}
  }
}

function saveMap(map: Record<string, string>): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(DATA_FILE, JSON.stringify(map), 'utf-8')
}

function randomSlug(): string {
  let s = ''
  for (let i = 0; i < SLUG_LEN; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)]
  return s
}

export async function POST(req: NextRequest) {
  const { url } = (await req.json()) as { url?: string }
  if (!url || typeof url !== 'string' || url.length > 4096) {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 })
  }

  const map = loadMap()

  // Check if this exact URL already has a slug (dedup)
  const existing = Object.entries(map).find(([, v]) => v === url)
  if (existing) {
    return NextResponse.json({ slug: existing[0] })
  }

  // Generate unique slug
  let slug = randomSlug()
  let tries = 0
  while (map[slug] && tries < 20) { slug = randomSlug(); tries++ }

  map[slug] = url
  saveMap(map)

  return NextResponse.json({ slug })
}
