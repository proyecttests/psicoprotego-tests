/**
 * @file components/common/Disclaimer.tsx
 * @description Componente de aviso legal/educativo que se muestra antes o
 * después de un test psicológico. Informa al usuario de que los resultados
 * son orientativos y no constituyen un diagnóstico clínico.
 */

import React from 'react'

// ── Props ────────────────────────────────────────────────────────────────────

interface DisclaimerProps {
  /**
   * Tipo de disclaimer:
   * - 'before' → se muestra antes de iniciar el test
   * - 'after'  → se muestra tras completarlo (antes de ver resultados)
   */
  type: 'before' | 'after'
  /** Nombre del test para personalizar el mensaje */
  testName: string
  /** Texto personalizado del aviso (opcional). Si se omite se usa el texto por defecto. */
  customText?: string
  /** Callback al confirmar ("Entiendo y continuar") */
  onContinue: () => void
  /** Callback al cancelar. Si se omite, el botón Cancelar no se muestra. */
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

/**
 * Renderiza texto con **negrita** como spans de React.
 */
function renderWithBold(text: string): React.ReactNode[] {
  const parts = text.split('**')
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-red-800">{part}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  )
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * Disclaimer — aviso informativo antes/después del test.
 *
 * @param type        - 'before' | 'after'
 * @param testName    - Nombre del test
 * @param customText  - Texto personalizado (opcional)
 * @param onContinue  - Confirmar y continuar
 * @param onCancel    - Cancelar (opcional)
 * @returns Sección de aviso con icono, texto y botones de acción
 */
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
      <div className="rounded-xl border border-red-200 bg-white p-5 shadow-sm border-l-4 border-l-red-500">

        {/* Cabecera con icono grande */}
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className="mt-0.5 text-4xl shrink-0">⚠️</span>
          <div className="min-w-0">
            <h2
              id="disclaimer-title"
              className="text-base font-semibold text-gray-900 leading-snug"
            >
              {title}
            </h2>
            <p
              id="disclaimer-body"
              className="mt-2 text-sm leading-relaxed text-gray-700"
              style={{ lineHeight: '1.6' }}
            >
              {renderWithBold(text)}
            </p>
          </div>
        </div>

        {/* Divisor */}
        <hr className="my-4 border-red-100" />

        {/* Recursos de crisis */}
        <p className="text-xs text-gray-600">
          <strong className="font-semibold">En caso de crisis:</strong> llama al{' '}
          <a
            href="tel:024"
            className="font-bold text-red-700 underline hover:text-red-900 focus:outline-none focus:ring-1 focus:ring-red-500 rounded"
          >
            024
          </a>{' '}
          (gratuito, 24 h) o al{' '}
          <a
            href="tel:112"
            className="font-bold text-red-700 underline hover:text-red-900 focus:outline-none focus:ring-1 focus:ring-red-500 rounded"
          >
            112
          </a>.{' '}
          <a
            href="https://www.sanidad.gob.es/linea024"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0066CC] underline hover:text-blue-800 focus:outline-none focus:ring-1 focus:ring-[#0066CC] rounded"
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
