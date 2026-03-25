/**
 * @file components/test-framework/QuestionRenderer.tsx
 * @description Renderizador dinámico de preguntas.
 * Actúa como switch/dispatcher: recibe una pregunta y delega al componente
 * correcto según su `type`. Es agnóstico al test — solo lee el campo `type`.
 *
 * Tipos soportados:
 *  - 'likert'         → LikertScale
 *  - 'boolean'        → BooleanQuestion
 *  - 'text'           → TextQuestion
 *  - 'multipleChoice' → MultipleChoiceQuestion
 */

import React from 'react'
import type { Question, AnswersMap } from '@/types/test'

import LikertScale            from './LikertScale'
import BooleanQuestion        from './BooleanQuestion'
import TextQuestion           from './TextQuestion'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'

// ── Props ────────────────────────────────────────────────────────────────────

interface QuestionRendererProps {
  /** Definición completa de la pregunta desde el JSON */
  question: Question
  /** Mapa completo de respuestas actuales del test */
  answers: AnswersMap
  /** Callback que actualiza el mapa de respuestas */
  onChange: (questionId: string, value: string | number | boolean) => void
  /**
   * Callback de auto-avance para preguntas Likert.
   * Si se pasa, LikertScale avanzará ~400ms después de que el usuario seleccione.
   * Pasar `undefined` desactiva el auto-avance (ej: última pregunta).
   */
  onAdvance?: () => void
  /** Código de idioma para localizar labels por defecto */
  lang?: string
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * QuestionRenderer — dispatcher de tipos de pregunta.
 *
 * Lee `question.type` y renderiza el componente correcto con las props
 * adecuadas. Si el tipo es desconocido, muestra un fallback de advertencia.
 *
 * @param question   - Definición de la pregunta (type, text, scale, options…)
 * @param answers    - Respuestas actuales del usuario
 * @param onChange   - Callback para actualizar una respuesta
 * @param onAdvance  - Callback de auto-avance (solo usado por LikertScale)
 * @returns El componente de input apropiado al tipo de pregunta
 */
const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  answers,
  onChange,
  onAdvance,
  lang = 'es',
}) => {
  const currentValue = answers[question.id]

  switch (question.type) {

    // ── Likert (slider) ─────────────────────────────────────────────────────
    case 'likert':
      return (
        <LikertScale
          question={question.text}
          value={currentValue as number | undefined}
          onChange={(val) => onChange(question.id, val)}
          scale={question.scale}
          labels={question.labels}
          onAdvance={onAdvance}
          lang={lang}
        />
      )

    // ── Boolean (sí/no) ─────────────────────────────────────────────────────
    case 'boolean':
      return (
        <BooleanQuestion
          question={question.text}
          value={currentValue as boolean | undefined}
          onChange={(val) => onChange(question.id, val)}
          options={question.booleanOptions}
        />
      )

    // ── Text (textarea) ─────────────────────────────────────────────────────
    case 'text':
      return (
        <TextQuestion
          question={question.text}
          value={currentValue as string | undefined}
          onChange={(val) => onChange(question.id, val)}
          placeholder={question.placeholder}
          maxLength={question.maxLength}
          validation={question.validation}
        />
      )

    // ── MultipleChoice (radio buttons) ──────────────────────────────────────
    case 'multipleChoice':
      return (
        <MultipleChoiceQuestion
          question={question.text}
          value={currentValue as string | undefined}
          onChange={(val) => onChange(question.id, val)}
          options={question.options ?? []}
          onAdvance={onAdvance}
        />
      )

    // ── Fallback para tipos desconocidos ────────────────────────────────────
    default: {
      const unknownType = (question as { type: string }).type
      return (
        <div
          role="alert"
          className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800"
        >
          <strong>Tipo de pregunta no soportado:</strong>{' '}
          <code className="font-mono">"{unknownType}"</code>. Revisa el JSON del test.
        </div>
      )
    }
  }
}

export default QuestionRenderer
