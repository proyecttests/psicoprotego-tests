/**
 * @file components/results/DownloadPDF.tsx
 * @description Client component to configure and download test PDFs.
 *
 * Flow: idle → configure → interstitial (5s countdown + ad) → done → idle
 * Name is stored in sessionStorage only, never sent to analytics.
 */

'use client'

import React from 'react'
import type { TestLangFile, AnswersMap } from '@/types/test'
import type { ScoringResult } from '@/utils/scoringFunctions'
import { trackEvent } from '@/config/analytics'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DownloadPDFProps {
  testData: TestLangFile
  answers: AnswersMap
  result: ScoringResult
  testId: string
  lang: string
  availableLangs: string[]
}

type Step = 'idle' | 'configure' | 'interstitial' | 'done'

// ── UI strings ────────────────────────────────────────────────────────────────

const UI: Record<string, {
  downloadWithResults: string
  downloadBlank: string
  configureTitle: string
  nameLabel: string
  namePlaceholder: string
  nameDisclaimer: string
  langLabel: string
  consentLabel: string
  generateButton: string
  cancelButton: string
  generating: string
  downloadingIn: string
  seconds: string
  adPlaceholder: string
  done: string
}> = {
  es: {
    downloadWithResults: '⬇ Descargar PDF con resultados',
    downloadBlank:       '⬇ Descargar test en blanco',
    configureTitle:      'Configurar informe PDF',
    nameLabel:           'Tu nombre (opcional)',
    namePlaceholder:     'Ej: Juan García',
    nameDisclaimer:      'Tu nombre solo se usa para generar este documento y no sale de tu navegador. No lo almacenamos ni lo procesamos. Eres responsable del uso y distribución de este informe.',
    langLabel:           'Idioma del informe',
    consentLabel:        'He leído y acepto las condiciones de uso de este informe',
    generateButton:      'Generar informe',
    cancelButton:        'Cancelar',
    generating:          'Generando tu informe...',
    downloadingIn:       'Descargando en',
    seconds:             'segundos...',
    adPlaceholder:       'Publicidad',
    done:                '¡Descargado!',
  },
  en: {
    downloadWithResults: '⬇ Download PDF with results',
    downloadBlank:       '⬇ Download blank test',
    configureTitle:      'Configure PDF report',
    nameLabel:           'Your name (optional)',
    namePlaceholder:     'E.g. John Smith',
    nameDisclaimer:      'Your name is only used to generate this document and never leaves your browser. We do not store or process it. You are responsible for the use and distribution of this report.',
    langLabel:           'Report language',
    consentLabel:        'I have read and accept the terms of use of this report',
    generateButton:      'Generate report',
    cancelButton:        'Cancel',
    generating:          'Generating your report...',
    downloadingIn:       'Downloading in',
    seconds:             'seconds...',
    adPlaceholder:       'Advertisement',
    done:                'Downloaded!',
  },
  pt: {
    downloadWithResults: '⬇ Baixar PDF com resultados',
    downloadBlank:       '⬇ Baixar teste em branco',
    configureTitle:      'Configurar relatório PDF',
    nameLabel:           'Seu nome (opcional)',
    namePlaceholder:     'Ex: João Silva',
    nameDisclaimer:      'Seu nome é usado apenas para gerar este documento e nunca sai do seu navegador. Não o armazenamos nem processamos. Você é responsável pelo uso e distribuição deste relatório.',
    langLabel:           'Idioma do relatório',
    consentLabel:        'Li e aceito os termos de uso deste relatório',
    generateButton:      'Gerar relatório',
    cancelButton:        'Cancelar',
    generating:          'Gerando seu relatório...',
    downloadingIn:       'Baixando em',
    seconds:             'segundos...',
    adPlaceholder:       'Publicidade',
    done:                'Baixado!',
  },
}

const LANG_FLAGS: Record<string, string> = {
  es: '🇪🇸 Español',
  en: '🇬🇧 English',
  pt: '🇧🇷 Português',
  ar: '🇸🇦 العربية',
  fr: '🇫🇷 Français',
  de: '🇩🇪 Deutsch',
  it: '🇮🇹 Italiano',
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
  availableLangs,
}) => {
  const [step, setStep]             = React.useState<Step>('idle')
  const [isBlank, setIsBlank]       = React.useState(false)
  const [userName, setUserName]     = React.useState('')
  const [viewLang, setViewLang]     = React.useState(lang)
  const [viewLangData, setViewLangData] = React.useState<TestLangFile | null>(null)
  const [validationDetails, setValidationDetails] = React.useState<{
    validated: boolean; reference?: string; originalReference?: string; originalJournal?: string
  } | null>(null)
  const [loadingLang, setLoadingLang]   = React.useState(false)
  const [countdown, setCountdown]   = React.useState(5)
  const [nameConsent, setNameConsent]   = React.useState(false)
  const [progress, setProgress]     = React.useState(0)

  const ui = getUi(lang)

  // ── sessionStorage: load name on mount ──────────────────────────────────
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem('psico_pdf_name')
      if (saved) setUserName(saved)
    } catch { /* ignore */ }
    // Load validation details for this test/lang
    fetch(`/data/tests/${testId}/metadata.json`)
      .then(r => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((meta: any) => {
        const vd = meta?.validationDetails
        if (!vd) return
        const langV = vd.translations?.[lang]
        const orig  = vd.original
        setValidationDetails({
          validated:         langV?.validated ?? false,
          reference:         langV?.reference,
          originalReference: orig?.reference,
          originalJournal:   orig?.journal,
        })
      })
      .catch(() => {/* silent */})
  }, [testId, lang])

  // ── Load viewLangData when viewLang changes ──────────────────────────────
  React.useEffect(() => {
    if (viewLang === lang) {
      setViewLangData(null)
      return
    }
    setLoadingLang(true)
    fetch(`/data/tests/${testId}/${viewLang}.json`)
      .then((r) => r.json() as Promise<TestLangFile>)
      .then((data) => {
        setViewLangData(data)
        setLoadingLang(false)
      })
      .catch(() => setLoadingLang(false))
  }, [viewLang, lang, testId])

  // ── Interstitial: countdown + progress bar ───────────────────────────────
  React.useEffect(() => {
    if (step !== 'interstitial') return
    setCountdown(5)
    setProgress(0)

    const startTime = Date.now()
    const duration  = 5000

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct     = Math.min(100, (elapsed / duration) * 100)
      setProgress(pct)
      setCountdown(Math.max(0, Math.ceil((duration - elapsed) / 1000)))

      if (elapsed >= duration) {
        clearInterval(interval)
        void triggerDownload()
        setStep('done')
        setTimeout(() => setStep('idle'), 2000)
      }
    }, 100)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

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

  const handleGenerate = () => {
    setStep('interstitial')
  }

  const triggerDownload = async () => {
    try {
      const now = new Date().toISOString()

      if (isBlank) {
        const { pdf } = await import('@react-pdf/renderer')
        const { TestBlankDocument } = await import('@/components/pdf/TestBlankDocument')

        const doc = React.createElement(TestBlankDocument, {
          testData,
          metadata: {
            generatedAt: now,
            testId,
          },
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const blob = await pdf(doc as any).toBlob()
        downloadBlob(blob, `psicoprotego_${testId}_blank_${Date.now()}.pdf`)
      } else {
        const { pdf } = await import('@react-pdf/renderer')
        const { TestReportDocument } = await import('@/components/pdf/TestReportDocument')

        const doc = React.createElement(TestReportDocument, {
          testData,
          answers,
          result,
          metadata: {
            completedAt: now,
            userLang:    lang,
            viewLang,
            userName:    userName.trim() || undefined,
            testId,
            validationDetails: validationDetails ?? undefined,
          },
          viewLangData: viewLangData ?? undefined,
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const blob = await pdf(doc as any).toBlob()
        downloadBlob(blob, `psicoprotego_${testId}_${Date.now()}.pdf`)
      }

      // Analytics — name is NEVER included
      trackEvent('pdf_download', { testId, isBlank, viewLang })
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

          {/* Language selector */}
          <div className="space-y-1">
            <label
              htmlFor="pdf-lang"
              className="block text-sm font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              {ui.langLabel}
            </label>
            <select
              id="pdf-lang"
              value={viewLang}
              onChange={(e) => setViewLang(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              style={{
                borderColor:     'var(--color-accent, #c8a96e)',
                backgroundColor: '#fff',
                color:           '#1a1a1a',
              }}
            >
              {availableLangs.map((l) => (
                <option key={l} value={l}>
                  {LANG_FLAGS[l] ?? l.toUpperCase()}
                </option>
              ))}
            </select>
            {loadingLang && (
              <p className="text-xs" style={{ color: '#888' }}>Cargando idioma...</p>
            )}
          </div>

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
              {ui.consentLabel}
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!nameConsent || loadingLang}
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

  // ── Render: interstitial ──────────────────────────────────────────────────
  if (step === 'interstitial') {
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

        {/* Progress bar */}
        <div className="w-full max-w-xs rounded-full bg-white/20 overflow-hidden h-2">
          <div
            className="h-full rounded-full transition-none"
            style={{
              width:           `${progress}%`,
              backgroundColor: 'var(--color-accent, #c8a96e)',
              transition:      'width 0.1s linear',
            }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Ad placeholder */}
        <div
          className="flex items-center justify-center rounded-lg text-sm font-medium"
          style={{
            width:           300,
            height:          250,
            backgroundColor: '#2a2a2a',
            border:          '1px dashed #555',
            color:           '#666',
          }}
          aria-hidden="true"
        >
          {ui.adPlaceholder}
        </div>

        {/* Countdown */}
        <p className="text-sm text-white/70">
          {ui.downloadingIn}{' '}
          <span className="font-bold text-white">{countdown}</span>{' '}
          {ui.seconds}
        </p>
      </div>
    )
  }

  return null
}

export default DownloadPDF
