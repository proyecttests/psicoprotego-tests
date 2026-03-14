/**
 * @file components/common/Footer.tsx
 * @description Footer de Psicoprotego.
 * - Normal: copyright, links, branding Psicoprotego.
 * - Crisis (showCrisisFooter=true): barra sticky roja con teléfonos de emergencia.
 */

import React from 'react'

// ── Props ────────────────────────────────────────────────────────────────────

interface FooterProps {
  showCrisisFooter?: boolean
}

// ── Componente ────────────────────────────────────────────────────────────────

const Footer: React.FC<FooterProps> = ({ showCrisisFooter = false }) => {
  if (showCrisisFooter) {
    return (
      <footer
        role="contentinfo"
        aria-label="Recursos de ayuda inmediata"
        className="sticky bottom-0 left-0 right-0 z-50 bg-red-600 shadow-lg sm:relative sm:bottom-auto sm:z-auto"
      >
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-center text-sm font-semibold text-white sm:text-left">
              <span aria-hidden="true">⚠️ </span>
              Necesitas ayuda inmediata — no estás solo/a
            </p>
            <div className="flex w-full gap-3 sm:w-auto">
              <a
                href="tel:024"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-red-700 shadow-sm transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 sm:flex-none"
                aria-label="Llamar al 024 — Teléfono de la Esperanza (gratuito, 24h)"
              >
                <span aria-hidden="true">📞</span>
                024 – Esperanza
              </a>
              <a
                href="tel:112"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-white px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 sm:flex-none"
                aria-label="Llamar al 112 — Emergencias"
              >
                <span aria-hidden="true">📞</span>
                112
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-neutral-200 py-6 mt-auto"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between text-sm font-sans">
        <p style={{ color: 'var(--color-primary)' }} className="font-medium">
          © Psicoprotego 2025
        </p>
        <nav aria-label="Footer" className="flex gap-4">
          <a
            href="https://psicoprotego.es/contacto"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            Contacto
          </a>
          <a
            href="https://psicoprotego.es/privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            Privacidad
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
