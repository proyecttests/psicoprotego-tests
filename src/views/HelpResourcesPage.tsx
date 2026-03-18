/**
 * @file pages/HelpResourcesPage.tsx
 * @description Página estática de recursos de ayuda urgente por idioma.
 *
 * Tono: calmado, profesional, informativo. Como un psicólogo que señala
 * dónde ir — no como una alarma de incendios.
 *
 * El contenido se lee desde src/data/help-resources/{lang}.json.
 * Para añadir un idioma: crear el JSON correspondiente y registrar la ruta.
 *
 * Rutas:
 *   /es/ayuda-urgente
 *   /en/urgent-help
 *   /pt/ajuda-urgente
 */

'use client'

import React from 'react'
import Link from 'next/link'

import esData from '@/data/help-resources/es.json'
import enData from '@/data/help-resources/en.json'
import ptData from '@/data/help-resources/pt.json'

// ── Types ─────────────────────────────────────────────────────────────────────

interface PhoneResource {
  type: 'phone'
  number: string
  tel: string
  label: string
  description: string
  scope: string
  available: string
}

interface LinkResource {
  type: 'link'
  label: string
  description: string
  url: string
}

type Resource = PhoneResource | LinkResource

interface HelpData {
  page: {
    title: string
    subtitle: string
  }
  sections: {
    emergency: {
      title: string
      intro: string
      resources: PhoneResource[]
    }
    mentalHealth: {
      title: string
      intro: string
      primary: PhoneResource[]
      expandLabel: string
      collapseLabel: string
      others: PhoneResource[]
    }
    otherResources: {
      title: string
      resources: Resource[]
    }
    professional: {
      title: string
      body: string
      linkLabel: string
      linkUrl: string
    }
  }
}

// ── Data map ──────────────────────────────────────────────────────────────────

const DATA: Record<string, HelpData> = {
  es: esData as HelpData,
  en: enData as HelpData,
  pt: ptData as HelpData,
}

function getData(lang: string): HelpData {
  return DATA[lang] ?? DATA['es']
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface HelpResourcesPageProps {
  lang: string
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Divisor sutil entre secciones */
const Divider = () => (
  <hr
    aria-hidden="true"
    className="w-full"
    style={{ borderColor: 'rgba(45,74,62,0.12)' }}
  />
)

/** Tarjeta de número de teléfono — el área completa es tappable en móvil */
const PhoneCard: React.FC<{ resource: PhoneResource; muted?: boolean }> = ({
  resource,
  muted = false,
}) => (
  <a
    href={`tel:${resource.tel}`}
    className="group flex flex-col gap-1 rounded-xl p-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    style={{
      backgroundColor: muted ? 'transparent' : '#fff',
      border: `1px solid rgba(45,74,62,${muted ? '0.1' : '0.15'})`,
      '--tw-ring-color': 'var(--color-primary)',
    } as React.CSSProperties}
    aria-label={`Llamar al ${resource.number} — ${resource.label}`}
  >
    {/* Número prominente */}
    <span
      className="text-2xl sm:text-3xl font-semibold tracking-tight transition-opacity group-hover:opacity-80"
      style={{ color: 'var(--color-primary)', fontFamily: "'Source Serif 4', serif" }}
    >
      {resource.number}
    </span>

    {/* Label */}
    <span
      className="text-sm font-medium leading-snug"
      style={{ color: 'var(--color-primary)' }}
    >
      {resource.label}
    </span>

    {/* Description */}
    <span
      className="text-sm leading-relaxed"
      style={{ color: 'var(--color-primary)', opacity: 0.65 }}
    >
      {resource.description}
    </span>

    {/* Metadata: scope + availability */}
    <span
      className="text-xs mt-1"
      style={{ color: 'var(--color-primary)', opacity: 0.45 }}
    >
      {resource.scope} · {resource.available}
    </span>
  </a>
)

/** Tarjeta de enlace web */
const LinkCard: React.FC<{ resource: LinkResource }> = ({ resource }) => (
  <a
    href={resource.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col gap-1 rounded-xl p-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    style={{
      backgroundColor: '#fff',
      border: '1px solid rgba(45,74,62,0.15)',
      '--tw-ring-color': 'var(--color-primary)',
    } as React.CSSProperties}
    aria-label={`${resource.label} — abrir enlace externo`}
  >
    <span
      className="text-sm font-medium leading-snug transition-opacity group-hover:opacity-80"
      style={{ color: 'var(--color-primary)' }}
    >
      {resource.label}
      <span
        aria-hidden="true"
        className="ml-1.5 text-xs"
        style={{ color: 'var(--color-accent)' }}
      >
        ↗
      </span>
    </span>
    <span
      className="text-sm leading-relaxed"
      style={{ color: 'var(--color-primary)', opacity: 0.65 }}
    >
      {resource.description}
    </span>
  </a>
)

/** Cabecera de sección */
const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    className="text-lg font-semibold"
    style={{ color: 'var(--color-primary)', fontFamily: "'Source Serif 4', serif" }}
  >
    {children}
  </h2>
)

// ── Componente principal ──────────────────────────────────────────────────────

const HelpResourcesPage: React.FC<HelpResourcesPageProps> = ({ lang }) => {
  const data = getData(lang)
  const { page, sections } = data

  const [othersExpanded, setOthersExpanded] = React.useState(false)

  return (
    <div className="flex flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
      <main className="flex flex-1 flex-col items-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-xl mx-auto flex flex-col gap-12">

          {/* ── Título de la página ───────────────────────────────────────── */}
          <header className="flex flex-col gap-3">
            <h1
              className="text-3xl sm:text-4xl font-semibold leading-tight"
              style={{ color: 'var(--color-primary)', fontFamily: "'Source Serif 4', serif" }}
            >
              {page.title}
            </h1>
            <p
              className="text-base leading-relaxed max-w-lg"
              style={{ color: 'var(--color-primary)', opacity: 0.7 }}
            >
              {page.subtitle}
            </p>
          </header>

          <Divider />

          {/* ── 1. Emergencias ───────────────────────────────────────────── */}
          <section aria-labelledby="section-emergency">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <SectionHeading>
                  <span id="section-emergency">{sections.emergency.title}</span>
                </SectionHeading>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-primary)', opacity: 0.65 }}
                >
                  {sections.emergency.intro}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {sections.emergency.resources.map((r) => (
                  <PhoneCard key={r.tel} resource={r} />
                ))}
              </div>
            </div>
          </section>

          <Divider />

          {/* ── 2. Salud mental ──────────────────────────────────────────── */}
          <section aria-labelledby="section-mental-health">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <SectionHeading>
                  <span id="section-mental-health">{sections.mentalHealth.title}</span>
                </SectionHeading>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-primary)', opacity: 0.65 }}
                >
                  {sections.mentalHealth.intro}
                </p>
              </div>

              {/* Recursos primarios del idioma */}
              <div className="flex flex-col gap-3">
                {sections.mentalHealth.primary.map((r) => (
                  <PhoneCard key={r.tel} resource={r} />
                ))}
              </div>

              {/* Expandible: otros países */}
              {sections.mentalHealth.others.length > 0 && (
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setOthersExpanded((v) => !v)}
                    aria-expanded={othersExpanded}
                    className="self-start text-sm underline underline-offset-2 transition-opacity hover:opacity-60 focus:outline-none focus-visible:ring-2 rounded"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {othersExpanded
                      ? sections.mentalHealth.collapseLabel
                      : sections.mentalHealth.expandLabel}
                  </button>

                  {othersExpanded && (
                    <div className="flex flex-col gap-3">
                      {sections.mentalHealth.others.map((r) => (
                        <PhoneCard key={r.tel} resource={r} muted />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <Divider />

          {/* ── 3. Otros recursos ────────────────────────────────────────── */}
          <section aria-labelledby="section-other">
            <div className="flex flex-col gap-5">
              <SectionHeading>
                <span id="section-other">{sections.otherResources.title}</span>
              </SectionHeading>

              <div className="flex flex-col gap-3">
                {sections.otherResources.resources.map((r, i) =>
                  r.type === 'phone' ? (
                    <PhoneCard key={r.tel + i} resource={r} />
                  ) : (
                    <LinkCard key={r.url + i} resource={r} />
                  )
                )}
              </div>
            </div>
          </section>

          <Divider />

          {/* ── 4. Hablar con un profesional ─────────────────────────────── */}
          <section aria-labelledby="section-professional">
            <div className="flex flex-col gap-4">
              <SectionHeading>
                <span id="section-professional">{sections.professional.title}</span>
              </SectionHeading>

              <p
                className="text-sm leading-relaxed max-w-lg"
                style={{ color: 'var(--color-primary)', opacity: 0.75 }}
              >
                {sections.professional.body}
              </p>

              <a
                href={sections.professional.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start text-sm underline underline-offset-2 transition-opacity hover:opacity-60 focus:outline-none focus-visible:ring-2 rounded"
                style={{ color: 'var(--color-primary)' }}
              >
                {sections.professional.linkLabel} ↗
              </a>
            </div>
          </section>

          {/* ── Navegación de vuelta ──────────────────────────────────────── */}
          <div className="pt-4">
            <Link
              href="/"
              className="text-xs transition-opacity hover:opacity-60 focus:outline-none focus-visible:ring-2 rounded"
              style={{ color: 'var(--color-primary)', opacity: 0.45 }}
            >
              ← Psicoprotego
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}

export default HelpResourcesPage
