/**
 * @file app/[lang]/aviso-legal/page.tsx
 * @description Legal notice page — Spain/EU compliant.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LANGS } from '@/config/brand'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS = SUPPORTED_LANGS

const CONTENT: Record<string, { metaTitle: string; metaDescription: string; heading: string; sections: Array<{ title: string; body: string }> }> = {
  es: {
    metaTitle:       'Aviso Legal — Psicoprotego',
    metaDescription: 'Aviso legal de Psicoprotego: información del responsable, actividad, condiciones de uso y legislación aplicable.',
    heading:         'Aviso Legal',
    sections: [
      { title: 'Responsable', body: 'Denominación: Psicoprotego. Correo electrónico: hola@psicoprotego.es. Actividad: plataforma online de tests psicológicos de autoevaluación.' },
      { title: 'Objeto y actividad', body: 'Psicoprotego ofrece tests de autoevaluación psicológica con fines exclusivamente educativos e informativos. Los contenidos de esta plataforma NO constituyen diagnóstico, tratamiento ni prestación de servicios psicológicos profesionales. Ante cualquier preocupación sobre salud mental, se recomienda consultar con un profesional cualificado.' },
      { title: 'Propiedad intelectual', body: 'Los contenidos de esta web (textos, imágenes, diseño, código fuente) son propiedad de Psicoprotego o de sus respectivos autores. Queda prohibida su reproducción total o parcial sin autorización expresa.' },
      { title: 'Responsabilidad', body: 'Psicoprotego no se hace responsable de los daños derivados del uso indebido de los contenidos de esta plataforma, ni de la interpretación incorrecta de los resultados de los tests. Los resultados son orientativos y no deben reemplazar la opinión de un profesional de la salud mental.' },
      { title: 'Legislación aplicable', body: 'Este aviso legal se rige por la legislación española vigente, en particular la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), y el Reglamento General de Protección de Datos (RGPD/GDPR).' },
      { title: 'Contacto', body: 'Para cualquier cuestión relativa a este aviso legal: hola@psicoprotego.es' },
    ],
  },
}

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const c = CONTENT[lang] ?? CONTENT['es']
  return {
    title:       c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `${SITE_URL}/${lang}/aviso-legal` },
  }
}

export default async function AvisoLegalPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const c = CONTENT[lang]
  if (!c) notFound()

  return (
    <div style={{ backgroundColor: 'var(--color-cream)' }} className="min-h-screen py-12">
      <div className="mx-auto max-w-2xl px-4">
        <h1
          className="font-['Source_Serif_4',serif] text-4xl font-bold mb-10"
          style={{ color: 'var(--color-primary)' }}
        >
          {c.heading}
        </h1>

        <div className="flex flex-col gap-8">
          {c.sections.map((s) => (
            <section key={s.title}>
              <h2
                className="font-['Source_Serif_4',serif] text-xl font-semibold mb-2"
                style={{ color: 'var(--color-primary)' }}
              >
                {s.title}
              </h2>
              <p className="text-neutral-700 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
