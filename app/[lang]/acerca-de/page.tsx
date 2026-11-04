/**
 * @file app/[lang]/acerca-de/page.tsx
 * @description Página «Acerca de» de Psicoprotego Tests.
 * Textos aprobados por Emmanuel (bloque D de la auditoría, 2026-11-04):
 * content-review/legal/textos-legales.borrador.md. Render: src/components/legal/LegalPage.tsx.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LANGS } from '@/config/brand'
import LegalPage, { type LegalContent } from '@/components/legal/LegalPage'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS = SUPPORTED_LANGS

const CONTENT: Record<string, LegalContent> = {
  es: {
    metaTitle:       "Acerca de — Psicoprotego",
    metaDescription: "Psicoprotego Tests: cuestionarios psicológicos validados en España, gratuitos y sin publicidad, del equipo de la consulta Psicoprotego.",
    heading:         "Acerca de Psicoprotego Tests",
    sections: [
      { title: "Qué es", body: "Psicoprotego Tests es una herramienta gratuita y sin publicidad para responder cuestionarios psicológicos validados en España y obtener una orientación sobre el resultado, que puedes llevar a un profesional." },
      { title: "Quiénes somos", body: "El equipo de psicólogos de la consulta Psicoprotego, en Pozuelo de Alarcón ([psicoprotego.es](https://psicoprotego.es/))." },
      { title: "Tests basados en evidencia", body: "Hoy: GAD-7 (ansiedad) y PHQ-9 (depresión). Cada test indica su validación en población española y sus limitaciones." },
      { title: "Privacidad", body: "Tus respuestas se calculan en tu navegador y no se guardan en nuestros servidores. Detalle en la [Política de privacidad](/es/privacidad)." },
      { title: "Contacto", body: "hola@psicoprotego.es" },
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
    alternates: { canonical: `${SITE_URL}/${lang}/acerca-de` },
  }
}

export default async function AcercaDePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const c = CONTENT[lang]
  if (!c) notFound()

  return <LegalPage content={c} />
}
