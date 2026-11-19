/**
 * @file components/test-framework/LikertScale.tsx
 * @description Escala Likert TDAH-optimizada: 4 cards táctiles, stagger entrada,
 * float hint si no responde en 2.8s, auto-avance 200ms tras selección.
 *
 * Excepciones a la regla de 4 opciones (decisión de Emmanuel, 2026-11-19; ver ux-rules.md):
 * - 5 opciones (ASRS-6): las mismas cards, más bajas y más juntas, para que quepan en móviles pequeños.
 * - Más de 5 (DES-II, 0–100 % en 11 pasos): rejilla de botones de 6 columnas, en orden de lectura.
 */

import React from 'react'
import type { ResponseOption } from '@/types/test'

// ── Props ────────────────────────────────────────────────────────────────────

interface LikertScaleProps {
  question: string
  value: number | undefined
  onChange: (value: number) => void
  /** Opciones literales del instrumento, en orden (vienen del JSON del test) */
  options: ResponseOption[]
  onAdvance?: () => void
}

// ── Delays de stagger para entrada de cards ───────────────────────────────

const STAGGER_DELAYS = ['1.15s', '1.3s', '1.45s', '1.6s', '1.75s']

// ── Componente ────────────────────────────────────────────────────────────────

const LikertScale: React.FC<LikertScaleProps> = ({
  question,
  value,
  onChange,
  options,
  onAdvance,
}) => {
  const hasValue = value !== undefined

  // ── Flotación suave si no responde en 2.8s ──────────────────────────────
  const [showFloat, setShowFloat] = React.useState(false)
  const floatTimer   = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const advanceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (floatTimer.current)   clearTimeout(floatTimer.current)
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
  }, [])

  React.useEffect(() => {
    if (hasValue) {
      setShowFloat(false)
      if (floatTimer.current) clearTimeout(floatTimer.current)
      return
    }
    floatTimer.current = setTimeout(() => setShowFloat(true), 2800)
    return () => { if (floatTimer.current) clearTimeout(floatTimer.current) }
  }, [hasValue])

  // ── Selección + auto-avance ──────────────────────────────────────────────

  const compact = options.length === 5

  const handleSelect = (newValue: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    onChange(newValue)
    if (onAdvance) {
      advanceTimer.current = setTimeout(() => {
        onAdvance()
      }, 200)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (options.length > 5) {
    return (
      <div
        className={`w-full grid grid-cols-6 gap-2${showFloat ? ' animate-floatUp' : ''}`}
        role="radiogroup"
        aria-label={question}
      >
        {options.map((option, idx) => {
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(option.value)}
              style={{
                animation: `fadeInContent 0.5s ease-out ${(1.15 + idx * 0.05).toFixed(2)}s both`,
                borderColor: isSelected ? 'var(--color-primary)' : '#E5E7EB',
                backgroundColor: isSelected ? 'var(--color-primary)' : 'white',
                color: isSelected ? 'white' : '#374151',
              }}
              className="
                flex h-12 items-center justify-center rounded-xl border-2 px-1 text-sm font-semibold tabular-nums
                whitespace-nowrap transition-colors duration-150 cursor-pointer
                hover:border-gray-300 hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2
              "
            >
              {option.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={`w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}${showFloat ? ' animate-floatUp' : ''}`}
      role="radiogroup"
      aria-label={question}
    >
      {options.map((option, idx) => {
        const isSelected = value === option.value
        const delay      = STAGGER_DELAYS[idx] ?? '2.25s'

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelect(option.value)}
            style={{
              animation: `fadeInContent 0.5s ease-out ${delay} both`,
              borderColor: isSelected ? 'var(--color-primary)' : '#E5E7EB',
              backgroundColor: isSelected ? 'rgba(45,74,62,0.05)' : 'white',
            }}
            className={`
              flex items-center gap-4 w-full px-5 ${compact ? 'py-2.5' : 'py-3'} sm:py-4 rounded-xl border-2 text-left
              transition-colors duration-150 cursor-pointer
              hover:border-gray-300 hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2
            `}
          >
            {/* Radio indicator */}
            <div
              className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150"
              style={{
                borderColor: isSelected ? 'var(--color-primary)' : '#D1D5DB',
                backgroundColor: isSelected ? 'var(--color-primary)' : 'white',
              }}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>

            {/* Label */}
            <span
              className="text-sm font-medium"
              style={{ color: isSelected ? 'var(--color-primary)' : '#374151' }}
            >
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default LikertScale
