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

import React from 'react'
import type {
  TestDefinition,
  MessagesMap,
  TestState,
  AnswersMap,
  Question,
} from '@/types/test'

import Header              from '@/components/common/Header'
import Footer              from '@/components/common/Footer'
import Disclaimer          from '@/components/common/Disclaimer'
import LangSwitcher        from '@/components/common/LangSwitcher'
import ProgressBar         from './ProgressBar'
import QuestionRenderer    from './QuestionRenderer'
import ResultCard          from '@/components/results/ResultCard'
import CalculatingScreen   from './CalculatingScreen'
import SharingScreen       from './SharingScreen'
import AdSlot              from '@/components/ads/AdSlot'
import { getScoringFunction } from '@/utils/scoringFunctions'
import type { ScoringResult, TestDefinitionForScoring } from '@/utils/scoringFunctions'
import { trackEvent } from '@/config/analytics'

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
  const [availableLangs, setAvailableLangs] = React.useState<string[]>([])
  const [answers,        setAnswers]        = React.useState<AnswersMap>({})
  const [currentIdx,     setCurrentIdx]     = React.useState(0)
  const [result,         setResult]         = React.useState<ScoringResult | null>(null)
  const [errorMsg,       setErrorMsg]       = React.useState<string>('')
  const [pendingShareUrl, setPendingShareUrl] = React.useState<string>('')

  const ui = getUiStrings(lang)

  // Estado de transición (animación de salida activa)
  const [isExiting, setIsExiting] = React.useState(false)

  // ── Carga de datos ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        const [testsRes, messagesRes] = await Promise.all([
          fetch('/data/tests.json'),
          fetch('/data/messages.json'),
        ])

        if (!testsRes.ok)    throw new Error(`Error cargando tests.json: ${testsRes.status}`)
        if (!messagesRes.ok) throw new Error(`Error cargando messages.json: ${messagesRes.status}`)

        const testsData    = await testsRes.json()    as { tests: TestDefinition[] }
        const messagesData = await messagesRes.json() as MessagesMap

        const foundTest =
          testsData.tests.find((t) => t.id === testId && t.lang === lang) ??
          testsData.tests.find((t) => t.id === testId)
        if (!foundTest) throw new Error(`Test "${testId}" no encontrado.`)

        const langs = testsData.tests
          .filter((t) => t.id === testId)
          .map((t) => t.lang)

        if (!cancelled) {
          setTestDef(foundTest)
          setMessages(messagesData)
          setAvailableLangs(langs)
          setUiState(foundTest.disclaimerBefore ? 'disclaimer-before' : 'answering')
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

    const scoringFnName = (testDef as unknown as Record<string, unknown>).scoringFunction as string | undefined
    const scoringFn = getScoringFunction(scoringFnName ?? 'scoreGAD7')
    const scored = scoringFn(
      testDef as unknown as TestDefinitionForScoring,
      finalAnswers,
      messages as Record<string, Record<string, unknown>>,
      lang,
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
    setUiState(testDef?.disclaimerBefore ? 'disclaimer-before' : 'answering')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleShareWhatsApp = (url: string) => {
    trackEvent('share_whatsapp', { testId })
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
      <div className="flex min-h-screen items-center justify-center">
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
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-8">
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
        </main>
        <Footer showCrisisFooter={false} />
      </div>
    )
  }

  if (uiState === 'disclaimer-before') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header testName={testDef?.name} />
        <main className="flex flex-1 flex-col items-center gap-6 pt-6 px-4 pb-8">
          {/* Selector de idioma — solo si hay más de uno disponible */}
          {availableLangs.length > 1 && (
            <div className="w-[95%] max-w-2xl flex justify-end sm:px-6">
              <LangSwitcher
                currentLang={lang}
                testId={testId}
                availableLangs={availableLangs}
              />
            </div>
          )}
          <Disclaimer
            type="before"
            testName={testDef?.name ?? ''}
            customText={testDef?.disclaimerBefore}
            onContinue={() => setUiState('answering')}
            onCancel={() => window.history.back()}
          />
          {/* Slot publicitario en intro — valor medio */}
          <AdSlot position="intro" size="rectangle" />
        </main>
        <Footer showCrisisFooter={false} />
      </div>
    )
  }

  if (uiState === 'calculating') {
    return (
      <CalculatingScreen
        lang={lang}
        testName={testDef?.name}
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
        testName={testDef?.name}
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
      <div className="flex min-h-screen flex-col">
        <Header testName={testDef?.name} />
        <main className="flex flex-1 items-start justify-center py-8">
          <ResultCard
            result={result}
            testData={testDef}
            onReset={handleReset}
            onShareWhatsApp={handleShareWhatsApp}
            type={result.resultType}
            lang={lang}
            testId={testId}
            maxScore={maxScore}
          />
        </main>
        <Footer showCrisisFooter={showCrisisFooter} />
      </div>
    )
  }

  // Answering
  if (!currentQuestion) return null

  const questionNumber = currentIdx + 1

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        testName={testDef?.name}
        currentQuestion={questionNumber}
        totalQuestions={visibleQuestions.length}
      />

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

      <Footer showCrisisFooter={false} />
    </div>
  )
}

export default TestContainer
