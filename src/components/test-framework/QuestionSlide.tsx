/**
 * @file components/test-framework/QuestionSlide.tsx
 * @description Wrapper de pregunta con animaciones TDAH.
 *
 * - Entrada: fadeInQuestion (0.6s, delay 0.2s) + riseUpAfterReveal (0.8s, delay 0.9s)
 * - Salida:  slideOutUpTikTok (0.4s) cuando isExiting=true
 * - Opciones: fadeInContent con delay 1.8s (aparecen mientras pregunta sube)
 *
 * Uso:
 * ```tsx
 * <QuestionSlide key={currentIdx} questionLabel="Pregunta 3" isExiting={isExiting}>
 *   <QuestionRenderer ... />
 * </QuestionSlide>
 * ```
 */

import React from 'react'

// ── Props ────────────────────────────────────────────────────────────────────

interface QuestionSlideProps {
  /** Texto de la etiqueta superior (ej: "Pregunta 3") */
  questionLabel: string
  /** Texto completo de la pregunta (mostrado en 2.3rem) */
  question: string
  /** Cuando true aplica animación de salida slideOutUpTikTok */
  isExiting: boolean
  /** Contenido de opciones/respuestas (QuestionRenderer) */
  children: React.ReactNode
}

// ── Componente ────────────────────────────────────────────────────────────────

const QuestionSlide: React.FC<QuestionSlideProps> = ({
  questionLabel,
  question,
  isExiting,
  children,
}) => {
  return (
    <div className={isExiting ? 'animate-slide-out-tiktok' : ''}>
      {/* ── Pregunta: fade-in + sube después de aparecer ─────────────────── */}
      <div className="animate-question-slide mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {questionLabel}
        </p>
        <h2
          style={{
            fontSize: '2.3rem',
            fontWeight: 600,
            lineHeight: 1.2,
            color: '#374151',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {question}
        </h2>
      </div>

      {/* ── Opciones: aparecen con stagger (delay 1.8s) ──────────────────── */}
      <div className="animate-options-appear">
        {children}
      </div>
    </div>
  )
}

export default QuestionSlide
