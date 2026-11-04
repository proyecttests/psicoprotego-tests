/**
 * @file components/common/CookieBanner.tsx
 * @description Banner de consentimiento de cookies (RGPD/GDPR).
 *
 * - Primera visita: muestra el banner con opciones Aceptar/Solo esenciales.
 * - Guarda la elección en localStorage (clave: psico_cookie_consent).
 * - GTM/GA4 solo se carga aquí, y solo si el usuario acepta analytics (app/layout.tsx no lo carga).
 * - «Solo esenciales» borra las cookies de Google Analytics que quedaran de una aceptación anterior.
 * - Se puede relanzar desde cualquier componente borrando la clave y recargando.
 */
'use client'

import React from 'react'
import Link from 'next/link'

// ── Storage ───────────────────────────────────────────────────────────────────

export const CONSENT_KEY  = 'psico_cookie_consent'
export type  ConsentValue = 'accepted' | 'essential'

export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  return (localStorage.getItem(CONSENT_KEY) as ConsentValue | null)
}

// ── GTM initializer (called after accept) ─────────────────────────────────────

function activateGTM(gtmId: string) {
  if (typeof window === 'undefined') return
  // Push consent update to dataLayer if it exists
  ;(window as unknown as { dataLayer?: unknown[] }).dataLayer =
    (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []
  ;(window as unknown as { dataLayer: unknown[] }).dataLayer.push({
    event: 'consent_update',
    analytics_storage: 'granted',
    ad_storage: 'denied',
  })
  // Inject GTM if not already present (mismo arranque que el snippet oficial: evento gtm.js)
  if (document.querySelector(`script[src*="${gtmId}"]`)) return
  ;(window as unknown as { dataLayer: unknown[] }).dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
  document.head.appendChild(s)
}

// ── Borrado de cookies de Google Analytics (al retirar el consentimiento) ─────

const GA_COOKIE = /^(_ga|_gid|_gat)/

function clearAnalyticsCookies() {
  if (typeof document === 'undefined') return
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => GA_COOKIE.test(n))
  // GA las guarda en el dominio más alto posible (ej. .psicoprotego.es): se prueba el host y
  // cada dominio padre, sin llegar al TLD.
  const parts   = location.hostname.split('.')
  const domains = [''].concat(parts.slice(0, -1).map((_, i) => '.' + parts.slice(i).join('.')))
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`
    }
  }
}

// ── UI strings ────────────────────────────────────────────────────────────────

const UI: Record<string, {
  message: string
  accept: string
  essential: string
  learnMore: string
  privacyLink: string
  cookiesLink: string
}> = {
  es: {
    message:     'Usamos cookies de analítica (Google Analytics) solo si las aceptas. Si las aceptas, enviamos, sin tu nombre ni datos que te identifiquen, qué test haces, tus respuestas y tu resultado, para elaborar estadísticas de uso. Puedes cambiar tu elección cuando quieras en «Preferencias de cookies».',
    accept:      'Aceptar',
    essential:   'Solo esenciales',
    learnMore:   'Más información',
    privacyLink: 'Privacidad',
    cookiesLink: 'Cookies',
  },
  en: {
    message:     'We use analytics cookies to improve the platform. We do not store personal data. You can accept only essential cookies.',
    accept:      'Accept all',
    essential:   'Essential only',
    learnMore:   'Learn more',
    privacyLink: 'Privacy',
    cookiesLink: 'Cookies',
  },
  pt: {
    message:     'Usamos cookies analíticos para melhorar a plataforma. Não armazenamos dados pessoais. Você pode aceitar apenas cookies essenciais.',
    accept:      'Aceitar tudo',
    essential:   'Somente essenciais',
    learnMore:   'Saiba mais',
    privacyLink: 'Privacidade',
    cookiesLink: 'Cookies',
  },
  ku: {
    message:     'کوکیە شیکارییەکان بەکاردەهێنین بۆ باشترکردنی پلاتفۆرمەکە. داتای کەسی تۆمار ناکەین. دەتوانیت تەنها کوکیە پێویستەکان قبوول بکەیت.',
    accept:      'هەموو قبوول بکە',
    essential:   'تەنها پێویستەکان',
    learnMore:   'زیاتر بزانە',
    privacyLink: 'تایبەتمەندی',
    cookiesLink: 'کوکیەکان',
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CookieBannerProps {
  lang: string
  gtmId?: string
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ lang, gtmId }) => {
  const [visible, setVisible] = React.useState(false)
  const ui = UI[lang] ?? UI['es']

  React.useEffect(() => {
    const stored = getConsent()
    if (!stored) {
      setVisible(true)
    } else if (stored === 'accepted' && gtmId) {
      activateGTM(gtmId)
    }
  }, [gtmId])

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
    if (gtmId) activateGTM(gtmId)
  }

  const handleEssential = () => {
    localStorage.setItem(CONSENT_KEY, 'essential')
    clearAnalyticsCookies()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      data-cookie-banner
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4 sm:px-6"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <div className="mx-auto max-w-3xl flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <p className="text-sm text-white/90 leading-relaxed flex-1">
          {ui.message}{' '}
          <Link
            href={`/${lang}/privacidad`}
            className="underline hover:text-white"
          >
            {ui.privacyLink}
          </Link>
          {' · '}
          <Link
            href={`/${lang}/cookies`}
            className="underline hover:text-white"
          >
            {ui.cookiesLink}
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          {/* Rechazar igual de visible que aceptar (criterio de la AEPD): mismo estilo */}
          <button
            type="button"
            onClick={handleEssential}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold transition hover:bg-white/90"
            style={{ color: 'var(--color-primary)' }}
          >
            {ui.essential}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold transition hover:bg-white/90"
            style={{ color: 'var(--color-primary)' }}
          >
            {ui.accept}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner
