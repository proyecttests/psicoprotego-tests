/**
 * @file app/[lang]/privacidad/page.tsx
 * @description Privacy policy — GDPR/LOPD compliant, no server-side data collection.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LANGS } from '@/config/brand'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS = SUPPORTED_LANGS

const CONTENT: Record<string, { metaTitle: string; metaDescription: string; heading: string; sections: Array<{ title: string; body: string }> }> = {
  es: {
    metaTitle:       'Política de Privacidad — Psicoprotego',
    metaDescription: 'Psicoprotego no recopila datos personales. Tus respuestas se guardan solo en tu dispositivo. Política RGPD/LOPD.',
    heading:         'Política de Privacidad',
    sections: [
      { title: 'Responsable del tratamiento', body: 'Psicoprotego. Contacto: hola@psicoprotego.es' },
      { title: 'Datos que NO recopilamos', body: 'Psicoprotego no recoge, almacena ni procesa datos personales en nuestros servidores. No hay registro de usuarios, no hay cuentas, no hay formularios de recogida de datos. Nunca pedimos tu nombre, email, edad ni ningún dato identificativo.' },
      { title: 'Almacenamiento local', body: 'Tus respuestas a los tests y tus resultados se guardan exclusivamente en el localStorage de tu navegador, en tu propio dispositivo. Estos datos nunca se transmiten a nuestros servidores ni a terceros. Tú tienes el control total y puedes borrarlos en cualquier momento desde la configuración de tu navegador.' },
      { title: 'Sin perfilado ni venta de datos', body: 'No creamos perfiles psicológicos ni de comportamiento. No vendemos, cedemos ni compartimos ningún dato con terceros. No realizamos publicidad dirigida ni personalizada.' },
      { title: 'Derechos sobre tus datos', body: 'Aunque no almacenamos datos personales en nuestros sistemas, si tienes alguna pregunta sobre el tratamiento de tus datos o deseas ejercer tus derechos reconocidos por el RGPD (acceso, rectificación, supresión, portabilidad, oposición), puedes contactarnos en hola@psicoprotego.es.' },
      { title: 'Cumplimiento normativo', body: 'Esta política cumple con el Reglamento General de Protección de Datos (RGPD, UE 2016/679) y la Ley Orgánica de Protección de Datos Personales y garantía de los derechos digitales (LOPD-GDD, Ley Orgánica 3/2018).' },
      { title: 'Actualización de esta política', body: 'Nos reservamos el derecho de actualizar esta política de privacidad. Los cambios significativos se comunicarán en esta misma página.' },
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
