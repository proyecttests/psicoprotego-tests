/**
 * @file components/common/TestGrid.tsx
 * @description Grid de tarjetas de test. Usado en home, categoría y tag pages.
 * Server Component — sin 'use client'.
 */

import Link from 'next/link'
import type { TestCard } from '@/utils/discoverTests'

interface TestGridProps {
  tests: TestCard[]
  lang: string
  ui: {
    validated: string
    questions: string
    startBtn: string
    empty: string
  }
}

export default function TestGrid({ tests, lang, ui }: TestGridProps) {
  if (tests.length === 0) {
    return <p className="text-center text-primary-500 py-12">{ui.empty}</p>
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {tests.map((test) => (
        <li key={test.testId}>
          <Link
            href={`/${lang}/test/${test.testId}`}
            className="group flex h-full flex-col rounded-2xl border border-primary-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-primary-400"
          >
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary-100 px-3 py-0.5 text-xs font-medium text-primary-700">
                {test.duration}
              </span>
              <span className="rounded-full bg-primary-100 px-3 py-0.5 text-xs font-medium text-primary-700">
                {test.itemCount} {ui.questions}
              </span>
              {test.validated && (
                <span className="rounded-full bg-accent-100 px-3 py-0.5 text-xs font-semibold text-accent-700">
                  {ui.validated}
                </span>
              )}
            </div>

            <h2 className="mb-2 font-serif text-lg font-bold text-primary-800 group-hover:text-primary-600">
              {test.name}
            </h2>

            <p className="flex-1 text-sm text-primary-600 leading-relaxed">
              {test.hook}
            </p>

            <span className="mt-5 inline-block self-start rounded-full bg-primary-800 px-5 py-2 text-sm font-semibold text-white transition group-hover:bg-primary-700">
              {ui.startBtn}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
