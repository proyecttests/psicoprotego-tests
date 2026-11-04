/**
 * @file app/[lang]/condiciones/page.tsx
 * @description Condiciones de uso de Psicoprotego Tests.
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
    metaTitle:       "Condiciones de uso — Psicoprotego",
    metaDescription: "Condiciones de uso de Psicoprotego Tests: herramienta gratuita y sin publicidad, no es un diagnóstico, responsabilidad sobre descargas y enlaces, e instrumentos de uso libre.",
    heading:         "Condiciones de uso",
    updated:         "4 de noviembre de 2026",
    sections: [
      { title: "Qué es", body: "Psicoprotego Tests es una herramienta gratuita, sin publicidad y sin registro. La pueden usar libremente particulares y profesionales: por ejemplo, para responder un cuestionario y llevar el resultado a consulta, o para usar el PDF en blanco con sus pacientes." },
      { title: "No es un diagnóstico", body: "Los cuestionarios son herramientas de cribado orientativas. No son un diagnóstico clínico ni sustituyen la valoración de un profesional de la salud mental.\n\nEsta web no es un servicio de urgencias: si estás en peligro, llama al 112; si tienes pensamientos de suicidio, al 024 (Línea de atención a la conducta suicida). Más recursos en [Ayuda urgente](/es/ayuda-urgente)." },
      { title: "Lo que descargas, capturas o compartes", body: "Tus respuestas y tu resultado se calculan en tu navegador. Lo que hagas con ellos es responsabilidad tuya:\n\n- **PDF:** se genera en tu dispositivo. Si escribes tu nombre, solo se usa para el PDF.\n- **Capturas de pantalla:** quedan en tu dispositivo.\n- **Enlace para compartir:** lleva tus respuestas codificadas, sin tu nombre ni datos que te identifiquen. Cualquier persona que tenga el enlace puede ver tus respuestas y tu resultado. Compártelo solo con quien quieras." },
      { title: "Instrumentos", body: "GAD-7 y PHQ-9: desarrollados por los doctores Robert L. Spitzer, Janet B. W. Williams, Kurt Kroenke y colaboradores, con una subvención educativa de Pfizer Inc. No se requiere permiso para reproducirlos, traducirlos, mostrarlos o distribuirlos. Versión española: «Spanish for Spain», [phqscreeners.com](https://www.phqscreeners.com/).\n\nUsamos solo instrumentos de uso libre o con permiso de uso. Si consideras que alguno no lo es, o que vulnera algún derecho, escríbenos a hola@psicoprotego.es y lo retiraremos de inmediato mientras lo revisamos." },
      { title: "Proyecto piloto", body: "La herramienta está en fase de pruebas: puede cambiar o contener errores." },
      { title: "Cambios", body: "Podemos actualizar estas condiciones. La versión vigente es la publicada en esta página." },
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
    alternates: { canonical: `${SITE_URL}/${lang}/condiciones` },
  }
}

export default async function CondicionesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const c = CONTENT[lang]
  if (!c) notFound()

  return <LegalPage content={c} />
}
