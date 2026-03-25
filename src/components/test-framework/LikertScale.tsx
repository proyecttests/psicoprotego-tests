/**
 * @file components/test-framework/LikertScale.tsx
 * @description Escala Likert TDAH-optimizada: 4 cards táctiles, stagger entrada,
 * float hint si no responde en 2.8s, auto-avance 200ms tras selección.
 */

import React from 'react'

// ── Props ────────────────────────────────────────────────────────────────────

interface LikertScaleProps {
  question: string
  value: number | undefined
  onChange: (value: number) => void
  scale?: { min: number; max: number; step?: number }
  labels?: { min: string; max: string }
  onAdvance?: () => void
  lang?: string
}

// ── Labels por defecto por idioma (GAD-7 / PHQ-9 estándar) ───────────────

const DEFAULT_OPTION_LABELS: Record<string, string[]> = {
  es: ['Nunca', 'Varios días', 'Más de la mitad de los días', 'Casi todos los días'],
  en: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  pt: ['Nunca', 'Vários dias', 'Mais de metade dos dias', 'Quase todos os dias'],
}

// ── Delays de stagger para entrada de cards ───────────────────────────────

const STAGGER_DELAYS = ['1.15s', '1.3s', '1.45s', '1.6s']

// ── Componente ────────────────────────────────────────────────────────────────

const LikertScale: React.FC<LikertScaleProps> = ({
  question,
  value,
  onChange,
  scale    = { min: 0, max: 3, step: 1 },
  onAdvance,
  lang = 'es',
}) => {
  const { min, max } = scale
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

  const handleSelect = (newValue: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    onChange(newValue)
    if (onAdvance) {
      advanceTimer.current = setTimeout(() => {
        onAdvance()
      }, 200)
    }
  }

  // ── Opciones generadas del rango ─────────────────────────────────────────

  const optionLabels = DEFAULT_OPTION_LABELS[lang] ?? DEFAULT_OPTION_LABELS['es']
  const options = Array.from({ length: max - min + 1 }, (_, i) => ({
    value: i + min,
    label: optionLabels[i] ?? String(i + min),
  }))

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className={`w-full flex flex-col gap-3${showFloat ? ' animate-floatUp' : ''}`}
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
            className="
              flex items-center gap-4 w-full px-5 py-4 rounded-xl border-2 text-left
              transition-colors duration-150 cursor-pointer
              hover:border-gray-300 hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2
            "
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
