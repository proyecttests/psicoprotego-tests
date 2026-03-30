/**
 * @file src/utils/storyImage.ts
 * @description Generates a 9:16 story image (1080×1920) for Instagram/TikTok sharing.
 * Uses Canvas API — runs client-side only.
 */

export interface StoryImageOptions {
  testName: string
  resultLabel: string
  resultColor: 'green' | 'yellow' | 'orange' | 'red'
  shareUrl: string
  lang: string
}

const COLOR_MAP: Record<string, { bg: string; accent: string } > = {
  green:  { bg: '#1a4a2a', accent: '#4ade80' },
  yellow: { bg: '#2a2a0a', accent: '#facc15' },
  orange: { bg: '#2a1a0a', accent: '#fb923c' },
  red:    { bg: '#2a0a0a', accent: '#f87171' },
}

const CTA: Record<string, string> = {
  es: '¿Cuál es el tuyo?',
  en: "What's yours?",
  pt: 'Qual é o seu?',
  ku: 'یت چییە؟',
}

const BRAND: Record<string, string> = {
  es: 'Test psicológico gratuito',
  en: 'Free psychological test',
  pt: 'Teste psicológico gratuito',
  ku: 'تاقیکردنەوەی پسیکۆلۆژی خۆڕایی',
}

/**
 * Generates a story image as a PNG Blob (1080×1920).
 * Returns null if Canvas API is unavailable.
 */
export async function generateStoryImage(opts: StoryImageOptions): Promise<Blob | null> {
  if (typeof document === 'undefined') return null

  const W = 1080
  const H = 1920
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const { bg, accent } = COLOR_MAP[opts.resultColor] ?? COLOR_MAP.green
  const cta = CTA[opts.lang] ?? CTA.es
  const brand = BRAND[opts.lang] ?? BRAND.es

  // ── Background gradient ───────────────────────────────────────────────────
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, bg)
  grad.addColorStop(0.6, '#1a2e20')
  grad.addColorStop(1, '#0d1a10')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // ── Decorative circles ────────────────────────────────────────────────────
  ctx.save()
  ctx.globalAlpha = 0.07
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.arc(W * 0.85, H * 0.12, 380, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(W * 0.1, H * 0.88, 280, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // ── Accent top bar ────────────────────────────────────────────────────────
  ctx.fillStyle = accent
  ctx.fillRect(80, 140, 120, 8)

  // ── Brand label ───────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = '42px system-ui, sans-serif'
  ctx.fillText(brand, 80, 220)

  // ── Test name ─────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.font = '700 68px system-ui, sans-serif'
  wrapText(ctx, opts.testName, 80, 330, W - 160, 84)

  // ── Divider ───────────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(80, 520)
  ctx.lineTo(W - 80, 520)
  ctx.stroke()

  // ── "Mi resultado" label ──────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '46px system-ui, sans-serif'
  const miResultado = opts.lang === 'en' ? 'My result' : opts.lang === 'pt' ? 'Meu resultado' : 'Mi resultado'
  ctx.fillText(miResultado, 80, 630)

  // ── Result category (big, accented) ──────────────────────────────────────
  ctx.fillStyle = accent
  ctx.font = '700 108px system-ui, sans-serif'
  wrapText(ctx, opts.resultLabel, 80, 780, W - 160, 120)

  // ── Pill / badge ─────────────────────────────────────────────────────────
  const pillY = 900
  ctx.save()
  ctx.globalAlpha = 0.15
  ctx.fillStyle = accent
  roundRect(ctx, 80, pillY, 440, 14, 7)
  ctx.fill()
  ctx.restore()

  // ── CTA ───────────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = '700 80px system-ui, sans-serif'
  ctx.fillText(cta, 80, H * 0.66)

  // ── URL pill ──────────────────────────────────────────────────────────────
  const urlText = opts.shareUrl.replace(/^https?:\/\//, '')
  const urlY = H * 0.66 + 80
  ctx.save()
  ctx.globalAlpha = 0.18
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, 80, urlY, W - 160, 90, 45)
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '38px monospace'
  ctx.fillText(urlText, 120, urlY + 58)

  // ── Bottom branding ───────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.font = '44px system-ui, sans-serif'
  ctx.fillText('testpsycho.com', 80, H - 100)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
) {
  const words = text.split(' ')
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y)
      line = word
      y += lineH
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, y)
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
