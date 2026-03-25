/**
 * @file components/results/DownloadCard.tsx
 * @description Genera una imagen cuadrada 1080×1080 con el resultado
 * y la descarga como PNG. Ideal para Instagram/TikTok stories.
 * Sin dependencias externas — usa Canvas API del navegador.
 */
'use client'

import React from 'react'

const UI: Record<string, { btn: string; hint: string }> = {
  es: { btn: 'Descargar imagen', hint: 'Para compartir en stories' },
  en: { btn: 'Download image',   hint: 'Share in your stories'    },
  pt: { btn: 'Baixar imagem',    hint: 'Para compartilhar nos stories' },
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

const DownloadCard: React.FC<DownloadCardProps> = ({
  lang, testName, score, maxScore, categoryLabel, colorKey, testId,
}) => {
  const ui     = UI[lang] ?? UI['es']
  const colors = COLORS[colorKey] ?? COLORS['green']
  const [loading, setLoading] = React.useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const SIZE = 1080
      const canvas = document.createElement('canvas')
      canvas.width  = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext('2d')!

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE)
      grad.addColorStop(0, colors.bg)
      grad.addColorStop(1, '#0a1a12')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, SIZE, SIZE)

      // Decorative circles
      ctx.globalAlpha = 0.06
      ctx.fillStyle   = '#ffffff'
      ctx.beginPath()
      ctx.arc(SIZE, 0, 420, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(0, SIZE, 320, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      // Score circle
      const cx = SIZE / 2
      const cy = 400
      const r  = 180
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = colors.circle
      ctx.lineWidth   = 10
      ctx.stroke()

      // Score arc (progress)
      const pct = maxScore > 0 ? score / maxScore : 0
      ctx.beginPath()
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + pct * Math.PI * 2)
      ctx.strokeStyle = colors.circle
      ctx.lineWidth   = 20
      ctx.lineCap     = 'round'
      ctx.stroke()
      ctx.lineCap = 'butt'

      // Score number
      ctx.fillStyle   = '#ffffff'
      ctx.font        = 'bold 160px Georgia, serif'
      ctx.textAlign   = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(score), cx, cy)

      // Max score label
      ctx.font      = '36px Arial, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.fillText(`/ ${maxScore}`, cx, cy + 110)

      // Category label chip
      const chipW = ctx.measureText(categoryLabel).width + 60
      const chipX = cx - chipW / 2
      const chipY = 630
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.beginPath()
      ctx.roundRect(chipX, chipY, chipW, 54, 27)
      ctx.fill()

      ctx.fillStyle    = colors.circle
      ctx.font         = 'bold 28px Arial, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.fillText(categoryLabel, cx, chipY + 27)

      // Test name
      ctx.fillStyle    = 'rgba(255,255,255,0.9)'
      ctx.font         = '44px Georgia, serif'
      ctx.textBaseline = 'top'
      wrapText(ctx, testName, cx, 730, 900, 56)

      // Domain
      ctx.fillStyle    = 'rgba(255,255,255,0.3)'
      ctx.font         = '30px Arial, sans-serif'
      ctx.textBaseline = 'bottom'
      ctx.fillText('testpsycho.com', cx, SIZE - 40)

      // Download
      const link    = document.createElement('a')
      link.download = `resultado-${testId}.png`
      link.href     = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleDownload}
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
      <p className="text-xs text-gray-400">{ui.hint}</p>
    </div>
  )
}

export default DownloadCard
