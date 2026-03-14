/**
 * @file components/common/Header.tsx
 * @description Cabecera principal de la aplicación.
 * Muestra el logo de Psicoprotego y un breadcrumb dinámico con el progreso del test.
 */

import React from 'react'

// ── Props ────────────────────────────────────────────────────────────────────

interface HeaderProps {
  /** Nombre del test activo (ej: "GAD-7") */
  testName?: string
  /** Número de la pregunta actual (1-indexed). Undefined si no hay test activo. */
  currentQuestion?: number
  /** Total de preguntas del test */
  totalQuestions?: number
}

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * Header — cabecera responsive con logo y breadcrumb de progreso.
 *
 * @param testName        - Nombre del test para el breadcrumb
 * @param currentQuestion - Pregunta actual (opcional)
 * @param totalQuestions  - Total preguntas (opcional)
 * @returns Elemento <header> con logo y navegación contextual
 */
const Header: React.FC<HeaderProps> = ({ testName, currentQuestion, totalQuestions }) => {
  const showBreadcrumb = Boolean(testName)
  const showProgress = showBreadcrumb && currentQuestion !== undefined && totalQuestions !== undefined

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm"
      role="banner"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">

        {/* ── Logo ────────────────────────────────────────────────────────── */}
        <a
          href="/"
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded-md"
          aria-label="Psicoprotego — Inicio"
        >
          {/* Icono shield SVG inline (no depende de assets externos) */}
          <svg
            aria-hidden="true"
            className="h-7 w-7 flex-shrink-0"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 2L4 7v9c0 7.18 5.16 13.9 12 15.93C22.84 29.9 28 23.18 28 16V7L16 2z"
              fill="#0066CC"
            />
            <path
              d="M13 16.5l2.5 2.5 4-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-lg font-bold tracking-tight text-[#0066CC]">
            Psicoprotego
          </span>
        </a>

        {/* ── Breadcrumb dinámico ──────────────────────────────────────────── */}
        {showBreadcrumb && (
          <nav
            aria-label="Ruta de navegación"
            className="flex items-center gap-1.5 text-sm text-gray-500"
          >
            <span className="hidden sm:inline font-medium text-[#0066CC] truncate max-w-[140px]">
              {testName}
            </span>

            {showProgress && (
              <>
                <span aria-hidden="true" className="hidden sm:inline text-gray-300">›</span>
                <span className="font-semibold text-gray-700 whitespace-nowrap">
                  {currentQuestion} / {totalQuestions}
                </span>
              </>
            )}

            {/* En mobile solo muestra la fracción */}
            {showProgress && (
              <span className="sm:hidden font-semibold text-gray-700 text-xs">
                {testName} · {currentQuestion}/{totalQuestions}
              </span>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
