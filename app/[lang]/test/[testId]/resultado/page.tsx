/**
 * @file app/[lang]/test/[testId]/resultado/page.tsx
 * @description Página de resultado compartido.
 *
 * El token ?d= contiene todas las respuestas en base64 URL-safe.
 * La página decodifica, re-ejecuta el scoring y muestra ResultCard en modo lectura.
 *
 * noindex: el resultado es personal, no debe indexarse.
 */

import { Suspense } from "react"
import type { Metadata } from "next"
import ResultadoClient from "./ResultadoClient"

interface PageProps {
  params: Promise<{ lang: string; testId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, testId } = await params

  try {
    const metaRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://psicoprotego.es"}/data/tests/${testId}/metadata.json`,
      { next: { revalidate: 3600 } }
    )
    if (metaRes.ok) {
      const meta = await metaRes.json() as { availableLangs: string[] }
      const resolvedLang = meta.availableLangs.includes(lang) ? lang : "es"

      const langRes = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://psicoprotego.es"}/data/tests/${testId}/${resolvedLang}.json`,
        { next: { revalidate: 3600 } }
      )
      if (langRes.ok) {
        const langData = await langRes.json() as { name: string; description?: string }
        const titles: Record<string, string> = {
          es: `Mis resultados — ${langData.name}`,
          en: `My results — ${langData.name}`,
          pt: `Meus resultados — ${langData.name}`,
        }
        return {
          title: titles[lang] ?? titles["es"],
          description: langData.description,
          robots: { index: false, follow: false },
        }
      }
    }
  } catch {
    // fallback below
  }

  return {
    title: "Resultado — Psicoprotego",
    robots: { index: false, follow: false },
  }
}

export default async function ResultadoPage({ params }: PageProps) {
  const { lang, testId } = await params

  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200"
          style={{ borderTopColor: "var(--color-primary)" }}
        />
      </div>
    }>
      <ResultadoClient lang={lang} testId={testId} />
    </Suspense>
  )
}
