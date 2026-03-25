/**
 * GET /r/[slug]
 * Redirects to the original URL stored for this slug.
 */
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_FILE = join(process.cwd(), 'data', 'short_urls.json')

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  try {
    if (!existsSync(DATA_FILE)) return NextResponse.json({ error: 'not found' }, { status: 404 })
    const map = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Record<string, string>
    const url = map[slug]
    if (!url) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.redirect(url, 301)
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
