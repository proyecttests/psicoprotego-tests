/**
 * @file components/common/Disclaimer.tsx
 * @description Aviso legal/educativo antes o después del test. Branding Psicoprotego.
 */

import React from 'react'

// ── Props ────────────────────────────────────────────────────────────────────

interface DisclaimerProps {
  type: 'before' | 'after'
  testName: string
  customText?: string
  onContinue: () => void
  onCancel?: () => void
}

// ── Textos por defecto ────────────────────────────────────────────────────────

const DEFAULT_TEXT_BEFORE = (testName: string) =>
  `El cuestionario ${testName} es una herramienta de evaluación psicológica validada clínicamente. Sus resultados son ` +
  `orientativos y tienen únicamente carácter educativo. **No sustituyen la evaluación, el diagnóstico ni el tratamiento ` +
  `de un profesional de la salud mental.** Si experimentas síntomas graves, por favor contacta con un profesional o ` +
  `llama al 024 (línea de atención a la conducta suicida en España).`

const DEFAULT_TEXT_AFTER = (testName: string) =>
  `Los resultados del ${testName} que vas a ver a continuación son orientativos. **No representan un diagnóstico clínico.** ` +
  `Si los resultados te generan preocupación, te recomendamos consultar con un profesional de la salud mental. ` +
  `Recuerda que buscar ayuda es un acto de fortaleza, no de debilidad.`

// ── Utilidad para renderizar negrita ─────────────────────────────────────────

function renderWithBold(text: string): React.ReactNode[] {
  const parts = text.split('**')
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-primary-600">{part}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  )
}

// ── Componente ────────────────────────────────────────────────────────────────

const Disclaimer: React.FC<DisclaimerProps> = ({
  type,
  testName,
  customText,
  onContinue,
  onCancel,
}) => {
  const text = customText
    ?? (type === 'before' ? DEFAULT_TEXT_BEFORE(testName) : DEFAULT_TEXT_AFTER(testName))

  const continueLabel = type === 'before' ? 'Entiendo y continuar' : 'Ver mis resultados'
  const title = type === 'before'
    ? 'Antes de comenzar — Aviso importante'
    : 'Antes de ver los resultados'

  return (
    <div
      role="alertdialog"
      aria-labelledby="disclaimer-title"
      aria-describedby="disclaimer-body"
      className="mx-auto w-[95%] max-w-2xl px-0 py-8 sm:px-6 sm:w-full"
    >
      {/* ── Caja de advertencia ─────────────────────────────────────────────── */}
      <div
        className="rounded-xl border border-primary-200 p-5 shadow-sm border-l-4 border-l-primary-500"
        style={{ backgroundColor: 'var(--color-cream)' }}
      >
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className="mt-0.5 text-4xl shrink-0">⚠️</span>
          <div className="min-w-0">
            <h2
              id="disclaimer-title"
              className="text-xl leading-snug"
            >
              {title}
            </h2>
            <p
              id="disclaimer-body"
              className="mt-2 text-sm leading-relaxed font-sans"
              style={{ color: '#666', lineHeight: '1.6' }}
            >
              {renderWithBold(text)}
            </p>
          </div>
        </div>

        <hr className="my-4 border-primary-100" />

        <p className="text-xs font-sans" style={{ color: '#666' }}>
          <strong className="font-semibold">En caso de crisis:</strong> llama al{' '}
          <a
            href="tel:024"
            className="font-bold text-primary-500 underline hover:text-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded"
          >
            024
          </a>{' '}
          (gratuito, 24 h) o al{' '}
          <a
            href="tel:112"
            className="font-bold text-primary-500 underline hover:text-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded"
          >
            112
          </a>.{' '}
          <a
            href="https://www.sanidad.gob.es/linea024"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-primary)' }}
            className="underline hover:opacity-80 focus:outline-none rounded"
          >
            Más información
          </a>
        </p>
      </div>

      {/* ── Botones de acción ────────────────────────────────────────────────── */}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary w-full sm:w-auto"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={onContinue}
          className="btn-primary w-full sm:w-auto"
          autoFocus
        >
          {continueLabel}
        </button>
      </div>
    </div>
  )
}

export default Disclaimer
