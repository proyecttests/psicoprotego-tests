/**
 * @file utils/discoverTests.ts
 * @description Auto-discovers tests and langs from /public/data/tests/ at build time.
 *
 * Usage in generateStaticParams():
 *   const tests = await discoverTests()
 *   return tests.flatMap(({ testId, langs }) => langs.map((lang) => ({ lang, testId })))
 *
 * This removes all hardcoded TESTS/LANGS arrays — adding a new test or language
 * only requires dropping JSON files in the correct directory.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import type { TestMetadata } from '@/types/test'

export interface TestEntry {
  testId: string
  langs: string[]
}

const TESTS_DIR = path.join(process.cwd(), 'public', 'data', 'tests')

/**
 * Reads /public/data/tests/ and returns all tests with their available langs.
 * Relies on each test's metadata.json `availableLangs` field.
 * Silently skips entries without metadata.json.
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
 * Used in generateStaticParams() for /[lang] routes.
 */
export async function discoverLangs(): Promise<string[]> {
  const tests = await discoverTests()
  const langSet = new Set<string>()
  for (const { langs } of tests) {
    for (const lang of langs) langSet.add(lang)
  }
  return [...langSet]
}
