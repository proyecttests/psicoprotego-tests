'use client'
/**
 * @file components/pdf/DownloadBlankLanding.tsx
 * @description Button to download the blank test PDF from the landing page.
 * Uses the same interstitial + PDF generation flow as DownloadPDF.
 */
import React from 'react'
import { trackEvent } from '@/config/analytics'
import type { TestLangFile } from '@/types/test'

const LABEL: Record<string, { btn: string; interstitial: string; countdown: string; ad: string }> = {
  es: { btn: 'Descargar test en blanco', interstitial: 'Preparando el test...', countdown: 'Descargando en', ad: 'Publicidad' },
  en: { btn: 'Download blank test',      interstitial: 'Preparing the test...', countdown: 'Downloading in', ad: 'Advertisement' },
  pt: { btn: 'Baixar teste em branco',   interstitial: 'Preparando o teste...', countdown: 'Baixando em',   ad: 'Publicidade' },
  ku: { btn: 'کوێزی خاڵی داگرە',           interstitial: 'کوێزەکە ئامادەدەکرێت...', countdown: 'داگرتن لە',      ad: 'ڕیکلام' },
}

interface DownloadBlankLandingProps {
  testId:   string
  lang:     string
  testName: string
}

export default function DownloadBlankLanding({ testId, lang, testName }: DownloadBlankLandingProps) {
  const ui = LABEL[lang] ?? LABEL['es']
  const [state, setState]       = React.useState<'idle' | 'interstitial' | 'done'>('idle')
  const [validationDetails, setValidationDetails] = React.useState<{
    validated: boolean; reference?: string; originalReference?: string; originalJournal?: string
  } | null>(null)
  const blobPromiseRef = React.useRef<Promise<Blob> | null>(null)
  const [countdown, setCountdown] = React.useState(5)

  const handleClick = () => {
    // Start building PDF immediately
    blobPromiseRef.current = buildBlob()
    setState('interstitial')
    setCountdown(5)
  }

  React.useEffect(() => {
    fetch(`/data/tests/${testId}/metadata.json`)
      .then(r => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((meta: any) => {
        const vd = meta?.validationDetails
        if (!vd) return
        const langV = vd.translations?.[lang]
        const orig  = vd.original
        setValidationDetails({ validated: langV?.validated ?? false, reference: langV?.reference, originalReference: orig?.reference, originalJournal: orig?.journal })
      })
      .catch(() => {/* silent */})
  }, [testId, lang])

  React.useEffect(() => {
    if (state !== 'interstitial') return
    if (countdown <= 0) {
      void triggerDownload()
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, countdown])

  const buildBlob = async (): Promise<Blob> => {
    const [{ pdf }, { TestBlankDocument }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('@/components/pdf/TestBlankDocument'),
    ])
    const r = await fetch(`/data/tests/${testId}/${lang}.json`)
    const testData = await r.json() as TestLangFile
    const doc = React.createElement(TestBlankDocument, {
      testData,
      metadata: { generatedAt: new Date().toISOString(), testId, validationDetails: validationDetails ?? undefined },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return pdf(doc as any).toBlob()
  }

  const triggerDownload = async () => {
    try {
      const blob = await (blobPromiseRef.current ?? buildBlob())
      blobPromiseRef.current = null
      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href    = url
      const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,'')
      a.download = `psicoprotego_${testId}_blank_${dateStr}.pdf`
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

      {/* Interstitial overlay */}
      {state === 'interstitial' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full flex flex-col items-center gap-5 shadow-2xl">
            {/* Spinner */}
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200"
              style={{ borderTopColor: 'var(--color-primary)' }}
            />
            <p className="font-semibold text-lg text-center" style={{ color: 'var(--color-primary)' }}>
              {ui.interstitial}
            </p>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${((5 - countdown) / 5) * 100}%`,
                  backgroundColor: 'var(--color-primary)',
                }}
              />
            </div>
            {/* Ad placeholder */}
            <div
              className="w-full flex items-center justify-center rounded-lg text-xs text-gray-400 font-sans"
              style={{ height: 100, backgroundColor: '#f5f3ef', border: '1px dashed #ccc' }}
            >
              {ui.ad}
            </div>
            <p className="text-sm text-gray-500 font-sans">
              {ui.countdown} {countdown}s…
            </p>
          </div>
        </div>
      )}
    </>
  )
}
