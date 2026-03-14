/**
 * @file components/test-framework/BooleanQuestion.tsx
 * @description Pregunta de tipo Sí/No con dos botones de selección exclusiva.
 * El botón seleccionado aparece resaltado en azul. Accessible via teclado.
 */

import React from 'react'

// ── Props ────────────────────────────────────────────────────────────────────

interface BooleanOptions {
  /** Texto del botón afirmativo (por defecto "Sí") */
  yes?: string
  /** Texto del botón negativo (por defecto "No") */
  no?: string
}

interface BooleanQuestionProps {
  /** Texto de la pregunta */
  question: string
  /** Valor actual: true (sí), false (no), o undefined (sin responder) */
  value: boolean | undefined
  /** Callback con el nuevo valor al seleccionar */
  onChange: (value: boolean) => void
  /** Personalización de los textos de los botones */
  options?: BooleanOptions
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * BooleanQuestion — pregunta de respuesta Sí/No.
 *
 * @param question - Texto de la pregunta
 * @param value    - Valor actual (true | false | undefined)
 * @param onChange - Callback al cambiar selección
 * @param options  - Etiquetas personalizadas para los botones
 * @returns Grupo de dos botones accesibles con feedback visual
 */
const BooleanQuestion: React.FC<BooleanQuestionProps> = ({
  question,
  value,
  onChange,
  options = {},
}) => {
  const yesLabel = options.yes ?? 'Sí'
  const noLabel  = options.no  ?? 'No'
  const groupId  = React.useId()

  return (
    <div role="group" aria-labelledby={`${groupId}-label`} className="w-full">
      {/* Etiqueta de pregunta oculta para screen readers */}
      <span id={`${groupId}-label`} className="sr-only">{question}</span>

      {/* ── Botones ────────────────────────────────────────────────────────── */}
      <div className="flex gap-4">

        {/* Botón SÍ */}
        <button
          type="button"
          role="radio"
          aria-checked={value === true}
          onClick={() => onChange(true)}
          className={`
            flex-1 min-h-[48px] rounded-xl border-2 text-base font-semibold
            transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2
            ${value === true
              ? 'border-[#0066CC] bg-[#0066CC] text-white shadow-md scale-[1.02]'
              : 'border-gray-300 bg-white text-gray-700 hover:border-[#0066CC] hover:text-[#0066CC] hover:bg-blue-50'
            }
          `}
        >
          <span aria-hidden="true" className="mr-2">✓</span>
          {yesLabel}
        </button>

        {/* Botón NO */}
        <button
          type="button"
          role="radio"
          aria-checked={value === false}
          onClick={() => onChange(false)}
          className={`
            flex-1 min-h-[48px] rounded-xl border-2 text-base font-semibold
            transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2
            ${value === false
              ? 'border-[#0066CC] bg-[#0066CC] text-white shadow-md scale-[1.02]'
              : 'border-gray-300 bg-white text-gray-700 hover:border-[#0066CC] hover:text-[#0066CC] hover:bg-blue-50'
            }
          `}
        >
          <span aria-hidden="true" className="mr-2">✗</span>
          {noLabel}
        </button>
      </div>
    </div>
  )
}

export default BooleanQuestion
