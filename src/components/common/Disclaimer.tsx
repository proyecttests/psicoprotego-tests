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

// ── Utilidad para renderizar negrita en texto plano ───────────────────────────

/**
 * Renderiza texto con **negrita** como spans de React.
 * Solo soporta el caso de un único par ** en el texto.
 */
function renderWithBold(text: string): React.ReactNode[] {
  const parts = text.split('**')
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-amber-900">{part}</strong>
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
      className="mx-auto max-w-2xl px-4 py-8 sm:px-6"
    >
      {/* ── Caja de advertencia ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 shadow-sm">

        {/* Cabecera con icono */}
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-0.5 text-2xl">⚠️</span>
          <div>
            <h2
              id="disclaimer-title"
              className="text-base font-semibold text-amber-900"
            >
              {title}
            </h2>
            <p
              id="disclaimer-body"
              className="mt-2 text-sm leading-relaxed text-amber-800"
            >
              {renderWithBold(text)}
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <hr className="my-4 border-amber-200" />

        {/* Recursos de crisis */}
        <p className="text-xs text-amber-700">
          <strong>En caso de crisis:</strong> llama al{' '}
          <a
            href="tel:024"
            className="font-bold underline hover:text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded"
          >
            024
          </a>{' '}
          (gratuito, 24 h) o al{' '}
          <a
            href="tel:112"
            className="font-bold underline hover:text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded"
          >
            112
          </a>.
        </p>
      </div>

      {/* ── Botones de acción ─────────────────────────────────────────────── */}
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
