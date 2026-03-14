/**
 * @file utils/scoringFunctions.ts
 * @description Sistema de scoring y detección de red flags para tests psicológicos.
 *
 * Arquitectura:
 *  - Cada test tiene su propia función de scoring (ej: scoreGAD7).
 *  - getScoringFunction() actúa como factory: recibe el nombre de la función
 *    y devuelve la implementación correcta.
 *  - Para añadir un nuevo test, basta con implementar su función y registrarla
 *    en el mapa SCORING_REGISTRY al final del archivo.
 *
 * Métodos de scoring soportados por pregunta:
 *  - 'direct'        → suma la respuesta tal cual (0, 1, 2, 3…)
 *  - 'reverse'       → invierte la escala antes de sumar (0→max, max→0)
 *  - 'redFlag'       → NO suma; detecta crisis si la respuesta está en redFlagValues
 *  - 'text_analysis' → NO suma; analiza texto buscando keywords de riesgo
 *  - 'none'          → ignorar completamente (solo contexto)
 *
 * Compatibilidad retroactiva:
 *  Si una pregunta tipo 'likert' no tiene scoring.method definido,
 *  se aplica 'direct' por defecto para mantener compatibilidad con el
 *  JSON actual de tests (que no tiene scoring.method por pregunta).
 */

// ── Tipos internos extendidos ─────────────────────────────────────────────────

/**
 * Método de scoring aplicable a una pregunta individual.
 */
export type ScoringMethod =
  | 'direct'
  | 'reverse'
  | 'redFlag'
  | 'text_analysis'
  | 'none'

/**
 * Configuración de scoring por pregunta (campo opcional en el JSON).
 * Si no está presente en una pregunta likert, se asume 'direct'.
 */
export interface QuestionScoringConfig {
  /** Cómo se procesa la respuesta */
  method: ScoringMethod
  /** Severidad si esta pregunta dispara un red flag */
  redFlagSeverity?: 'high' | 'critical'
  /** Palabras clave para method='text_analysis' */
  keywords?: string[]
}

/**
 * Pregunta con configuración de scoring opcional.
 * Extiende la interfaz base Question sin romper compatibilidad.
 */
export interface QuestionWithScoring {
  id: string
  type: string
  text: string
  scale?: { min: number; max: number; step?: number }
  isRedFlag?: boolean
  redFlagValues?: Array<string | number | boolean>
  /** Configuración de scoring enriquecida (opcional en JSON actual) */
  scoring?: QuestionScoringConfig
  // Cualquier otra propiedad de Question
  [key: string]: unknown
}

/**
 * Definición de test enriquecida con preguntas tipadas para scoring.
 */
export interface TestDefinitionForScoring {
  id: string
  name: string
  lang: string
  questions: QuestionWithScoring[]
  scoring: Array<{
    min: number
    max: number | null
    category: string
    color: string
    messageKey: string
  }>
  [key: string]: unknown
}

// ── Tipos de salida públicos ──────────────────────────────────────────────────

/**
 * Representa un indicador de riesgo detectado en una respuesta.
 */
export interface RedFlag {
  /** ID de la pregunta que disparó el red flag */
  questionId: string
  /** Texto de la pregunta (para mostrar en UI o logs) */
  text: string
  /** Gravedad del indicador */
  severity: 'high' | 'critical'
}

/**
 * Categoría de resultado del test (tramo de score).
 */
export interface ScoringCategory {
  min: number
  max: number | null
  /** Etiqueta de la categoría (ej: "Ansiedad Moderada") */
  label: string
  /** Color Tailwind para UI (ej: "orange") */
  color: string
  /** Clave para buscar el mensaje en messages.json */
  messageKey: string
}

/**
 * Resultado completo del cálculo de scoring de un test.
 */
export interface ScoringResult {
  /**
   * Puntuación numérica total.
   * null cuando resultType === 'CRISIS' (no se debe mostrar al usuario).
   */
  score: number | null

  /** Categoría que corresponde al score (null si es CRISIS sin categoría) */
  category: ScoringCategory | null

  /** Lista de red flags detectados (puede estar vacía) */
  redFlags: RedFlag[]

  /** Nivel de urgencia derivado de los red flags */
  urgency: 'none' | 'high' | 'critical'

  /** Tipo de resultado: flujo normal o flujo de crisis */
  resultType: 'NORMAL' | 'CRISIS'

  /**
   * Mensaje resuelto desde messages.json (si se pasó el mapa).
   * Opcional porque scoreXxx puede usarse sin messages (solo scoring puro).
   * Para CRISIS incluye phones y resources; para NORMAL incluye recommendation.
   */
  message?: {
    title: string
    body: string
    recommendation?: string
    action?: string
    // Campos de CRISIS
    phones?: Array<{ label: string; number: string }>
    resources?: Array<{ label: string; url?: string }>
  }
}

// ── Tipo de la función de scoring ─────────────────────────────────────────────

/**
 * Firma de cualquier función de scoring.
 * Todas las implementaciones (scoreGAD7, scorePHQ9, etc.) deben respetar esta firma.
 */
export type ScoringFunction = (
  testData: TestDefinitionForScoring,
  answers: Record<string, number | string | boolean>,
  messages?: Record<string, Record<string, unknown>>,
  lang?: string,
) => ScoringResult

// ── Helpers internos ──────────────────────────────────────────────────────────

/**
 * Determina el método de scoring efectivo para una pregunta.
 *
 * Prioridad:
 *  1. question.scoring.method (nuevo sistema enriquecido)
 *  2. question.isRedFlag === true → 'redFlag' (sistema legacy)
 *  3. question.type === 'likert' → 'direct' (retrocompatibilidad)
 *  4. question.type === 'text'   → 'text_analysis' si tiene keywords, sino 'none'
 *  5. 'none' para el resto
 *
 * @param question - Pregunta a evaluar
 * @returns Método de scoring resuelto
 */
function resolveMethod(question: QuestionWithScoring): ScoringMethod {
  // Sistema enriquecido (campo scoring.method en el JSON)
  if (question.scoring?.method) return question.scoring.method

  // Legacy: isRedFlag sin método explícito
  if (question.isRedFlag) return 'redFlag'

  // Fallback por tipo de pregunta
  if (question.type === 'likert') return 'direct'
  if (question.type === 'text' && question.scoring?.keywords?.length) return 'text_analysis'

  return 'none'
}

/**
 * Invierte una respuesta numérica dentro de la escala de la pregunta.
 *
 * Ej: scale 0–3, respuesta 1 → invertida 2 (max - answer + min)
 *
 * @param answer   - Valor respondido
 * @param question - Pregunta con scale definido
 * @returns Valor invertido, o el original si no hay scale
 */
function reverseScore(answer: number, question: QuestionWithScoring): number {
  const min = question.scale?.min ?? 0
  const max = question.scale?.max ?? 3
  return max - answer + min
}

/**
 * Analiza texto buscando palabras clave de riesgo.
 *
 * @param text     - Texto respondido por el usuario
 * @param keywords - Lista de palabras o frases a buscar
 * @returns true si alguna keyword aparece en el texto (insensible a mayúsculas)
 */
function containsRiskKeyword(text: string, keywords: string[]): boolean {
  const normalized = text.toLowerCase()
  return keywords.some((kw) => normalized.includes(kw.toLowerCase()))
}

/**
 * Calcula el nivel de urgencia a partir de una lista de red flags.
 *
 * Regla: si hay al menos un 'critical' → urgencia 'critical';
 *        si hay al menos un 'high'     → urgencia 'high';
 *        si no hay ninguno             → 'none'.
 *
 * @param redFlags - Lista de red flags detectados
 * @returns Nivel de urgencia máximo
 */
function resolveUrgency(redFlags: RedFlag[]): ScoringResult['urgency'] {
  if (redFlags.some((rf) => rf.severity === 'critical')) return 'critical'
  if (redFlags.some((rf) => rf.severity === 'high'))     return 'high'
  return 'none'
}

/**
 * Busca la categoría de scoring que corresponde a un score numérico.
 *
 * @param score      - Puntuación total
 * @param scoringRules - Array de reglas del test
 * @returns La categoría encontrada, o null si ninguna aplica
 */
function findCategory(
  score: number,
  scoringRules: TestDefinitionForScoring['scoring'],
): ScoringCategory | null {
  const rule = scoringRules.find(
    (r) => score >= r.min && (r.max === null || score <= r.max),
  )
  if (!rule) return null

  return {
    min:        rule.min,
    max:        rule.max,
    label:      rule.category,   // el JSON usa 'category', aquí lo mapeamos a 'label'
    color:      rule.color,
    messageKey: rule.messageKey,
  }
}

// ── Implementaciones de scoring ───────────────────────────────────────────────

/**
 * Calcula el score del test GAD-7 (Trastorno de Ansiedad Generalizada).
 *
 * Algoritmo:
 *  1. Itera cada pregunta visible.
 *  2. Aplica el método de scoring correspondiente (direct, reverse, redFlag…).
 *  3. Acumula la puntuación de preguntas 'direct' y 'reverse'.
 *  4. Registra red flags de preguntas 'redFlag' y 'text_analysis'.
 *  5. Si hay red flag crítico → resultType = 'CRISIS', score = null.
 *  6. Si no hay crisis → busca categoría y opcionalmente el mensaje.
 *
 * @param testData - Definición del test cargada desde tests.json
 * @param answers  - Mapa questionId → valor respondido
 * @param messages - (Opcional) Mapa de mensajes desde messages.json
 * @param lang     - (Opcional) Código de idioma, por defecto 'es'
 * @returns ScoringResult completo
 */
export function scoreGAD7(
  testData: TestDefinitionForScoring,
  answers: Record<string, number | string | boolean>,
  messages?: Record<string, Record<string, unknown>>,
  lang = 'es',
): ScoringResult {
  let totalScore = 0
  const redFlags: RedFlag[] = []

  // ── Paso 1: iterar preguntas y acumular score / detectar red flags ─────────
  for (const question of testData.questions) {
    const answer  = answers[question.id]
    const method  = resolveMethod(question)

    switch (method) {
      // ── direct: suma la respuesta tal cual ──────────────────────────────
      case 'direct': {
        if (typeof answer === 'number') {
          totalScore += answer
        }
        break
      }

      // ── reverse: invierte la escala antes de sumar ──────────────────────
      case 'reverse': {
        if (typeof answer === 'number') {
          totalScore += reverseScore(answer, question)
        }
        break
      }

      // ── redFlag: detecta crisis, NO suma ────────────────────────────────
      case 'redFlag': {
        const isTriggered =
          answer !== undefined &&
          question.redFlagValues !== undefined &&
          (question.redFlagValues as Array<string | number | boolean>).includes(answer)

        if (isTriggered) {
          const severity = question.scoring?.redFlagSeverity ?? 'critical'
          redFlags.push({
            questionId: question.id,
            text:       question.text,
            severity,
          })
        }
        break
      }

      // ── text_analysis: busca keywords en texto libre ─────────────────────
      case 'text_analysis': {
        if (typeof answer === 'string' && question.scoring?.keywords?.length) {
          const triggered = containsRiskKeyword(answer, question.scoring.keywords)
          if (triggered) {
            const severity = question.scoring.redFlagSeverity ?? 'high'
            redFlags.push({
              questionId: question.id,
              text:       question.text,
              severity,
            })
          }
        }
        break
      }

      // ── none: ignorar completamente ──────────────────────────────────────
      case 'none':
      default:
        break
    }
  }

  // ── Paso 2: resolver urgencia ─────────────────────────────────────────────
  const urgency = resolveUrgency(redFlags)

  // ── Paso 3: si hay red flag crítico → CRISIS ──────────────────────────────
  if (urgency === 'critical') {
    let crisisMessage: ScoringResult['message'] | undefined

    if (messages) {
      const testMsgs = messages[testData.id] as
        | Record<string, Record<string, unknown>>
        | undefined
      crisisMessage = testMsgs?.[lang]?.['crisis'] as ScoringResult['message'] | undefined
    }

    return {
      score:      null,
      category:   null,
      redFlags,
      urgency:    'critical',
      resultType: 'CRISIS',
      message:    crisisMessage,
    }
  }

  // ── Paso 4: buscar categoría para el score acumulado ─────────────────────
  const category = findCategory(totalScore, testData.scoring)

  if (!category) {
    // Score fuera de rango — devuelve resultado parcial sin categoría
    console.warn(
      `[scoreGAD7] No se encontró categoría para score ${totalScore}. ` +
      `Revisa las reglas de scoring en tests.json.`,
    )
    return {
      score:      totalScore,
      category:   null,
      redFlags,
      urgency,
      resultType: 'NORMAL',
    }
  }

  // ── Paso 5: resolver mensaje (opcional) ───────────────────────────────────
  let message: ScoringResult['message'] | undefined

  if (messages) {
    const testMessages = messages[testData.id] as
      | Record<string, Record<string, Record<string, unknown>>>
      | undefined

    const langMessages = testMessages?.[lang]
    const normalMsgs   = langMessages?.['normal'] as
      | Record<string, { title: string; body: string; recommendation: string }>
      | undefined

    const resolved = normalMsgs?.[category.messageKey]

    if (resolved) {
      message = {
        title:          resolved.title,
        body:           resolved.body,
        recommendation: resolved.recommendation,
      }
    } else {
      console.warn(
        `[scoreGAD7] Mensaje no encontrado para clave "${category.messageKey}" ` +
        `(test: ${testData.id}, lang: ${lang}).`,
      )
    }
  }

  // ── Resultado NORMAL ──────────────────────────────────────────────────────
  return {
    score:      totalScore,
    category,
    redFlags,
    urgency,
    resultType: 'NORMAL',
    message,
  }
}

// ── Registry de funciones de scoring ─────────────────────────────────────────

/**
 * Mapa de nombre → función de scoring.
 *
 * Para agregar un nuevo test:
 *  1. Implementa scoreTuTest() siguiendo el mismo contrato que scoreGAD7.
 *  2. Agrégalo aquí: SCORING_REGISTRY['scoreTuTest'] = scoreTuTest
 */
const SCORING_REGISTRY: Record<string, ScoringFunction> = {
  scoreGAD7,
  // scorePHQ9:  scorePHQ9,   ← ejemplo futuro
  // scorePSS10: scorePSS10,  ← ejemplo futuro
}

// ── Factory pública ───────────────────────────────────────────────────────────

/**
 * Devuelve la función de scoring registrada bajo el nombre dado.
 *
 * @param functionName - Nombre registrado en SCORING_REGISTRY (ej: 'scoreGAD7')
 * @returns La función de scoring correspondiente
 * @throws Error si el nombre no está registrado
 *
 * @example
 * ```ts
 * const scoringFn = getScoringFunction('scoreGAD7')
 * const result    = scoringFn(testData, answers, messages, 'es')
 *
 * if (result.resultType === 'CRISIS') {
 *   // mostrar pantalla de crisis
 * } else {
 *   // mostrar resultado normal con result.score y result.category
 * }
 * ```
 */
export function getScoringFunction(functionName: string): ScoringFunction {
  const fn = SCORING_REGISTRY[functionName]

  if (!fn) {
    const available = Object.keys(SCORING_REGISTRY).join(', ')
    throw new Error(
      `[getScoringFunction] Función de scoring "${functionName}" no registrada. ` +
      `Disponibles: ${available}`,
    )
  }

  return fn
}

/**
 * Devuelve la lista de nombres de funciones de scoring registradas.
 * Útil para validación o UI dinámica.
 *
 * @returns Array de nombres registrados
 */
export function getAvailableScoringFunctions(): string[] {
  return Object.keys(SCORING_REGISTRY)
}
