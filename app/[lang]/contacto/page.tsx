/**
 * @file app/[lang]/contacto/page.tsx
 * @description Contact page with email, mailto form, and crisis line disclaimer.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS = ['es', 'en', 'pt', 'ku']

const CONTENT: Record<string, {
  metaTitle: string
  metaDescription: string
  heading: string
  intro: string
  emailLabel: string
  formHeading: string
  subjectLabel: string
  messageLabel: string
  sendBtn: string
  disclaimer: string
  crisisHeading: string
  crisisBody: string
}> = {
  es: {
    metaTitle:       'Contacto — Psicoprotego',
    metaDescription: 'Contacta con Psicoprotego para consultas, sugerencias o colaboraciones. hola@psicoprotego.es',
    heading:         'Contacto',
    intro:           '¿Tienes alguna pregunta, sugerencia o propuesta de colaboración? Escríbenos.',
    emailLabel:      'Email directo',
    formHeading:     'Envíanos un mensaje',
    subjectLabel:    'Asunto',
    messageLabel:    'Mensaje',
    sendBtn:         'Enviar mensaje',
    disclaimer:      'Este formulario abre tu cliente de correo habitual. No almacenamos ningún dato.',
    crisisHeading:   '¿Estás en crisis?',
    crisisBody:      'Psicoprotego no es un servicio de atención psicológica profesional ni una línea de emergencias. Si estás en una situación de crisis o tienes pensamientos de hacerte daño, por favor contacta con el 024 (línea de atención a la conducta suicida, gratuita y disponible 24h) o llama al 112.',
  },
  en: {
    metaTitle:       'Contact — Psicoprotego',
    metaDescription: 'Contact Psicoprotego for inquiries, suggestions or collaborations. hola@psicoprotego.es',
    heading:         'Contact',
    intro:           'Have a question, suggestion or collaboration proposal? Write to us.',
    emailLabel:      'Direct email',
    formHeading:     'Send us a message',
    subjectLabel:    'Subject',
    messageLabel:    'Message',
    sendBtn:         'Send message',
    disclaimer:      'This form opens your usual email client. We do not store any data.',
    crisisHeading:   'Are you in crisis?',
    crisisBody:      'Psicoprotego is not a professional psychological support service or an emergency line. If you are in crisis or have thoughts of self-harm, please contact a crisis line in your country or call emergency services.',
  },
  pt: {
    metaTitle:       'Contato — Psicoprotego',
    metaDescription: 'Entre em contato com o Psicoprotego para dúvidas, sugestões ou colaborações. hola@psicoprotego.es',
    heading:         'Contato',
    intro:           'Tem alguma dúvida, sugestão ou proposta de colaboração? Escreva para nós.',
    emailLabel:      'Email direto',
    formHeading:     'Envie-nos uma mensagem',
    subjectLabel:    'Assunto',
    messageLabel:    'Mensagem',
    sendBtn:         'Enviar mensagem',
    disclaimer:      'Este formulário abre seu cliente de e-mail habitual. Não armazenamos nenhum dado.',
    crisisHeading:   'Está em crise?',
    crisisBody:      'O Psicoprotego não é um serviço de apoio psicológico profissional nem uma linha de emergência. Se estiver em crise ou tiver pensamentos de se machucar, entre em contato com uma linha de crise no seu país ou ligue para os serviços de emergência.',
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
    alternates: { canonical: `${SITE_URL}/${lang}/contacto` },
  }
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const c = CONTENT[lang]
  if (!c) notFound()

  const mailto = `mailto:hola@psicoprotego.es`
  const mailtoWithBody = `mailto:hola@psicoprotego.es?subject=Consulta%20Psicoprotego&body=`

  return (
    <div style={{ backgroundColor: 'var(--color-cream)' }} className="min-h-screen py-12">
      <div className="mx-auto max-w-2xl px-4">
        <h1
          className="font-['Source_Serif_4',serif] text-4xl font-bold mb-4"
          style={{ color: 'var(--color-primary)' }}
        >
          {c.heading}
        </h1>
        <p className="text-neutral-600 mb-8 leading-relaxed">{c.intro}</p>

        {/* Email */}
        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-neutral-400">
            {c.emailLabel}
          </p>
          <a
            href={mailto}
            className="text-lg font-semibold transition hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            hola@psicoprotego.es
          </a>
        </div>

        {/* mailto form */}
        <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-6 mb-8">
          <h2
            className="font-['Source_Serif_4',serif] text-xl font-semibold mb-4"
            style={{ color: 'var(--color-primary)' }}
          >
            {c.formHeading}
          </h2>
          <a
            href={mailtoWithBody}
            className="btn-primary inline-block"
          >
            {c.sendBtn}
          </a>
          <p className="mt-3 text-xs text-neutral-400">{c.disclaimer}</p>
        </div>

        {/* Crisis disclaimer */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: '#f59e0b', backgroundColor: '#fffbeb' }}
        >
          <h3 className="font-semibold text-amber-700 mb-2">{c.crisisHeading}</h3>
          <p className="text-sm text-amber-800 leading-relaxed">{c.crisisBody}</p>
        </div>
      </div>
    </div>
  )
}
