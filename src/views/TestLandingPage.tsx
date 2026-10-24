/**
 * @file views/TestLandingPage.tsx
 * @description Landing page del test — Server Component puro.
 *
 * Recibe los datos ya cargados como props (cargados por el page.tsx en servidor).
 * Sin hooks de estado, sin fetch, sin react-router.
 * El botón "Iniciar test" usa next/link → prerenderizado como <a> estático.
 *
 * Si hay contenido clínico completo (`content`, de es.content.json) la landing se monta con él;
 * si no, con el bloque `landing` de es.json.
 */

import Link from 'next/link'
import type { TestContent, TestLangFile, TestMetadata } from '@/types/test'
import DownloadBlankLanding from '@/components/pdf/DownloadBlankLanding'
import RichText from '@/components/landing/RichText'
import TestMetadataTable from '@/components/test-framework/TestMetadataTable'
import { FaqAccordion }  from '@/components/landing/FaqAccordion'

// ── UI strings ────────────────────────────────────────────────────────────────

const UI = {
  es: {
    startButton:         'Iniciar test',
    startButtonAria:     (name: string) => `Iniciar ${name}`,
    freeLine:            'Gratuito · Sin registro',
    validatedBadge:      'Validado científicamente',
    questionsLabel:      (n: number) => `${n} preguntas`,
    durationLabel:       (t: string) => t,
    whatItMeasuresTitle: '¿Qué mide este test?',
    whoIsItForTitle:     '¿Para quién es?',
    howItWorksTitle:     'Cómo funciona',
    technicalSheetTitle: 'Ficha técnica del test',
    faqTitle:            'Preguntas frecuentes',
    disclaimerText:      'Este test es educativo y no constituye diagnóstico clínico. Psicoprotego no almacena tus respuestas.',
  },
  en: {
    startButton:         'Start test',
    startButtonAria:     (name: string) => `Start ${name}`,
    freeLine:            'Free · No sign-up',
    validatedBadge:      'Scientifically validated',
    questionsLabel:      (n: number) => `${n} questions`,
    durationLabel:       (t: string) => t,
    whatItMeasuresTitle: 'What does this test measure?',
    whoIsItForTitle:     'Who is it for?',
    howItWorksTitle:     'How it works',
    technicalSheetTitle: 'Technical sheet',
    faqTitle:            'Frequently asked questions',
    disclaimerText:      'This test is educational and does not constitute clinical diagnosis. Psicoprotego does not store your answers.',
  },
  pt: {
    startButton:         'Iniciar teste',
    startButtonAria:     (name: string) => `Iniciar ${name}`,
    freeLine:            'Gratuito · Sem cadastro',
    validatedBadge:      'Validado cientificamente',
    questionsLabel:      (n: number) => `${n} perguntas`,
    durationLabel:       (t: string) => t,
    whatItMeasuresTitle: 'O que este teste mede?',
    whoIsItForTitle:     'Para quem é?',
    howItWorksTitle:     'Como funciona',
    technicalSheetTitle: 'Ficha técnica do teste',
    faqTitle:            'Perguntas frequentes',
    disclaimerText:      'Este teste é educativo e não constitui diagnóstico clínico. O Psicoprotego não armazena suas respostas.',
  },
  ku: {
    startButton:         'کوێزەکە دەستپێبکە',
    startButtonAria:     (name: string) => `${name} دەستپێبکە`,
    freeLine:            'بەخۆڕایی · تۆمارنامە نییە',
    validatedBadge:      'زانستیانە پشتڕاستکراوەتەوە',
    questionsLabel:      (n: number) => `${n} پرسیار`,
    durationLabel:       (t: string) => t,
    whatItMeasuresTitle: 'ئەم کوێزە چیی دەسەنجێت؟',
    whoIsItForTitle:     'بۆ کێیە؟',
    howItWorksTitle:     'چۆن کار دەکات',
    technicalSheetTitle: 'کاغەزی تەکنیکی کوێز',
    faqTitle:            'پرسیارە باوەکان',
    disclaimerText:      'ئەم کوێزە پەروەردەییەو نییەتە دیاریکردنی نەخۆشی کلینیکی. Psicoprotego وەڵامەکانت تۆمار ناکات.',
  },
} as const

/** Textos de la landing con contenido clínico (es.content.json solo existe en español) */
const CONTENT_UI = {
  indicationsTitle: 'Indicaciones',
  limitationsTitle: 'Limitaciones',
  referencesTitle:  'Referencias',
  draftBanner:      'Borrador pendiente de revisión clínica. Este contenido aún no está firmado por un profesional.',
} as const

type SupportedLang = keyof typeof UI

function getUI(lang: string) {
  return UI[(lang as SupportedLang) in UI ? (lang as SupportedLang) : 'es']
}

// ── Sub-components (server-safe) ──────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode; id?: string }> = ({
  title, children, id,
}) => (
  <section id={id} className="w-full max-w-2xl mx-auto flex flex-col gap-4">
    <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--color-primary)' }}>
      {title}
    </h2>
    {children}
  </section>
)

const Pill: React.FC<{ children: React.ReactNode; accent?: boolean }> = ({
  children, accent = false,
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

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="rounded-xl p-6 flex flex-col gap-4"
    style={{ backgroundColor: '#fff', border: '1px solid rgba(45,74,62,0.12)' }}
  >
    {children}
  </div>
)

const BulletList: React.FC<{ title: string; items: string[] }> = ({ title, items }) =>
  items.length === 0 ? null : (
    <div className="flex flex-col gap-2">
      <h3 className="text-base font-semibold" style={{ color: 'var(--color-primary)' }}>{title}</h3>
      <ul className="list-disc pl-5 flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed" style={{ color: 'var(--color-primary)', opacity: 0.88 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )

/** Secciones de texto clínico de es.content.json (qué mide → interpretación). */
const ClinicalSections: React.FC<{ content: TestContent }> = ({ content }) => {
  const ui = CONTENT_UI
  const { whatItMeasures, whoIsItFor, howItWorks, validation, interpretation } = content
  return (
    <>
      <Section title={whatItMeasures.heading} id="que-mide">
        <Card><RichText text={whatItMeasures.body} /></Card>
      </Section>

      <Section title={whoIsItFor.heading} id="para-quien">
        <Card>
          <RichText text={whoIsItFor.body} />
          <BulletList title={ui.indicationsTitle} items={whoIsItFor.indications} />
          <BulletList title={ui.limitationsTitle} items={whoIsItFor.limitations} />
        </Card>
      </Section>

      <Section title={howItWorks.heading} id="como-funciona">
        <Card>
          <RichText text={howItWorks.body} />
          {howItWorks.steps.length > 0 && (
            <ol className="flex flex-col gap-3" role="list">
              {howItWorks.steps.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed font-medium pt-1" style={{ color: 'var(--color-primary)' }}>
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </Section>

      <Section title={validation.heading} id="validacion">
        <Card>
          <RichText text={validation.body} />
          {validation.references && validation.references.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold" style={{ color: 'var(--color-primary)' }}>{ui.referencesTitle}</h3>
              <ol className="flex flex-col gap-2" role="list">
                {validation.references.map((ref) => (
                  <li
                    key={ref.id}
                    id={`ref-${ref.id}`}
                    className="text-xs leading-relaxed scroll-mt-24"
                    style={{ color: 'var(--color-primary)', opacity: 0.8 }}
                  >
                    [{ref.id}] {ref.authors} ({ref.year}). {ref.title}. <em>{ref.journal}</em>
                    {ref.volume ? `, ${ref.volume}` : ''}{ref.issue ? `(${ref.issue})` : ''}{ref.pages ? `, ${ref.pages}` : ''}.
                    {ref.doi && (
                      <>
                        {' '}
                        <a
                          href={ref.url ?? `https://doi.org/${ref.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 break-all"
                        >
                          doi:{ref.doi}
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Card>
      </Section>

      <Section title={interpretation.heading} id="interpretacion">
        <Card><RichText text={interpretation.body} /></Card>
      </Section>
    </>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface TestLandingPageProps {
  langData:  TestLangFile
  /** Contenido clínico completo de es.content.json, o null si no lo hay / tiene [PENDIENTE] */
  content?:  TestContent | null
  metadata:  TestMetadata
  lang:      string
  testId:    string
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function TestLandingPage({
  langData, content = null, metadata, lang, testId,
}: TestLandingPageProps) {
  const ui        = getUI(lang)
  const { landing } = langData
  const isValidated = metadata.validated
  const startHref   = `/${lang}/test/${testId}/start`
  const isQuiz      = metadata.category === 'screening'
  const startLabel  = isQuiz
    ? ({ es: 'Empezar quiz', en: 'Start quiz', pt: 'Iniciar quiz', ku: 'کوێزەکە دەستپێبکە' } as Record<string,string>)[lang] ?? 'Empezar quiz'
    : ui.startButton
  const isDraft     = content !== null && content.status !== 'clinically-approved'

  return (
    <div className="flex flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
      {isDraft && (
        <div
          role="note"
          className="w-full px-4 py-3 text-center text-sm font-semibold"
          style={{ backgroundColor: '#fef3c7', color: '#78350f', borderBottom: '1px solid #fcd34d' }}
        >
          {CONTENT_UI.draftBanner}
        </div>
      )}

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
            {content?.hero.title ?? langData.name}
          </h1>

          <p
            className="text-xl sm:text-2xl font-medium leading-snug max-w-xl"
            style={{ color: 'var(--color-accent)' }}
          >
            {content?.hero.subtitle ?? landing.hook}
          </p>

          {(content ? content.hero.clinicalContext : landing.description) && (
            <p
              className="text-base leading-relaxed max-w-xl"
              style={{ color: 'var(--color-primary)', opacity: 0.8 }}
            >
              {content ? content.hero.clinicalContext : landing.description}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {content ? (
              content.hero.badges.map((badge, i) => (
                <Pill key={i} accent={i === 0 && isValidated}>{badge}</Pill>
              ))
            ) : (
              <>
                <Pill>{ui.durationLabel(metadata.timeToComplete)}</Pill>
                <Pill>{ui.questionsLabel(metadata.itemCount)}</Pill>
                {isValidated && <Pill accent>{ui.validatedBadge}</Pill>}
              </>
            )}
          </div>

          {/* CTA hero */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <Link
              href={startHref}
              aria-label={ui.startButtonAria(langData.name)}
              className="btn-primary text-lg px-10 py-4 w-full sm:w-auto"
            >
              {ui.startButton}
            </Link>
            <p className="text-xs" style={{ color: 'var(--color-primary)', opacity: 0.55 }}>
              {ui.freeLine}
            </p>
            {!isQuiz && (
              <DownloadBlankLanding
                testId={testId}
                lang={lang}
                testName={langData.name}
              />
            )}
          </div>
        </section>

        {content ? (
          <ClinicalSections content={content} />
        ) : (
          <>
        {/* ── 2. QUÉ MIDE ─────────────────────────────────────────────────── */}
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

        {/* ── 4. PARA QUIÉN ───────────────────────────────────────────────── */}
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
                <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--color-primary)' }}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </Section>
          </>
        )}

        {/* ── 6. FICHA TÉCNICA ────────────────────────────────────────────── */}
        <section id="ficha-tecnica" className="w-full max-w-2xl mx-auto flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--color-primary)' }}>
            {ui.technicalSheetTitle}
          </h2>
          {metadata.validationDetails && <TestMetadataTable metadata={metadata} lang={lang} />}
        </section>

        {/* ── 7. FAQ (client component por el accordion interactivo) ───────── */}
        <FaqAccordion items={content?.faq ?? landing.faq} title={ui.faqTitle} />

        {/* ── Privacidad (solo con contenido clínico) ─────────────────────── */}
        {content && (
          <Section title={content.privacy.heading} id="privacidad">
            <Card><RichText text={content.privacy.body} /></Card>
          </Section>
        )}

        {/* ── 8. CTA FINAL ────────────────────────────────────────────────── */}
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-2 py-4">
          <Link
            href={startHref}
            aria-label={ui.startButtonAria(langData.name)}
            className="btn-primary text-lg px-10 py-4 w-full sm:w-auto"
          >
            {ui.startButton}
          </Link>
          <p className="text-xs" style={{ color: 'var(--color-primary)', opacity: 0.55 }}>
            {ui.freeLine}
          </p>
        </div>

      </main>

      {/* ── Disclaimer band ──────────────────────────────────────────────── */}
      <div
        className="w-full border-t px-4 py-4 text-center"
        style={{ borderColor: 'rgba(45,74,62,0.12)' }}
      >
        <p className="text-xs max-w-2xl mx-auto" style={{ color: 'var(--color-primary)', opacity: 0.55 }}>
          {ui.disclaimerText}
        </p>
      </div>
    </div>
  )
}
