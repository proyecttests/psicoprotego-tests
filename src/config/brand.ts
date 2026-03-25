/**
 * @file config/brand.ts
 * @description Psicoprotego brand constants — single source of truth.
 *
 * Actualiza aquí para propagar cambios a todos los componentes.
 * CSS variables están en globals.css / tailwind.config.ts.
 */

// ── Colors ────────────────────────────────────────────────────────────────────

export const BRAND_COLORS = {
  primary:   '#2d4a3e',   // dark green — main brand
  accent:    '#c8a96e',   // gold — links, highlights
  cream:     '#f5f3ef',   // page backgrounds
  text:      '#1a1a1a',   // body text
  gray:      '#666666',   // secondary text
  lightGray: '#e8e4dd',   // borders, dividers
  white:     '#ffffff',
  green:     '#4a7c5c',   // category: low/good
  yellow:    '#c8a96e',   // category: moderate
  orange:    '#c47a3a',   // category: elevated
  red:       '#8b3a3a',   // category: high/crisis
} as const

// Category colors (maps to scoring color keys)
export const CATEGORY_COLORS: Record<string, string> = {
  green:  BRAND_COLORS.green,
  yellow: BRAND_COLORS.yellow,
  orange: BRAND_COLORS.orange,
  red:    BRAND_COLORS.red,
}

// ── Typography ────────────────────────────────────────────────────────────────

export const BRAND_FONTS = {
  serif:      "'Source Serif 4', Georgia, serif",
  sansSerif:  "'Inter', -apple-system, 'Helvetica Neue', Arial, sans-serif",
  mono:       "'JetBrains Mono', 'Courier New', monospace",
} as const

// PDF uses Helvetica (built-in to react-pdf, no embedding needed)
export const PDF_FONTS = {
  regular:  'Helvetica',
  bold:     'Helvetica-Bold',
  italic:   'Helvetica-Oblique',
  boldItal: 'Helvetica-BoldOblique',
} as const

// ── Site metadata ─────────────────────────────────────────────────────────────

export const BRAND_NAME    = 'Psicoprotego'
export const BRAND_DOMAIN  = 'psicoprotego.es'
export const BRAND_EMAIL   = 'hola@psicoprotego.es'
export const BRAND_TAGLINE = {
  es: 'Tests psicológicos gratuitos, privados y basados en evidencia',
  en: 'Free, private and evidence-based psychological tests',
  pt: 'Testes psicológicos gratuitos, privados e baseados em evidências',
  ku: 'تاقیکردنەوەی پسیکۆلۆژیی بەخۆڕایی، تایبەت و بنەمایی زانستی',
} as const

// ── Supported languages ───────────────────────────────────────────────────────

export const SUPPORTED_LANGS = ['es', 'en', 'pt', 'ku'] as const
export type  SupportedLang   = typeof SUPPORTED_LANGS[number]

export const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur', 'ku'])

export const LANG_LABELS: Record<string, string> = {
  es: '🇪🇸 Español',
  en: '🇬🇧 English',
  pt: '🇧🇷 Português',
  ku: '🏳 کوردی',
  ar: '🇸🇦 العربية',
  fr: '🇫🇷 Français',
  de: '🇩🇪 Deutsch',
  it: '🇮🇹 Italiano',
}

export const LANG_NAMES: Record<string, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  ku: 'کوردی سۆرانی',
  ar: 'العربية',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
}

// ── Scoring ───────────────────────────────────────────────────────────────────

/** Order of severity for display (low → high) */
export const CATEGORY_ORDER = ['green', 'yellow', 'orange', 'red'] as const
