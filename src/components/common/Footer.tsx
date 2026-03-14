/**
 * @file components/common/Footer.tsx
 * @description Footer de crisis. Solo se renderiza cuando showCrisisFooter=true,
 * mostrando una barra sticky roja con botones directos de llamada (024 / 112).
 * En el resto del flujo del test (answering, disclaimer, etc.) no aparece.
 */

import React from 'react'

// ── Props ────────────────────────────────────────────────────────────────────

interface FooterProps {
  /**
   * Controla si se muestra el footer de crisis.
   * - false (por defecto): no renderiza nada
   * - true: muestra la barra sticky roja con teléfonos de emergencia
   */
  showCrisisFooter?: boolean
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * Footer — barra de crisis sticky.
 *
 * Solo se renderiza cuando `showCrisisFooter` es true (resultado de tipo CRISIS).
 * Sticky en mobile (bottom: 0), relativa en desktop.
 *
 * @param showCrisisFooter - Mostrar footer rojo de crisis (default: false)
 * @returns Null o barra roja con botones de llamada directa
 */
const Footer: React.FC<FooterProps> = ({ showCrisisFooter = false }) => {
  if (!showCrisisFooter) return null

  return (
    <footer
      role="contentinfo"
      aria-label="Recursos de ayuda inmediata"
      className="
        sticky bottom-0 left-0 right-0 z-50
        bg-red-600 shadow-lg
        sm:relative sm:bottom-auto sm:z-auto
      "
    >
      <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">

          {/* Texto de urgencia */}
          <p className="text-center text-sm font-semibold text-white sm:text-left">
            <span aria-hidden="true">⚠️ </span>
            Necesitas ayuda inmediata — no estás solo/a
          </p>

          {/* Botones de llamada */}
          <div className="flex w-full gap-3 sm:w-auto">
            <a
              href="tel:024"
              className="
                flex flex-1 items-center justify-center gap-2 rounded-lg
                bg-white px-5 py-3 text-sm font-bold text-red-700
                shadow-sm transition-colors
                hover:bg-red-50
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600
                sm:flex-none
              "
              aria-label="Llamar al 024 — Teléfono de atención a la conducta suicida (gratuito, 24h)"
            >
              <span aria-hidden="true">📞</span>
              Llamar al 024
            </a>

            <a
              href="tel:112"
              className="
                flex flex-1 items-center justify-center gap-2 rounded-lg
                border-2 border-white px-5 py-3 text-sm font-bold text-white
                transition-colors
                hover:bg-red-700
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600
                sm:flex-none
              "
              aria-label="Llamar al 112 — Emergencias"
            >
              <span aria-hidden="true">📞</span>
              Llamar 112
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
