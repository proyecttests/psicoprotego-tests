/**
 * @file components/results/ResultCard.tsx
 * @description Tarjeta de resultados del test psicológico.
 *
 * - NORMAL: score animado + barra visual (score/maxScore), categoría con color,
 *   recomendación, botones de compartir (WhatsApp + copiar enlace obfuscado).
 *
 * - CRISIS: alerta roja prominente, teléfonos con botones grandes (48px),
 *   animate-pulse en llamadas, sin score.
 *
 * Compartir: la URL se ofusca con base64 para no exponer score ni categoría
 * en texto plano. Formato: /:lang/test/:testId/result?r=<btoa(score:categoryKey)>
 */

import React from 'react'
import type { ScoringResult } from '@/utils/scoringFunctions'
import type { TestDefinition, CrisisPhone, CrisisResource } from '@/types/test'

// ── Props ────────────────────────────────────────────────────────────────────

interface ResultCardProps {
  result: ScoringResult
  type: 'NORMAL' | 'CRISIS'
  testData: TestDefinition | null
  onReset: () => void
  onShareWhatsApp?: (url: string) => void
  lang: string
  testId: string
  maxScore: number
}

// ── Paleta de colores por categoría ──────────────────────────────────────────

const COLOR_MAP: Record<string, {
  bg: string; text: string; border: string; badge: string; bar: string
}> = {
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-300',  badge: 'bg-green-100 text-green-800',  bar: 'bg-green-500'  },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300', badge: 'bg-yellow-100 text-yellow-800', bar: 'bg-yellow-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', badge: 'bg-orange-100 text-orange-800', bar: 'bg-orange-500' },
  red:    { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-300',    badge: 'bg-red-100 text-red-800',      bar: 'bg-red-500'    },
}

// ── UI strings ────────────────────────────────────────────────────────────────

const RESULT_UI: Record<string, {
  retry: string
  recommendation: string
  disclaimer: string
  shareWhatsApp: string
  copyLink: string
  copied: string
  shareText: string
  scoreLabel: string
  callNow: string
}> = {
  es: {
    retry:          '↺ Volver a intentar',
    recommendation: 'Recomendación',
    disclaimer:     'Estos resultados tienen fines exclusivamente educativos y orientativos. No constituyen un diagnóstico clínico ni sustituyen la valoración de un profesional de la salud mental.',
    shareWhatsApp:  'Compartir en WhatsApp',
    copyLink:       'Copiar enlace',
    copied:         '¡Copiado!',
    shareText:      'Acabo de completar este test psicológico. ¿Lo intentas tú también?',
    scoreLabel:     'Puntuación',
    callNow:        'Llama ahora — es gratuito y confidencial',
  },
  en: {
    retry:          '↺ Try again',
    recommendation: 'Recommendation',
    disclaimer:     'These results are for educational and informational purposes only. They do not constitute a clinical diagnosis and do not replace the assessment of a mental health professional.',
    shareWhatsApp:  'Share on WhatsApp',
    copyLink:       'Copy link',
    copied:         'Copied!',
    shareText:      'I just completed this psychological test. Want to try?',
    scoreLabel:     'Score',
    callNow:        'Call now — it\'s free and confidential',
  },
  pt: {
    retry:          '↺ Tentar novamente',
    recommendation: 'Recomendação',
    disclaimer:     'Estes resultados têm fins exclusivamente educativos e orientativos. Não constituem um diagnóstico clínico nem substituem a avaliação de um profissional de saúde mental.',
    shareWhatsApp:  'Compartilhar no WhatsApp',
    copyLink:       'Copiar link',
    copied:         'Copiado!',
    shareText:      'Acabei de completar este teste psicológico. Quer tentar?',
    scoreLabel:     'Pontuação',
    callNow:        'Ligue agora — é gratuito e confidencial',
  },
}

function getUi(lang: string) {
  return RESULT_UI[lang] ?? RESULT_UI['es']
}

// ── Share URL (ofuscada con base64) ───────────────────────────────────────────

/**
 * Genera una URL de resultado ofuscada.
 * El token es btoa(score:categoryKey), que oculta el dato a inspección casual.
 */
function buildShareUrl(lang: string, testId: string, score: number, categoryKey: string): string {
  const token = btoa(`${score}:${categoryKey}`)
  return `${window.location.origin}/${lang}/test/${testId}/result?r=${encodeURIComponent(token)}`
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 600): number {
  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => {
    if (target === 0) { setDisplay(0); return }

    const steps     = 20
    const interval  = duration / steps
    const increment = target / steps
    let current     = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplay(target)
        clearInterval(timer)
      } else {
        setDisplay(Math.round(current))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [target, duration])

  return display
}

function useFadeIn(): boolean {
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return visible
}

// ── Sub-componente: ScoreBar ──────────────────────────────────────────────────

const ScoreBar: React.FC<{
  score: number
  maxScore: number
  colorKey: string
  lang: string
}> = ({ score, maxScore, colorKey, lang }) => {
  const pct    = maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0
  const colors = COLOR_MAP[colorKey] ?? COLOR_MAP['green']
  const ui     = getUi(lang)
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const id = setTimeout(() => setWidth(pct), 150)
    return () => clearTimeout(id)
  }, [pct])

  return (
    <div className="w-full mt-4" aria-label={`${ui.scoreLabel}: ${score} de ${maxScore}`}>
      <div className="flex justify-between text-xs text-gray-500 mb-1 font-sans">
        <span>0</span>
        <span className={`font-semibold ${colors.text}`}>{score} / {maxScore}</span>
        <span>{maxScore}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full ${colors.bar}`}
          style={{ width: `${width}%`, transition: 'width 0.7s ease-out' }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={maxScore}
        />
      </div>
    </div>
  )
}

// ── Sub-componente: ShareButtons ──────────────────────────────────────────────

const ShareButtons: React.FC<{
  shareUrl: string
  lang: string
  onShareWhatsApp?: (url: string) => void
}> = ({ shareUrl, lang, onShareWhatsApp }) => {
  const [copied, setCopied] = React.useState(false)
  const ui = getUi(lang)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API not available — silent fail
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${ui.shareText} ${shareUrl}`)}`

  const handleWhatsApp = (e: React.MouseEvent) => {
    if (onShareWhatsApp) {
      e.preventDefault()
      onShareWhatsApp(whatsappUrl)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsApp}
        className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        aria-label={ui.shareWhatsApp}
      >
        <span aria-hidden="true">💬</span>
        {ui.shareWhatsApp}
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
        aria-label={ui.copyLink}
      >
        <span aria-hidden="true">{copied ? '✓' : '🔗'}</span>
        {copied ? ui.copied : ui.copyLink}
      </button>
    </div>
  )
}

// ── Sub-componente: NormalResult ──────────────────────────────────────────────

const NormalResult: React.FC<{
  result: ScoringResult
  onReset: () => void
  onShareWhatsApp?: (url: string) => void
  lang: string
  testId: string
  maxScore: number
}> = ({ result, onReset, onShareWhatsApp, lang, testId, maxScore }) => {
  const visible      = useFadeIn()
  const displayScore = useCountUp(result.score ?? 0)
  const colorKey     = result.category?.color ?? 'green'
  const colors       = COLOR_MAP[colorKey] ?? COLOR_MAP['green']
  const message      = result.message
  const ui           = getUi(lang)
  const shareUrl     = buildShareUrl(lang, testId, result.score ?? 0, result.category?.messageKey ?? '')

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div
      className={`w-full max-w-2xl space-y-4 px-4 py-6 sm:px-6 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* ── Score + barra visual ────────────────────────────────────────── */}
      <div className={`card text-center ${colors.bg} ${colors.border} border-2`}>
        <div
          aria-label={`${ui.scoreLabel}: ${result.score}`}
          className={`mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full border-4 ${colors.border} ${colors.bg}`}
        >
          <span className={`text-5xl font-extrabold ${colors.text}`}>
            {displayScore}
          </span>
        </div>

        <span className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${colors.badge}`}>
          {result.category?.label}
        </span>

        {maxScore > 0 && (
          <ScoreBar
            score={result.score ?? 0}
            maxScore={maxScore}
            colorKey={colorKey}
            lang={lang}
          />
        )}
      </div>

      {/* ── Mensaje de resultado ─────────────────────────────────────────── */}
      <div className="card space-y-4">
        <h1 className="text-xl">{message?.title}</h1>
        <p className="text-sm leading-relaxed font-sans" style={{ color: '#666', lineHeight: '1.6' }}>
          {message?.body}
        </p>

        {/* Recomendación destacada */}
        <div className="rounded-lg border p-4" style={{ borderColor: 'var(--color-accent)', backgroundColor: 'var(--color-cream)' }}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider font-sans" style={{ color: 'var(--color-accent)' }}>
            {ui.recommendation}
          </p>
          <p className="text-sm font-medium leading-relaxed font-sans" style={{ color: 'var(--color-primary)' }}>
            {message?.recommendation}
          </p>
        </div>

        {/* Disclaimer obligatorio */}
        <p className="border-t border-gray-100 pt-3 text-xs italic text-gray-400">
          {ui.disclaimer}
        </p>
      </div>

      {/* ── Compartir ───────────────────────────────────────────────────── */}
      <ShareButtons shareUrl={shareUrl} lang={lang} onShareWhatsApp={onShareWhatsApp} />

      {/* ── Reintentar ──────────────────────────────────────────────────── */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary"
          aria-label={ui.retry}
        >
          {ui.retry}
        </button>
      </div>
    </div>
  )
}

// ── Sub-componente: CrisisResult ──────────────────────────────────────────────

const CrisisResult: React.FC<{
  result: ScoringResult
  onReset: () => void
  lang: string
}> = ({ result, onReset, lang }) => {
  const visible   = useFadeIn()
  const message   = result.message
  const phones    = (message?.phones    ?? []) as CrisisPhone[]
  const resources = (message?.resources ?? []) as CrisisResource[]
  const ui        = getUi(lang)

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div
      className={`w-full max-w-2xl space-y-4 px-4 py-6 sm:px-6 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* ── Alerta de crisis ─────────────────────────────────────────────── */}
      <div
        role="alert"
        className="rounded-xl border-2 border-red-400 bg-red-50 p-6 text-center shadow-md"
      >
        <p aria-hidden="true" className="mb-3 text-5xl">⚠️</p>
        <h1 className="text-xl font-extrabold uppercase tracking-wide text-red-800">
          {message?.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-red-700" style={{ lineHeight: '1.6' }}>
          {message?.body}
        </p>
      </div>

      {/* ── Teléfonos de crisis ──────────────────────────────────────────── */}
      <div className="card space-y-3">
        <h2 className="text-base font-semibold text-gray-700">
          {ui.callNow}
        </h2>

        {phones.map((phone: CrisisPhone, i: number) => (
          <a
            key={i}
            href={`tel:${phone.number}`}
            className="
              flex min-h-[48px] items-center justify-between gap-3 rounded-xl
              border-2 border-red-400 bg-red-600 px-5 py-4
              text-white shadow-sm transition-colors
              hover:bg-red-700
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              animate-pulse
            "
            aria-label={`Llamar al ${phone.number} — ${phone.label}`}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="text-xl">📞</span>
              <span>
                <span className="text-2xl font-extrabold tracking-wider">{phone.number}</span>
                <span className="ml-3 text-sm font-medium opacity-90">{phone.label}</span>
              </span>
            </span>
            <span aria-hidden="true" className="text-red-200">→</span>
          </a>
        ))}
      </div>

      {/* ── Recursos adicionales ─────────────────────────────────────────── */}
      {resources.length > 0 && (
        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Más recursos de apoyo</h2>
          <ul className="space-y-2">
            {resources.map((resource: CrisisResource, i: number) => (
              <li key={i}>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline hover:opacity-80 focus:outline-none focus:ring-1 rounded"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {resource.label}
                  </a>
                ) : (
                  <span className="text-sm text-gray-600">{resource.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Botones de acción directa ────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="tel:024"
          className="
            flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg
            bg-red-700 px-5 py-3 text-sm font-bold text-white shadow-sm
            transition-colors hover:bg-red-800
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          "
          aria-label="Llamar al 024 ahora"
        >
          <span aria-hidden="true">📞</span> Llamar al 024
        </a>
        <a
          href="tel:112"
          className="
            flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg
            border-2 border-red-400 px-5 py-3 text-sm font-bold text-red-700
            transition-colors hover:bg-red-50
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          "
          aria-label="Llamar al 112 ahora"
        >
          <span aria-hidden="true">📞</span> Llamar al 112
        </a>
      </div>

      {/* Volver al inicio */}
      <div className="text-center">
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-400 underline hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded"
        >
          {ui.retry}
        </button>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

const ResultCard: React.FC<ResultCardProps> = ({ result, type, onReset, onShareWhatsApp, lang, testId, maxScore }) => {
  if (type === 'CRISIS') {
    return <CrisisResult result={result} onReset={onReset} lang={lang} />
  }
  return <NormalResult result={result} onReset={onReset} onShareWhatsApp={onShareWhatsApp} lang={lang} testId={testId} maxScore={maxScore} />
}

export default ResultCard
