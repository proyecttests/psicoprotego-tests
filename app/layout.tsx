import type { Metadata } from 'next'
import { Source_Serif_4, Montserrat } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
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
  title: {
    default: 'Psicoprotego — Tests Psicológicos',
    template: '%s — Psicoprotego',
  },
  description: 'Tests psicológicos validados clínicamente. GAD-7, PHQ-9 y más.',
}

// ── GTM ──────────────────────────────────────────────────────────────────────

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-MN3QW7Q7'

const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`

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
      <head>
        <Script id="gtm-head" strategy="afterInteractive">
          {gtmScript}
        </Script>
      </head>
      <body>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}
        <Analytics />
      </body>
    </html>
  )
}
