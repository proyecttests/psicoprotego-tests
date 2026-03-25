/**
 * @file utils/discoverTests.ts
 * @description Auto-discovers tests, langs, categories and tags from /public/data/tests/ at build time.
 *
 * Adding a new test or language only requires dropping JSON files — zero code changes.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import type { TestMetadata, TestLangFile } from '@/types/test'

export interface TestEntry {
  testId: string
  langs: string[]
}

export interface TestCard {
  testId: string
  name: string
  hook: string
  duration: string
  itemCount: number
  validated: boolean
  topicCategory: string
  tags: string[]
}

const TESTS_DIR = path.join(process.cwd(), 'public', 'data', 'tests')

// ── Core discovery ────────────────────────────────────────────────────────────

export async function discoverTests(): Promise<TestEntry[]> {
  let entries: string[]
  try {
    entries = await fs.readdir(TESTS_DIR)
  } catch {
    return []
  }

  const results: TestEntry[] = []

  for (const testId of entries) {
    try {
      const metaRaw = await fs
        .readFile(path.join(TESTS_DIR, testId, 'metadata.json'), 'utf-8')
        .catch(() => null)
      if (!metaRaw) continue

      const meta = JSON.parse(metaRaw) as TestMetadata
      if (Array.isArray(meta.availableLangs) && meta.availableLangs.length > 0) {
        results.push({ testId, langs: meta.availableLangs })
      }
    } catch {
      // skip broken entries
    }
  }

  return results
}

export async function discoverLangs(): Promise<string[]> {
  const tests = await discoverTests()
  const langSet = new Set<string>()
  for (const { langs } of tests) {
    for (const lang of langs) langSet.add(lang)
  }
  return [...langSet]
}

// ── Categories & Tags ─────────────────────────────────────────────────────────

/** Returns all unique topicCategory values across all tests. */
export async function discoverCategories(): Promise<string[]> {
  const cats = new Set<string>()
  const entries = await safeReaddir(TESTS_DIR)
  for (const testId of entries) {
    const meta = await readMeta(testId)
    if (meta?.topicCategory) cats.add(meta.topicCategory)
  }
  return [...cats]
}

/** Returns all unique tag values across all tests. */
export async function discoverTags(): Promise<string[]> {
  const tagSet = new Set<string>()
  const entries = await safeReaddir(TESTS_DIR)
  for (const testId of entries) {
    const meta = await readMeta(testId)
    for (const tag of meta?.tags ?? []) tagSet.add(tag)
  }
  return [...tagSet]
}

/**
 * Returns only valid (lang, categoria) pairs — combinations where at least one test exists.
 * Prevents generating empty category pages at build time.
 */
export async function discoverCategoryParams(): Promise<{ lang: string; categoria: string }[]> {
  const entries = await safeReaddir(TESTS_DIR)
  const pairs = new Map<string, Set<string>>() // categoria → Set<lang>

  for (const testId of entries) {
    const meta = await readMeta(testId)
    if (!meta?.topicCategory) continue
    for (const lang of meta.availableLangs) {
      if (!pairs.has(meta.topicCategory)) pairs.set(meta.topicCategory, new Set())
      pairs.get(meta.topicCategory)!.add(lang)
    }
  }

  const result: { lang: string; categoria: string }[] = []
  for (const [categoria, langs] of pairs) {
    for (const lang of langs) result.push({ lang, categoria })
  }
  return result
}

/**
 * Returns only valid (lang, tag) pairs — combinations where at least one test exists.
 */
export async function discoverTagParams(): Promise<{ lang: string; tag: string }[]> {
  const entries = await safeReaddir(TESTS_DIR)
  const pairs = new Map<string, Set<string>>() // tag → Set<lang>

  for (const testId of entries) {
    const meta = await readMeta(testId)
    if (!meta?.tags?.length) continue
    for (const tag of meta.tags) {
      for (const lang of meta.availableLangs) {
        if (!pairs.has(tag)) pairs.set(tag, new Set())
        pairs.get(tag)!.add(lang)
      }
    }
  }

  const result: { lang: string; tag: string }[] = []
  for (const [tag, langs] of pairs) {
    for (const lang of langs) result.push({ lang, tag })
  }
  return result
}

// ── TestCards ─────────────────────────────────────────────────────────────────

export async function loadTestCards(
  lang: string,
  filter?: { topicCategory?: string; tag?: string },
): Promise<TestCard[]> {
  const entries = await safeReaddir(TESTS_DIR)
  const cards: TestCard[] = []

  for (const testId of entries) {
    try {
      const meta = await readMeta(testId)
      if (!meta) continue
      if (!meta.availableLangs.includes(lang)) continue
      if (filter?.topicCategory && meta.topicCategory !== filter.topicCategory) continue
      if (filter?.tag && !(meta.tags ?? []).includes(filter.tag)) continue

      const langRaw =
        await fs.readFile(path.join(TESTS_DIR, testId, `${lang}.json`), 'utf-8').catch(() => null) ??
        await fs.readFile(path.join(TESTS_DIR, testId, 'es.json'), 'utf-8').catch(() => null)
      if (!langRaw) continue

      const langData = JSON.parse(langRaw) as TestLangFile

      cards.push({
        testId,
        name:          langData.name,
        hook:          langData.landing.hook,
        duration:      meta.timeToComplete,
        itemCount:     meta.itemCount,
        validated:     meta.validated,
        topicCategory: meta.topicCategory ?? '',
        tags:          meta.tags ?? [],
      })
    } catch { /* skip */ }
  }

  return cards
}

// ── Internal helpers ──────────────────────────────────────────────────────────

async function safeReaddir(dir: string): Promise<string[]> {
  try { return await fs.readdir(dir) } catch { return [] }
}

async function readMeta(testId: string): Promise<TestMetadata | null> {
  try {
    const raw = await fs
      .readFile(path.join(TESTS_DIR, testId, 'metadata.json'), 'utf-8')
      .catch(() => null)
    if (!raw) return null
    return JSON.parse(raw) as TestMetadata
  } catch {
    return null
  }
}
