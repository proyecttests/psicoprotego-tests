/**
 * @file utils/siteConfig.ts
 * @description Reads /public/data/site.config.json for global settings.
 * Edit that JSON to change behavior — no code changes needed.
 */

import fs from 'node:fs/promises'
import path from 'node:path'

interface SiteConfig {
  indexing: Record<string, boolean>
}

let _cache: SiteConfig | null = null

export async function getSiteConfig(): Promise<SiteConfig> {
  if (_cache) return _cache
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), 'public', 'data', 'site.config.json'),
      'utf-8',
    )
    _cache = JSON.parse(raw) as SiteConfig
    return _cache
  } catch {
    return { indexing: {} }
  }
}

/** Returns Next.js robots metadata for a given page type key. */
export async function getRobots(pageType: string) {
  const cfg = await getSiteConfig()
  const shouldIndex = cfg.indexing[pageType] ?? true
  return { index: shouldIndex, follow: true }
}
