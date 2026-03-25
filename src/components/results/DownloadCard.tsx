/**
 * @file components/results/DownloadCard.tsx
 * @description Genera una imagen cuadrada 1080×1080 con el resultado
 * y la descarga como PNG. Ideal para Instagram/TikTok stories.
 * Sin dependencias externas — usa Canvas API del navegador.
 */
'use client'

import React from 'react'

const UI: Record<string, { btn: string; hintShare: string; hintDownload: string }> = {
  es: { btn: 'Compartir en stories',     hintShare: 'Elige Instagram o TikTok',    hintDownload: 'Se descargará la imagen' },
  en: { btn: 'Share to stories',         hintShare: 'Choose Instagram or TikTok',  hintDownload: 'Image will be downloaded' },
  pt: { btn: 'Compartilhar nos stories', hintShare: 'Escolha Instagram ou TikTok', hintDownload: 'A imagem será baixada' },
  ku: { btn: 'لە ستۆریدا بڵاوبکەرەوە', hintShare: 'Instagram یان TikTok هەڵبژێرە', hintDownload: 'وێنەکە داگیردەکرێت' },
}

const COLORS: Record<string, { bg: string; text: string; circle: string }> = {
  green:  { bg: '#1a3a2a', text: '#ffffff', circle: '#4ade80' },
  yellow: { bg: '#2d2a1a', text: '#ffffff', circle: '#fbbf24' },
  orange: { bg: '#2d1f1a', text: '#ffffff', circle: '#fb923c' },
  red:    { bg: '#2d1a1a', text: '#ffffff', circle: '#f87171' },
}

interface DownloadCardProps {
  lang:          string
  testName:      string
  score:         number
  maxScore:      number
  categoryLabel: string
  colorKey:      string
  testId:        string
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(' ')
  let line    = ''
  let currentY = y

  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      line     = word
      currentY += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, currentY)
  return currentY + lineHeight
}

function shadeColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#',''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount))
  return `rgb(${r},${g},${b})`
}

const DownloadCard: React.FC<DownloadCardProps> = ({
  lang, testName, score, maxScore, categoryLabel, colorKey, testId,
}) => {
  const ui     = UI[lang] ?? UI['es']
  const colors = COLORS[colorKey] ?? COLORS['green']
  const [loading,   setLoading]   = React.useState(false)
  const [canShare,  setCanShare]  = React.useState(false)

  React.useEffect(() => {
    // Check if the browser supports sharing files (mobile Web Share API)
    const testFile = new File([''], 'test.png', { type: 'image/png' })
    setCanShare(!!navigator.canShare?.({ files: [testFile] }))
  }, [])

  const handleShare = async () => {
    setLoading(true)
    try {
      const SIZE = 1080
      const canvas = document.createElement('canvas')
      canvas.width  = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext('2d')!
      const colors = COLORS[colorKey] ?? COLORS['green']

      // ── Background ──────────────────────────────────────────────────────
      const grad = ctx.createLinearGradient(0, 0, SIZE * 0.6, SIZE)
      grad.addColorStop(0, colors.bg)
      grad.addColorStop(1, shadeColor(colors.bg, -20))
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, SIZE, SIZE)

      // Subtle geometric accent — top-right quarter circle
      ctx.save()
      ctx.globalAlpha = 0.08
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(SIZE, 0, 560, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 0.04
      ctx.beginPath()
      ctx.arc(0, SIZE, 400, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // ── Top branding bar ─────────────────────────────────────────────────
      ctx.fillStyle = 'rgba(255,255,255,0.06)'
      ctx.fillRect(0, 0, SIZE, 100)
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.font = '600 30px -apple-system, "Helvetica Neue", Arial, sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText('psicoprotego.es', 60, 50)

      // Logo dot
      ctx.fillStyle = colors.circle
      ctx.beginPath()
      ctx.arc(46, 50, 9, 0, Math.PI * 2)
      ctx.fill()

      // ── Test name ─────────────────────────────────────────────────────────
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.font = '400 38px -apple-system, "Helvetica Neue", Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      wrapText(ctx, testName, SIZE / 2, 136, SIZE - 120, 50)

      // ── Score area ───────────────────────────────────────────────────────
      const cx = SIZE / 2
      const cy = 460
      const r  = 200

      // Shadow ring
      ctx.save()
      ctx.globalAlpha = 0.15
      ctx.beginPath()
      ctx.arc(cx, cy, r + 12, 0, Math.PI * 2)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 4
      ctx.stroke()
      ctx.restore()

      // Background track
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 24
      ctx.stroke()

      // Progress arc
      const pct = maxScore > 0 ? Math.min(score / maxScore, 1) : 0
      ctx.beginPath()
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + pct * Math.PI * 2)
      ctx.strokeStyle = colors.circle
      ctx.lineWidth = 24
      ctx.lineCap = 'round'
      ctx.stroke()
      ctx.lineCap = 'butt'

      // Score number — large
      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${score >= 100 ? 130 : 160}px -apple-system, "Helvetica Neue", Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(score), cx, cy - 16)

      // "/ maxScore" label
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.font = '400 38px -apple-system, "Helvetica Neue", Arial, sans-serif'
      ctx.fillText(`/ ${maxScore}`, cx, cy + 90)

      // ── Category pill ─────────────────────────────────────────────────────
      ctx.font = 'bold 36px -apple-system, "Helvetica Neue", Arial, sans-serif'
      const pillW = Math.min(ctx.measureText(categoryLabel).width + 80, SIZE - 120)
      const pillH = 68
      const pillX = cx - pillW / 2
      const pillY = 720

      // Pill background
      ctx.fillStyle = colors.circle
      ctx.globalAlpha = 0.2
      ctx.beginPath()
      ;(ctx as CanvasRenderingContext2D & { roundRect: Function }).roundRect(pillX, pillY, pillW, pillH, pillH / 2)
      ctx.fill()
      ctx.globalAlpha = 1

      // Pill border
      ctx.strokeStyle = colors.circle
      ctx.lineWidth = 2
      ctx.beginPath()
      ;(ctx as CanvasRenderingContext2D & { roundRect: Function }).roundRect(pillX, pillY, pillW, pillH, pillH / 2)
      ctx.stroke()

      // Pill text
      ctx.fillStyle = colors.circle
      ctx.font = 'bold 34px -apple-system, "Helvetica Neue", Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(categoryLabel, cx, pillY + pillH / 2)

      // ── CTA bottom line ──────────────────────────────────────────────────
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.font = '400 28px -apple-system, "Helvetica Neue", Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText('¿Cuál es tu resultado?', cx, SIZE - 48)

      // ── Download ──────────────────────────────────────────────────────────
      canvas.toBlob((blob) => {
        if (!blob) return
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
        const link    = document.createElement('a')
        link.download = `psicoprotego_${testId}_story_${dateStr}.png`
        link.href     = URL.createObjectURL(blob)
        link.click()
        setTimeout(() => URL.revokeObjectURL(link.href), 2000)
      }, 'image/png')

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleShare}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition active:opacity-80 disabled:opacity-50"
        style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
      >
        {/* Download icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round"/>
        </svg>
        {loading ? '…' : ui.btn}
      </button>
      <p className="text-xs text-gray-400">{canShare ? ui.hintShare : ui.hintDownload}</p>
    </div>
  )
}

export default DownloadCard
