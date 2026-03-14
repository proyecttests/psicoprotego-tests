/**
 * @file components/test-framework/TextQuestion.tsx
 * @description Pregunta de respuesta libre con textarea.
 * Incluye contador de caracteres (cuando se define maxLength) y
 * validación en tiempo real con feedback visual.
 */

import React from 'react'
import type { ValidationRules } from '@/types/test'

// ── Props ────────────────────────────────────────────────────────────────────

interface TextQuestionProps {
  /** Texto de la pregunta */
  question: string
  /** Valor actual del textarea */
  value: string | undefined
  /** Callback al cambiar el contenido */
  onChange: (value: string) => void
  /** Texto de ejemplo dentro del textarea */
  placeholder?: string
  /** Longitud máxima del texto */
  maxLength?: number
  /** Reglas de validación */
  validation?: ValidationRules
}

// ── Hook de validación ────────────────────────────────────────────────────────

/**
 * Valida el valor actual contra las reglas proporcionadas.
 * @returns Mensaje de error o null si es válido
 */
function useValidation(value: string | undefined, rules?: ValidationRules): string | null {
  if (!rules) return null
  const text = value ?? ''

  if (rules.required && text.trim().length === 0) {
    return 'Este campo es obligatorio.'
  }
  if (rules.minLength && text.length < rules.minLength) {
    return `Mínimo ${rules.minLength} caracteres.`
  }
  if (rules.maxLength && text.length > rules.maxLength) {
    return `Máximo ${rules.maxLength} caracteres.`
  }
  if (rules.pattern && !new RegExp(rules.pattern).test(text)) {
    return 'El formato no es válido.'
  }
  return null
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * TextQuestion — textarea con contador de caracteres y validación en tiempo real.
 *
 * @param question    - Texto de la pregunta
 * @param value       - Valor actual
 * @param onChange    - Callback de cambio
 * @param placeholder - Texto de ejemplo
 * @param maxLength   - Límite de caracteres (activa el contador)
 * @param validation  - Reglas de validación
 * @returns Textarea accesible con feedback de validación
 */
const TextQuestion: React.FC<TextQuestionProps> = ({
  question,
  value,
  onChange,
  placeholder = 'Escribe tu respuesta aquí…',
  maxLength,
  validation,
}) => {
  const [touched, setTouched] = React.useState(false)
  const inputId    = React.useId()
  const errorId    = React.useId()
  const currentLen = (value ?? '').length
  const error      = useValidation(value, validation)

  // Determina si el contador debe mostrarse en rojo
  const isNearLimit = maxLength !== undefined && currentLen >= maxLength * 0.9

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="sr-only"
      >
        {question}
      </label>

      {/* ── Textarea ──────────────────────────────────────────────────────── */}
      <textarea
        id={inputId}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        aria-describedby={touched && error ? errorId : undefined}
        aria-invalid={touched && Boolean(error)}
        className={`
          w-full resize-y rounded-xl border-2 bg-white px-4 py-3 text-base text-gray-800
          placeholder:text-gray-400 leading-relaxed
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${touched && error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-300'
            : 'border-gray-300 focus:border-[#0066CC] focus:ring-blue-200'
          }
        `}
      />

      {/* ── Footer del textarea (contador + error) ───────────────────────── */}
      <div className="mt-1 flex items-start justify-between gap-2">
        {/* Error de validación */}
        <div>
          {touched && error && (
            <p
              id={errorId}
              role="alert"
              className="text-sm text-red-600 font-medium"
            >
              {error}
            </p>
          )}
        </div>

        {/* Contador de caracteres */}
        {maxLength !== undefined && (
          <p
            aria-live="polite"
            className={`ml-auto shrink-0 text-xs font-medium tabular-nums transition-colors ${
              isNearLimit ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {currentLen}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

export default TextQuestion
