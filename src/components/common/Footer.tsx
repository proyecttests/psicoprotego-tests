/**
 * @file components/common/Footer.tsx
 * @description Footer de Psicoprotego con navegación interna por idioma.
 * - Normal: copyright, links internos (acerca-de, blog, contacto, privacidad, cookies, aviso-legal).
 * - Crisis (showCrisisFooter=true): barra sticky roja con teléfonos de emergencia.
 */

import React from 'react'
import Link from 'next/link'

// ── Props ────────────────────────────────────────────────────────────────────

interface FooterProps {
  showCrisisFooter?: boolean
  lang?: string
}

// ── Componente ────────────────────────────────────────────────────────────────

const Footer: React.FC<FooterProps> = ({ showCrisisFooter = false, lang = 'es' }) => {
  if (showCrisisFooter) {
    return (
      <footer
        role="contentinfo"
        aria-label="Recursos de ayuda inmediata"
        className="sticky bottom-0 left-0 right-0 z-50 bg-primary-500 shadow-lg sm:relative sm:bottom-auto sm:z-auto"
      >
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-center text-sm font-semibold text-white sm:text-left">
              Hay apoyo disponible — no estás solo/a
            </p>
            <div className="flex w-full gap-3 sm:w-auto">
              <a
                href="tel:024"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-primary-500 shadow-sm transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500 sm:flex-none"
                aria-label="Llamar al 024 — Teléfono de la Esperanza (gratuito, 24h)"
              >
                <span aria-hidden="true">📞</span>
                024 – Esperanza
              </a>
              <a
                href="tel:112"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-white px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500 sm:flex-none"
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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 font-sans text-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p style={{ color: 'var(--color-primary)' }} className="font-medium">
            © Psicoprotego 2025
          </p>

          <nav aria-label="Footer navigation" className="flex flex-col items-center gap-2 sm:items-end">
            {/* Row 1 */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link
                href={`/${lang}/acerca-de`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                {lang === 'en' ? 'About' : lang === 'pt' ? 'Sobre nós' : 'Acerca de'}
              </Link>
              <Link
                href={`/${lang}/blog`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                Blog
              </Link>
              <Link
                href={`/${lang}/contacto`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                {lang === 'en' ? 'Contact' : lang === 'pt' ? 'Contato' : 'Contacto'}
              </Link>
            </div>
            {/* Row 2 */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link
                href={`/${lang}/privacidad`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                {lang === 'en' ? 'Privacy' : lang === 'pt' ? 'Privacidade' : 'Privacidad'}
              </Link>
              <Link
                href={`/${lang}/cookies`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                Cookies
              </Link>
              <Link
                href={`/${lang}/aviso-legal`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                {lang === 'en' ? 'Legal notice' : lang === 'pt' ? 'Aviso legal' : 'Aviso legal'}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
