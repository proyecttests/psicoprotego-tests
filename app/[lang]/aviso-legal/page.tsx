/**
 * @file app/[lang]/aviso-legal/page.tsx
 * @description Legal notice page — Spain/EU compliant.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS = ['es', 'en', 'pt']

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
  en: {
    metaTitle:       'Legal Notice — Psicoprotego',
    metaDescription: 'Legal notice for Psicoprotego: responsible party, activity, terms of use, and applicable legislation.',
    heading:         'Legal Notice',
    sections: [
      { title: 'Responsible party', body: 'Name: Psicoprotego. Email: hola@psicoprotego.es. Activity: online psychological self-assessment test platform.' },
      { title: 'Purpose and activity', body: 'Psicoprotego offers psychological self-assessment tests for exclusively educational and informational purposes. The content of this platform does NOT constitute diagnosis, treatment, or provision of professional psychological services. For any mental health concern, please consult a qualified professional.' },
      { title: 'Intellectual property', body: 'The contents of this website (texts, images, design, source code) are the property of Psicoprotego or their respective authors. Total or partial reproduction without express authorization is prohibited.' },
      { title: 'Liability', body: 'Psicoprotego is not responsible for damages arising from misuse of this platform content, nor from incorrect interpretation of test results. Results are indicative and should not replace the opinion of a mental health professional.' },
      { title: 'Applicable law', body: 'This legal notice is governed by applicable Spanish law, in particular Law 34/2002 on Information Society Services and Electronic Commerce, and the General Data Protection Regulation (GDPR).' },
      { title: 'Contact', body: 'For any matter relating to this legal notice: hola@psicoprotego.es' },
    ],
  },
  pt: {
    metaTitle:       'Aviso Legal — Psicoprotego',
    metaDescription: 'Aviso legal do Psicoprotego: responsável, atividade, condições de uso e legislação aplicável.',
    heading:         'Aviso Legal',
    sections: [
      { title: 'Responsável', body: 'Denominação: Psicoprotego. E-mail: hola@psicoprotego.es. Atividade: plataforma online de testes psicológicos de autoavaliação.' },
      { title: 'Objeto e atividade', body: 'O Psicoprotego oferece testes de autoavaliação psicológica com fins exclusivamente educativos e informativos. Os conteúdos desta plataforma NÃO constituem diagnóstico, tratamento ou prestação de serviços psicológicos profissionais. Para qualquer preocupação com saúde mental, recomenda-se consultar um profissional qualificado.' },
      { title: 'Propriedade intelectual', body: 'Os conteúdos deste site (textos, imagens, design, código-fonte) são propriedade do Psicoprotego ou de seus respectivos autores. É proibida a reprodução total ou parcial sem autorização expressa.' },
      { title: 'Responsabilidade', body: 'O Psicoprotego não se responsabiliza por danos decorrentes do uso indevido dos conteúdos desta plataforma, nem da interpretação incorreta dos resultados dos testes. Os resultados são orientativos e não devem substituir a opinião de um profissional de saúde mental.' },
      { title: 'Legislação aplicável', body: 'Este aviso legal é regido pela legislação espanhola vigente, em particular a Lei 34/2002 de Serviços da Sociedade da Informação e do Comércio Eletrônico, e o Regulamento Geral de Proteção de Dados (RGPD/GDPR).' },
      { title: 'Contato', body: 'Para qualquer questão relacionada a este aviso legal: hola@psicoprotego.es' },
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
