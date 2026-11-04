'use client'
/**
 * @file components/pdf/DownloadBlankLanding.tsx
 * @description Button to download the blank test PDF from the landing page.
 * Genera el PDF en el navegador y lo descarga en cuanto está listo (como DownloadPDF).
 */
import React from 'react'
import { trackEvent } from '@/config/analytics'
import { buildBlankPdf } from './buildPdf'

const LABEL: Record<string, { btn: string; generating: string }> = {
  es: { btn: 'Descargar test en blanco', generating: 'Preparando el test...' },
}

interface DownloadBlankLandingProps {
  testId:   string
  lang:     string
}

export default function DownloadBlankLanding({ testId, lang }: DownloadBlankLandingProps) {
  const ui = LABEL[lang] ?? LABEL['es']
  const [state, setState]       = React.useState<'idle' | 'generating' | 'done'>('idle')

  const handleClick = () => {
    setState('generating')
    void triggerDownload()
  }

  const triggerDownload = async () => {
    try {
      const blob = await buildBlankPdf(testId, lang)
      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href    = url
      a.download = `psicoprotego-${testId}-en-blanco.pdf`
      a.click()
      URL.revokeObjectURL(url)
      trackEvent('pdf_download', { testId, isBlank: true, source: 'landing' })
    } catch (err) {
      console.error('[DownloadBlankLanding]', err)
    } finally {
      setState('done')
      setTimeout(() => setState('idle'), 2000)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="text-sm underline underline-offset-2 transition-opacity hover:opacity-70"
        style={{ color: 'var(--color-accent)' }}
      >
        {ui.btn}
      </button>

      {/* Overlay mientras se genera el PDF */}
      {state === 'generating' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          role="status"
          aria-live="polite"
        >
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full flex flex-col items-center gap-5 shadow-2xl">
            {/* Spinner */}
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200"
              style={{ borderTopColor: 'var(--color-primary)' }}
            />
            <p className="font-semibold text-lg text-center" style={{ color: 'var(--color-primary)' }}>
              {ui.generating}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
