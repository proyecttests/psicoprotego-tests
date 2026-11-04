/**
 * @file app/[lang]/privacidad/page.tsx
 * @description Política de privacidad de Psicoprotego Tests (RGPD / LOPDGDD).
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
    metaTitle:       "Política de Privacidad — Psicoprotego",
    metaDescription: "Tus respuestas se calculan en tu navegador y no se guardan en nuestros servidores. Analítica de Google solo si aceptas las cookies.",
    heading:         "Política de Privacidad",
    updated:         "4 de noviembre de 2026",
    sections: [
      { title: "Responsable", body: "Psicólogos Protego (Psicoprotego). Los datos de identificación del responsable están en la [política de privacidad de psicoprotego.es](https://psicoprotego.es/politica-privacidad/).\n\nContacto: hola@psicoprotego.es." },
      { title: "Resumen", body: "No hay registro ni cuentas. Tus respuestas y tu resultado se calculan en tu navegador y no se guardan en nuestros servidores. Solo si aceptas las cookies de analítica se envían estadísticas a Google Analytics." },
      { title: "Al hacer un test", body: "Tus respuestas y tu resultado se calculan en tu navegador. No se envían a nuestros servidores ni se guardan." },
      { title: "Al descargar el PDF", body: "Se genera en tu dispositivo. Si escribes tu nombre, solo se usa para el PDF y se queda en esa pestaña del navegador hasta que la cierras." },
      { title: "Al compartir el resultado", body: "El enlace lleva tus respuestas codificadas detrás del símbolo «#», una parte de la dirección que el navegador no envía a ningún servidor. No lleva tu nombre ni datos que te identifiquen. Quien tenga el enlace puede ver tus respuestas y tu resultado." },
      { title: "Si aceptas las cookies de analítica", body: "Enviamos a Google Analytics, sin tu nombre ni ningún dato que te identifique, qué test haces, tus respuestas, tu resultado y si ha aparecido el aviso de ayuda urgente, para elaborar estadísticas de uso. Google los asocia a un identificador aleatorio de tu navegador. Si compartes un resultado, también se envía el enlace.\n\nBase: tu consentimiento, que puedes retirar cuando quieras desde «Preferencias de cookies», en el pie de cada página.\n\nConservación: los datos de los eventos se conservan 2 meses y los asociados al identificador de tu navegador, 14 meses." },
      { title: "Estadísticas de visitas sin cookies", body: "Vercel Web Analytics registra las páginas visitadas, el país, el navegador y el tipo de dispositivo, sin cookies y sin el enlace de resultados. Identifica las visitas con un código que se descarta a las 24 horas. Base: nuestro interés legítimo en conocer el uso agregado de la web." },
      { title: "Registros del alojamiento", body: "Como cualquier web, el servidor de alojamiento (Vercel) registra datos técnicos de cada visita (dirección IP, página pedida, navegador) durante un tiempo breve, para el funcionamiento y la seguridad del servicio." },
      { title: "Si nos escribes", body: "Usamos tu correo solo para responderte." },
      { title: "Quién más los trata", body: "- Vercel Inc. (EE. UU.): alojamiento y estadísticas sin cookies.\n- Google Ireland Ltd. / Google LLC (EE. UU.): Google Analytics, solo si aceptas.\n\nVercel y Google declaran estar adheridos al Marco de Privacidad de Datos UE-EE. UU., que la Comisión Europea reconoce como garantía adecuada para las transferencias de datos a EE. UU.\n\nNo vendemos ni cedemos datos a nadie más, no hacemos publicidad ni usamos los datos para publicidad." },
      { title: "Tus derechos", body: "Puedes pedir acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a hola@psicoprotego.es. Como no guardamos datos que te identifiquen, es posible que no podamos localizar tus datos. Si crees que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos ([aepd.es](https://www.aepd.es/))." },
      { title: "Menores", body: "Los cuestionarios están pensados para mayores de 18 años." },
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
    alternates: { canonical: `${SITE_URL}/${lang}/privacidad` },
  }
}

export default async function PrivacidadPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const c = CONTENT[lang]
  if (!c) notFound()

  return <LegalPage content={c} />
}
