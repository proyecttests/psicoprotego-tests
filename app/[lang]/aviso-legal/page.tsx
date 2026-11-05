/**
 * @file app/[lang]/aviso-legal/page.tsx
 * @description Legal notice page — Spain/EU compliant.
 * Textos aprobados por Emmanuel (bloque D de la auditoría, 2026-11-04):
 * content-review/legal/textos-legales.borrador.md. Render: src/components/legal/LegalPage.tsx.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LANGS } from '@/config/brand'
import LegalPage, { type LegalContent } from '@/components/legal/LegalPage'
import { SITE_URL } from '@/config/site'

const LANGS = SUPPORTED_LANGS

const CONTENT: Record<string, LegalContent> = {
  es: {
    metaTitle:       "Aviso Legal",
    metaDescription: "Aviso legal de Psicoprotego Tests: titular, objeto del servicio, propiedad intelectual, responsabilidad y legislación aplicable.",
    heading:         "Aviso Legal",
    sections: [
      { title: "Titular", body: "Psicoprotego Tests es un servicio de Psicólogos Protego (Psicoprotego). Los datos de identificación del titular, de colegiación profesional y de autorización sanitaria están en el [aviso legal de psicoprotego.es](https://psicoprotego.es/aviso-legal/).\n\nContacto: hola@psicoprotego.es." },
      { title: "Objeto", body: "Psicoprotego Tests es una herramienta gratuita de cribado psicológico con cuestionarios validados. No es un servicio de atención psicológica, diagnóstico ni tratamiento, ni un servicio de urgencias. Su uso se rige por las [Condiciones de uso](/es/condiciones)." },
      { title: "Propiedad intelectual", body: "Los textos, el diseño y el código de esta web son de Psicoprotego o se usan con autorización. Los cuestionarios (GAD-7, PHQ-9) pertenecen a sus autores y se usan según sus condiciones de uso libre: ver [Condiciones de uso](/es/condiciones), apartado «Instrumentos»." },
      { title: "Responsabilidad", body: "Los resultados son orientativos y no sustituyen la valoración de un profesional. Psicoprotego no responde del uso que se haga de los resultados, los PDF o los enlaces compartidos, ni del contenido de webs externas enlazadas." },
      { title: "Legislación aplicable", body: "Legislación española, en particular la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE)." },
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

  return <LegalPage content={c} />
}
