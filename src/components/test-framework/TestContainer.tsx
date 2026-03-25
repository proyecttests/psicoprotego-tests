/**
 * @file components/test-framework/TestContainer.tsx
 * @description Orquestador principal del framework de tests psicológicos.
 *
 * Responsabilidades:
 * 1. Cargar la definición del test desde /data/tests.json
 * 2. Cargar los mensajes desde /data/messages.json
 * 3. Gestionar el flujo de estados: loading → disclaimer-before → answering → result | error
 * 4. Filtrar preguntas condicionales (showIf)
 * 5. Detectar red flags durante las respuestas
 * 6. Calcular el score final y mapear al mensaje correcto
 * 7. Auto-avanzar en preguntas Likert (pasa onAdvance a QuestionRenderer)
 * 8. Transiciones TDAH: slideOutUpTikTok (salida) + fadeInQuestion (entrada)
 *
 * Uso:
 * ```tsx
 * <TestContainer testId="gad7" lang="es" />
 * ```
 */

'use client'

import React from 'react'
import type {
  TestDefinition,
  MessagesMap,
  TestState,
  AnswersMap,
  Question,
} from '@/types/test'

import ProgressBar         from './ProgressBar'
import QuestionRenderer    from './QuestionRenderer'
import ResultCard          from '@/components/results/ResultCard'
import CalculatingScreen   from './CalculatingScreen'
import SharingScreen       from './SharingScreen'
import { getScoringFunction } from '@/utils/scoringFunctions'
import { buildShareUrl } from '@/utils/shareEncoding'
import type { ScoringResult, TestDefinitionForScoring } from '@/utils/scoringFunctions'
import { trackEvent } from '@/config/analytics'

// ── Crisis bar (sticky bottom, solo cuando resultType === 'CRISIS') ───────────

const CRISIS_STRINGS: Record<string, { message: string; phone1Label: string; phone1: string; phone2: string }> = {
  es: { message: 'Hay apoyo disponible — no estás solo/a', phone1Label: '024 – Esperanza', phone1: '024', phone2: '112' },
  en: { message: 'Support is available — you are not alone',  phone1Label: '988',              phone1: '988', phone2: '911' },
  pt: { message: 'Há apoio disponível — você não está sozinho/a', phone1Label: '192',           phone1: '192', phone2: '190' },
}

const CrisisBar: React.FC<{ lang: string }> = ({ lang }) => {
  const t = CRISIS_STRINGS[lang] ?? CRISIS_STRINGS['es']
  return (
    <div
      role="complementary"
      aria-label="Recursos de ayuda inmediata"
      className="fixed bottom-0 left-0 right-0 z-50 shadow-lg"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-center text-sm font-semibold text-white sm:text-left">
            {t.message}
          </p>
          <div className="flex w-full gap-3 sm:w-auto">
            <a
              href={`tel:${t.phone1}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold sm:flex-none"
              style={{ color: 'var(--color-primary)' }}
              aria-label={`Llamar al ${t.phone1Label}`}
            >
              <span aria-hidden="true">📞</span>
              {t.phone1Label}
            </a>
            <a
              href={`tel:${t.phone2}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-white px-5 py-3 text-sm font-bold text-white sm:flex-none"
              aria-label={`Llamar al ${t.phone2}`}
            >
              <span aria-hidden="true">📞</span>
              {t.phone2}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── UI strings ────────────────────────────────────────────────────────────────

const UI_STRINGS: Record<string, {
  loading: string
  errorTitle: string
  reload: string
  prev: string
  next: string
  finish: string
  selectAnswer: string
}> = {
  es: {
    loading:      'Cargando cuestionario…',
    errorTitle:   'Error al cargar el test',
    reload:       'Recargar página',
    prev:         '← Anterior',
    next:         'Siguiente →',
    finish:       'Ver resultados →',
    selectAnswer: 'Selecciona una respuesta para continuar',
  },
  en: {
    loading:      'Loading questionnaire…',
    errorTitle:   'Error loading the test',
    reload:       'Reload page',
    prev:         '← Previous',
    next:         'Next →',
    finish:       'See results →',
    selectAnswer: 'Select an answer to continue',
  },
  pt: {
    loading:      'Carregando questionário…',
    errorTitle:   'Erro ao carregar o teste',
    reload:       'Recarregar página',
    prev:         '← Anterior',
    next:         'Próximo →',
    finish:       'Ver resultados →',
    selectAnswer: 'Selecione uma resposta para continuar',
  },
}

function getUiStrings(lang: string) {
  return UI_STRINGS[lang] ?? UI_STRINGS['es']
}

// ── Props ────────────────────────────────────────────────────────────────────

interface TestContainerProps {
  /** Identificador del test a cargar (debe coincidir con el `id` en tests.json) */
  testId: string
  /** Código de idioma (debe coincidir con un `lang` en messages.json) */
  lang?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Evalúa si una pregunta debe mostrarse según su condición `showIf`.
 */
function shouldShowQuestion(question: Question, answers: AnswersMap): boolean {
  if (!question.showIf) return true
  const { questionId, value } = question.showIf
  return answers[questionId] === value
}

// ── Componente ────────────────────────────────────────────────────────────────

const TestContainer: React.FC<TestContainerProps> = ({ testId, lang = 'es' }) => {
  // ── Estado ─────────────────────────────────────────────────────────────────
  const [uiState,        setUiState]        = React.useState<TestState>('loading')
  const [testDef,        setTestDef]        = React.useState<TestDefinition | null>(null)
  const [messages,       setMessages]       = React.useState<MessagesMap | null>(null)
  const [effectiveLang,  setEffectiveLang]  = React.useState(lang)
  const [answers,        setAnswers]        = React.useState<AnswersMap>({})
  const [currentIdx,     setCurrentIdx]     = React.useState(0)
  const [result,         setResult]         = React.useState<ScoringResult | null>(null)
  const [errorMsg,       setErrorMsg]       = React.useState<string>('')
  const [pendingShareUrl, setPendingShareUrl] = React.useState<string>('')

  // Scoring function name loaded from JSON — stored in ref to avoid re-renders
  const scoringFnNameRef = React.useRef<string>('scoreGAD7')
  const testCategoryRef  = React.useRef<'psychometric' | 'quiz'>('psychometric')

  const ui = getUiStrings(lang)

  // Estado de transición (animación de salida activa)
  const [isExiting, setIsExiting] = React.useState(false)

  // ── Carga de datos ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        // 1. Fetch metadata for availableLangs
        const metaRes = await fetch(`/data/tests/${testId}/metadata.json`)
        if (!metaRes.ok) throw new Error(`Test "${testId}" no encontrado.`)
        const metadata = await metaRes.json() as { availableLangs: string[]; category?: 'psychometric' | 'quiz' }

        // 2. Fetch lang file, fall back to 'es' if lang not available
        const resolvedLang = metadata.availableLangs.includes(lang) ? lang : 'es'
        const langRes = await fetch(`/data/tests/${testId}/${resolvedLang}.json`)
        if (!langRes.ok) throw new Error(`Contenido de "${testId}" en "${resolvedLang}" no encontrado.`)
        const langData = await langRes.json() as import('@/types/test').TestLangFile

        // 3. Build testDef compatible with TestDefinition interface
        const foundTest: TestDefinition = {
          id:               langData.id,
          lang:             langData.lang,
          name:             langData.name,
          version:          langData.version,
          questions:        langData.questions,
          scoring:          langData.scoring,
          disclaimerBefore: langData.disclaimerBefore,
          disclaimerAfter:  langData.disclaimerAfter,
          instructions:     langData.instructions,
        }

        // 4. Build messages map compatible with scoringFunctions format
        const messagesData: MessagesMap = {
          [testId]: { [resolvedLang]: langData.results },
        }

        if (!cancelled) {
          scoringFnNameRef.current = langData.scoringFunction ?? 'scoreGAD7'
          testCategoryRef.current  = metadata.category ?? 'psychometric'
          setTestDef(foundTest)
          setMessages(messagesData)
          setEffectiveLang(resolvedLang)
          setUiState('answering')
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : 'Error desconocido')
          setUiState('error')
        }
      }
    }

    void loadData()
    return () => { cancelled = true }
  }, [testId, lang])

  // ── Preguntas visibles ─────────────────────────────────────────────────────
  const visibleQuestions = React.useMemo(() => {
    if (!testDef) return []
    return testDef.questions.filter((q) => shouldShowQuestion(q, answers))
  }, [testDef, answers])

  // Puntuación máxima teórica (suma de scale.max de preguntas Likert no redFlag)
  const maxScore = React.useMemo(() => {
    if (!testDef) return 0
    return testDef.questions
      .filter((q) => !q.isRedFlag && q.type === 'likert')
      .reduce((sum, q) => sum + (q.scale?.max ?? 3), 0)
  }, [testDef])

  const currentQuestion = visibleQuestions[currentIdx] ?? null
  const isLastQuestion  = currentIdx === visibleQuestions.length - 1

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAnswer = (questionId: string, value: string | number | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    trackEvent('question_answered', { testId, questionId, answer: value })
  }

  const handleSubmit = (finalAnswers: AnswersMap) => {
    if (!testDef || !messages) return

    const scoringFn = getScoringFunction(scoringFnNameRef.current)
    const scored = scoringFn(
      testDef as unknown as TestDefinitionForScoring,
      finalAnswers,
      messages as Record<string, Record<string, unknown>>,
      effectiveLang,
    )

    if (scored.resultType === 'CRISIS' && !scored.message) {
      setErrorMsg(`No se encontró mensaje de crisis para "${testId}" (lang: ${lang}).`)
      setUiState('error')
      return
    }

    trackEvent('test_completed', {
      testId,
      score: scored.score,
      category: scored.category?.label,
    })

    if (scored.resultType === 'CRISIS' || (scored.redFlags && scored.redFlags.length > 0)) {
      trackEvent('red_flag_detected', {
        testId,
        flagCount: scored.redFlags?.length ?? 0,
        severity: 'critical',
      })
    }

    setResult(scored)
    setUiState('calculating')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /**
   * Avanza con animación de salida (slideOutUpTikTok, 400ms) y luego cambia pregunta.
   * También es el callback de auto-avance de LikertScale.
   */
  const handleNext = () => {
    if (!testDef || !messages || isExiting) return

    setIsExiting(true)
    // 800ms total de transición: salida 400ms + 400ms margen de respuesta de botones
    setTimeout(() => {
      setIsExiting(false)
      if (!isLastQuestion) {
        setCurrentIdx((prev) => prev + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        handleSubmit({ ...answers })
      }
    }, 400)
  }

  const handleBack = () => {
    if (currentIdx <= 0 || isExiting) return

    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      setCurrentIdx((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 400)
  }

  const handleReset = () => {
    trackEvent('test_reset', { testId })
    setAnswers({})
    setCurrentIdx(0)
    setResult(null)
    setPendingShareUrl('')
    setIsExiting(false)
    setUiState('answering')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleShare = () => {
    const url = buildShareUrl(lang, testId, answers)
    trackEvent('share_open', { testId })
    setPendingShareUrl(url)
    setUiState('sharing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Helpers de render ──────────────────────────────────────────────────────

  const currentAnswered = currentQuestion
    ? answers[currentQuestion.id] !== undefined
    : false

  const showCrisisFooter = result?.resultType === 'CRISIS'

  // ── Render por estado ──────────────────────────────────────────────────────

  if (uiState === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 text-gray-500">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200" style={{ borderTopColor: 'var(--color-primary)' }}
            aria-hidden="true"
          />
          <p className="text-sm font-medium">{ui.loading}</p>
        </div>
      </div>
    )
  }

  if (uiState === 'error') {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div
          role="alert"
          className="max-w-md rounded-xl border border-red-300 bg-red-50 p-6 text-center shadow-sm"
        >
          <span aria-hidden="true" className="text-4xl">⚠️</span>
          <h1 className="mt-3 text-lg font-semibold text-red-800">{ui.errorTitle}</h1>
          <p className="mt-2 text-sm text-red-700">{errorMsg}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary mt-5"
          >
            {ui.reload}
          </button>
        </div>
      </div>
    )
  }

  if (uiState === 'calculating') {
    return (
      <CalculatingScreen
        lang={lang}
        category={testCategoryRef.current}
        onDone={() => {
          setUiState('result')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    )
  }

  if (uiState === 'sharing' && pendingShareUrl) {
    return (
      <SharingScreen
        lang={lang}
        category={testCategoryRef.current}
        shareUrl={pendingShareUrl}
        onDone={() => {
          setPendingShareUrl('')
          setUiState('result')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    )
  }

  if (uiState === 'result' && result) {
    return (
      <>
        <div className="flex flex-1 items-start justify-center py-8">
          <ResultCard
            result={result}
            testData={testDef}
            onReset={handleReset}
            onShare={handleShare}
            lang={lang}
            testId={testId}
            maxScore={maxScore}
          />
        </div>
        {showCrisisFooter && <CrisisBar lang={lang} />}
      </>
    )
  }

  // Answering
  if (!currentQuestion) return null

  const questionNumber = currentIdx + 1

  return (
    <>
      <main
        className="flex flex-1 flex-col items-center justify-between px-4 py-6 sm:px-6"
        aria-live="polite"
      >
        {/* SECCIÓN SUPERIOR: Barra de progreso */}
        <div className="w-full max-w-2xl">
          <ProgressBar
            currentQuestion={questionNumber}
            totalQuestions={visibleQuestions.length}
          />
        </div>

        {/* SECCIÓN CENTRAL: Pregunta + Opciones con transición TDAH */}
        <div
          key={currentIdx}
          className={`w-full max-w-2xl flex flex-col items-center gap-14 flex-1 justify-center py-4${isExiting ? ' animate-slide-out-tiktok' : ''}`}
        >
          {/* Instrucciones validadas — solo en la primera pregunta */}
          {currentIdx === 0 && testDef?.instructions && (
            <p
              className="w-full max-w-md px-4 text-sm leading-relaxed text-center animate-fadeInQuestion"
              style={{ color: 'var(--color-primary)', opacity: 0.6 }}
              aria-label="Instrucciones del test"
            >
              {testDef.instructions}
            </p>
          )}

          {/* Pregunta - Grande, fade suave, centrada */}
          <h2
            className="text-2xl sm:text-3xl font-semibold leading-snug text-center px-4 animate-fadeInQuestion max-w-md pb-2"
            style={{ color: 'var(--color-primary)' }}
          >
            {currentQuestion.text}
          </h2>

          {/* Opciones - Cards con animación de subida */}
          <div className="w-full max-w-md animate-riseUpAfter">
            <QuestionRenderer
              question={currentQuestion}
              answers={answers}
              onChange={handleAnswer}
              onAdvance={
                currentQuestion.type === 'likert' && !isLastQuestion
                  ? handleNext
                  : undefined
              }
              lang={lang}
            />
          </div>
        </div>

        {/* SECCIÓN INFERIOR: Botones de navegación */}
        <div className="w-full max-w-2xl flex items-center justify-between gap-4">
          {currentIdx > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary"
              aria-label="Ir a la pregunta anterior"
            >
              {ui.prev}
            </button>
          ) : (
            <div aria-hidden="true" />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={!currentAnswered}
            className="btn-primary"
            aria-label={isLastQuestion ? ui.finish : ui.next}
          >
            {isLastQuestion ? ui.finish : ui.next}
          </button>
        </div>

        {!currentAnswered && (
          <p aria-live="polite" className="text-center text-xs text-gray-400 mt-2">
            {ui.selectAnswer}
          </p>
        )}
      </main>
    </>
  )
}

export default TestContainer
