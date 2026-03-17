/**
 * @file types/test.ts
 * @description Definiciones de tipos TypeScript compartidos para el framework
 * de tests psicológicos. Todos los componentes del framework usan estos tipos.
 */

// ── Preguntas ───────────────────────────────────────────────────────────────

/** Tipos de pregunta soportados por el framework */
export type QuestionType = 'likert' | 'boolean' | 'text' | 'multipleChoice'

/** Opción individual para preguntas de selección múltiple o booleanas */
export interface QuestionOption {
  value: string
  label: string
}

/** Condición para mostrar una pregunta de forma condicional */
export interface ShowIfCondition {
  /** ID de la pregunta que activa esta condición */
  questionId: string
  /** Valor que debe tener la pregunta para mostrar esta */
  value: string | number | boolean
}

/** Reglas de validación para preguntas de texto */
export interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
}

/**
 * Definición completa de una pregunta del test.
 * Dependiendo del `type`, algunos campos son relevantes u opcionales.
 */
export interface Question {
  /** Identificador único (ej: "q1", "gad7_1") */
  id: string
  /** Tipo de input que renderiza el framework */
  type: QuestionType
  /** Texto de la pregunta que ve el usuario */
  text: string

  // ── Likert ────────────────────────────────────────────────────────────────
  /** Rango numérico del slider (por defecto 0–3) */
  scale?: { min: number; max: number; step?: number }
  /** Etiquetas de los extremos del slider */
  labels?: { min: string; max: string }

  // ── Boolean ───────────────────────────────────────────────────────────────
  /** Textos personalizados para los botones Sí/No */
  booleanOptions?: { yes: string; no: string }

  // ── Text ──────────────────────────────────────────────────────────────────
  placeholder?: string
  maxLength?: number
  validation?: ValidationRules

  // ── MultipleChoice ────────────────────────────────────────────────────────
  /** Opciones de selección */
  options?: QuestionOption[]

  // ── Lógica condicional ────────────────────────────────────────────────────
  /** Si se define, solo muestra esta pregunta cuando se cumple la condición */
  showIf?: ShowIfCondition

  // ── Red flags ─────────────────────────────────────────────────────────────
  /** Marca esta pregunta como posible indicador de crisis */
  isRedFlag?: boolean
  /** Valores específicos que disparan una alerta de crisis */
  redFlagValues?: Array<string | number | boolean>
}

// ── Puntuación ──────────────────────────────────────────────────────────────

/** Regla de puntuación que mapea un rango de score a una categoría */
export interface ScoringRule {
  min: number
  /** null significa "sin límite superior" */
  max: number | null
  /** Etiqueta de la categoría (ej: "Ansiedad leve") */
  category: string
  /** Color Tailwind para mostrar la categoría (ej: "green", "yellow", "red") */
  color: 'green' | 'yellow' | 'orange' | 'red'
  /** Clave para buscar el mensaje en messages.json */
  messageKey: string
}

// ── Triggers de seguimiento ──────────────────────────────────────────────────

/** Disparador que activa una pregunta de seguimiento */
export interface FollowUpTrigger {
  /** ID de la pregunta que puede disparar el seguimiento */
  questionId: string
  /** Valor que activa el trigger */
  value: string | number | boolean
  /** Mensaje o ID de pregunta de seguimiento */
  followUpMessage: string
}

// ── Estructura del test ──────────────────────────────────────────────────────

/**
 * Definición completa de un test psicológico.
 * Se carga desde /data/tests.json.
 */
export interface TestDefinition {
  /** Identificador único del test (ej: "gad7") */
  id: string
  /** Nombre completo para mostrar */
  name: string
  /** Versión del test */
  version: string
  /** Código de idioma (ej: "es", "en") */
  lang: string
  /** Descripción corta del test */
  description?: string
  /** Número total de preguntas visibles por defecto */
  questions: Question[]
  /** Reglas para calcular e interpretar el score */
  scoring: ScoringRule[]
  /** Triggers opcionales para preguntas de seguimiento */
  followUpTriggers?: FollowUpTrigger[]
  /** Texto del disclaimer antes del test */
  disclaimerBefore?: string
  /** Texto del disclaimer después del test */
  disclaimerAfter?: string
}

// ── Mensajes de resultado ────────────────────────────────────────────────────

/** Mensaje estándar de resultado (tipo NORMAL) */
export interface NormalMessage {
  title: string
  body: string
  recommendation: string
}

/** Teléfono de crisis */
export interface CrisisPhone {
  label: string
  number: string
}

/** Recurso de apoyo */
export interface CrisisResource {
  label: string
  url?: string
}

/** Mensaje de crisis (tipo CRISIS) */
export interface CrisisMessage {
  title: string
  body: string
  phones: CrisisPhone[]
  resources: CrisisResource[]
}

/** Mapa de mensajes por clave */
export interface MessagesMap {
  [testId: string]: {
    [lang: string]: {
      normal: { [messageKey: string]: NormalMessage }
      crisis: CrisisMessage
    }
  }
}

// ── Estado del test ──────────────────────────────────────────────────────────

/** Estado del componente TestContainer */
export type TestState = 'loading' | 'answering' | 'calculating' | 'sharing' | 'result' | 'error'

/** Respuestas del usuario: mapa de questionId → valor */
export type AnswersMap = Record<string, string | number | boolean>

/** Resultado calculado tras completar el test */
export interface TestResult {
  /** null en caso de crisis (no se muestra score) */
  score: number | null
  type: 'NORMAL' | 'CRISIS'
  category?: string
  color?: ScoringRule['color']
  message: NormalMessage | CrisisMessage
}

// ── Metadata del test ────────────────────────────────────────────────────────

export interface TestMetadataTranslation {
  validated: boolean
  reference?: string
  note?: string
}

export interface TestMetadata {
  id: string
  availableLangs: string[]
  category: 'psychometric' | 'quiz'
  originalInstrument: string
  use: string[]
  measures: string[]
  validated: boolean
  validationDetails: {
    original: {
      lang: string
      reference: string
      journal: string
      doi: string
      sample: string
      sensitivity: string
      specificity: string
    }
    translations: Record<string, TestMetadataTranslation>
  }
  ageRange: { min: number; max: number | null }
  selfAdministrable: boolean
  timeToComplete: string
  itemCount: number
  itemType: string
  scoringRange: { min: number; max: number }
  cutoffs: Record<string, [number, number]>
  copyright: string
}

// ── Landing page del test ─────────────────────────────────────────────────────

export interface TestLandingFaq {
  q: string
  a: string
}

export interface TestLanding {
  hook: string
  description: string
  whatItMeasures: string
  whoIsItFor: string
  howItWorks: string[]
  faq: TestLandingFaq[]
}

// ── Archivo de idioma completo ────────────────────────────────────────────────

export interface TestLangFile {
  id: string
  lang: string
  name: string
  version: string
  scoringFunction: string
  disclaimerBefore?: string
  disclaimerAfter?: string
  landing: TestLanding
  questions: Question[]
  scoring: ScoringRule[]
  results: {
    normal: Record<string, NormalMessage>
    crisis: CrisisMessage
  }
}
