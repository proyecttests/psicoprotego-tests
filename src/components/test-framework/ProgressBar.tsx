/**
 * @file components/test-framework/ProgressBar.tsx
 * @description Barra de progreso horizontal para tests psicológicos.
 * Muestra visualmente el avance del usuario a través del cuestionario.
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

/**
 * ProgressBar — barra de progreso horizontal con porcentaje dinámico.
 *
 * @param currentQuestion - Pregunta actual (1-indexed)
 * @param totalQuestions  - Número total de preguntas
 * @returns Elemento de progreso accesible con texto y barra visual
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ currentQuestion, totalQuestions }) => {
  // Calcula el porcentaje completado (0–100)
  const percentage = Math.round(((currentQuestion - 1) / totalQuestions) * 100)

  return (
    <div
      className="w-full px-4 py-3 sm:px-6"
      role="region"
      aria-label="Progreso del cuestionario"
    >
      {/* ── Etiqueta de texto ─────────────────────────────────────────────── */}
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          Pregunta{' '}
          <span className="text-[#0066CC] font-semibold">{currentQuestion}</span>{' '}
          de{' '}
          <span className="font-semibold">{totalQuestions}</span>
        </span>
        <span className="text-gray-400 text-xs">{percentage}% completado</span>
      </div>

      {/* ── Barra visual ──────────────────────────────────────────────────── */}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso: pregunta ${currentQuestion} de ${totalQuestions}`}
        className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className="h-full rounded-full bg-[#0066CC] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
