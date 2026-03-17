/**
 * @file pages/TestLandingPage.tsx
 * @description Landing page SEO completa del test psicológico.
 *
 * Secciones: Hero → Ad slot → Qué mide → Para quién → Cómo funciona →
 *            Ficha técnica → FAQ (schema FAQPage) → CTA final → Footer.
 *
 * SEO: inyecta <title>, <meta description> y JSON-LD
 *      (FAQPage + BreadcrumbList + MedicalWebPage si psicométrico validado)
 *      via useEffect/DOM directo (SPA Vite; migrable a Next.js con minimal diff).
 *
 * Uso:
 * ```tsx
 * <TestLandingPage testId="gad7" lang="es" onStart={() => navigate('interstitial')} />
 * ```
 */

import React from 'react'
import type { TestMetadata, TestLangFile } from '@/types/test'
import Header            from '@/components/common/Header'
import Footer            from '@/components/common/Footer'
import AdSlot            from '@/components/ads/AdSlot'
import TestMetadataTable from '@/components/test-framework/TestMetadataTable'

// ── UI strings ────────────────────────────────────────────────────────────────

const UI = {
  es: {
    startButton:         'Iniciar test',
    startButtonAria:     (name: string) => `Iniciar ${name}`,
    freeLine:            'Gratuito · Sin registro',
    validatedBadge:      'Validado científicamente',
    questionsLabel:      (n: number) => `${n} preguntas`,
    durationLabel:       (t: string) => `${t} min`,
    whatItMeasuresTitle: '¿Qué mide este test?',
    whoIsItForTitle:     '¿Para quién es?',
    howItWorksTitle:     'Cómo funciona',
    technicalSheetTitle: 'Ficha técnica del test',
    faqTitle:            'Preguntas frecuentes',
    disclaimerText:      'Este test es educativo y no constituye diagnóstico clínico. Psicoprotego no almacena tus respuestas.',
    breadcrumbHome:      'Inicio',
    breadcrumbTests:     'Tests',
    loading:             'Cargando…',
    errorTitle:          'No se pudo cargar el test',
    errorRetry:          'Recargar',
  },
  en: {
    startButton:         'Start test',
    startButtonAria:     (name: string) => `Start ${name}`,
    freeLine:            'Free · No sign-up',
    validatedBadge:      'Scientifically validated',
    questionsLabel:      (n: number) => `${n} questions`,
    durationLabel:       (t: string) => `${t} min`,
    whatItMeasuresTitle: 'What does this test measure?',
    whoIsItForTitle:     'Who is it for?',
    howItWorksTitle:     'How it works',
    technicalSheetTitle: 'Technical sheet',
    faqTitle:            'Frequently asked questions',
    disclaimerText:      'This test is educational and does not constitute clinical diagnosis. Psicoprotego does not store your answers.',
    breadcrumbHome:      'Home',
    breadcrumbTests:     'Tests',
    loading:             'Loading…',
    errorTitle:          'Could not load test',
    errorRetry:          'Retry',
  },
  pt: {
    startButton:         'Iniciar teste',
    startButtonAria:     (name: string) => `Iniciar ${name}`,
    freeLine:            'Gratuito · Sem cadastro',
    validatedBadge:      'Validado cientificamente',
    questionsLabel:      (n: number) => `${n} perguntas`,
    durationLabel:       (t: string) => `${t} min`,
    whatItMeasuresTitle: 'O que este teste mede?',
    whoIsItForTitle:     'Para quem é?',
    howItWorksTitle:     'Como funciona',
    technicalSheetTitle: 'Ficha técnica do teste',
    faqTitle:            'Perguntas frequentes',
    disclaimerText:      'Este teste é educativo e não constitui diagnóstico clínico. O Psicoprotego não armazena suas respostas.',
    breadcrumbHome:      'Início',
    breadcrumbTests:     'Testes',
    loading:             'Carregando…',
    errorTitle:          'Não foi possível carregar o teste',
    errorRetry:          'Recarregar',
  },
} as const

type SupportedLang = keyof typeof UI

function getUI(lang: string) {
  return UI[(lang as SupportedLang) in UI ? (lang as SupportedLang) : 'es']
}

// ── SEO helpers ───────────────────────────────────────────────────────────────

function buildJsonLd(
  langData: TestLangFile,
  metadata: TestMetadata,
  lang: string,
  testId: string,
  ui: ReturnType<typeof getUI>,
): object[] {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url    = `${origin}/${lang}/test/${testId}`

  const schemas: object[] = []

  // ── BreadcrumbList ────────────────────────────────────────────────────────
  schemas.push({
    '@context':      'https://schema.org',
    '@type':         'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: ui.breadcrumbHome,  item: origin },
      { '@type': 'ListItem', position: 2, name: ui.breadcrumbTests, item: `${origin}/${lang}/test` },
      { '@type': 'ListItem', position: 3, name: langData.name,      item: url },
    ],
  })

  // ── FAQPage ───────────────────────────────────────────────────────────────
  if (langData.landing.faq.length > 0) {
    schemas.push({
      '@context':   'https://schema.org',
      '@type':      'FAQPage',
      mainEntity:   langData.landing.faq.map((item) => ({
        '@type':        'Question',
        name:           item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
  }

  // ── MedicalWebPage (solo si psicométrico validado) ────────────────────────
  if (metadata.category === 'psychometric' && metadata.validated) {
    const originalRef = metadata.validationDetails.original
    schemas.push({
      '@context':   'https://schema.org',
      '@type':      'MedicalWebPage',
      name:         langData.name,
      description:  langData.landing.description,
      url,
      audience:     { '@type': 'Patient' },
      medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
      citation:     `${originalRef.reference} — ${originalRef.journal}`,
      ...(originalRef.doi ? { sameAs: `https://doi.org/${originalRef.doi}` } : {}),
    })
  }

  return schemas
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface TestLandingPageProps {
  testId:  string
  lang:    string
  /** Callback al pulsar "Iniciar test" (apuntará al intersticial en el siguiente paso) */
  onStart: () => void
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Sección con título de sección y contenido */
const Section: React.FC<{
  title: string
  children: React.ReactNode
  id?: string
}> = ({ title, children, id }) => (
  <section
    id={id}
    className="w-full max-w-2xl mx-auto flex flex-col gap-4"
  >
    <h2
      className="text-xl sm:text-2xl font-semibold"
      style={{ color: 'var(--color-primary)' }}
    >
      {title}
    </h2>
    {children}
  </section>
)

/** Badge pill pequeño */
const Pill: React.FC<{ children: React.ReactNode; accent?: boolean }> = ({
  children,
  accent = false,
}) => (
  <span
    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap"
    style={
      accent
        ? { backgroundColor: 'var(--color-accent)', color: '#fff' }
        : { backgroundColor: 'rgba(45,74,62,0.1)', color: 'var(--color-primary)' }
    }
  >
    {children}
  </span>
)

/** Botón principal de inicio */
const StartButton: React.FC<{
  label: string
  ariaLabel: string
  onClick: () => void
  large?: boolean
}> = ({ label, ariaLabel, onClick, large = false }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className={`btn-primary ${large ? 'text-lg px-10 py-4' : ''} w-full sm:w-auto`}
  >
    {label}
  </button>
)

/** Acción de item FAQ accordion */
const FaqItem: React.FC<{
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
  index: number
}> = ({ q, a, isOpen, onToggle, index }) => (
  <div
    className="rounded-xl overflow-hidden"
    style={{ border: '1px solid rgba(45,74,62,0.15)' }}
  >
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${index}`}
      id={`faq-question-${index}`}
      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
      style={{
        backgroundColor: isOpen ? '#fff' : 'var(--color-cream)',
        color: 'var(--color-primary)',
      }}
    >
      <span className="text-sm sm:text-base">{q}</span>
      <span
        aria-hidden="true"
        className="flex-shrink-0 transition-transform duration-200 text-lg"
        style={{
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          color: 'var(--color-accent)',
        }}
      >
        +
      </span>
    </button>

    <div
      id={`faq-answer-${index}`}
      role="region"
      aria-labelledby={`faq-question-${index}`}
      hidden={!isOpen}
    >
      <p
        className="px-5 pb-5 pt-2 text-sm sm:text-base leading-relaxed"
        style={{ color: 'var(--color-primary)', opacity: 0.85 }}
      >
        {a}
      </p>
    </div>
  </div>
)

// ── Componente principal ──────────────────────────────────────────────────────

const TestLandingPage: React.FC<TestLandingPageProps> = ({ testId, lang, onStart }) => {
  const ui = getUI(lang)

  // ── State ─────────────────────────────────────────────────────────────────
  const [loadState, setLoadState] = React.useState<'loading' | 'loaded' | 'error'>('loading')
  const [langData,  setLangData]  = React.useState<TestLangFile | null>(null)
  const [metadata,  setMetadata]  = React.useState<TestMetadata | null>(null)
  const [errorMsg,  setErrorMsg]  = React.useState('')
  const [openFaq,   setOpenFaq]   = React.useState<number | null>(null)

  // ── Fetch data ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const [metaRes, langRes] = await Promise.all([
          fetch(`/data/tests/${testId}/metadata.json`),
          fetch(`/data/tests/${testId}/${lang}.json`),
        ])

        if (!metaRes.ok) throw new Error(`Test "${testId}" not found.`)

        // Fall back to 'es' if language file missing
        const finalLangRes = langRes.ok
          ? langRes
          : await fetch(`/data/tests/${testId}/es.json`)

        if (!finalLangRes.ok) throw new Error(`Content for "${testId}" not available.`)

        const [meta, ld] = await Promise.all([
          metaRes.json() as Promise<TestMetadata>,
          finalLangRes.json() as Promise<TestLangFile>,
        ])

        if (!cancelled) {
          setMetadata(meta)
          setLangData(ld)
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
  }, [testId, lang])

  // ── SEO injection ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!langData || !metadata) return

    // Title
    const prevTitle = document.title
    document.title  = `${langData.name} — Psicoprotego`

    // Meta description
    const selector = 'meta[name="description"]'
    let metaEl = document.querySelector(selector) as HTMLMetaElement | null
    if (!metaEl) {
      metaEl = document.createElement('meta')
      metaEl.setAttribute('name', 'description')
      document.head.appendChild(metaEl)
    }
    const prevDesc = metaEl.getAttribute('content') ?? ''
    metaEl.setAttribute('content', langData.landing.description)

    // JSON-LD
    const scriptId = `ld-json-${testId}-landing`
    let scriptEl   = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!scriptEl) {
      scriptEl      = document.createElement('script')
      scriptEl.id   = scriptId
      scriptEl.type = 'application/ld+json'
      document.head.appendChild(scriptEl)
    }
    scriptEl.textContent = JSON.stringify(buildJsonLd(langData, metadata, lang, testId, ui))

    return () => {
      document.title = prevTitle
      metaEl?.setAttribute('content', prevDesc)
      document.getElementById(scriptId)?.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langData, metadata])

  // ── Render: loading ───────────────────────────────────────────────────────
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

  // ── Render: error ─────────────────────────────────────────────────────────
  if (loadState === 'error' || !langData || !metadata) {
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

  const { landing } = langData
  const isValidated  = metadata.validated

  // ── Render: loaded ────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
      <Header testName={langData.name} />

      <main className="flex flex-1 flex-col items-center gap-16 px-4 py-10 sm:px-6">

        {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
        <section
          aria-label="Introducción al test"
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-6"
        >
          <h1
            className="text-3xl sm:text-4xl font-bold leading-tight"
            style={{ color: 'var(--color-primary)', fontFamily: "'Source Serif 4', serif" }}
          >
            {langData.name}
          </h1>

          <p
            className="text-xl sm:text-2xl font-medium leading-snug max-w-xl"
            style={{ color: 'var(--color-accent)' }}
          >
            {landing.hook}
          </p>

          <p
            className="text-base leading-relaxed max-w-xl"
            style={{ color: 'var(--color-primary)', opacity: 0.8 }}
          >
            {landing.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <Pill>{ui.durationLabel(metadata.timeToComplete)}</Pill>
            <Pill>{ui.questionsLabel(metadata.itemCount)}</Pill>
            {isValidated && <Pill accent>{ui.validatedBadge}</Pill>}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <StartButton
              label={ui.startButton}
              ariaLabel={ui.startButtonAria(langData.name)}
              onClick={onStart}
              large
            />
            <p className="text-xs" style={{ color: 'var(--color-primary)', opacity: 0.55 }}>
              {ui.freeLine}
            </p>
          </div>
        </section>

        {/* ── 2. AD SLOT (leaderboard) ────────────────────────────────────── */}
        <div className="w-full max-w-2xl mx-auto">
          <AdSlot position="test-intro" size="leaderboard" />
        </div>

        {/* ── 3. QUÉ MIDE ─────────────────────────────────────────────────── */}
        <Section title={ui.whatItMeasuresTitle} id="que-mide">
          <div
            className="rounded-xl p-6 flex gap-4 items-start"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(45,74,62,0.12)' }}
          >
            <span aria-hidden="true" className="text-3xl flex-shrink-0 mt-0.5">🧠</span>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--color-primary)', opacity: 0.88 }}
            >
              {landing.whatItMeasures}
            </p>
          </div>
        </Section>

        {/* ── 4. PARA QUIÉN ES ────────────────────────────────────────────── */}
        <Section title={ui.whoIsItForTitle} id="para-quien">
          <div
            className="rounded-xl p-6 flex gap-4 items-start"
            style={{ backgroundColor: '#fff', border: '1px solid rgba(45,74,62,0.12)' }}
          >
            <span aria-hidden="true" className="text-3xl flex-shrink-0 mt-0.5">👤</span>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--color-primary)', opacity: 0.88 }}
            >
              {landing.whoIsItFor}
            </p>
          </div>
        </Section>

        {/* ── 5. CÓMO FUNCIONA ────────────────────────────────────────────── */}
        <Section title={ui.howItWorksTitle} id="como-funciona">
          <ol className="flex flex-col sm:flex-row gap-4" role="list">
            {landing.howItWorks.map((step, i) => (
              <li
                key={i}
                className="flex-1 rounded-xl p-5 flex flex-col gap-3"
                style={{ backgroundColor: '#fff', border: '1px solid rgba(45,74,62,0.12)' }}
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <p
                  className="text-sm leading-relaxed font-medium"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── 6. FICHA TÉCNICA ────────────────────────────────────────────── */}
        <section
          id="ficha-tecnica"
          className="w-full max-w-2xl mx-auto flex flex-col gap-4"
        >
          <h2
            className="text-xl sm:text-2xl font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            {ui.technicalSheetTitle}
          </h2>
          <TestMetadataTable metadata={metadata} lang={lang} />
        </section>

        {/* ── 7. FAQ ──────────────────────────────────────────────────────── */}
        <Section title={ui.faqTitle} id="faq">
          <div className="flex flex-col gap-2">
            {landing.faq.map((item, i) => (
              <FaqItem
                key={i}
                index={i}
                q={item.q}
                a={item.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </Section>

        {/* ── 8. CTA FINAL ────────────────────────────────────────────────── */}
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-2 py-4">
          <StartButton
            label={ui.startButton}
            ariaLabel={ui.startButtonAria(langData.name)}
            onClick={onStart}
            large
          />
          <p className="text-xs" style={{ color: 'var(--color-primary)', opacity: 0.55 }}>
            {ui.freeLine}
          </p>
        </div>

      </main>

      {/* ── 9. FOOTER con disclaimer ─────────────────────────────────────── */}
      <div
        className="w-full border-t px-4 py-4 text-center"
        style={{ borderColor: 'rgba(45,74,62,0.12)' }}
      >
        <p className="text-xs max-w-2xl mx-auto" style={{ color: 'var(--color-primary)', opacity: 0.55 }}>
          {ui.disclaimerText}
        </p>
      </div>
      <Footer showCrisisFooter={false} />
    </div>
  )
}

export default TestLandingPage
