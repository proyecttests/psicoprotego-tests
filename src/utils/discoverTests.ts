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

/**
 * Reads /public/data/tests/ and returns all tests with their available langs.
 */
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

/**
 * Returns the de-duplicated list of all langs across all tests.
 */
export async function discoverLangs(): Promise<string[]> {
  const tests = await discoverTests()
  const langSet = new Set<string>()
  for (const { langs } of tests) {
    for (const lang of langs) langSet.add(lang)
  }
  return [...langSet]
}

// ── Categories & Tags ─────────────────────────────────────────────────────────

/**
 * Returns all unique topicCategory values across all tests.
 */
export async function discoverCategories(): Promise<string[]> {
  let entries: string[]
  try {
    entries = await fs.readdir(TESTS_DIR)
  } catch {
    return []
  }

  const cats = new Set<string>()

  for (const testId of entries) {
    try {
      const metaRaw = await fs
        .readFile(path.join(TESTS_DIR, testId, 'metadata.json'), 'utf-8')
        .catch(() => null)
      if (!metaRaw) continue
      const meta = JSON.parse(metaRaw) as TestMetadata
      if (meta.topicCategory) cats.add(meta.topicCategory)
    } catch { /* skip */ }
  }

  return [...cats]
}

/**
 * Returns all unique tag values across all tests.
 */
export async function discoverTags(): Promise<string[]> {
  let entries: string[]
  try {
    entries = await fs.readdir(TESTS_DIR)
  } catch {
    return []
  }

  const tagSet = new Set<string>()

  for (const testId of entries) {
    try {
      const metaRaw = await fs
        .readFile(path.join(TESTS_DIR, testId, 'metadata.json'), 'utf-8')
        .catch(() => null)
      if (!metaRaw) continue
      const meta = JSON.parse(metaRaw) as TestMetadata
      for (const tag of meta.tags ?? []) tagSet.add(tag)
    } catch { /* skip */ }
  }

  return [...tagSet]
}

// ── TestCards ─────────────────────────────────────────────────────────────────

/**
 * Loads all tests as TestCard objects for a given lang.
 * Optionally filters by topicCategory or tag.
 */
export async function loadTestCards(
  lang: string,
  filter?: { topicCategory?: string; tag?: string },
): Promise<TestCard[]> {
  let entries: string[]
  try {
    entries = await fs.readdir(TESTS_DIR)
  } catch {
    return []
  }

  const cards: TestCard[] = []

  for (const testId of entries) {
    try {
      const metaRaw = await fs
        .readFile(path.join(TESTS_DIR, testId, 'metadata.json'), 'utf-8')
        .catch(() => null)
      if (!metaRaw) continue

      const meta = JSON.parse(metaRaw) as TestMetadata
      if (!meta.availableLangs.includes(lang)) continue

      // Apply filters
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
    } catch {
      // skip broken entries
    }
  }

  return cards
}
