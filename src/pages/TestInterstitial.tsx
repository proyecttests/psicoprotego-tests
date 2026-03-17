/**
 * @file pages/TestInterstitial.tsx
 * @description Pantalla intersticial entre la landing page y el test.
 *
 * Flujo: TestLandingPage → [onStart] → TestInterstitial → [onContinue] → TestContainer
 *
 * Contiene:
 * 1. Disclaimer clínico completo con teléfonos de crisis
 * 2. AdSlot pre-test (mayor valor publicitario)
 * 3. Botón "Entiendo y continuar" + enlace "Cancelar"
 *
 * No tiene contenido SEO (página funcional/transicional).
 *
 * Uso:
 * ```tsx
 * <TestInterstitial
 *   testId="gad7"
 *   lang="es"
 *   onContinue={() => setFlow('test')}
 *   onCancel={() => setFlow('landing')}
 * />
 * ```
 */

import React from 'react'
import type { TestLangFile } from '@/types/test'
import Header  from '@/components/common/Header'
import Footer  from '@/components/common/Footer'
import AdSlot  from '@/components/ads/AdSlot'

// ── UI strings ────────────────────────────────────────────────────────────────

const UI = {
  es: {
    pageTitle:       'Antes de comenzar',
    disclaimerTitle: 'Aviso importante antes de continuar',
    defaultText:     (name: string) =>
      `El cuestionario **${name}** es una herramienta de evaluación psicológica orientativa. ` +
      `Sus resultados tienen únicamente carácter educativo. **No sustituyen la evaluación, el diagnóstico ` +
      `ni el tratamiento de un profesional de la salud mental.** Si experimentas síntomas graves o tienes ` +
      `pensamientos de hacerte daño, por favor contacta con un profesional de inmediato.`,
    crisisLabel:     'En caso de crisis',
    crisisLine:      'Llama al',
    crisisFree:      '(gratuito, 24 h)',
    crisisOr:        'o al',
    crisisMore:      'Más información',
    continueButton:  'Entiendo y continuar',
    cancelLink:      'Cancelar, volver atrás',
    loading:         'Cargando…',
    errorTitle:      'No se pudo cargar el test',
    errorRetry:      'Recargar',
  },
  en: {
    pageTitle:       'Before you start',
    disclaimerTitle: 'Important notice before continuing',
    defaultText:     (name: string) =>
      `The **${name}** questionnaire is an orientative psychological assessment tool. ` +
      `Its results are for educational purposes only. **They do not replace evaluation, diagnosis, ` +
      `or treatment by a mental health professional.** If you experience severe symptoms or thoughts ` +
      `of self-harm, please contact a professional immediately.`,
    crisisLabel:     'In case of crisis',
    crisisLine:      'Call',
    crisisFree:      '(free, 24 h)',
    crisisOr:        'or',
    crisisMore:      'More information',
    continueButton:  'I understand, continue',
    cancelLink:      'Cancel, go back',
    loading:         'Loading…',
    errorTitle:      'Could not load test',
    errorRetry:      'Retry',
  },
  pt: {
    pageTitle:       'Antes de começar',
    disclaimerTitle: 'Aviso importante antes de continuar',
    defaultText:     (name: string) =>
      `O questionário **${name}** é uma ferramenta de avaliação psicológica orientativa. ` +
      `Seus resultados têm caráter exclusivamente educativo. **Não substituem a avaliação, o diagnóstico ` +
      `nem o tratamento por um profissional de saúde mental.** Se você tiver sintomas graves ou pensamentos ` +
      `de se machucar, entre em contato com um profissional imediatamente.`,
    crisisLabel:     'Em caso de crise',
    crisisLine:      'Ligue para',
    crisisFree:      '(gratuito, 24 h)',
    crisisOr:        'ou',
    crisisMore:      'Mais informações',
    continueButton:  'Entendo e continuar',
    cancelLink:      'Cancelar, voltar',
    loading:         'Carregando…',
    errorTitle:      'Não foi possível carregar o teste',
    errorRetry:      'Recarregar',
  },
} as const

type SupportedLang = keyof typeof UI

function getUI(lang: string) {
  return UI[(lang as SupportedLang) in UI ? (lang as SupportedLang) : 'es']
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Renderiza texto con **bold** inline */
function renderBold(text: string): React.ReactNode[] {
  return text.split('**').map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold" style={{ color: '#991b1b' }}>{part}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface TestInterstitialProps {
  testId:     string
  lang:       string
  onContinue: () => void
  onCancel:   () => void
}

// ── Componente ────────────────────────────────────────────────────────────────

const TestInterstitial: React.FC<TestInterstitialProps> = ({
  testId,
  lang,
  onContinue,
  onCancel,
}) => {
  const ui = getUI(lang)

  const [testName,      setTestName]      = React.useState('')
  const [disclaimerText, setDisclaimerText] = React.useState('')
  const [loadState,     setLoadState]     = React.useState<'loading' | 'loaded' | 'error'>('loading')
  const [errorMsg,      setErrorMsg]      = React.useState('')

  // ── Fetch testName + disclaimerBefore ─────────────────────────────────────
  React.useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch(`/data/tests/${testId}/${lang}.json`)
        const finalRes = res.ok ? res : await fetch(`/data/tests/${testId}/es.json`)
        if (!finalRes.ok) throw new Error(`Content for "${testId}" not found.`)

        const data = await finalRes.json() as TestLangFile

        if (!cancelled) {
          setTestName(data.name)
          setDisclaimerText(data.disclaimerBefore ?? ui.defaultText(data.name))
          setLoadState('loaded')
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : 'Error desconocido')
          setLoadState('error')
        }
      }
    }

    void load()
    return () => { cancelled = true }
  }, [testId, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loadState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 text-gray-500">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200"
            style={{ borderTopColor: 'var(--color-primary)' }}
            aria-hidden="true"
          />
          <p className="text-sm font-medium">{ui.loading}</p>
        </div>
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (loadState === 'error') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <div
            role="alert"
            className="max-w-md rounded-xl border border-red-300 bg-red-50 p-6 text-center shadow-sm"
          >
            <span aria-hidden="true" className="text-4xl">⚠️</span>
            <h1 className="mt-3 text-lg font-semibold text-red-800">{ui.errorTitle}</h1>
            <p className="mt-2 text-sm text-red-700">{errorMsg}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary mt-5"
            >
              {ui.errorRetry}
            </button>
          </div>
        </main>
        <Footer showCrisisFooter={false} />
      </div>
    )
  }

  // ── Loaded ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
      <Header testName={testName} />

      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-8">

          {/* ── 1. DISCLAIMER ──────────────────────────────────────────────── */}
          <section
            role="alertdialog"
            aria-labelledby="interstitial-title"
            aria-describedby="interstitial-body"
          >
            <div
              className="rounded-xl p-6 border-l-4 shadow-sm"
              style={{
                backgroundColor: '#fff',
                border: '1px solid #fca5a5',
                borderLeftColor: '#dc2626',
                borderLeftWidth: '4px',
              }}
            >
              {/* Header del disclaimer */}
              <div className="flex items-start gap-4 mb-4">
                <span aria-hidden="true" className="text-3xl flex-shrink-0 mt-0.5">⚠️</span>
                <div>
                  <h1
                    id="interstitial-title"
                    className="text-lg font-semibold leading-snug"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {ui.pageTitle}
                  </h1>
                  <p
                    className="text-xs mt-0.5 font-medium uppercase tracking-wide opacity-60"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {ui.disclaimerTitle}
                  </p>
                </div>
              </div>

              {/* Texto del disclaimer */}
              <p
                id="interstitial-body"
                className="text-sm leading-relaxed font-sans"
                style={{ color: '#4b5563' }}
              >
                {renderBold(disclaimerText)}
              </p>

              {/* Teléfono de crisis — siempre visible */}
              <div
                className="mt-5 pt-4 flex flex-col gap-2"
                style={{ borderTop: '1px solid #fecaca' }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: '#991b1b' }}
                >
                  {ui.crisisLabel}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="tel:024"
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-500"
                    style={{ backgroundColor: '#dc2626', color: '#fff' }}
                    aria-label="Llamar al 024 — gratuito, disponible 24 horas"
                  >
                    <span aria-hidden="true">📞</span>
                    024 <span className="font-normal opacity-80">{ui.crisisFree}</span>
                  </a>
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-500"
                    style={{ backgroundColor: '#fff', color: '#dc2626', border: '2px solid #dc2626' }}
                    aria-label="Llamar al 112 — Emergencias"
                  >
                    <span aria-hidden="true">📞</span>
                    112
                  </a>
                  <a
                    href="https://www.sanidad.gob.es/linea024"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs underline self-center hover:opacity-75"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {ui.crisisMore} →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── 2. AD SLOT (mayor valor: pre-test) ─────────────────────────── */}
          <div className="flex justify-center">
            <AdSlot position="pre-test" size="rectangle" />
          </div>

          {/* ── 3. BOTÓN + CANCELAR ────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={onContinue}
              autoFocus
              className="btn-primary w-full text-base py-4"
              aria-label={ui.continueButton}
            >
              {ui.continueButton}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="text-sm underline underline-offset-2 transition-opacity hover:opacity-60 focus:outline-none focus-visible:ring-2 rounded"
              style={{ color: 'var(--color-primary)', opacity: 0.65 }}
            >
              {ui.cancelLink}
            </button>
          </div>

        </div>
      </main>

      <Footer showCrisisFooter={false} />
    </div>
  )
}

export default TestInterstitial
