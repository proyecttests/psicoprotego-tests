/**
 * @file components/test-framework/TestMetadataTable.tsx
 * @description Ficha técnica del test a partir del bloque metadata.json.
 *
 * Muestra: uso, qué mide, validación por idioma, rango de edad,
 * autoadministrable, ítems, duración, puntuación con cutoffs, copyright.
 *
 * Uso:
 * ```tsx
 * <TestMetadataTable metadata={metadata} lang="es" />
 * ```
 */

import React from 'react'
import type { TestMetadata } from '@/types/test'

// ── UI strings ────────────────────────────────────────────────────────────────

const STRINGS = {
  es: {
    title:          'Ficha técnica',
    use:            'Uso',
    measures:       'Qué mide',
    validation:     'Validación',
    validatedYes:   'Validado',
    validatedNo:    'Traducción no validada clínicamente',
    originalIn:     'Instrumento original en',
    age:            'Edad de administración',
    ageFrom:        'Desde',
    ageYears:       'años',
    ageNoMax:       'sin límite superior',
    selfAdmin:      'Autoadministrable',
    yes:            'Sí',
    no:             'No',
    items:          'Nº de ítems',
    duration:       'Duración estimada',
    scoring:        'Rango de puntuación',
    cutoffs:        'Puntos de corte',
    copyright:      'Copyright / uso',
    langNames: {
      es: 'español', en: 'inglés', pt: 'portugués',
      fr: 'francés', de: 'alemán', it: 'italiano',
      ar: 'árabe', he: 'hebreo', tr: 'turco',
      ja: 'japonés', ko: 'coreano', ku: 'kurdo',
    } as Record<string, string>,
    useLabels: {
      clinical_screening: 'Cribado clínico',
      educational:        'Educativo',
      research:           'Investigación',
      self_assessment:    'Autodiagnóstico',
    } as Record<string, string>,
    measureLabels: {
      generalized_anxiety: 'Ansiedad generalizada',
      depression:          'Depresión',
      ptsd:                'TEPT',
      alcohol_use:         'Consumo de alcohol',
      adhd:                'TDAH',
      social_anxiety:      'Ansiedad social',
      panic:               'Pánico',
    } as Record<string, string>,
    itemTypeLabels: {
      likert_4:        'Likert (4 opciones, 0–3)',
      likert_5:        'Likert (5 opciones, 0–4)',
      boolean:         'Sí / No',
      multiple_choice: 'Opción múltiple',
    } as Record<string, string>,
    copyrightLabels: {
      free_use:        'Uso libre / dominio público',
      proprietary:     'Instrumento propietario',
      creative_commons:'Creative Commons',
    } as Record<string, string>,
    cutoffLabels: {
      minimal:            'Mínimo',
      mild:               'Leve',
      moderate:           'Moderado',
      moderately_severe:  'Moderadamente severo',
      severe:             'Severo',
      crisis:             'Crisis',
    } as Record<string, string>,
  },
  en: {
    title:          'Technical sheet',
    use:            'Use',
    measures:       'What it measures',
    validation:     'Validation',
    validatedYes:   'Validated',
    validatedNo:    'Unvalidated translation',
    originalIn:     'Original instrument in',
    age:            'Administration age',
    ageFrom:        'From',
    ageYears:       'years',
    ageNoMax:       'no upper limit',
    selfAdmin:      'Self-administered',
    yes:            'Yes',
    no:             'No',
    items:          'No. of items',
    duration:       'Estimated duration',
    scoring:        'Scoring range',
    cutoffs:        'Cut-off points',
    copyright:      'Copyright / use',
    langNames: {
      es: 'Spanish', en: 'English', pt: 'Portuguese',
      fr: 'French',  de: 'German',  it: 'Italian',
      ar: 'Arabic',  he: 'Hebrew',  tr: 'Turkish',
      ja: 'Japanese',ko: 'Korean',  ku: 'Kurdish',
    } as Record<string, string>,
    useLabels: {
      clinical_screening: 'Clinical screening',
      educational:        'Educational',
      research:           'Research',
      self_assessment:    'Self-assessment',
    } as Record<string, string>,
    measureLabels: {
      generalized_anxiety: 'Generalized anxiety',
      depression:          'Depression',
      ptsd:                'PTSD',
      alcohol_use:         'Alcohol use',
      adhd:                'ADHD',
      social_anxiety:      'Social anxiety',
      panic:               'Panic',
    } as Record<string, string>,
    itemTypeLabels: {
      likert_4:        'Likert (4 options, 0–3)',
      likert_5:        'Likert (5 options, 0–4)',
      boolean:         'Yes / No',
      multiple_choice: 'Multiple choice',
    } as Record<string, string>,
    copyrightLabels: {
      free_use:        'Free use / public domain',
      proprietary:     'Proprietary instrument',
      creative_commons:'Creative Commons',
    } as Record<string, string>,
    cutoffLabels: {
      minimal:            'Minimal',
      mild:               'Mild',
      moderate:           'Moderate',
      moderately_severe:  'Moderately severe',
      severe:             'Severe',
      crisis:             'Crisis',
    } as Record<string, string>,
  },
  pt: {
    title:          'Ficha técnica',
    use:            'Uso',
    measures:       'O que mede',
    validation:     'Validação',
    validatedYes:   'Validado',
    validatedNo:    'Tradução não validada clinicamente',
    originalIn:     'Instrumento original em',
    age:            'Faixa etária',
    ageFrom:        'A partir de',
    ageYears:       'anos',
    ageNoMax:       'sem limite superior',
    selfAdmin:      'Autoadministrável',
    yes:            'Sim',
    no:             'Não',
    items:          'Nº de itens',
    duration:       'Duração estimada',
    scoring:        'Intervalo de pontuação',
    cutoffs:        'Pontos de corte',
    copyright:      'Copyright / uso',
    langNames: {
      es: 'espanhol',  en: 'inglês',    pt: 'português',
      fr: 'francês',   de: 'alemão',    it: 'italiano',
      ar: 'árabe',     he: 'hebraico',  tr: 'turco',
      ja: 'japonês',   ko: 'coreano',   ku: 'curdo',
    } as Record<string, string>,
    useLabels: {
      clinical_screening: 'Triagem clínica',
      educational:        'Educativo',
      research:           'Pesquisa',
      self_assessment:    'Autoavaliação',
    } as Record<string, string>,
    measureLabels: {
      generalized_anxiety: 'Ansiedade generalizada',
      depression:          'Depressão',
      ptsd:                'TEPT',
      alcohol_use:         'Uso de álcool',
      adhd:                'TDAH',
      social_anxiety:      'Ansiedade social',
      panic:               'Pânico',
    } as Record<string, string>,
    itemTypeLabels: {
      likert_4:        'Likert (4 opções, 0–3)',
      likert_5:        'Likert (5 opções, 0–4)',
      boolean:         'Sim / Não',
      multiple_choice: 'Múltipla escolha',
    } as Record<string, string>,
    copyrightLabels: {
      free_use:        'Uso livre / domínio público',
      proprietary:     'Instrumento proprietário',
      creative_commons:'Creative Commons',
    } as Record<string, string>,
    cutoffLabels: {
      minimal:            'Mínimo',
      mild:               'Leve',
      moderate:           'Moderado',
      moderately_severe:  'Moderadamente grave',
      severe:             'Grave',
      crisis:             'Crise',
    } as Record<string, string>,
  },
} as const

type SupportedLang = keyof typeof STRINGS

function getStrings(lang: string) {
  return STRINGS[(lang as SupportedLang) in STRINGS ? (lang as SupportedLang) : 'es']
}

// ── Cutoff colors ─────────────────────────────────────────────────────────────

const CUTOFF_COLORS: Record<string, { bg: string; text: string }> = {
  minimal:           { bg: '#d1fae5', text: '#065f46' },
  mild:              { bg: '#fef9c3', text: '#713f12' },
  moderate:          { bg: '#ffedd5', text: '#7c2d12' },
  moderately_severe: { bg: '#fed7aa', text: '#7c2d12' },
  severe:            { bg: '#fee2e2', text: '#7f1d1d' },
  crisis:            { bg: '#fce7f3', text: '#831843' },
}

function getCutoffColor(key: string) {
  return CUTOFF_COLORS[key] ?? { bg: '#f3f4f6', text: '#374151' }
}

// ── Sub-components ────────────────────────────────────────────────────────────

const FieldCard: React.FC<{ label: string; children: React.ReactNode; wide?: boolean }> = ({
  label,
  children,
  wide = false,
}) => (
  <div
    className={`rounded-xl p-4 flex flex-col gap-2${wide ? ' sm:col-span-2' : ''}`}
    style={{ backgroundColor: 'var(--color-cream)', border: '1px solid rgba(45,74,62,0.12)' }}
  >
    <span
      className="text-xs font-semibold uppercase tracking-wider"
      style={{ color: 'var(--color-primary)', opacity: 0.7 }}
    >
      {label}
    </span>
    <div>{children}</div>
  </div>
)

const Badge: React.FC<{
  label: string
  bg?: string
  text?: string
  outlined?: boolean
}> = ({ label, bg, text, outlined = false }) => (
  <span
    className="inline-block rounded-full px-3 py-0.5 text-xs font-medium mr-1.5 mb-1"
    style={
      outlined
        ? {
            border: '1.5px solid var(--color-primary)',
            color: 'var(--color-primary)',
            backgroundColor: 'transparent',
          }
        : {
            backgroundColor: bg ?? 'rgba(45,74,62,0.1)',
            color: text ?? 'var(--color-primary)',
          }
    }
  >
    {label}
  </span>
)

// ── Props ─────────────────────────────────────────────────────────────────────

interface TestMetadataTableProps {
  metadata: TestMetadata
  lang: string
}

// ── Component ─────────────────────────────────────────────────────────────────

const TestMetadataTable: React.FC<TestMetadataTableProps> = ({ metadata, lang }) => {
  const s = getStrings(lang)

  // ── Validation logic ──────────────────────────────────────────────────────
  const langValidation = metadata.validationDetails.translations[lang]
  const originalLang   = metadata.validationDetails.original.lang
  const isValidated    = langValidation?.validated === true

  // ── Age label ─────────────────────────────────────────────────────────────
  const ageLabel = metadata.ageRange.max
    ? `${metadata.ageRange.min}–${metadata.ageRange.max} ${s.ageYears}`
    : `${s.ageFrom} ${metadata.ageRange.min} ${s.ageYears}`

  // ── Item type label ───────────────────────────────────────────────────────
  const itemTypeLabel =
    s.itemTypeLabels[metadata.itemType] ?? metadata.itemType

  // ── Copyright label ───────────────────────────────────────────────────────
  const copyrightLabel =
    s.copyrightLabels[metadata.copyright] ?? metadata.copyright

  return (
    <section aria-label={s.title} className="w-full max-w-2xl mx-auto">
      <h3
        className="text-sm font-semibold uppercase tracking-widest mb-3 px-1"
        style={{ color: 'var(--color-primary)', opacity: 0.6 }}
      >
        {s.title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Uso */}
        <FieldCard label={s.use}>
          <div className="flex flex-wrap">
            {metadata.use.map((u) => (
              <Badge
                key={u}
                label={s.useLabels[u] ?? u}
              />
            ))}
          </div>
        </FieldCard>

        {/* Qué mide */}
        <FieldCard label={s.measures}>
          <div className="flex flex-wrap">
            {metadata.measures.map((m) => (
              <Badge
                key={m}
                label={s.measureLabels[m] ?? m}
                outlined
              />
            ))}
          </div>
        </FieldCard>

        {/* Validación */}
        <FieldCard label={s.validation}>
          {isValidated ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                >
                  <span aria-hidden="true">✓</span> {s.validatedYes}
                </span>
              </div>
              {langValidation?.reference && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-primary)', opacity: 0.75 }}>
                  {langValidation.reference}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit"
                style={{ backgroundColor: '#fef9c3', color: '#713f12' }}
              >
                <span aria-hidden="true">⚠</span> {s.validatedNo}
              </span>
              {langValidation?.note && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-primary)', opacity: 0.7 }}>
                  {langValidation.note}
                </p>
              )}
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-primary)', opacity: 0.65 }}>
                {s.originalIn}{' '}
                <strong>{s.langNames[originalLang] ?? originalLang}</strong>
                {metadata.validationDetails.original.reference && (
                  <> · {metadata.validationDetails.original.reference}</>
                )}
              </p>
            </div>
          )}
        </FieldCard>

        {/* Edad */}
        <FieldCard label={s.age}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            {ageLabel}
          </p>
        </FieldCard>

        {/* Autoadministrable */}
        <FieldCard label={s.selfAdmin}>
          <Badge
            label={metadata.selfAdministrable ? s.yes : s.no}
            bg={metadata.selfAdministrable ? '#d1fae5' : '#fee2e2'}
            text={metadata.selfAdministrable ? '#065f46' : '#7f1d1d'}
          />
        </FieldCard>

        {/* Nº ítems + tipo */}
        <FieldCard label={s.items}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            {metadata.itemCount}
            <span
              className="ml-2 text-xs font-normal opacity-75"
              style={{ color: 'var(--color-primary)' }}
            >
              {itemTypeLabel}
            </span>
          </p>
        </FieldCard>

        {/* Duración */}
        <FieldCard label={s.duration}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            {metadata.timeToComplete}
          </p>
        </FieldCard>

        {/* Puntuación */}
        <FieldCard label={s.scoring}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            {metadata.scoringRange.min}–{metadata.scoringRange.max}
          </p>
        </FieldCard>

        {/* Cutoffs — span 2 columns */}
        <FieldCard label={s.cutoffs} wide>
          <div className="flex flex-wrap gap-2 mt-0.5">
            {Object.entries(metadata.cutoffs).map(([key, range]) => {
              const colors = getCutoffColor(key)
              const label  = s.cutoffLabels[key] ?? key
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  <span className="font-mono font-bold">{range[0]}–{range[1]}</span>
                  <span>{label}</span>
                </span>
              )
            })}
          </div>
        </FieldCard>

        {/* Copyright */}
        <FieldCard label={s.copyright}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            {copyrightLabel}
          </p>
        </FieldCard>

      </div>
    </section>
  )
}

export default TestMetadataTable
