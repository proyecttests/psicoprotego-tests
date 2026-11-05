/** @type {import('next').NextConfig} */

// ── Security headers ──────────────────────────────────────────────────────────
// Applied to all routes. CSP is permissive enough for Next.js + GTM + fonts.
// Tighten script-src once GTM nonce support is implemented.

const SECURITY_HEADERS = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    // Content-Security-Policy
    // - script-src: self + GTM + inline (needed for Next.js hydration & GTM inline)
    //   + 'wasm-unsafe-eval': @react-pdf/renderer compila WebAssembly para maquetar los PDF
    //   (solo permite WebAssembly, no eval de JavaScript)
    // - style-src: self + unsafe-inline (Tailwind inline styles)
    // - img-src: self + data URIs (Canvas-generated story images)
    // - connect-src: self + GA4 analytics endpoint
    // TODO: replace 'unsafe-inline' in script-src with nonces (requires Next.js middleware)
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://www.googletagmanager.com",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
      "frame-src https://www.googletagmanager.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

// ── Indexación ────────────────────────────────────────────────────────────────
// Misma regla que SITE_INDEXABLE (src/config/site.ts): en el dominio de Vercel, X-Robots-Tag
// noindex en todo, también en lo que no es HTML (JSON de datos, imágenes). Se quita sola al
// definir NEXT_PUBLIC_SITE_URL con la dirección definitiva.

const SITE_URL       = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego-tests.vercel.app'
const SITE_INDEXABLE = !new URL(SITE_URL).hostname.endsWith('.vercel.app')

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: SITE_INDEXABLE
          ? SECURITY_HEADERS
          : [...SECURITY_HEADERS, { key: 'X-Robots-Tag', value: 'noindex, follow' }],
      },
      {
        // Resultado compartido: los enlaces antiguos llevan las respuestas en ?d=. Sin
        // Referer, la URL no viaja en las peticiones que salen de la página (JS, prefetch,
        // enlaces). Va después de la regla general para sustituir su Referrer-Policy.
        source: '/:lang/test/:testId/resultado',
        headers: [{ key: 'Referrer-Policy', value: 'no-referrer' }],
      },
    ]
  },
}

export default nextConfig
