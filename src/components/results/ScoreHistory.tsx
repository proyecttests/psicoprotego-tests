/**
 * @file components/results/ScoreHistory.tsx
 * @description Muestra la comparación con el resultado anterior del mismo test.
 * Lee de localStorage `psico_history_${testId}`. Solo visible si hay 2+ entradas.
 */
'use client'

import React from 'react'

const HISTORY_KEY = (testId: string) => `psico_history_${testId}`

interface HistoryEntry {
  score: number
  categoryLabel: string
  date: string
}

const AGO: Record<string, (n: number, unit: string) => string> = {
  es: (n, u) => `hace ${n} ${u}`,
  en: (n, u) => `${n} ${u} ago`,
  pt: (n, u) => `há ${n} ${u}`,
}

const UNITS: Record<string, { day: string; week: string; month: string }> = {
  es: { day: 'días',    week: 'semanas', month: 'meses'   },
  en: { day: 'days',   week: 'weeks',   month: 'months'  },
  pt: { day: 'dias',   week: 'semanas', month: 'meses'   },
}

const UI: Record<string, { label: string; better: string; worse: string; same: string }> = {
  es: { label: 'Resultado anterior', better: 'Has mejorado', worse: 'Ha subido la puntuación', same: 'Sin cambios' },
  en: { label: 'Previous result',    better: "You've improved", worse: 'Score went up', same: 'No change' },
  pt: { label: 'Resultado anterior', better: 'Você melhorou', worse: 'A pontuação subiu', same: 'Sem mudanças' },
}

function timeAgo(dateStr: string, lang: string): string {
  const units = UNITS[lang] ?? UNITS['es']
  const ago   = AGO[lang]   ?? AGO['es']
  const diff  = Date.now() - new Date(dateStr).getTime()
  const days  = Math.round(diff / 86400000)
  if (days < 7)  return ago(days || 1, units.day)
  if (days < 30) return ago(Math.round(days / 7), units.week)
  return ago(Math.round(days / 30), units.month)
}

interface ScoreHistoryProps {
  testId:       string
  currentScore: number
  lang:         string
}

const ScoreHistory: React.FC<ScoreHistoryProps> = ({ testId, currentScore, lang }) => {
  const [prev, setPrev] = React.useState<HistoryEntry | null>(null)
  const ui = UI[lang] ?? UI['es']

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY(testId))
      if (!raw) return
      const history: HistoryEntry[] = JSON.parse(raw)
      // history[0] is current (just saved), history[1] is previous
      if (history.length >= 2) setPrev(history[1])
    } catch { /* ignore */ }
  }, [testId])

  if (!prev) return null

  const delta    = currentScore - prev.score
  const improved = delta < 0  // lower score = better in anxiety/depression scales
  const worsened = delta > 0
  const neutral  = delta === 0

  const sentiment = improved ? ui.better : worsened ? ui.worse : ui.same
  const arrow     = improved ? '↓' : worsened ? '↑' : '→'
  const color     = improved ? '#16a34a' : worsened ? '#b45309' : '#6b7280'

  return (
    <div
      className="rounded-xl px-4 py-3 flex items-center gap-4"
      style={{ backgroundColor: '#f5f3ef', border: '1px solid #e5e0d8' }}
    >
      <div className="text-2xl font-bold" style={{ color }} aria-hidden="true">
        {arrow}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-sans">{ui.label} · {timeAgo(prev.date, lang)}</p>
        <p className="text-sm font-semibold" style={{ color }}>
          {sentiment} — {prev.score} → {currentScore} pts
        </p>
      </div>
    </div>
  )
}

export default ScoreHistory
