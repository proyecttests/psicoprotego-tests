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
 * 7. NO hardcodea ninguna pregunta — todo se lee del JSON
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
  TestResult,
  Question,
  NormalMessage,
} from '@/types/test'

import Header          from '@/components/common/Header'
import Footer          from '@/components/common/Footer'
import Disclaimer      from '@/components/common/Disclaimer'
import ProgressBar     from './ProgressBar'
import QuestionRenderer from './QuestionRenderer'
import ResultCard      from '@/components/results/ResultCard'

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
 *
 * @param question - Pregunta a evaluar
 * @param answers  - Mapa de respuestas actuales
 * @returns true si la pregunta debe mostrarse, false si debe ocultarse
 */
function shouldShowQuestion(question: Question, answers: AnswersMap): boolean {
  if (!question.showIf) return true
  const { questionId, value } = question.showIf
  return answers[questionId] === value
}

/**
 * Detecta si alguna respuesta activa un red flag de crisis.
 *
 * @param questions - Todas las preguntas del test
 * @param answers   - Respuestas actuales
 * @returns true si hay al menos una respuesta de crisis
 */
function hasRedFlag(questions: Question[], answers: AnswersMap): boolean {
  return questions.some((q) => {
    if (!q.isRedFlag || !q.redFlagValues) return false
    const answer = answers[q.id]
    return answer !== undefined && (q.redFlagValues as Array<string | number | boolean>).includes(answer)
  })
}

/**
 * Calcula el score numérico sumando las respuestas de tipo likert.
 * Solo suma las preguntas que sean `type: 'likert'` o que tengan valor numérico.
 *
 * @param questions - Preguntas del test
 * @param answers   - Respuestas del usuario
 * @returns Score total
 */
function calculateScore(questions: Question[], answers: AnswersMap): number {
  return questions.reduce((sum, q) => {
    if (q.type !== 'likert') return sum
    const val = answers[q.id]
    return sum + (typeof val === 'number' ? val : 0)
  }, 0)
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * TestContainer — orquestador principal del test psicológico.
 *
 * @param testId - ID del test en tests.json
 * @param lang   - Idioma de los mensajes (por defecto 'es')
 */
const TestContainer: React.FC<TestContainerProps> = ({ testId, lang = 'es' }) => {
  // ── Estado ─────────────────────────────────────────────────────────────────
  const [uiState,    setUiState]    = React.useState<TestState>('loading')
  const [testDef,    setTestDef]    = React.useState<TestDefinition | null>(null)
  const [messages,   setMessages]   = React.useState<MessagesMap | null>(null)
  const [answers,    setAnswers]    = React.useState<AnswersMap>({})
  const [currentIdx, setCurrentIdx] = React.useState(0)   // índice en visibleQuestions
  const [result,     setResult]     = React.useState<TestResult | null>(null)
  const [errorMsg,   setErrorMsg]   = React.useState<string>('')

  // ── Carga de datos ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        // Carga en paralelo para mejor rendimiento
        const [testsRes, messagesRes] = await Promise.all([
          fetch('/data/tests.json'),
          fetch('/data/messages.json'),
        ])

        if (!testsRes.ok)    throw new Error(`Error cargando tests.json: ${testsRes.status}`)
        if (!messagesRes.ok) throw new Error(`Error cargando messages.json: ${messagesRes.status}`)

        const testsData    = await testsRes.json()    as { tests: TestDefinition[] }
        const messagesData = await messagesRes.json() as MessagesMap

        const foundTest = testsData.tests.find((t) => t.id === testId && t.lang === lang)
        if (!foundTest) throw new Error(`Test "${testId}" (lang: ${lang}) no encontrado.`)

        if (!cancelled) {
          setTestDef(foundTest)
          setMessages(messagesData)
          // Si hay disclaimer, ir a ese estado; si no, directo a preguntas
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

  // ── Preguntas visibles (filtradas por showIf) ──────────────────────────────
  const visibleQuestions = React.useMemo(() => {
    if (!testDef) return []
    return testDef.questions.filter((q) => shouldShowQuestion(q, answers))
  }, [testDef, answers])

  const currentQuestion  = visibleQuestions[currentIdx] ?? null
  const isLastQuestion   = currentIdx === visibleQuestions.length - 1

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Actualiza la respuesta de una pregunta en el mapa de respuestas.
   * @param questionId - ID de la pregunta
   * @param value      - Nuevo valor
   */
  const handleAnswer = (questionId: string, value: string | number | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  /**
   * Avanza a la siguiente pregunta o calcula el resultado si es la última.
   * Detecta red flags antes de avanzar.
   */
  const handleNext = () => {
    if (!testDef || !messages) return

    const updatedAnswers = { ...answers }

    // ── Detección de red flag ──────────────────────────────────────────────
    if (hasRedFlag(testDef.questions, updatedAnswers)) {
      const crisisMessages = messages[testId]?.[lang]?.crisis
      if (crisisMessages) {
        setResult({
          score: null,
          type: 'CRISIS',
          message: crisisMessages,
        })
        setUiState('result')
        return
      }
    }

    if (!isLastQuestion) {
      setCurrentIdx((prev) => prev + 1)
    } else {
      handleSubmit(updatedAnswers)
    }
  }

  /**
   * Vuelve a la pregunta anterior.
   */
  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx((prev) => prev - 1)
  }

  /**
   * Calcula el score final, busca la regla de scoring correspondiente
   * y construye el objeto TestResult.
   *
   * @param finalAnswers - Mapa de respuestas completo
   */
  const handleSubmit = (finalAnswers: AnswersMap) => {
    if (!testDef || !messages) return

    const score = calculateScore(testDef.questions, finalAnswers)

    // Busca la regla de scoring que corresponde al score
    const rule = testDef.scoring.find(
      (r) => score >= r.min && (r.max === null || score <= r.max)
    )

    if (!rule) {
      setErrorMsg(`No se encontró regla de scoring para score ${score}.`)
      setUiState('error')
      return
    }

    // Busca el mensaje en messages.json
    const testMessages = messages[testId]?.[lang]
    if (!testMessages) {
      setErrorMsg(`No se encontraron mensajes para test "${testId}" (lang: ${lang}).`)
      setUiState('error')
      return
    }

    const normalMessage = testMessages.normal?.[rule.messageKey] as NormalMessage | undefined
    if (!normalMessage) {
      setErrorMsg(`Mensaje no encontrado para clave "${rule.messageKey}".`)
      setUiState('error')
      return
    }

    setResult({
      score,
      type: 'NORMAL',
      category: rule.category,
      color: rule.color,
      message: normalMessage,
    })
    setUiState('result')
  }

  /**
   * Reinicia el test al estado inicial de respuestas.
   */
  const handleReset = () => {
    setAnswers({})
    setCurrentIdx(0)
    setResult(null)
    setUiState(testDef?.disclaimerBefore ? 'disclaimer-before' : 'answering')
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  // Determina si la pregunta actual tiene respuesta (para habilitar "Siguiente")
  const currentAnswered = currentQuestion
    ? answers[currentQuestion.id] !== undefined
    : false

  // ── Render por estado ──────────────────────────────────────────────────────

  // Loading
  if (uiState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-4 text-gray-500"
        >
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0066CC]"
            aria-hidden="true"
          />
          <p className="text-sm font-medium">Cargando cuestionario…</p>
        </div>
      </div>
    )
  }

  // Error
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
            <h1 className="mt-3 text-lg font-semibold text-red-800">Error al cargar el test</h1>
            <p className="mt-2 text-sm text-red-700">{errorMsg}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary mt-5"
            >
              Recargar página
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Disclaimer antes
  if (uiState === 'disclaimer-before') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header testName={testDef?.name} />
        <main className="flex flex-1 items-start justify-center pt-8">
          <Disclaimer
            type="before"
            testName={testDef?.name ?? ''}
            customText={testDef?.disclaimerBefore}
            onContinue={() => setUiState('answering')}
            onCancel={() => window.history.back()}
          />
        </main>
        <Footer />
      </div>
    )
  }

  // Resultado
  if (uiState === 'result' && result) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header testName={testDef?.name} />
        <main className="flex flex-1 items-start justify-center py-8">
          <ResultCard
            result={result}
            testData={testDef}
            onReset={handleReset}
          />
        </main>
        <Footer />
      </div>
    )
  }

  // Answering (estado principal)
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
        className="flex flex-1 flex-col items-center px-4 py-6 sm:px-6"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="w-full max-w-2xl">
          {/* ── Barra de progreso ──────────────────────────────────────────── */}
          <ProgressBar
            currentQuestion={questionNumber}
            totalQuestions={visibleQuestions.length}
          />

          {/* ── Tarjeta de pregunta ────────────────────────────────────────── */}
          <div className="card mt-4">
            {/* Número y texto de la pregunta */}
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Pregunta {questionNumber}
            </p>
            <h2 className="mb-6 text-xl font-semibold leading-snug text-gray-800">
              {currentQuestion.text}
            </h2>

            {/* Renderizador dinámico del tipo de pregunta */}
            <QuestionRenderer
              question={currentQuestion}
              answers={answers}
              onChange={handleAnswer}
            />
          </div>

          {/* ── Botones de navegación ─────────────────────────────────────── */}
          <div className="mt-6 flex items-center justify-between gap-4">
            {/* Botón Anterior */}
            {currentIdx > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn-secondary"
                aria-label="Ir a la pregunta anterior"
              >
                ← Anterior
              </button>
            ) : (
              <div aria-hidden="true" />
            )}

            {/* Botón Siguiente / Finalizar */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!currentAnswered}
              className="btn-primary"
              aria-label={isLastQuestion ? 'Finalizar y ver resultados' : 'Ir a la siguiente pregunta'}
            >
              {isLastQuestion ? 'Ver resultados →' : 'Siguiente →'}
            </button>
          </div>

          {/* Hint de respuesta pendiente */}
          {!currentAnswered && (
            <p
              aria-live="polite"
              className="mt-3 text-center text-xs text-gray-400"
            >
              Selecciona una respuesta para continuar
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TestContainer
