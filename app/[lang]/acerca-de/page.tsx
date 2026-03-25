/**
 * @file app/[lang]/acerca-de/page.tsx
 * @description About page — Psicoprotego platform info, team and contact.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS = ['es', 'en', 'pt']

type LangContent = {
  metaTitle: string
  metaDescription: string
  heading: string
  sections: Array<{ title: string; body: string }>
}

const CONTENT: Record<string, LangContent> = {
  es: {
    metaTitle:       'Acerca de — Psicoprotego',
    metaDescription: 'Psicoprotego es una plataforma de autoevaluación psicológica gratuita, basada en evidencia y 100% privada.',
    heading:         'Acerca de Psicoprotego',
    sections: [
      {
        title: 'Nuestra misión',
        body:  'Psicoprotego es una plataforma de autoevaluación psicológica gratuita, validada científicamente y completamente privada. Creemos en la democratización del acceso a herramientas psicológicas de calidad para cualquier persona, sin importar su situación económica o geográfica.',
      },
      {
        title: 'Privacidad ante todo',
        body:  'No almacenamos ningún dato personal en nuestros servidores. Tus respuestas y resultados se guardan únicamente en tu dispositivo (localStorage). Ningún dato abandona tu navegador. No hay registro, no hay cuenta, no hay rastreo.',
      },
      {
        title: 'Tests basados en evidencia',
        body:  'Todos nuestros tests están basados en instrumentos psicológicos validados y ampliamente utilizados en la investigación científica (GAD-7, PHQ-9, ECR-R y otros). Cada test incluye información sobre su base científica y sus limitaciones.',
      },
      {
        title: 'Quiénes somos',
        body:  'Somos un equipo interdisciplinar formado por psicólogos clínicos e ingenieros de software con un objetivo en común: acercar la psicología de calidad a cualquier persona. Combinamos rigor científico con una experiencia de usuario sencilla y accesible.',
      },
      {
        title: 'Contacto',
        body:  'Para consultas, sugerencias o colaboraciones: hola@psicoprotego.es',
      },
    ],
  },
  en: {
    metaTitle:       'About — Psicoprotego',
    metaDescription: 'Psicoprotego is a free, evidence-based psychological self-assessment platform that is 100% private.',
    heading:         'About Psicoprotego',
    sections: [
      {
        title: 'Our mission',
        body:  'Psicoprotego is a free, scientifically validated, and completely private psychological self-assessment platform. We believe in democratizing access to quality psychological tools for everyone, regardless of economic or geographic situation.',
      },
      {
        title: 'Privacy first',
        body:  'We store no personal data on our servers. Your responses and results are saved only on your device (localStorage). No data leaves your browser. No registration, no account, no tracking.',
      },
      {
        title: 'Evidence-based tests',
        body:  'All our tests are based on validated psychological instruments widely used in scientific research (GAD-7, PHQ-9, ECR-R and others). Each test includes information about its scientific basis and limitations.',
      },
      {
        title: 'Who we are',
        body:  'We are an interdisciplinary team of clinical psychologists and software engineers with a shared goal: bringing quality psychology to everyone. We combine scientific rigor with a simple, accessible user experience.',
      },
      {
        title: 'Contact',
        body:  'For inquiries, suggestions or collaborations: hola@psicoprotego.es',
      },
    ],
  },
  pt: {
    metaTitle:       'Sobre nós — Psicoprotego',
    metaDescription: 'Psicoprotego é uma plataforma de autoavaliação psicológica gratuita, baseada em evidências e 100% privada.',
    heading:         'Sobre o Psicoprotego',
    sections: [
      {
        title: 'Nossa missão',
        body:  'O Psicoprotego é uma plataforma de autoavaliação psicológica gratuita, validada cientificamente e completamente privada. Acreditamos na democratização do acesso a ferramentas psicológicas de qualidade para qualquer pessoa, independentemente de sua situação econômica ou geográfica.',
      },
      {
        title: 'Privacidade em primeiro lugar',
        body:  'Não armazenamos nenhum dado pessoal em nossos servidores. Suas respostas e resultados são salvos apenas no seu dispositivo (localStorage). Nenhum dado sai do seu navegador. Sem cadastro, sem conta, sem rastreamento.',
      },
      {
        title: 'Testes baseados em evidências',
        body:  'Todos os nossos testes são baseados em instrumentos psicológicos validados e amplamente utilizados na pesquisa científica (GAD-7, PHQ-9, ECR-R e outros). Cada teste inclui informações sobre sua base científica e limitações.',
      },
      {
        title: 'Quem somos',
        body:  'Somos uma equipe interdisciplinar de psicólogos clínicos e engenheiros de software com um objetivo em comum: aproximar a psicologia de qualidade de qualquer pessoa. Combinamos rigor científico com uma experiência de usuário simples e acessível.',
      },
      {
        title: 'Contato',
        body:  'Para consultas, sugestões ou colaborações: hola@psicoprotego.es',
      },
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
