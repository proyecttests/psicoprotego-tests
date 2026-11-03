'use client'

/**
 * @file components/common/Footer.tsx
 * @description Footer de Psicoprotego con navegación interna por idioma.
 * Ayuda urgente (112, 024 y enlace a /ayuda-urgente), aviso de que los tests no son un diagnóstico,
 * aviso de piloto, copyright y links internos
 * (acerca-de, contacto, privacidad, cookies, aviso-legal).
 * Los bloques de crisis del resultado los muestran CrisisBar y ResultCard.
 */

import React from 'react'
import Link from 'next/link'
import { CONSENT_KEY } from './CookieBanner'
import { getCrisisPhone } from '@/config/crisisPhones'

// ── Ayuda urgente (visible en todas las páginas) ─────────────────────────────

const URGENT_HELP: Record<string, { question: string; call: string; or: string; more: string }> = {
  es: {
    question: '¿Necesitas ayuda urgente?',
    call:     'Llama al',
    or:       'o al',
    more:     'Más recursos de ayuda',
  },
}

const EMERGENCY = getCrisisPhone('112')
const SUICIDE   = getCrisisPhone('024')

// ── Aviso de autodiagnóstico (visible en todas las páginas) ─────────────────

const NOT_A_DIAGNOSIS: Record<string, string> = {
  es: 'Los tests de esta web son herramientas de cribado orientativas: no son un diagnóstico ni sustituyen la valoración de un profesional de la salud mental.',
}

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
  const help = URGENT_HELP[lang] ?? URGENT_HELP['es']
  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-neutral-200 py-6 mt-auto"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 font-sans text-sm">
        <p
          className="mb-4 text-center leading-relaxed"
          style={{ color: 'var(--color-primary)' }}
        >
          <strong>{help.question}</strong>{' '}
          {help.call}{' '}
          <a href={`tel:${EMERGENCY.tel}`} className="font-semibold underline">{EMERGENCY.number}</a>
          {` (${EMERGENCY.label.toLowerCase()}) ${help.or} `}
          <a href={`tel:${SUICIDE.tel}`} className="font-semibold underline">{SUICIDE.number}</a>
          {` (${SUICIDE.situation.toLowerCase()}). `}
          <Link
            href={`/${lang}/ayuda-urgente`}
            className="font-semibold underline"
            style={{ color: 'var(--color-accent)' }}
          >
            {help.more}
          </Link>
        </p>
        <p
          className="mb-3 text-center text-xs leading-relaxed"
          style={{ color: 'var(--color-primary)' }}
        >
          {NOT_A_DIAGNOSIS[lang] ?? NOT_A_DIAGNOSIS['es']}
        </p>
        <p
          className="mb-4 rounded-lg border px-4 py-3 text-center text-xs leading-relaxed"
          style={{ color: 'var(--color-primary)', borderColor: 'var(--color-accent)' }}
        >
          {PILOT_NOTICE[lang] ?? PILOT_NOTICE['es']}
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* suppressHydrationWarning: el HTML estático lleva el año del build */}
          <p style={{ color: 'var(--color-primary)' }} className="font-medium" suppressHydrationWarning>
            © Psicoprotego {new Date().getFullYear()}
          </p>

          <nav aria-label="Footer navigation" className="flex flex-col items-center gap-2 sm:items-end">
            {/* Row 1 */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link
                href={`/${lang}/acerca-de`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                Acerca de
              </Link>
              <Link
                href={`/${lang}/contacto`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                Contacto
              </Link>
            </div>
            {/* Row 2 */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link
                href={`/${lang}/privacidad`}
                className="transition-colors hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                Privacidad
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
                Aviso legal
              </Link>
              <button
                type="button"
                onClick={() => { localStorage.removeItem(CONSENT_KEY); location.reload() }}
                className="transition-colors hover:underline cursor-pointer bg-transparent border-0 p-0 text-xs"
                style={{ color: 'var(--color-accent)' }}
              >
                Preferencias de cookies
              </button>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
