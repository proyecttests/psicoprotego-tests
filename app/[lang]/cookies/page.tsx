/**
 * @file app/[lang]/cookies/page.tsx
 * @description Cookie policy — no cookies used, localStorage only.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS = ['es', 'en', 'pt', 'ku']

const CONTENT: Record<string, { metaTitle: string; metaDescription: string; heading: string; sections: Array<{ title: string; body: string }> }> = {
  es: {
    metaTitle:       'Política de Cookies — Psicoprotego',
    metaDescription: 'Psicoprotego no utiliza cookies de seguimiento. Solo usamos localStorage para guardar tu progreso de forma local.',
    heading:         'Política de Cookies',
    sections: [
      { title: 'No utilizamos cookies', body: 'Psicoprotego NO establece ninguna cookie en tu navegador. No utilizamos cookies de análisis, publicidad, sesión ni de terceros. Por este motivo, no es necesario que aceptes ningún banner de cookies.' },
      { title: '¿Qué usamos en su lugar?', body: 'Para mejorar tu experiencia, utilizamos localStorage (almacenamiento local del navegador) para guardar: el progreso en los tests, el historial de puntuaciones anteriores y tus preferencias de idioma. Este almacenamiento es local a tu dispositivo. Ningún dato se envía a nuestros servidores.' },
      { title: 'Sin rastreadores de terceros', body: 'No integramos herramientas de analítica de terceros (Google Analytics, Meta Pixel, etc.). No hay scripts de publicidad. No compartimos datos con terceros.' },
      { title: '¿Cómo borrar el almacenamiento local?', body: 'Puedes borrar el localStorage desde la configuración de tu navegador en cualquier momento. Esto eliminará tu historial de tests y preferencias guardadas en este dispositivo.' },
      { title: 'Contacto', body: 'Para cualquier duda sobre nuestra política de cookies: hola@psicoprotego.es' },
    ],
  },
  en: {
    metaTitle:       'Cookie Policy — Psicoprotego',
    metaDescription: 'Psicoprotego uses no tracking cookies. We only use localStorage to save your progress locally on your device.',
    heading:         'Cookie Policy',
    sections: [
      { title: 'We use no cookies', body: 'Psicoprotego does NOT set any cookies in your browser. We use no analytics, advertising, session, or third-party cookies. For this reason, no cookie consent banner is required.' },
      { title: 'What do we use instead?', body: 'To improve your experience, we use localStorage (browser local storage) to save: your progress within tests, your score history, and your language preferences. This storage is local to your device. No data is sent to our servers.' },
      { title: 'No third-party trackers', body: 'We do not integrate third-party analytics tools (Google Analytics, Meta Pixel, etc.). There are no advertising scripts. We do not share data with third parties.' },
      { title: 'How to clear local storage', body: 'You can clear localStorage from your browser settings at any time. This will delete your test history and saved preferences on this device.' },
      { title: 'Contact', body: 'For any questions about our cookie policy: hola@psicoprotego.es' },
    ],
  },
  pt: {
    metaTitle:       'Política de Cookies — Psicoprotego',
    metaDescription: 'O Psicoprotego não usa cookies de rastreamento. Usamos apenas localStorage para salvar seu progresso localmente.',
    heading:         'Política de Cookies',
    sections: [
      { title: 'Não usamos cookies', body: 'O Psicoprotego NÃO define nenhum cookie no seu navegador. Não usamos cookies de análise, publicidade, sessão ou de terceiros. Por esse motivo, não é necessário aceitar nenhum banner de cookies.' },
      { title: 'O que usamos em vez disso?', body: 'Para melhorar sua experiência, usamos localStorage (armazenamento local do navegador) para salvar: seu progresso nos testes, histórico de pontuações anteriores e preferências de idioma. Esse armazenamento é local no seu dispositivo. Nenhum dado é enviado aos nossos servidores.' },
      { title: 'Sem rastreadores de terceiros', body: 'Não integramos ferramentas de análise de terceiros (Google Analytics, Meta Pixel, etc.). Não há scripts de publicidade. Não compartilhamos dados com terceiros.' },
      { title: 'Como limpar o armazenamento local', body: 'Você pode limpar o localStorage nas configurações do navegador a qualquer momento. Isso excluirá seu histórico de testes e preferências salvas neste dispositivo.' },
      { title: 'Contato', body: 'Para qualquer dúvida sobre nossa política de cookies: hola@psicoprotego.es' },
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

  return (
    <div style={{ backgroundColor: 'var(--color-cream)' }} className="min-h-screen py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* No-cookie badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
          style={{ backgroundColor: '#e8f5f0', color: 'var(--color-primary)' }}
        >
          <span>0 cookies</span>
        </div>

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
