/**
 * @file components/test-framework/ProgressBar.tsx
 * @description Barra de progreso horizontal para tests psicológicos.
 * Muestra "X de Y • Z restantes" con gradient primary→accent.
 * Sticky debajo del header (top-[60px]).
 */

import React from 'react'

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
      className="sticky top-[60px] z-30 w-full bg-white border-b border-gray-200 px-4 py-3"
      role="region"
      aria-label="Progreso del cuestionario"
    >
      {/* ── Etiqueta de texto ─────────────────────────────────────────────── */}
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
            {currentQuestion}
          </span>
          {' '}de {totalQuestions} • <span className="text-gray-500">{remaining} restantes</span>
        </span>
        <span className="text-gray-400 text-xs">{percentage}%</span>
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
