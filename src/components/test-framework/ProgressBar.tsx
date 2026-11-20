/**
 * @file components/test-framework/ProgressBar.tsx
 * @description Barra de progreso horizontal para tests psicológicos.
 * Muestra "X de Y • Z restantes" con gradient primary→accent.
 * Sticky arriba del todo: en modo test no hay cabecera. Lleva el botón «A+» (tamaño de letra).
 */

import React from 'react'
import TextSizeControl from '@/components/common/TextSizeControl'

// ── Props ────────────────────────────────────────────────────────────────────

interface ProgressBarProps {
  /** Número de la pregunta actual (1-indexed) */
  currentQuestion: number
  /** Total de preguntas del test */
  totalQuestions: number
}

// ── Componente ────────────────────────────────────────────────────────────────

const ProgressBar: React.FC<ProgressBarProps> = ({ currentQuestion, totalQuestions }) => {
  const percentage = Math.round((currentQuestion / totalQuestions) * 100)
  const remaining  = totalQuestions - currentQuestion

  return (
    <div
      className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 px-4 py-1.5 tall:py-2"
      role="region"
      aria-label="Progreso del cuestionario"
    >
      {/* ── Etiqueta de texto ─────────────────────────────────────────────── */}
      <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
        <span className="font-medium text-gray-700">
          <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
            {currentQuestion}
          </span>
          {' '}de {totalQuestions} • <span className="text-gray-500">{remaining} restantes</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-gray-500 text-xs">{percentage}%</span>
          <TextSizeControl compact />
        </span>
      </div>

      {/* ── Barra visual ──────────────────────────────────────────────────── */}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso: pregunta ${currentQuestion} de ${totalQuestions}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className="h-full transition-all duration-[600ms]"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
          }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
