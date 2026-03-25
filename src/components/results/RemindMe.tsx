/**
 * @file components/results/RemindMe.tsx
 * @description Botón "Recuérdame en X semanas" para repetir el test.
 *
 * Guarda en localStorage { testId, completedAt, remindAt } sin backend.
 * En la siguiente visita, si el recordatorio está vencido, muestra un banner
 * invitando a repetir y comparar resultados.
 *
 * Uso: <RemindMe lang="es" testId="gad7" weeks={4} />
 */

'use client'

import React from 'react'

// ── Config ────────────────────────────────────────────────────────────────────

const STORAGE_KEY = (testId: string) => `psico_remind_${testId}`
const DEFAULT_WEEKS = 4

interface ReminderData {
  testId: string
  completedAt: string   // ISO date
  remindAt: string      // ISO date
  score?: number
  category?: string
}

// ── UI strings ────────────────────────────────────────────────────────────────

const UI: Record<string, {
  set: (weeks: number) => string
  set2: (weeks: number) => string
  set4: (weeks: number) => string
  saved: string
  due: string
  dueBody: string
  retake: string
  retakeQuiz: string
  dismiss: string
  prevScore: (score: number, category: string) => string
}> = {
  es: {
    set:     (w) => `Recordarme en ${w} semanas`,
    set2:    (w) => `${w} sem`,
    set4:    (w) => `${w} sem`,
    saved:   '✓ Recordatorio guardado',
    due:     '¿Repites el test?',
    dueBody: 'Han pasado las semanas acordadas. Puedes repetir el test y comparar tu progreso.',
    retake:  'Hacer el test de nuevo',
    retakeQuiz: 'Hacer el quiz de nuevo',
    dismiss: 'Descartar',
    prevScore: (s: number, cat: string) => `Último resultado: ${s} pts — ${cat}`,
  },
  en: {
    set:     (w) => `Remind me in ${w} weeks`,
    set2:    (w) => `${w} wk`,
    set4:    (w) => `${w} wk`,
    saved:   '✓ Reminder saved',
    due:     'Time to retake?',
    dueBody: 'The agreed time has passed. You can retake the test and compare your progress.',
    retake:  'Retake the test',
    retakeQuiz: 'Retake the quiz',
    dismiss: 'Dismiss',
    prevScore: (s: number, cat: string) => `Last result: ${s} pts — ${cat}`,
  },
  pt: {
    set:     (w) => `Lembrar em ${w} semanas`,
    set2:    (w) => `${w} sem`,
    set4:    (w) => `${w} sem`,
    saved:   '✓ Lembrete salvo',
    due:     'Hora de refazer?',
    dueBody: 'O tempo acordado passou. Você pode refazer o teste e comparar seu progresso.',
    retake:  'Refazer o teste',
    retakeQuiz: 'Refazer o quiz',
    dismiss: 'Descartar',
    prevScore: (s: number, cat: string) => `Último resultado: ${s} pts — ${cat}`,
  },
  ku: {
    set:     (w) => `لە ${w} هەفتەدا بیرمبهێنەرەوە`,
    set2:    (w) => `${w} هتە`,
    set4:    (w) => `${w} هتە`,
    saved:   '✓ یادەوەری پاراستراوە',
    due:     'کاتی دووبارەکردنەوەیە؟',
    dueBody: 'ماوەی دیاریکراو تێپەڕیوە. دەتوانیت کوێزەکە دووباره بکەیتەوە و پێشکەوتنت بسەنجیت.',
    retake:  'کوێزەکە دووبارە بکەرەوە',
    retakeQuiz: 'کوێزەکە دووبارە بکەرەوە',
    dismiss: 'پشتگوێخستن',
    prevScore: (s: number, cat: string) => `کۆتا ئەنجام: ${s} خاڵ — ${cat}`,
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

interface RemindMeProps {
  lang: string
  testId: string
  weeks?: number
  testCategory?: string
  currentScore?: number
  currentCategory?: string
}

const RemindMe: React.FC<RemindMeProps> = ({ lang, testId, weeks = DEFAULT_WEEKS, testCategory, currentScore, currentCategory }) => {
  const ui = UI[lang] ?? UI['es']
  const key = STORAGE_KEY(testId)

  const [saved,     setSaved]     = React.useState(false)
  const [isDue,     setIsDue]     = React.useState(false)
  const [dismissed, setDismissed] = React.useState(false)

  // On mount: check if there's a due reminder
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return
      const data = JSON.parse(raw) as ReminderData
      if (new Date() >= new Date(data.remindAt)) {
        setIsDue(true)
      } else {
        setSaved(true) // already scheduled, not yet due
      }
    } catch { /* ignore */ }
  }, [key])

  const handleSet = (w: number) => {
    const now      = new Date()
    const remindAt = new Date(now.getTime() + w * 7 * 24 * 60 * 60 * 1000)
    const data: ReminderData = {
      testId,
      completedAt: now.toISOString(),
      remindAt:    remindAt.toISOString(),
      score:    currentScore,
      category: currentCategory,
    }
    try {
      localStorage.setItem(key, JSON.stringify(data))
      setSaved(true)
      setIsDue(false)
    } catch { /* ignore */ }
  }

  const handleDismiss = () => {
    localStorage.removeItem(key)
    setIsDue(false)
    setDismissed(true)
  }

  if (dismissed) return null

  // ── Due banner ───────────────────────────────────────────────────────────
  if (isDue) {
    return (
      <div
        className="rounded-xl p-4 flex flex-col gap-3"
        style={{ backgroundColor: '#e8f0ea', border: '1px solid var(--color-primary)' }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
            {ui.due}
          </p>
          <p className="text-xs mt-1 text-gray-600">{ui.dueBody}</p>
          {(() => {
            try {
              const stored = JSON.parse(localStorage.getItem(key) ?? 'null') as ReminderData | null
              if (stored?.score !== undefined && stored.category) {
                return <p className="text-xs font-semibold mt-1" style={{ color: 'var(--color-primary)' }}>{ui.prevScore(stored.score, stored.category)}</p>
              }
            } catch { /* ignore */ }
            return null
          })()}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { localStorage.removeItem(key); window.location.href = `/${lang}/test/${testId}` }}
            className="btn-primary text-xs py-2 px-4"
          >
            {testCategory === 'quiz' ? ui.retakeQuiz : ui.retake}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs underline opacity-60 hover:opacity-100"
            style={{ color: 'var(--color-primary)' }}
          >
            {ui.dismiss}
          </button>
        </div>
      </div>
    )
  }

  // ── Set reminder ─────────────────────────────────────────────────────────
  if (saved) {
    return (
      <p className="text-xs text-center opacity-50" style={{ color: 'var(--color-primary)' }}>
        {ui.saved}
      </p>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {[2, 4, 8].map((w) => (
        <button
          key={w}
          type="button"
          onClick={() => handleSet(w)}
          className="rounded-full border px-3 py-1 text-xs font-medium transition hover:bg-primary-50"
          style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
        >
          {ui.set(w)}
        </button>
      ))}
    </div>
  )
}

export default RemindMe
