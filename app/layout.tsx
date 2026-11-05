import type { Metadata } from 'next'
import { Source_Serif_4, Montserrat } from 'next/font/google'
import VercelAnalytics from './components/VercelAnalytics'
import { SITE_URL } from '@/config/site'
import './globals.css'

// ── Google Fonts via next/font (auto-hosted, no external request) ─────────────

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  // Resuelve como absolutas las URL relativas de canónicas, hreflang y Open Graph
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Psicoprotego — Tests Psicológicos',
    template: '%s — Psicoprotego',
  },
  description: 'Tests psicológicos validados clínicamente. GAD-7, PHQ-9 y más.',
}

// GTM no se carga aquí: lo inyecta CookieBanner solo si el usuario acepta las cookies.

// ── Root Layout ───────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning: LangHtmlUpdater corrige lang/dir en cliente
    <html
      lang="es"
      suppressHydrationWarning
      className={`${sourceSerif4.variable} ${montserrat.variable}`}
    >
      <body>
        {children}
        <VercelAnalytics />
      </body>
    </html>
  )
}
