/**
 * @file app/[lang]/test/[testId]/resultado/page.tsx
 * @description Página de resultado compartido.
 *
 * El token #d= (o ?d= en enlaces antiguos) contiene todas las respuestas en base64 URL-safe;
 * va en el fragmento, así que no llega al servidor.
 * La página decodifica, re-ejecuta el scoring y muestra ResultCard en modo lectura.
 *
 * noindex: el resultado es personal, no debe indexarse.
 */

import { Suspense } from "react"
import type { Metadata } from "next"
import ResultadoClient from "./ResultadoClient"
import { getTestName } from "@/utils/testName"

interface PageProps {
  params: Promise<{ lang: string; testId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, testId } = await params
  const name = await getTestName(testId, lang)
  return {
    title:  name ? `Mis resultados — ${name}` : "Resultado",
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
