/**
 * @file views/GroupResultsView.tsx
 * @description Vista de resultados grupales.
 *
 * Flujo:
 * 1. Carga el JSON del test para obtener las preguntas + scoring
 * 2. Usuario pega URLs de resultado (una por línea) y un nombre opcional
 * 3. Decodifica cada URL con decodeAnswersWithKeys
 * 4. Re-calcula el resultado de cada participante
 * 5. Muestra: distribución de categorías + tabla individual
 */
'use client'

import React from 'react'
import { decodeAnswersWithKeys } from '@/utils/shareEncoding'
import { getScoringFunction } from '@/utils/scoringFunctions'
import type { TestLangFile } from '@/types/test'
import type { ScoringResult } from '@/utils/scoringFunctions'

// ── UI strings ────────────────────────────────────────────────────────────────
const UI: Record<string, {
  title: string; subtitle: string; addEntry: string; namePlaceholder: string
  urlPlaceholder: string; urlHint: string; addBtn: string; removeBtn: string
  resultsTitle: string; distributionTitle: string; disclaimer: string
  errorInvalid: string; errorWrongTest: string; noResults: string
  nameLabel: string; resultLabel: string; scoreLabel: string; anonymous: string
}> = {
  es: {
    title:            'Resultados grupales',
    subtitle:         'Combina los resultados compartidos por cada participante y obtén una vista agregada del grupo.',
    addEntry:         'Añadir participante',
    namePlaceholder:  'Nombre (opcional)',
    urlPlaceholder:   'Pegar URL de resultado…',
    urlHint:          'Pide a cada participante que comparta su URL de resultado',
    addBtn:           'Añadir',
    removeBtn:        'Quitar',
    resultsTitle:     'Resultados individuales',
    distributionTitle:'Distribución del grupo',
    disclaimer:       'Esta herramienta combina resultados de forma local en tu navegador. Ningún dato se envía a ningún servidor. Los resultados tienen carácter exclusivamente informativo y no constituyen un diagnóstico clínico. El uso de esta herramienta con grupos requiere el consentimiento informado de todos los participantes.',
    errorInvalid:     'URL no válida o formato no reconocido',
    errorWrongTest:   'Esta URL es de un test diferente',
    noResults:        'Añade al menos una URL para ver resultados',
    nameLabel:        'Nombre',
    resultLabel:      'Resultado',
    scoreLabel:       'Puntuación',
    anonymous:        'Anónimo',
  },
  en: {
    title:            'Group results',
    subtitle:         'Combine results shared by each participant and get an aggregated group view.',
    addEntry:         'Add participant',
    namePlaceholder:  'Name (optional)',
    urlPlaceholder:   'Paste result URL…',
    urlHint:          'Ask each participant to share their result URL',
    addBtn:           'Add',
    removeBtn:        'Remove',
    resultsTitle:     'Individual results',
    distributionTitle:'Group distribution',
    disclaimer:       'This tool combines results locally in your browser. No data is sent to any server. Results are for informational purposes only and do not constitute a clinical diagnosis. Using this tool with groups requires the informed consent of all participants.',
    errorInvalid:     'Invalid URL or unrecognized format',
    errorWrongTest:   'This URL is from a different test',
    noResults:        'Add at least one URL to see results',
    nameLabel:        'Name',
    resultLabel:      'Result',
    scoreLabel:       'Score',
    anonymous:        'Anonymous',
  },
  pt: {
    title:            'Resultados do grupo',
    subtitle:         'Combine os resultados compartilhados por cada participante e obtenha uma visão agregada do grupo.',
    addEntry:         'Adicionar participante',
    namePlaceholder:  'Nome (opcional)',
    urlPlaceholder:   'Colar URL do resultado…',
    urlHint:          'Peça a cada participante que compartilhe sua URL de resultado',
    addBtn:           'Adicionar',
    removeBtn:        'Remover',
    resultsTitle:     'Resultados individuais',
    distributionTitle:'Distribuição do grupo',
    disclaimer:       'Esta ferramenta combina resultados localmente no seu navegador. Nenhum dado é enviado a nenhum servidor. Os resultados são exclusivamente informativos e não constituem diagnóstico clínico. O uso desta ferramenta com grupos requer o consentimento informado de todos os participantes.',
    errorInvalid:     'URL inválida ou formato não reconhecido',
    errorWrongTest:   'Esta URL é de um teste diferente',
    noResults:        'Adicione pelo menos uma URL para ver os resultados',
    nameLabel:        'Nome',
    resultLabel:      'Resultado',
    scoreLabel:       'Pontuação',
    anonymous:        'Anônimo',
  },
  ku: {
    title:            'ئەنجامەکانی گروپ',
    subtitle:         'ئەنجامەکانی بەشداربووەکان بخەنە یەک و دیمەنی کۆی گروپەکە ببینە.',
    addEntry:         'بەشداربوو زیاد بکە',
    namePlaceholder:  'ناو (دڵخوازانە)',
    urlPlaceholder:   'URL-ی ئەنجام پەیست بکە…',
    urlHint:          'داوا لە هەر بەشداربوێک بکە URL-ی ئەنجامەکەی بۍ بشێوێت',
    addBtn:           'زیاد بکە',
    removeBtn:        'لابردن',
    resultsTitle:     'ئەنجامە تاکەکانە',
    distributionTitle:'دابەشبوونی گروپ',
    disclaimer:       'ئەم ئامرازە ئەنجامەکان لە گەڕەکەکەی تۆدا یەکدەخاتەوە. هیچ داتایەک نادرێت بۆ هیچ سێرڤەرێک. ئەنجامەکان تەنها ڕابەریین و نییەتە دیاریکردنی نەخۆشی کلینیکی. بەکارهێنانی ئەم ئامرازە لەگەڵ گروپەکان پێویستی بە ئاگادارکردنەوەی هەموو بەشداربووەکان هەیە.',
    errorInvalid:     'URL نادروست یان فۆرمات نانادرێت',
    errorWrongTest:   'ئەم URL-ە لە کوێزێکی جیاوازە',
    noResults:        'لانیکەم یەک URL زیاد بکە بۆ دیتنی ئەنجامەکان',
    nameLabel:        'ناو',
    resultLabel:      'ئەنجام',
    scoreLabel:       'خاڵ',
    anonymous:        'نەناسراو',
  },
}

const COLOR_CLASSES: Record<string, string> = {
  green:  'bg-primary-100 text-primary-800 border-primary-300',
  yellow: 'bg-accent-100 text-accent-800 border-accent-300',
  orange: 'bg-orange-100 text-orange-800 border-orange-300',
  red:    'bg-red-100 text-red-800 border-red-300',
}

const BAR_COLORS: Record<string, string> = {
  green:  'var(--color-primary)',
  yellow: 'var(--color-accent)',
  orange: '#c47a3a',
  red:    '#8b3a3a',
}

interface Entry {
  id: string
  name: string
  url: string
  result?: ScoringResult
  error?: string
}

interface GroupResultsViewProps {
  lang: string
  testId: string
}

export default function GroupResultsView({ lang, testId }: GroupResultsViewProps) {
  const ui = UI[lang] ?? UI['es']

  const [testData,  setTestData]  = React.useState<TestLangFile | null>(null)
  const [entries,   setEntries]   = React.useState<Entry[]>([])
  const [inputUrl,  setInputUrl]  = React.useState('')
  const [inputName, setInputName] = React.useState('')

  React.useEffect(() => {
    fetch(`/data/tests/${testId}/${lang}.json`)
      .then((r) => r.json())
      .then((d: TestLangFile) => setTestData(d))
      .catch(() => {
        // Try fallback to es
        fetch(`/data/tests/${testId}/es.json`)
          .then((r) => r.json())
          .then((d: TestLangFile) => setTestData(d))
          .catch(() => {})
      })
  }, [testId, lang])

  const addEntry = () => {
    if (!inputUrl.trim()) return
    const id = crypto.randomUUID()
    const name = inputName.trim()
    const url = inputUrl.trim()

    if (!testData) {
      setEntries((prev) => [...prev, { id, name, url, error: 'Loading test data…' }])
      return
    }

    try {
      // Parse the URL to get the token
      let token: string | null = null
      try {
        const u = new URL(url)
        token = u.searchParams.get('d')
        // Check testId match
        if (!u.pathname.includes(`/${testId}/`)) {
          setEntries((prev) => [...prev, { id, name, url, error: ui.errorWrongTest }])
          setInputUrl('')
          setInputName('')
          return
        }
      } catch {
        // Try relative URL or just the token itself
        const match = url.match(/[?&]d=([^&]+)/)
        token = match?.[1] ?? null
      }

      if (!token) {
        setEntries((prev) => [...prev, { id, name, url, error: ui.errorInvalid }])
        setInputUrl('')
        setInputName('')
        return
      }

      const questionIds = testData.questions.map((q) => q.id)
      const answers = decodeAnswersWithKeys(token, questionIds)
      if (!answers) {
        setEntries((prev) => [...prev, { id, name, url, error: ui.errorInvalid }])
        setInputUrl('')
        setInputName('')
        return
      }

      const scoreFn = getScoringFunction(testData.scoringFunction)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = scoreFn(testData as any, answers)

      setEntries((prev) => [...prev, { id, name, url, result }])
    } catch {
      setEntries((prev) => [...prev, { id, name, url, error: ui.errorInvalid }])
    }

    setInputUrl('')
    setInputName('')
  }

  const removeEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id))

  const validEntries = entries.filter((e) => e.result)
  const categoryMap: Record<string, { label: string; color: string; count: number }> = {}
  for (const e of validEntries) {
    const cat = e.result!.category
    if (!cat) continue
    const key = cat.color ?? 'green'
    if (!categoryMap[key]) categoryMap[key] = { label: cat.label, color: key, count: 0 }
    categoryMap[key].count++
  }
  const categories = Object.values(categoryMap).sort((a, b) => b.count - a.count)
  const total = validEntries.length

  return (
    <div style={{ backgroundColor: 'var(--color-cream)' }} className="min-h-screen py-10">
      <div className="mx-auto max-w-2xl px-4">

        {/* Header */}
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
          {ui.title}
        </h1>
        <p className="text-sm text-gray-600 mb-8">{ui.subtitle}</p>

        {/* Add entry form */}
        <div className="rounded-xl border bg-white p-5 mb-6" style={{ borderColor: 'var(--color-lightGray)' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-primary)' }}>
            {ui.addEntry}
          </h2>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder={ui.namePlaceholder}
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              style={{ borderColor: 'var(--color-lightGray)' }}
            />
            <div className="flex gap-2">
              <input
                type="url"
                placeholder={ui.urlPlaceholder}
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEntry()}
                className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--color-lightGray)' }}
              />
              <button
                type="button"
                onClick={addEntry}
                disabled={!inputUrl.trim()}
                className="btn-primary text-sm px-4 disabled:opacity-40"
              >
                {ui.addBtn}
              </button>
            </div>
            <p className="text-xs text-gray-400">{ui.urlHint}</p>
          </div>
        </div>

        {/* Distribution chart */}
        {categories.length > 0 && (
          <div className="rounded-xl border bg-white p-5 mb-6" style={{ borderColor: 'var(--color-lightGray)' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
              {ui.distributionTitle} <span className="font-normal text-gray-500">({total})</span>
            </h2>
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <div key={cat.color}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium" style={{ color: BAR_COLORS[cat.color] ?? '#555' }}>
                      {cat.label}
                    </span>
                    <span className="text-gray-500">
                      {cat.count}/{total} ({Math.round((cat.count / total) * 100)}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(cat.count / total) * 100}%`, backgroundColor: BAR_COLORS[cat.color] ?? 'var(--color-primary)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Individual results */}
        {entries.length > 0 ? (
          <div className="rounded-xl border bg-white overflow-hidden mb-6" style={{ borderColor: 'var(--color-lightGray)' }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--color-lightGray)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                {ui.resultsTitle}
              </h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-lightGray)' }}>
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                      {entry.name || ui.anonymous}
                    </p>
                    {entry.error ? (
                      <p className="text-xs text-red-500">{entry.error}</p>
                    ) : entry.result ? (
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {entry.result.score !== null && (
                          <span className="text-xs text-gray-500">
                            {ui.scoreLabel}: <strong>{entry.result.score}</strong>
                          </span>
                        )}
                        {entry.result.category && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${COLOR_CLASSES[entry.result.category.color ?? 'green'] ?? ''}`}
                          >
                            {entry.result.category.label}
                          </span>
                        )}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="text-xs text-gray-400 hover:text-red-500 shrink-0"
                  >
                    {ui.removeBtn}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">{ui.noResults}</p>
        )}

        {/* Disclaimer */}
        <div
          className="rounded-xl border p-4 text-xs leading-relaxed text-gray-600"
          style={{ borderColor: 'var(--color-lightGray)', backgroundColor: 'var(--color-cream)' }}
        >
          {ui.disclaimer}
        </div>

      </div>
    </div>
  )
}
