/**
 * @file components/test-framework/LikertScale.tsx
 * @description Componente de escala Likert con slider táctil, auto-avance y
 * feedback visual. Optimizado para mobile-first (thumb 56px, touch-friendly).
 *
 * @param question   - Texto de la pregunta
 * @param value      - Valor actual (undefined si no se ha respondido)
 * @param onChange   - Callback de cambio de valor
 * @param scale      - Rango del slider ({ min, max, step })
 * @param labels     - Etiquetas de los extremos ({ min, max })
 * @param onAdvance  - Si se pasa, activa auto-advance ~400ms tras selección
 */

import React from 'react'

// ── Props ────────────────────────────────────────────────────────────────────

interface LikertScaleProps {
  /** Texto de la pregunta */
  question: string
  /** Valor actual seleccionado (undefined = sin respuesta) */
  value: number | undefined
  /** Callback que recibe el nuevo valor al cambiar */
  onChange: (value: number) => void
  /** Configuración del rango del slider */
  scale?: { min: number; max: number; step?: number }
  /** Etiquetas para los extremos del slider */
  labels?: { min: string; max: string }
  /** Callback para auto-avanzar al siguiente tras selección (~400ms delay) */
  onAdvance?: () => void
}

// ── Helpers de color ──────────────────────────────────────────────────────────

/** Clases Tailwind de texto según nivel (0=verde … max=rojo). */
function getValueTextColor(value: number, max: number): string {
  const ratio = value / max
  if (ratio === 0)    return 'text-green-600'
  if (ratio <= 0.33)  return 'text-yellow-500'
  if (ratio <= 0.66)  return 'text-orange-500'
  return 'text-red-600'
}

/** Color hex del track izquierdo según nivel. */
function getTrackFillColor(value: number, max: number): string {
  const ratio = value / max
  if (ratio === 0)    return '#10B981'
  if (ratio <= 0.33)  return '#F59E0B'
  if (ratio <= 0.66)  return '#F97316'
  return '#EF4444'
}

// ── Componente ────────────────────────────────────────────────────────────────

const LikertScale: React.FC<LikertScaleProps> = ({
  question,
  value,
  onChange,
  scale  = { min: 0, max: 3, step: 1 },
  labels = { min: 'Nunca', max: 'Casi todos los días' },
  onAdvance,
}) => {
  const { min, max, step = 1 } = scale
  const hasValue  = value !== undefined
  const inputId   = React.useId()

  // Estado de feedback visual post-selección
  const [showFeedback, setShowFeedback] = React.useState(false)
  const advanceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Limpieza al desmontar
  React.useEffect(() => {
    return () => { if (advanceTimer.current) clearTimeout(advanceTimer.current) }
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (newValue: number) => {
    // Reiniciar temporizador de auto-avance si el usuario sigue deslizando
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    onChange(newValue)

    if (onAdvance) {
      setShowFeedback(true)
      advanceTimer.current = setTimeout(() => {
        setShowFeedback(false)
        onAdvance()
      }, 400)
    }
  }

  /** Enter/Space confirman y auto-avanzan inmediatamente si hay valor. */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && onAdvance && hasValue) {
      e.preventDefault()
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
      setShowFeedback(false)
      onAdvance()
    }
  }

  // ── Estilos dinámicos ─────────────────────────────────────────────────────

  const fillColor  = hasValue ? getTrackFillColor(value!, max) : '#0066CC'
  const fillPct    = hasValue ? ((value! - min) / (max - min)) * 100 : 0
  const trackStyle = hasValue
    ? `linear-gradient(to right, ${fillColor} ${fillPct}%, #E5E7EB ${fillPct}%)`
    : undefined

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full px-4 sm:px-2">

      {/* ── Círculo de feedback ────────────────────────────────────────────── */}
      <div className="mb-6 flex justify-center">
        <div
          aria-live="polite"
          aria-atomic="true"
          className={`
            flex h-16 w-16 items-center justify-center rounded-full border-2
            text-3xl font-bold transition-all duration-200
            ${showFeedback
              ? 'border-green-500 bg-green-50 text-green-600 animate-pulse'
              : hasValue
                ? `border-[#0066CC] bg-blue-50 ${getValueTextColor(value!, max)}`
                : 'border-gray-200 bg-gray-50 text-gray-300'
            }
          `}
        >
          {showFeedback ? '✓' : hasValue ? value : '–'}
        </div>
      </div>

      {/* ── Slider ────────────────────────────────────────────────────────── */}
      <label htmlFor={inputId} className="sr-only">{question}</label>

      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? min}
        onChange={(e) => handleChange(Number(e.target.value))}
        onFocus={() => { if (!hasValue) onChange(min) }}
        onKeyDown={handleKeyDown}
        aria-label={question}
        aria-valuetext={
          hasValue
            ? `${value} — ${value === min ? labels.min : value === max ? labels.max : String(value)}`
            : 'Sin responder'
        }
        className="
          w-full cursor-pointer appearance-none rounded-full
          h-3
          bg-gray-200
          focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2
          [&::-webkit-slider-thumb]:h-14
          [&::-webkit-slider-thumb]:w-14
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[#0066CC]
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:transition-all
          [&::-webkit-slider-thumb]:duration-200
          hover:[&::-webkit-slider-thumb]:h-16
          hover:[&::-webkit-slider-thumb]:w-16
          [&::-moz-range-thumb]:h-14
          [&::-moz-range-thumb]:w-14
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:bg-[#0066CC]
          [&::-moz-range-thumb]:shadow-md
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:transition-all
          [&::-moz-range-thumb]:duration-200
        "
        style={{ background: trackStyle }}
      />

      {/* ── Etiquetas de extremos ─────────────────────────────────────────── */}
      <div className="mt-3 flex justify-between text-xs text-gray-500 select-none leading-snug">
        <span className="max-w-[45%] text-left">{labels.min}</span>
        <span className="max-w-[45%] text-right">{labels.max}</span>
      </div>

      {/* ── Marcadores numéricos intermedios (posición absoluta exacta) ───── */}
      <div className="relative mt-1 h-5 select-none" aria-hidden="true">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => {
          const total    = max - min
          const pct      = total === 0 ? 0 : ((n - min) / total) * 100
          // Compensación de borde: 0% sin offset, 100% corrido a la izquierda, intermedios centrados
          const tx = n === min ? '0%' : n === max ? '-100%' : '-50%'
          return (
            <span
              key={n}
              className={`
                absolute top-0 text-[11px] font-medium transition-colors duration-200
                ${value === n ? 'text-[#0066CC]' : 'text-gray-400'}
              `}
              style={{ left: `${pct}%`, transform: `translateX(${tx})` }}
            >
              {n}
            </span>
          )
        })}
      </div>

      {/* ── Hint de teclado (solo cuando hay auto-avance) ─────────────────── */}
      {onAdvance && (
        <p className="mt-3 text-center text-[11px] text-gray-400 select-none">
          Avance automático · <kbd className="font-mono">Enter</kbd> para confirmar
        </p>
      )}
    </div>
  )
}

export default LikertScale
