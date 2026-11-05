/**
 * @file app/[lang]/cookies/page.tsx
 * @description Política de cookies de Psicoprotego Tests.
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
    metaTitle:       "Política de Cookies",
    metaDescription: "Qué guarda Psicoprotego Tests en tu navegador: almacenamiento técnico y, solo si las aceptas, cookies de Google Analytics.",
    heading:         "Política de Cookies",
    updated:         "4 de noviembre de 2026",
    sections: [
      { title: "Qué usamos", body: "Además del almacenamiento técnico necesario para que la web funcione, solo usamos cookies de Google Analytics si las aceptas. Vercel Web Analytics no usa cookies.",
        table: {"head": ["Nombre", "Tipo", "Para qué", "Duración", "Necesita consentimiento"], "rows": [["psico_cookie_consent", "Almacenamiento local del navegador", "Recordar si aceptaste o rechazaste la analítica", "Hasta que lo borres", "No (técnica)"], ["test_access_granted", "Almacenamiento de la pestaña", "Comprobar que has visto el aviso antes de empezar el test", "Hasta cerrar la pestaña", "No (técnica)"], ["psico_pdf_name", "Almacenamiento de la pestaña", "Recordar el nombre que escribiste para el PDF", "Hasta cerrar la pestaña", "No (técnica)"], ["_ga, _ga_<ID>", "Cookies de Google Analytics", "Estadísticas de uso", "2 años", "**Sí**"]]} },
      { title: "Cómo cambiar tu elección", body: "En «Preferencias de cookies», en el pie de cada página. Si eliges «Solo esenciales», dejamos de cargar Google Analytics y borramos sus cookies.\n\nMás información en la [Política de privacidad](/es/privacidad)." },
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
    alternates: { canonical: `${SITE_URL}/${lang}/cookies` },
  }
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const c = CONTENT[lang]
  if (!c) notFound()

  return <LegalPage content={c} />
}
