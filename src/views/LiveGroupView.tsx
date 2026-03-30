/**
 * @file views/LiveGroupView.tsx
 * @description Live group session view. Polls /api/group?code=X every 5s
 * and decodes each participant's answers to show category distribution.
 * Only used for quiz-type sessions.
 */
'use client'

import React from 'react'
import { decodeAnswersWithKeys } from '@/utils/shareEncoding'
import { getScoringFunction } from '@/utils/scoringFunctions'
import type { TestLangFile } from '@/types/test'
import type { ScoringResult } from '@/utils/scoringFunctions'
export interface GroupSession {
  testId: string
  lang: string
  code: string
  createdAt: string
  participants: Array<{ name: string; token: string; joinedAt: string }>
}

// ── UI ────────────────────────────────────────────────────────────────────────

const UI: Record<string, {
  title: string; loading: string; notFound: string; noParticipants: string
  distribution: string; individual: string; anonymous: string
  score: string; result: string; waiting: string; expires: string
  liveLabel: string; code: string
}> = {
  es: {
    title:          'Resultados del grupo',
    loading:        'Cargando sesión…',
    notFound:       'Sesión no encontrada o expirada',
    noParticipants: 'Esperando participantes…',
    distribution:   'Distribución del grupo',
    individual:     'Resultados individuales',
    anonymous:      'Anónimo',
    score:          'Puntuación',
    result:         'Resultado',
    waiting:        'Actualizando en tiempo real',
    expires:        'Sesión expira en 24h',
    liveLabel:      'EN VIVO',
    code:           'Código',
  },
  en: {
    title:          'Group results',
    loading:        'Loading session…',
    notFound:       'Session not found or expired',
    noParticipants: 'Waiting for participants…',
    distribution:   'Group distribution',
    individual:     'Individual results',
    anonymous:      'Anonymous',
    score:          'Score',
    result:         'Result',
    waiting:        'Updating in real time',
    expires:        'Session expires in 24h',
    liveLabel:      'LIVE',
    code:           'Code',
  },
  pt: {
    title:          'Resultados do grupo',
    loading:        'Carregando sessão…',
    notFound:       'Sessão não encontrada ou expirada',
    noParticipants: 'Aguardando participantes…',
    distribution:   'Distribuição do grupo',
    individual:     'Resultados individuais',
    anonymous:      'Anônimo',
    score:          'Pontuação',
    result:         'Resultado',
    waiting:        'Atualizando em tempo real',
    expires:        'Sessão expira em 24h',
    liveLabel:      'AO VIVO',
    code:           'Código',
  },
}

const BAR_COLORS: Record<string, string> = {
  green:  'var(--color-primary)',
  yellow: 'var(--color-accent)',
  orange: '#c47a3a',
  red:    '#8b3a3a',
}

const COLOR_CLASSES: Record<string, string> = {
  green:  'bg-primary-100 text-primary-800 border-primary-300',
  yellow: 'bg-accent-100 text-accent-800 border-accent-300',
  orange: 'bg-orange-100 text-orange-800 border-orange-300',
  red:    'bg-red-100 text-red-800 border-red-300',
}

interface DecodedParticipant {
  name: string
  result: ScoringResult | null
  joinedAt: string
}

interface LiveGroupViewProps {
  lang: string
  testId: string
  code: string
}

export default function LiveGroupView({ lang, testId, code }: LiveGroupViewProps) {
  const ui = UI[lang] ?? UI['es']

  const [session,      setSession]      = React.useState<GroupSession | null>(null)
  const [testData,     setTestData]     = React.useState<TestLangFile | null>(null)
  const [decoded,      setDecoded]      = React.useState<DecodedParticipant[]>([])
  const [status,       setStatus]       = React.useState<'loading' | 'ok' | 'not_found'>('loading')
  const [lastUpdated,  setLastUpdated]  = React.useState<Date | null>(null)

  // Load test lang file
  React.useEffect(() => {
    fetch(`/data/tests/${testId}/${lang}.json`)
      .then((r) => r.json())
      .then((d: TestLangFile) => setTestData(d))
      .catch(() => {
        fetch(`/data/tests/${testId}/es.json`)
          .then((r) => r.json())
          .then((d: TestLangFile) => setTestData(d))
          .catch(() => {})
      })
  }, [testId, lang])

  // Poll group session
  const fetchSession = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/group?code=${code}`)
      if (res.status === 404) { setStatus('not_found'); return }
      if (!res.ok) return
      const data = await res.json() as GroupSession
      setSession(data)
      setStatus('ok')
      setLastUpdated(new Date())
    } catch { /* silent — will retry */ }
  }, [code])

  React.useEffect(() => {
    fetchSession()
    const interval = setInterval(fetchSession, 5000)
    return () => clearInterval(interval)
  }, [fetchSession])

  // Decode participants when session or testData changes
  React.useEffect(() => {
    if (!session || !testData) return
    const questionIds = testData.questions.map((q) => q.id)
    const scoreFn = getScoringFunction(testData.scoringFunction)
    const results: DecodedParticipant[] = session.participants.map((p) => {
      try {
        const answers = decodeAnswersWithKeys(p.token, questionIds)
        if (!answers) return { name: p.name, result: null, joinedAt: p.joinedAt }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = scoreFn(testData as any, answers)
        return { name: p.name, result, joinedAt: p.joinedAt }
      } catch {
        return { name: p.name, result: null, joinedAt: p.joinedAt }
      }
    })
    setDecoded(results)
  }, [session, testData])

  // Distribution
  const categoryMap: Record<string, { label: string; color: string; count: number }> = {}
  for (const p of decoded) {
    const cat = p.result?.category
    if (!cat) continue
    const key = cat.color ?? 'green'
    if (!categoryMap[key]) categoryMap[key] = { label: cat.label, color: key, count: 0 }
    categoryMap[key].count++
  }
  const categories = Object.values(categoryMap).sort((a, b) => b.count - a.count)
  const total = decoded.filter((p) => p.result).length

  // ── Render ──────────────────────────────────────────────────────────────────

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
        <p className="text-sm text-gray-500">{ui.loading}</p>
      </div>
    )
  }

  if (status === 'not_found') {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
        <p className="text-sm text-gray-500">{ui.notFound}</p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--color-cream)' }} className="min-h-screen py-10">
      <div className="mx-auto max-w-2xl px-4">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                {ui.liveLabel}
              </span>
              <span className="text-xs text-gray-400">{ui.code}: <span className="font-mono font-bold">{code}</span></span>
            </div>
            <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {ui.title}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {session?.testId.toUpperCase()} · {ui.waiting}
              {lastUpdated && ` · ${lastUpdated.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
            </p>
          </div>
          <div className="text-right text-3xl font-bold tabular-nums" style={{ color: 'var(--color-primary)' }}>
            {decoded.length}
            <p className="text-xs font-normal text-gray-400">participants</p>
          </div>
        </div>

        {/* Distribution chart */}
        {categories.length > 0 && (
          <div className="rounded-xl border bg-white p-5 mb-5" style={{ borderColor: 'var(--color-lightGray)' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
              {ui.distribution} <span className="font-normal text-gray-500">({total})</span>
            </h2>
            <div className="flex flex-col gap-4">
              {categories.map((cat) => (
                <div key={cat.color}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium" style={{ color: BAR_COLORS[cat.color] ?? '#555' }}>
                      {cat.label}
                    </span>
                    <span className="text-gray-500 font-mono">
                      {cat.count}/{total} · {Math.round((cat.count / total) * 100)}%
                    </span>
                  </div>
                  <div className="h-4 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(cat.count / total) * 100}%`, backgroundColor: BAR_COLORS[cat.color] ?? 'var(--color-primary)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Individual results */}
        {decoded.length > 0 ? (
          <div className="rounded-xl border bg-white overflow-hidden mb-5" style={{ borderColor: 'var(--color-lightGray)' }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--color-lightGray)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{ui.individual}</h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-lightGray)' }}>
              {decoded.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: BAR_COLORS[p.result?.category?.color ?? 'green'] ?? 'var(--color-primary)' }}>
                    {(p.name || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                      {p.name || ui.anonymous}
                    </p>
                    {p.result?.category && (
                      <div className="flex items-center gap-2 mt-0.5">
                        {p.result.score !== null && (
                          <span className="text-xs text-gray-400">{p.result.score}pts</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${COLOR_CLASSES[p.result.category.color ?? 'green'] ?? ''}`}>
                          {p.result.category.label}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-300 shrink-0">
                    {new Date(p.joinedAt).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border bg-white p-8 text-center mb-5" style={{ borderColor: 'var(--color-lightGray)' }}>
            <p className="text-sm text-gray-400">{ui.noParticipants}</p>
            <p className="text-xs text-gray-300 mt-1">{ui.expires}</p>
          </div>
        )}

      </div>
    </div>
  )
}
