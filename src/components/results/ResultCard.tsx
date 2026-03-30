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
import RemindMe from './RemindMe'
import ScoreHistory from './ScoreHistory'
import DownloadCard from './DownloadCard'
import RelatedTests from './RelatedTests'
import GroupSession from './GroupSession'
import Link from 'next/link'
import { encodeAnswers } from '@/utils/shareEncoding'
import type { ScoringResult } from '@/utils/scoringFunctions'
import type { TestDefinition, TestLangFile, AnswersMap } from '@/types/test'
import dynamic from 'next/dynamic'

const DownloadPDF = dynamic(() => import('./DownloadPDF').then(m => m.DownloadPDF), { ssr: false })

// ── Props ────────────────────────────────────────────────────────────────────

interface ResultCardProps {
  result: ScoringResult
  testData: TestDefinition | null
  onReset: () => void
  onShare?: () => void
  lang: string
  testId: string
  maxScore: number
  topicCategory?: string | null
  tags?: string[]
  testCategory?: 'psychometric' | 'quiz'
  answers?: AnswersMap
  availableLangs?: string[]
  testLangFile?: TestLangFile
}

// ── Paleta de colores por categoría ──────────────────────────────────────────

const COLOR_MAP: Record<string, {
  bg: string; text: string; border: string; badge: string; bar: string
}> = {
  green:  { bg: 'bg-primary-50',   text: 'text-primary-600',  border: 'border-primary-200',  badge: 'bg-primary-100 text-primary-700',  bar: 'bg-primary-400'  },
  yellow: { bg: 'bg-accent-50',    text: 'text-accent-600',   border: 'border-accent-200',   badge: 'bg-accent-100 text-accent-700',   bar: 'bg-accent-400'   },
  orange: { bg: 'bg-accent-50',    text: 'text-accent-700',   border: 'border-accent-300',   badge: 'bg-accent-100 text-accent-700',   bar: 'bg-accent-500'   },
  red:    { bg: 'bg-primary-100',  text: 'text-primary-700',  border: 'border-primary-400',  badge: 'bg-primary-200 text-primary-800',  bar: 'bg-primary-600'  },
}

// ── Mapa de rutas de ayuda por idioma ────────────────────────────────────────

const HELP_ROUTES: Record<string, string> = {
  es: '/es/ayuda-urgente',
  en: '/en/ayuda-urgente',
  pt: '/pt/ayuda-urgente',
  ku: '/ku/ayuda-urgente',
}

// ── UI strings ────────────────────────────────────────────────────────────────

const RESULT_UI: Record<string, {
  retry: string
  recommendation: string
  disclaimer: string
  shareResults: string
  remindMe: string
  copyLink: string
  copied: string
  scoreLabel: string
  supportTitle: string
  supportBody: string
  supportLink: string
  privacyNote: string
  emergencyNote: string
  groupResults?: string
}> = {
  es: {
    retry:          '↺ Volver a intentar',
    recommendation: 'Recomendación',
    disclaimer:     'Estos resultados tienen fines exclusivamente educativos y orientativos. No constituyen un diagnóstico clínico ni sustituyen la valoración de un profesional de la salud mental.',
    shareResults:   'Compartir resultados',
    remindMe:       'Recordarme para repetir el test',
    copyLink:       'Copiar enlace',
    copied:         '¡Copiado!',
    scoreLabel:     'Puntuación',
    supportTitle:   'En tus respuestas hemos detectado algunos aspectos que pueden indicar que necesitas apoyo',
    supportBody:    'Te recomendamos que consultes con un profesional lo antes posible.',
    supportLink:    'Puedes pedir ayuda en estos recursos →',
    privacyNote:    'Esta información está solo en tu navegador y no la verá nadie si tú no la compartes.',
    emergencyNote:  'Si es una emergencia, llama al 112',
    groupResults:   'Ver resultados grupales →',
  },
  en: {
    retry:          '↺ Try again',
    recommendation: 'Recommendation',
    disclaimer:     'These results are for educational and informational purposes only. They do not constitute a clinical diagnosis and do not replace the assessment of a mental health professional.',
    shareResults:   'Share results',
    remindMe:       'Remind me to retake',
    copyLink:       'Copy link',
    copied:         'Copied!',
    scoreLabel:     'Score',
    supportTitle:   'Some of your responses include aspects that may indicate you need support',
    supportBody:    'We recommend consulting with a professional as soon as possible.',
    supportLink:    'You can find help resources here →',
    privacyNote:    'This information stays only in your browser — no one can see it unless you share it.',
    emergencyNote:  'If this is an emergency, call 112',
    groupResults:   'See group results →',
  },
  pt: {
    retry:          '↺ Tentar novamente',
    recommendation: 'Recomendação',
    disclaimer:     'Estes resultados têm fins exclusivamente educativos e orientativos. Não constituem um diagnóstico clínico nem substituem a avaliação de um profissional de saúde mental.',
    shareResults:   'Compartilhar resultados',
    remindMe:       'Lembrar de refazer',
    copyLink:       'Copiar link',
    copied:         'Copiado!',
    scoreLabel:     'Pontuação',
    supportTitle:   'Algumas das suas respostas incluem aspectos que podem indicar que você precisa de apoio',
    supportBody:    'Recomendamos que consulte um profissional o quanto antes.',
    supportLink:    'Você pode pedir ajuda nestes recursos →',
    privacyNote:    'Estas informações ficam apenas no seu navegador e ninguém poderá vê-las se você não as compartilhar.',
    emergencyNote:  'Se for uma emergência, ligue para o 112',
    groupResults:   'Ver resultados grupais →',
  },
  ku: {
    retry:          '↺ دووبارە هەوڵبدەرەوە',
    recommendation: 'پێشنیار',
    disclaimer:     'ئەم ئەنجامانە بۆ مەبەستی پەروەردەیی و ڕابەریی تەنهان. نییەتە دیاریکردنی نەخۆشی کلینیکی و شوێنی ئەرزیابیکردنی پزیشکی تەندروستی دەروونی ناگرن.',
    shareResults:   'ئەنجامەکان بڵاوبکەرەوە',
    remindMe:       'بیرم بهێنەوە بۆ دووبارەکردنەوە',
    copyLink:       'لینکەکە کۆپی بکە',
    copied:         'کۆپیکرا!',
    scoreLabel:     'خاڵ',
    supportTitle:   'هەندێک لە وەڵامەکانت ئاماژەیان دەدات کە دەبێت پشتگیریت پێ بکرێت',
    supportBody:    'پێشنیارت دەکەین هەرچوانتر لەگەڵ پزیشکێک مشتومڕ بکەیت.',
    supportLink:    'لێرەوە یارمەتی بدۆزەرەوە ←',
    privacyNote:    'ئەم زانیارییە تەنها لە گەڕەکەکەی تۆدایە و کەس نایبینێت ئەگەر خۆت بڵاوی نەکەیتەوە.',
    emergencyNote:  'ئەگەر ئەمەرجەنسییە، پەیوەندی بکە بە 112',
    groupResults:   'ئەنجامە کۆمەڵایەتییەکان ببینە ←',
  },
}

function getUi(lang: string) {
  return RESULT_UI[lang] ?? RESULT_UI['es']
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
      <div className="flex justify-between text-xs text-neutral-500 mb-1 font-sans">
        <span>0</span>
        <span className={`font-semibold ${colors.text}`}>{score} / {maxScore}</span>
        <span>{maxScore}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-neutral-200 overflow-hidden">
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
  lang: string
  onShare?: () => void
}> = ({ lang, onShare }) => {
  const ui = getUi(lang)
  if (!onShare) return null

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onShare}
        className="btn-primary flex items-center gap-2"
        aria-label={ui.shareResults}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        {ui.shareResults}
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
  onShare?: () => void
  lang: string
  testId: string
  maxScore: number
  topicCategory?: string | null
  tags?: string[]
  testCategory?: 'psychometric' | 'quiz'
  answers?: AnswersMap
  availableLangs?: string[]
  testLangFile?: TestLangFile
}> = ({ result, onReset, onShare, lang, testId, maxScore, topicCategory, tags, testCategory, answers, availableLangs, testLangFile }) => {
  const visible      = useFadeIn()
  const isCrisis     = result.resultType === 'CRISIS'
  const displayScore = useCountUp(result.score ?? 0)
  const colorKey     = result.category?.color ?? 'green'
  const colors       = COLOR_MAP[colorKey] ?? COLOR_MAP['green']
  const message      = result.message
  const ui           = getUi(lang)
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
      {/* ── Score + categoría (oculto en CRISIS) ───────────────────────── */}
      {!isCrisis && (
      <div className={`card text-center ${colors.bg} ${colors.border} border-2`}>
        {maxScore > 0 ? (
          /* Tests clínicos: círculo de score numérico */
          <>
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
            <ScoreBar
              score={result.score ?? 0}
              maxScore={maxScore}
              colorKey={colorKey}
              lang={lang}
            />
          </>
        ) : (
          /* Quiz: solo categoría con emoji grande */
          <div className="py-4">
            <div
              className={`mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-4 ${colors.border} ${colors.bg}`}
            >
              <span className="text-5xl" role="img" aria-hidden="true">
                {colorKey === 'green' ? '🌿' : colorKey === 'yellow' ? '💛' : colorKey === 'orange' ? '🍂' : '🌊'}
              </span>
            </div>
            <span className={`inline-block rounded-full px-5 py-2 text-base font-bold ${colors.badge}`}>
              {result.category?.label}
            </span>
          </div>
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
        <p className="border-t border-neutral-100 pt-3 text-xs italic text-neutral-400">
          {ui.disclaimer}
        </p>
      </div>

      {/* ── Historial de puntuaciones ──────────────────────────────────── */}
      {!isCrisis && (
        <ScoreHistory testId={testId} currentScore={result.score ?? 0} lang={lang} />
      )}

      {/* ── Compartir + Descargar ────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <ShareButtons lang={lang} onShare={onShare} />
        {/* Group session button removed here — rendered below via GroupSession */}
        {!isCrisis && testCategory === 'quiz' && (
          <DownloadCard
            lang={lang}
            testName={testId}
            score={result.score ?? 0}
            maxScore={maxScore}
            categoryLabel={result.category?.label ?? ''}
            colorKey={colorKey}
            testId={testId}
          />
        )}
      </div>

      {/* ── PDF Download (psychometric tests only) ──────────────────────── */}
      {!isCrisis && testCategory !== 'quiz' && answers && availableLangs && testLangFile && (
        <DownloadPDF
          testData={testLangFile}
          answers={answers}
          result={result}
          testId={testId}
          lang={lang}
          availableLangs={availableLangs}
        />
      )}

      {/* ── Recordatorio de repetición ──────────────────────────────────── */}
      <RemindMe lang={lang} testId={testId} testCategory={testCategory} currentScore={result.score ?? 0} currentCategory={result.category?.label} />

      {/* ── Sesión grupal (solo quizzes) ─────────────────────────────────── */}
      {!isCrisis && testCategory === 'quiz' && answers && (
        <GroupSession
          lang={lang}
          testId={testId}
          testName={testLangFile?.name ?? testId}
          token={encodeAnswers(answers)}
          shareUrl={typeof window !== 'undefined' ? window.location.href : ''}
        />
      )}

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

      {/* ── Tests relacionados ────────────────────────────────────────────── */}
      <RelatedTests
        lang={lang}
        currentTestId={testId}
        currentCategory={topicCategory ?? null}
        currentTags={tags ?? []}
      />
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset, onShare, lang, testId, maxScore, topicCategory, tags, testCategory, answers, availableLangs, testLangFile }) => {
  return (
    <NormalResult
      result={result}
      onReset={onReset}
      onShare={onShare}
      lang={lang}
      testId={testId}
      maxScore={maxScore}
      topicCategory={topicCategory}
      tags={tags}
      testCategory={testCategory}
      answers={answers}
      availableLangs={availableLangs}
      testLangFile={testLangFile}
    />
  )
}

export default ResultCard
