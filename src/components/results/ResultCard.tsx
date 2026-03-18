/**
 * @file components/results/ResultCard.tsx
 * @description Tarjeta de resultados del test psicológico.
 *
 * - Siempre muestra el resultado normal (score, categoría, recomendación).
 * - Si hay red flags, urgencia o resultType === 'CRISIS', añade un bloque
 *   de apoyo profesional calmado debajo del resultado (sin rojo, sin alarma).
 *
 * Compartir: la URL se ofusca con base64 para no exponer score ni categoría
 * en texto plano. Formato: /:lang/test/:testId/result?r=<btoa(score:categoryKey)>
 */

import React from 'react'
import Link from 'next/link'
import type { ScoringResult } from '@/utils/scoringFunctions'
import type { TestDefinition } from '@/types/test'

// ── Props ────────────────────────────────────────────────────────────────────

interface ResultCardProps {
  result: ScoringResult
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
  green:  { bg: 'bg-green-50',    text: 'text-green-700',   border: 'border-green-300',   badge: 'bg-green-100 text-green-800',    bar: 'bg-green-500'    },
  yellow: { bg: 'bg-accent-50',   text: 'text-accent-600',  border: 'border-accent-200',  badge: 'bg-accent-100 text-accent-700',  bar: 'bg-accent-400'   },
  orange: { bg: 'bg-accent-50',   text: 'text-accent-600',  border: 'border-accent-300',  badge: 'bg-accent-100 text-accent-700',  bar: 'bg-accent-500'   },
  red:    { bg: 'bg-primary-50',  text: 'text-primary-500', border: 'border-primary-300', badge: 'bg-primary-100 text-primary-600', bar: 'bg-primary-500'  },
}

// ── Mapa de rutas de ayuda por idioma ────────────────────────────────────────

const HELP_ROUTES: Record<string, string> = {
  es: '/es/ayuda-urgente',
  en: '/en/ayuda-urgente',
  pt: '/pt/ayuda-urgente',
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
  supportTitle: string
  supportBody: string
  supportLink: string
  privacyNote: string
  emergencyNote: string
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
    supportTitle:   'En tus respuestas hemos detectado algunos aspectos que pueden indicar que necesitas apoyo',
    supportBody:    'Te recomendamos que consultes con un profesional lo antes posible.',
    supportLink:    'Puedes pedir ayuda en estos recursos →',
    privacyNote:    'Esta información está solo en tu navegador y no la verá nadie si tú no la compartes.',
    emergencyNote:  'Si es una emergencia, llama al 112',
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
    supportTitle:   'Some of your responses include aspects that may indicate you need support',
    supportBody:    'We recommend consulting with a professional as soon as possible.',
    supportLink:    'You can find help resources here →',
    privacyNote:    'This information stays only in your browser — no one can see it unless you share it.',
    emergencyNote:  'If this is an emergency, call 112',
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
    supportTitle:   'Algumas das suas respostas incluem aspectos que podem indicar que você precisa de apoio',
    supportBody:    'Recomendamos que consulte um profissional o quanto antes.',
    supportLink:    'Você pode pedir ajuda nestes recursos →',
    privacyNote:    'Estas informações ficam apenas no seu navegador e ninguém poderá vê-las se você não as compartilhar.',
    emergencyNote:  'Se for uma emergência, ligue para o 112',
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

// ── Sub-componente: SupportBlock ──────────────────────────────────────────────

/**
 * Bloque de apoyo profesional calmado. Se muestra cuando el resultado indica
 * puntuación severa, urgencia > none, o red flags detectados.
 * Sin rojo, sin alarma — tono de psicólogo que señala dónde ir.
 */
const SupportBlock: React.FC<{ lang: string }> = ({ lang }) => {
  const ui       = getUi(lang)
  const helpRoute = HELP_ROUTES[lang] ?? HELP_ROUTES['es']

  return (
    <div
      className="rounded-xl px-5 py-5"
      style={{
        backgroundColor: '#ede8df',
        borderLeft: '4px solid var(--color-primary)',
      }}
    >
      <p
        className="text-sm font-semibold leading-snug mb-2"
        style={{ color: 'var(--color-primary)' }}
      >
        {ui.supportTitle}
      </p>
      <p
        className="text-sm leading-relaxed font-sans mb-3"
        style={{ color: 'var(--color-primary)', opacity: 0.75 }}
      >
        {ui.supportBody}
      </p>
      <Link
        href={helpRoute}
        className="text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 rounded"
        style={{ color: 'var(--color-accent)' }}
      >
        {ui.supportLink}
      </Link>
      <p
        className="mt-4 text-xs"
        style={{ color: 'var(--color-primary)', opacity: 0.5 }}
      >
        {ui.privacyNote}
      </p>
      <p
        className="mt-1 text-xs"
        style={{ color: 'var(--color-primary)', opacity: 0.4 }}
      >
        {ui.emergencyNote}
      </p>
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
  const isCrisis     = result.resultType === 'CRISIS'
  const displayScore = useCountUp(result.score ?? 0)
  const colorKey     = result.category?.color ?? 'green'
  const colors       = COLOR_MAP[colorKey] ?? COLOR_MAP['green']
  const message      = result.message
  const ui           = getUi(lang)
  const shareUrl     = buildShareUrl(lang, testId, result.score ?? 0, result.category?.messageKey ?? '')

  const showSupport =
    isCrisis ||
    (result.redFlags?.length ?? 0) > 0 ||
    (result.urgency != null && result.urgency !== 'none')

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div
      className={`w-full max-w-2xl space-y-4 px-4 py-6 sm:px-6 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* ── Score + barra visual (oculto en CRISIS: score es null) ──────── */}
      {!isCrisis && (
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
      )}

      {/* ── Mensaje de resultado ─────────────────────────────────────────── */}
      <div className="card space-y-4">
        <h1 className="text-xl">{message?.title}</h1>
        <p className="text-sm leading-relaxed font-sans" style={{ color: '#666', lineHeight: '1.6' }}>
          {message?.body}
        </p>

        {/* Recomendación destacada — solo si existe */}
        {message?.recommendation && (
          <div className="rounded-lg border p-4" style={{ borderColor: 'var(--color-accent)', backgroundColor: 'var(--color-cream)' }}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider font-sans" style={{ color: 'var(--color-accent)' }}>
              {ui.recommendation}
            </p>
            <p className="text-sm font-medium leading-relaxed font-sans" style={{ color: 'var(--color-primary)' }}>
              {message.recommendation}
            </p>
          </div>
        )}

        {/* Disclaimer obligatorio */}
        <p className="border-t border-gray-100 pt-3 text-xs italic text-gray-400">
          {ui.disclaimer}
        </p>
      </div>

      {/* ── Compartir ───────────────────────────────────────────────────── */}
      <ShareButtons shareUrl={shareUrl} lang={lang} onShareWhatsApp={onShareWhatsApp} />

      {/* ── Bloque de apoyo profesional (solo si hay red flags / urgencia) ─ */}
      {showSupport && <SupportBlock lang={lang} />}

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

// ── Componente principal ──────────────────────────────────────────────────────

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset, onShareWhatsApp, lang, testId, maxScore }) => {
  return (
    <NormalResult
      result={result}
      onReset={onReset}
      onShareWhatsApp={onShareWhatsApp}
      lang={lang}
      testId={testId}
      maxScore={maxScore}
    />
  )
}

export default ResultCard
