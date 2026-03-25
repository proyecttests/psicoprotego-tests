/**
 * @file components/results/RelatedTests.tsx
 * @description Muestra 1-2 tests relacionados tras completar uno.
 * Filtra por topicCategory o tags compartidos. Lee /data/tests-index.json.
 */
'use client'

import React from 'react'
import Link from 'next/link'

interface TestIndexEntry {
  testId:        string
  category:      string
  topicCategory: string | null
  tags:          string[]
  availableLangs: string[]
  validated:     boolean
  timeToComplete: string | null
  itemCount:     number | null
  names:         Record<string, string>
  hooks:         Record<string, string>
}

const UI: Record<string, { title: string; cta: string; ctaQuiz: string; validated: string }> = {
  es: { title: 'También podría interesarte', cta: 'Hacer el test →', ctaQuiz: 'Hacer el quiz →', validated: 'Validado clínicamente' },
  en: { title: 'You might also like',        cta: 'Take the test →', ctaQuiz: 'Take the quiz →', validated: 'Clinically validated'  },
  pt: { title: 'Você também pode gostar',    cta: 'Fazer o teste →', ctaQuiz: 'Fazer o quiz →',  validated: 'Validado clinicamente' },
}

function score(entry: TestIndexEntry, currentCategory: string | null, currentTags: string[]): number {
  let s = 0
  if (currentCategory && entry.topicCategory === currentCategory) s += 3
  const shared = entry.tags.filter(t => currentTags.includes(t)).length
  s += shared
  return s
}

interface RelatedTestsProps {
  lang:            string
  currentTestId:   string
  currentCategory: string | null
  currentTags:     string[]
}

const RelatedTests: React.FC<RelatedTestsProps> = ({
  lang, currentTestId, currentCategory, currentTags,
}) => {
  const [related, setRelated] = React.useState<TestIndexEntry[]>([])
  const ui = UI[lang] ?? UI['es']

  React.useEffect(() => {
    fetch('/data/tests-index.json')
      .then(r => r.json())
      .then((index: TestIndexEntry[]) => {
        const candidates = index
          .filter(e => e.testId !== currentTestId && e.availableLangs.includes(lang))
          .map(e    => ({ entry: e, s: score(e, currentCategory, currentTags) }))
          .filter(({ s }) => s > 0)
          .sort((a, b) => b.s - a.s)
          .slice(0, 2)
          .map(({ entry }) => entry)
        setRelated(candidates)
      })
      .catch(() => {/* silent */})
  }, [currentTestId, lang, currentCategory, currentTags])

  if (related.length === 0) return null

  return (
    <div className="w-full max-w-2xl space-y-3 px-4">
      <h3
        className="text-sm font-semibold uppercase tracking-wider font-sans"
        style={{ color: 'var(--color-primary)', opacity: 0.6 }}
      >
        {ui.title}
      </h3>
      {related.map(entry => {
        const name = entry.names[lang] ?? entry.names['es'] ?? entry.testId
        return (
          <Link
            key={entry.testId}
            href={`/${lang}/test/${entry.testId}`}
            className="flex items-center justify-between rounded-xl px-4 py-3 transition hover:opacity-80"
            style={{ backgroundColor: '#f5f3ef', border: '1px solid #e5e0d8' }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-primary)' }}>
                {name}
              </p>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                {entry.validated ? ui.validated : ''}{entry.timeToComplete ? ` · ${entry.timeToComplete}` : ''}
              </p>
            </div>
            <span className="text-xs font-medium ml-3 shrink-0" style={{ color: 'var(--color-accent)' }}>
              {entry.category === 'quiz' ? ui.ctaQuiz : ui.cta}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export default RelatedTests
