/**
 * @file components/test-framework/SliderScale.tsx
 * @description Barra deslizante para escalas de muchos pasos (DES-II: 0–100 % de 10 en 10).
 *
 * Prueba pedida por Emmanuel (2026-11-20) como alternativa a la rejilla; se activa por test con
 * `"likertDisplay": "slider"` en {lang}.json. Diferencias con un slider nativo:
 * - Sin valor por defecto: hasta el primer toque no hay marcador y no se puede avanzar.
 * - Se toca o se arrastra en cualquier punto de la barra y salta al paso más cercano.
 * - Sin auto-avance: al arrastrar se ajusta, y se confirma con «Siguiente».
 * - Teclado: flechas (un paso), Inicio y Fin. role="slider" con aria-valuetext.
 */

import React from 'react'
import type { ResponseOption } from '@/types/test'

interface SliderScaleProps {
  question: string
  value: number | undefined
  onChange: (value: number) => void
  /** Opciones en orden; cada una es un paso de la barra */
  options: ResponseOption[]
}

const SliderScale: React.FC<SliderScaleProps> = ({ question, value, onChange, options }) => {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const dragging = React.useRef(false)
  const idx      = options.findIndex((o) => o.value === value)
  const hasValue = idx >= 0
  const last     = options.length - 1
  const pct      = hasValue ? (idx / last) * 100 : 0

  const pick = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const next  = options[Math.round(ratio * last)]
    if (next && next.value !== value) onChange(next.value)
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    pick(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) pick(e.clientX)
  }
  const onPointerUp = () => { dragging.current = false }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const from = hasValue ? idx : -1
    let to = from
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') to = Math.min(last, from + 1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') to = Math.max(0, from - 1)
    else if (e.key === 'Home') to = 0
    else if (e.key === 'End') to = last
    else return
    e.preventDefault()
    if (to !== from && options[to]) onChange(options[to].value)
  }

  return (
    <div className="w-full select-none" style={{ animation: 'fadeInContent 0.5s ease-out 1.15s both' }}>
      {/* Valor elegido, grande; antes del primer toque, la indicación */}
      <p
        className={`mb-3 text-center font-semibold tabular-nums ${hasValue ? 'text-3xl' : 'text-base'}`}
        style={{ color: 'var(--color-primary)', opacity: hasValue ? 1 : 0.75 }}
        aria-hidden="true"
      >
        {hasValue ? options[idx].label : 'Toca o desliza en la barra'}
      </p>

      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={question}
        aria-valuemin={Number(options[0]?.value)}
        aria-valuemax={Number(options[last]?.value)}
        aria-valuenow={hasValue ? Number(value) : undefined}
        aria-valuetext={hasValue ? options[idx].label : 'Sin responder'}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="relative mx-3 h-14 cursor-pointer touch-none rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
        style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
      >
        {/* Pista */}
        <div className="absolute left-0 right-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-gray-200" />
        {hasValue && (
          <div
            className="absolute left-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }}
          />
        )}
        {/* Marcas de cada paso */}
        {options.map((o, i) => (
          <span
            key={o.value}
            className="absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded bg-gray-400"
            style={{ left: `${(i / last) * 100}%`, opacity: hasValue && i <= idx ? 0 : 0.6 }}
          />
        ))}
        {/* Marcador: solo cuando hay respuesta */}
        {hasValue && (
          <span
            className="absolute top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 bg-white shadow-md transition-[left] duration-100"
            style={{ left: `${pct}%`, borderColor: 'var(--color-primary)' }}
          />
        )}
      </div>

      {/* Extremos y punto medio rotulados */}
      <div className="mx-3 mt-1 flex justify-between text-sm font-medium text-gray-600 tabular-nums">
        <span>{options[0]?.label}</span>
        <span>{options[Math.round(last / 2)]?.label}</span>
        <span>{options[last]?.label}</span>
      </div>
    </div>
  )
}

export default SliderScale
