'use client'

/**
 * @file components/common/Footer.tsx
 * @description Footer de Psicoprotego con navegación interna por idioma.
 * Copyright, aviso de piloto y links internos (acerca-de, blog, contacto, privacidad, cookies, aviso-legal).
 * Los teléfonos de crisis no van aquí: los muestran CrisisBar y ResultCard.
 */

import React from 'react'
import Link from 'next/link'
import { CONSENT_KEY } from './CookieBanner'

// ── Aviso de proyecto piloto (visible en todas las páginas) ─────────────────

const PILOT_NOTICE: Record<string, string> = {
  es: 'Proyecto piloto en desarrollo. Esta herramienta está en fase de pruebas y puede cambiar o contener errores: no la utilices como un producto final ni como sustituto de una valoración profesional.',
}

// ── Props ────────────────────────────────────────────────────────────────────

interface FooterProps {
  lang?: string
}

// ── Componente ────────────────────────────────────────────────────────────────

const Footer: React.FC<FooterProps> = ({ lang = 'es' }) => {
  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-neutral-200 py-6 mt-auto"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 font-sans text-sm">
        <p
          className="mb-4 rounded-lg border px-4 py-3 text-center text-xs leading-relaxed"
          style={{ color: 'var(--color-primary)', borderColor: 'var(--color-accent)' }}
        >
          {PILOT_NOTICE[lang] ?? PILOT_NOTICE['es']}
        </p>
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
                {lang === 'en' ? 'About' : lang === 'pt' ? 'Sobre nós' : lang === 'ku' ? 'دەربارە' : 'Acerca de'}
              </Link>
              <Link
                href={`/${lang}/contacto`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                {lang === 'en' ? 'Contact' : lang === 'pt' ? 'Contato' : lang === 'ku' ? 'پەیوەندی' : 'Contacto'}
              </Link>
            </div>
            {/* Row 2 */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link
                href={`/${lang}/privacidad`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                {lang === 'en' ? 'Privacy' : lang === 'pt' ? 'Privacidade' : lang === 'ku' ? 'تایبەتمەندی' : 'Privacidad'}
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
                {lang === 'en' ? 'Legal notice' : lang === 'pt' ? 'Aviso legal' : lang === 'ku' ? 'ئاگاداری یاسایی' : 'Aviso legal'}
              </Link>
              <button
                type="button"
                onClick={() => { localStorage.removeItem(CONSENT_KEY); location.reload() }}
                className="transition-colors hover:underline cursor-pointer bg-transparent border-0 p-0 text-xs"
                style={{ color: 'var(--color-accent)' }}
              >
                {lang === 'en' ? 'Cookie preferences' : lang === 'pt' ? 'Preferências de cookies' : lang === 'ku' ? 'ئەرجێندانی کوکیەکان' : 'Preferencias de cookies'}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
