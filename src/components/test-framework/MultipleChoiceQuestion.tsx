/**
 * @file components/test-framework/MultipleChoiceQuestion.tsx
 * @description Pregunta de opción múltiple (single-select).
 * Renderiza las opciones como botones con feedback visual al seleccionar.
 * Accesible con role="radiogroup".
 */

import React from 'react'
import type { QuestionOption } from '@/types/test'

// ── Props ────────────────────────────────────────────────────────────────────

interface MultipleChoiceQuestionProps {
  /** Texto de la pregunta */
  question: string
  /** Valor actualmente seleccionado (string del campo value de la opción) */
  value: string | undefined
  /** Callback con el value de la opción seleccionada */
  onChange: (value: string) => void
  /** Lista de opciones disponibles */
  options: QuestionOption[]
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * MultipleChoiceQuestion — selección única entre varias opciones.
 *
 * @param question - Texto de la pregunta
 * @param value    - Valor de la opción actualmente seleccionada
 * @param onChange - Callback al cambiar selección
 * @param options  - Array de opciones { value, label }
 * @returns Grupo de botones accesibles con visual feedback
 */
const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  value,
  onChange,
  options,
}) => {
  const groupId = React.useId()

  return (
    <div
      role="radiogroup"
      aria-labelledby={`${groupId}-label`}
      className="w-full"
    >
      {/* Etiqueta oculta para screen readers */}
      <span id={`${groupId}-label`} className="sr-only">{question}</span>

      {/* ── Lista de opciones ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              className={`
                w-full min-h-[48px] rounded-xl border-2 px-5 py-3 text-left text-base
                font-medium transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2
                ${isSelected
                  ? 'border-[#0066CC] bg-[#0066CC] text-white shadow-md'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-[#0066CC] hover:bg-blue-50 hover:text-[#0066CC]'
                }
              `}
            >
              {/* Indicador de selección */}
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`
                    flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2
                    transition-colors
                    ${isSelected
                      ? 'border-white bg-white'
                      : 'border-gray-400 bg-transparent'
                    }
                  `}
                >
                  {isSelected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0066CC]" />
                  )}
                </span>
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MultipleChoiceQuestion
