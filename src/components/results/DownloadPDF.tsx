/**
 * @file components/results/DownloadPDF.tsx
 * @description Client component to configure and download test PDFs.
 *
 * Flow: idle → configure → generating (hasta que el PDF está listo) → done → idle
 * Name is stored in sessionStorage only, never sent to analytics.
 */

'use client'

import React from 'react'
import type { TestLangFile, AnswersMap } from '@/types/test'
import type { ScoringResult } from '@/utils/scoringFunctions'
import { trackEvent } from '@/config/analytics'
import { buildBlankPdf, buildReportPdf } from '@/components/pdf/buildPdf'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DownloadPDFProps {
  testData: TestLangFile
  answers: AnswersMap
  result: ScoringResult
  testId: string
  lang: string
}

type Step = 'idle' | 'configure' | 'generating' | 'done'

// ── UI strings ────────────────────────────────────────────────────────────────

const UI: Record<string, {
  downloadWithResults: string
  downloadBlank: string
  configureTitle: string
  nameLabel: string
  namePlaceholder: string
  nameDisclaimer: string
  consentLabel: string
  consentLink: string
  consentAfter: string
  generateButton: string
  cancelButton: string
  generating: string
  done: string
}> = {
  es: {
    downloadWithResults: '⬇ Descargar PDF con resultados',
    downloadBlank:       '⬇ Descargar test en blanco',
    configureTitle:      'Configurar informe PDF',
    nameLabel:           'Tu nombre (opcional)',
    namePlaceholder:     'Ej: Juan García',
    nameDisclaimer:      'Tu nombre solo se usa para generar este documento y no sale de tu navegador. No lo almacenamos ni lo procesamos. Eres responsable del uso y distribución de este informe.',
    consentLabel:        'He leído y acepto las',
    consentLink:         'condiciones de uso',
    consentAfter:        ' de este informe',
    generateButton:      'Generar informe',
    cancelButton:        'Cancelar',
    generating:          'Generando tu informe...',
    done:                '¡Descargado!',
  },
}

function getUi(lang: string) {
  return UI[lang] ?? UI['es']
}

// ── Component ─────────────────────────────────────────────────────────────────

export const DownloadPDF: React.FC<DownloadPDFProps> = ({
  testData,
  answers,
  result,
  testId,
  lang,
}) => {
  const [step, setStep]             = React.useState<Step>('idle')
  const [isBlank, setIsBlank]       = React.useState(false)
  const [userName, setUserName]     = React.useState('')
  const [nameConsent, setNameConsent]   = React.useState(false)

  const ui = getUi(lang)

  // ── sessionStorage: load name on mount ──────────────────────────────────
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem('psico_pdf_name')
      if (saved) setUserName(saved)
    } catch { /* ignore */ }
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleOpenConfigure = (blank: boolean) => {
    setIsBlank(blank)
    setNameConsent(false)
    setStep('configure')
  }

  const handleNameChange = (value: string) => {
    setUserName(value)
    try {
      if (value) sessionStorage.setItem('psico_pdf_name', value)
      else sessionStorage.removeItem('psico_pdf_name')
    } catch { /* ignore */ }
  }

  const handleGenerate = async () => {
    setStep('generating')
    await triggerDownload()
    setStep('done')
    setTimeout(() => setStep('idle'), 2000)
  }

  const buildBlob = (blank: boolean): Promise<Blob> =>
    blank
      ? buildBlankPdf(testId, lang, testData)
      : buildReportPdf({ testId, lang, testData, answers, result, userName: userName.trim() || undefined })

  const triggerDownload = async () => {
    try {
      const blob = await buildBlob(isBlank)
      downloadBlob(blob, `psicoprotego-${testId}-${isBlank ? 'en-blanco' : 'resultados'}.pdf`)
      trackEvent('pdf_download', { testId, isBlank })
    } catch (err) {
      console.error('[DownloadPDF] Error generating PDF:', err)
    }
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a   = document.createElement('a')
    a.href     = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Render: idle ──────────────────────────────────────────────────────────
  if (step === 'idle' || step === 'done') {
    return (
      <div className="flex flex-col gap-2 w-full" aria-label="Opciones de descarga PDF">
        {step === 'done' && (
          <p className="text-sm font-semibold text-center" style={{ color: 'var(--color-primary)' }}>
            {ui.done}
          </p>
        )}
        <button
          type="button"
          onClick={() => handleOpenConfigure(false)}
          className="btn-primary w-full text-sm"
        >
          {ui.downloadWithResults}
        </button>
        <button
          type="button"
          onClick={() => handleOpenConfigure(true)}
          className="btn-secondary w-full text-sm"
        >
          {ui.downloadBlank}
        </button>
      </div>
    )
  }

  // ── Render: configure modal ───────────────────────────────────────────────
  if (step === 'configure') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        role="dialog"
        aria-modal="true"
        aria-label={ui.configureTitle}
      >
        <div
          className="w-full max-w-md rounded-xl shadow-xl p-6 space-y-5"
          style={{ backgroundColor: 'var(--color-cream, #f5f3ef)' }}
        >
          <h2
            className="text-lg font-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            {ui.configureTitle}
          </h2>

          {/* Name field */}
          {!isBlank && (
            <div className="space-y-1">
              <label
                htmlFor="pdf-name"
                className="block text-sm font-medium"
                style={{ color: 'var(--color-primary)' }}
              >
                {ui.nameLabel}
              </label>
              <input
                id="pdf-name"
                type="text"
                value={userName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={ui.namePlaceholder}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{
                  borderColor:     'var(--color-accent, #c8a96e)',
                  backgroundColor: '#fff',
                  color:           '#1a1a1a',
                }}
                maxLength={80}
                autoComplete="off"
              />
              <p className="text-xs leading-relaxed" style={{ color: '#888' }}>
                {ui.nameDisclaimer}
              </p>
            </div>
          )}

          {/* Consent checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={nameConsent}
              onChange={(e) => setNameConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-current"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <span className="text-sm leading-relaxed" style={{ color: '#444' }}>
              {ui.consentLabel}{' '}
              {/* Pestaña nueva: navegar aquí perdería el resultado, que solo vive en esta página */}
              <a
                href={`/${lang}/condiciones`}
                target="_blank"
                rel="noopener"
                className="underline underline-offset-2"
                style={{ color: 'var(--color-accent)' }}
              >
                {ui.consentLink}
              </a>
              {ui.consentAfter}
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!nameConsent}
              className="btn-primary flex-1 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {ui.generateButton}
            </button>
            <button
              type="button"
              onClick={() => setStep('idle')}
              className="btn-secondary flex-1 text-sm"
            >
              {ui.cancelButton}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Render: generating ────────────────────────────────────────────────────
  if (step === 'generating') {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 p-6"
        style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
        role="status"
        aria-live="polite"
        aria-label={ui.generating}
      >
        {/* Spinner */}
        <div
          className="h-14 w-14 animate-spin rounded-full border-4 border-white/20"
          style={{ borderTopColor: 'var(--color-accent, #c8a96e)' }}
          aria-hidden="true"
        />

        <p className="text-lg font-semibold text-white">{ui.generating}</p>
      </div>
    )
  }

  return null
}

export default DownloadPDF
