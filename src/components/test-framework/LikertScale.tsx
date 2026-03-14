/**
 * @file components/test-framework/LikertScale.tsx
 * @description Componente de escala Likert con slider táctil.
 * Soporta rangos configurables (por defecto 0–3) y muestra etiquetas
 * en los extremos del slider. Optimizado para mobile (touch-friendly).
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
}

// ── Colores de feedback según valor ──────────────────────────────────────────

/**
 * Devuelve las clases Tailwind de color según el nivel seleccionado (0–3).
 * 0 = verde, 1 = amarillo, 2 = naranja, 3 = rojo.
 */
function getValueColor(value: number, max: number): string {
  const ratio = value / max
  if (ratio === 0) return 'text-green-600'
  if (ratio <= 0.33) return 'text-yellow-500'
  if (ratio <= 0.66) return 'text-orange-500'
  return 'text-red-600'
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * LikertScale — slider de respuesta con feedback visual.
 *
 * @param question - Texto de la pregunta
 * @param value    - Valor actual (undefined si no se ha respondido)
 * @param onChange - Callback de cambio de valor
 * @param scale    - Configuración del rango ({ min, max, step })
 * @param labels   - Etiquetas de los extremos ({ min, max })
 * @returns Input range accesible con etiquetas y valor destacado
 */
const LikertScale: React.FC<LikertScaleProps> = ({
  question,
  value,
  onChange,
  scale = { min: 0, max: 3, step: 1 },
  labels = { min: 'Nunca', max: 'Casi todos los días' },
}) => {
  const { min, max, step = 1 } = scale
  const hasValue = value !== undefined
  const inputId = React.useId()

  return (
    <div className="w-full">
      {/* ── Número grande (feedback visual) ────────────────────────────────── */}
      <div className="mb-4 flex justify-center">
        <div
          aria-live="polite"
          aria-atomic="true"
          className={`
            flex h-16 w-16 items-center justify-center rounded-full border-2 text-3xl font-bold
            transition-all duration-200
            ${hasValue
              ? `border-[#0066CC] bg-blue-50 ${getValueColor(value!, max)}`
              : 'border-gray-200 bg-gray-50 text-gray-300'
            }
          `}
        >
          {hasValue ? value : '–'}
        </div>
      </div>

      {/* ── Slider ────────────────────────────────────────────────────────── */}
      <label htmlFor={inputId} className="sr-only">
        {question}
      </label>

      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? min}
        onChange={(e) => onChange(Number(e.target.value))}
        onFocus={() => { if (!hasValue) onChange(min) }}
        aria-label={question}
        aria-valuetext={hasValue ? `${value} — ${value === min ? labels.min : value === max ? labels.max : ''}` : 'Sin responder'}
        className="
          w-full cursor-pointer appearance-none rounded-full
          h-3
          bg-gray-200
          accent-[#0066CC]
          focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2
          [&::-webkit-slider-thumb]:h-7
          [&::-webkit-slider-thumb]:w-7
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[#0066CC]
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:h-7
          [&::-moz-range-thumb]:w-7
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:bg-[#0066CC]
          [&::-moz-range-thumb]:shadow-md
        "
        style={{
          // Colorea el track izquierdo (parte completada) dinámicamente
          background: hasValue
            ? `linear-gradient(to right, #0066CC ${((value! - min) / (max - min)) * 100}%, #E5E7EB ${((value! - min) / (max - min)) * 100}%)`
            : undefined,
        }}
      />

      {/* ── Etiquetas de extremos ─────────────────────────────────────────── */}
      <div className="mt-2 flex justify-between text-xs text-gray-500 select-none">
        <span className="max-w-[45%] text-left leading-snug">{labels.min}</span>
        <span className="max-w-[45%] text-right leading-snug">{labels.max}</span>
      </div>

      {/* ── Marcadores numéricos ──────────────────────────────────────────── */}
      <div
        className="mt-1 flex justify-between px-1 text-[10px] text-gray-400 select-none"
        aria-hidden="true"
      >
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <span
            key={n}
            className={`font-medium transition-colors ${value === n ? 'text-[#0066CC]' : ''}`}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

export default LikertScale
