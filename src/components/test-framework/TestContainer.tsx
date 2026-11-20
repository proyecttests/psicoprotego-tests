/**
 * @file components/test-framework/TestContainer.tsx
 * @description Orquestador principal del framework de tests psicológicos.
 *
 * Responsabilidades:
 * 1. Cargar la definición del test desde /data/tests/{testId}/ (metadata.json + {lang}.json)
 * 2. Construir el mapa de mensajes desde `results` de {lang}.json
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
} from '@/types/test'

import ProgressBar         from './ProgressBar'
import QuestionRenderer    from './QuestionRenderer'
import ResultCard          from '@/components/results/ResultCard'
import CalculatingScreen   from './CalculatingScreen'
import SharingScreen       from './SharingScreen'
import UrgentHelpLine      from './UrgentHelpLine'
import { getScoringFunction, getMaxScore } from '@/utils/scoringFunctions'
import { eraseLocalData } from '@/utils/localData'
import { shouldShowQuestion } from '@/utils/questionVisibility'
import type { ScoringResult, TestDefinitionForScoring, QuestionWithScoring } from '@/utils/scoringFunctions'
import { trackEvent } from '@/config/analytics'
import { getCrisisPhone } from '@/config/crisisPhones'

// ── Crisis bar (sticky bottom, solo cuando resultType === 'CRISIS') ───────────

const CRISIS_STRINGS: Record<string, { message: string; phone1Label: string; phone1: string; phone2: string }> = {
  es: {
    message:     'Hay apoyo disponible — no estás solo/a',
    phone1Label: `${getCrisisPhone('024').number} – Conducta suicida`,
    phone1:      getCrisisPhone('024').tel,
    phone2:      getCrisisPhone('112').tel,
  },
}

const CrisisBar: React.FC<{ lang: string }> = ({ lang }) => {
  const t = CRISIS_STRINGS[lang] ?? CRISIS_STRINGS['es']
  return (
    <div
      data-crisis-bar
      role="complementary"
      aria-label="Recursos de ayuda inmediata"
      className="fixed bottom-0 left-0 right-0 z-[60] shadow-lg"
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
  writeAnswer: string
}> = {
  es: {
    loading:      'Cargando cuestionario…',
    errorTitle:   'Error al cargar el test',
    reload:       'Recargar página',
    prev:         '← Anterior',
    next:         'Siguiente →',
    finish:       'Ver resultados →',
    selectAnswer: 'Selecciona una respuesta para continuar',
    writeAnswer:  'Escribe tu respuesta para continuar',
  },
}

// Pantalla tras «Borrar mis respuestas»
const ERASED_UI = {
  title:      'Respuestas borradas',
  body:       'Hemos borrado de este navegador tus respuestas y tu resultado. No quedaba ninguna copia en nuestros servidores.',
  backToTest: 'Volver al test',
  allTests:   'Ver todos los tests',
}

function getUiStrings(lang: string) {
  return UI_STRINGS[lang] ?? UI_STRINGS['es']
}

// ── Props ────────────────────────────────────────────────────────────────────

interface TestContainerProps {
  /** Identificador del test a cargar (nombre de la carpeta en /data/tests/) */
  testId: string
  /** Código de idioma (debe existir /data/tests/{testId}/{lang}.json) */
  lang?: string
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
  const scoringFnNameRef    = React.useRef<string>('scoreGAD7')
  const testCategoryRef     = React.useRef<'psychometric' | 'screening'>('psychometric')
  const conditionRef        = React.useRef<string | null>(null)
  const testTagsRef         = React.useRef<string[]>([])
  const availableLangsRef   = React.useRef<string[]>([])
  const testLangFileRef     = React.useRef<import('@/types/test').TestLangFile | null>(null)

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
        const metadata = await metaRes.json() as { availableLangs: string[]; category?: 'psychometric' | 'screening'; condition?: string; tags?: string[] }

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
          crisisCriteria:   langData.crisisCriteria,
          disclaimerBefore: langData.disclaimerBefore,
          instructions:     langData.instructions,
          responseOptions:  langData.responseOptions,
          likertDisplay:    langData.likertDisplay,
        }

        // 4. Build messages map compatible with scoringFunctions format
        const messagesData: MessagesMap = {
          [testId]: { [resolvedLang]: langData.results },
        }

        if (!cancelled) {
          scoringFnNameRef.current = langData.scoringFunction ?? 'scoreGAD7'
          testCategoryRef.current  = metadata.category ?? 'psychometric'
          conditionRef.current     = metadata.condition ?? null
          testTagsRef.current       = metadata.tags ?? []
          availableLangsRef.current = metadata.availableLangs ?? [resolvedLang]
          testLangFileRef.current   = langData
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

  // Puntuación máxima teórica del instrumento
  const maxScore = React.useMemo(
    () => (testDef ? getMaxScore(testDef.questions as QuestionWithScoring[], scoringFnNameRef.current) : 0),
    [testDef],
  )

  const currentQuestion = visibleQuestions[currentIdx] ?? null
  const isLastQuestion  = currentIdx === visibleQuestions.length - 1

  // Si una respuesta oculta las preguntas que quedaban (ej. PHQ-9: ítem 9 ≠ 0 oculta el 10),
  // el auto-avance deja el índice fuera de rango: se envía ya, sin retrasar el resultado de crisis.
  React.useEffect(() => {
    if (uiState !== 'answering' || isExiting || visibleQuestions.length === 0) return
    if (currentIdx >= visibleQuestions.length) {
      setCurrentIdx(visibleQuestions.length - 1)
      handleSubmit({ ...answers })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, visibleQuestions.length, uiState, isExiting])

  // Modo test: mientras se responde, sin cabecera ni pie (globals.css); el resultado los recupera
  React.useEffect(() => {
    const root = document.documentElement
    if (uiState === 'answering') root.dataset.testMode = 'on'
    else delete root.dataset.testMode
    return () => { delete root.dataset.testMode }
  }, [uiState])

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAnswer = (questionId: string, value: string | number | boolean) => {
    // Las respuestas no salen del navegador: ni a la analítica ni a ningún enlace
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
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

    // Analítica solo de accesos: qué test se termina, sin puntuación, categoría ni avisos
    trackEvent('test_completed', { testId })

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

  // «Borrar mis respuestas»: vacía la memoria de la pestaña y lo que quede en sessionStorage
  const handleErase = () => {
    eraseLocalData()
    setAnswers({})
    setCurrentIdx(0)
    setResult(null)
    setPendingShareUrl('')
    setIsExiting(false)
    setUiState('erased')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Se comparte el enlace al test, no el resultado
  const handleShare = () => {
    const url = `${window.location.origin}/${lang}/test/${testId}`
    trackEvent('share_open', { testId })
    setPendingShareUrl(url)
    setUiState('sharing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Helpers de render ──────────────────────────────────────────────────────

  // Texto obligatorio: no basta con haber escrito y borrado, tiene que quedar algo
  const currentValue    = currentQuestion ? answers[currentQuestion.id] : undefined
  const currentAnswered = currentQuestion?.type === 'text' && currentQuestion.validation?.required
    ? typeof currentValue === 'string' && currentValue.trim().length > 0
    : currentValue !== undefined
  // Más de 4 opciones (ASRS-6, DES-II): enunciado e ítem algo más pequeños para que quepan
  const manyOptions = (currentQuestion?.responseOptions ?? testDef?.responseOptions ?? []).length > 4
    && currentQuestion?.type === 'likert'
  // Y si además enunciado + ítem son largos (PCL-5 e ITQ), el ítem baja a text-base para caber en 360×640
  const longContent = manyOptions &&
    ((currentQuestion?.instructions ?? testDef?.instructions ?? '').length + (currentQuestion?.text.length ?? 0)) > 220
  // Ítem largo con 4 opciones o menos: sin el tamaño más grande
  const longItem = (currentQuestion?.text.length ?? 0) > 100

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
        onDone={() => {
          setUiState('result')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    )
  }

  if (uiState === 'erased') {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="card w-full max-w-sm space-y-4 text-center">
          <h2 className="text-xl">{ERASED_UI.title}</h2>
          <p className="text-sm font-sans" style={{ color: 'var(--color-primary)' }}>{ERASED_UI.body}</p>
          <div className="flex flex-col gap-2">
            <a href={`/${lang}/test/${testId}`} className="btn-primary">{ERASED_UI.backToTest}</a>
            <a href={`/${lang}`} className="btn-secondary">{ERASED_UI.allTests}</a>
          </div>
        </div>
      </div>
    )
  }

  if (uiState === 'sharing' && pendingShareUrl) {
    return (
      <SharingScreen
        lang={lang}
        shareUrl={pendingShareUrl}
        testName={testDef?.name ?? ''}
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
            onErase={handleErase}
            lang={lang}
            testId={testId}
            maxScore={maxScore}
            condition={conditionRef.current}
            tags={testTagsRef.current}
            testCategory={testCategoryRef.current}
            answers={answers}
            availableLangs={availableLangsRef.current}
            testLangFile={testLangFileRef.current ?? undefined}
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
      {/* div, no main: el layout ya pone el <main> de la página. pb-12: la línea de ayuda urgente */}
      <div
        className={`flex flex-1 flex-col items-center justify-between px-4 pb-9 ${longContent ? 'pt-1 tall:pt-3' : 'pt-1 tall:pt-5'} sm:px-6 sm:pt-6`}
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
          className={`w-full max-w-2xl flex flex-col items-center ${longContent ? 'gap-2' : manyOptions ? 'gap-3' : 'gap-3 tall:gap-6'} sm:gap-14 flex-1 justify-center py-1 tall:py-2 sm:py-4${isExiting ? ' animate-slide-out-tiktok' : ''}`}
        >
          {/* Instrucciones validadas — en cada pregunta: los ítems oficiales no se entienden sin el enunciado */}
          {(currentQuestion.instructions ?? testDef?.instructions) && (
            <p
              className={`w-full max-w-md px-2 ${manyOptions ? 'text-xs tall:text-sm' : 'text-sm tall:text-base'} leading-relaxed text-center animate-fadeInQuestion`}
              style={{ color: 'var(--color-primary)', opacity: 0.85 }}
              aria-label="Instrucciones del test"
            >
              {currentQuestion.instructions ?? testDef?.instructions}
            </p>
          )}

          {/* Pregunta - Grande, fade suave, centrada */}
          <h2
            /* Las opciones suben hasta 30 px (riseUp 20 + flotación 10): el hueco bajo el ítem no baja de 32 */
            className={`${longContent ? 'text-base tall:text-lg pb-6' : manyOptions ? 'text-lg tall:text-xl pb-5' : longItem ? 'text-xl pb-3' : 'text-xl tall:text-2xl pb-5 tall:pb-3'} sm:text-3xl font-semibold leading-snug text-center px-2 animate-fadeInQuestion max-w-md`}
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
                currentQuestion.type === 'likert'
                  ? (isLastQuestion ? undefined : handleNext)
                  : (testCategoryRef.current === 'screening' && currentQuestion.type === 'multipleChoice')
                    ? handleNext
                    : undefined
              }
              testResponseOptions={testDef?.responseOptions}
              likertDisplay={testDef?.likertDisplay}
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

          {/* En screening, el auto-avance maneja la siguiente pregunta — solo mostrar Next en la última */}
          {(testCategoryRef.current !== 'screening' || isLastQuestion) && (
            <button
              type="button"
              onClick={handleNext}
              disabled={!currentAnswered}
              className="btn-primary"
              aria-label={isLastQuestion ? ui.finish : ui.next}
            >
              {isLastQuestion ? ui.finish : ui.next}
            </button>
          )}
        </div>

        {!currentAnswered && (
          <p aria-live="polite" className="text-center text-sm text-gray-600 mt-2">
            {currentQuestion.type === 'text' ? ui.writeAnswer : ui.selectAnswer}
          </p>
        )}
      </div>
      <UrgentHelpLine lang={lang} />
    </>
  )
}

export default TestContainer
