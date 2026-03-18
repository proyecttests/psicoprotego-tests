/**
 * @file components/common/Header.tsx
 * @description Cabecera principal de Psicoprotego con logo SVG y breadcrumb dinámico.
 */

import React from 'react'
import Link from 'next/link'

// ── Props ────────────────────────────────────────────────────────────────────

interface HeaderProps {
  testName?: string
  currentQuestion?: number
  totalQuestions?: number
}

// ── Componente ────────────────────────────────────────────────────────────────

const Header: React.FC<HeaderProps> = ({ testName, currentQuestion, totalQuestions }) => {
  const showBreadcrumb = Boolean(testName)
  const showProgress   = showBreadcrumb && currentQuestion !== undefined && totalQuestions !== undefined

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white shadow-sm"
      role="banner"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">

        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md"
          aria-label="Psicoprotego — Inicio"
        >
          <img
            src="/oficial-horizontal-verde.svg"
            alt="Psicoprotego"
            className="h-8 w-auto md:h-10"
            loading="eager"
          />
        </Link>

        {/* ── Breadcrumb dinámico ───────────────────────────────────────────── */}
        {showBreadcrumb && (
          <nav
            aria-label="Ruta de navegación"
            className="flex items-center gap-1.5 text-sm"
          >
            <span
              className="hidden sm:inline font-medium truncate max-w-[140px]"
              style={{ color: 'var(--color-primary)' }}
            >
              {testName}
            </span>

            {showProgress && (
              <>
                <span aria-hidden="true" className="hidden sm:inline text-neutral-300">›</span>
                <span className="font-semibold text-neutral-800 whitespace-nowrap">
                  {currentQuestion} / {totalQuestions}
                </span>
              </>
            )}

            {showProgress && (
              <span className="sm:hidden font-semibold text-neutral-800 text-xs">
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
