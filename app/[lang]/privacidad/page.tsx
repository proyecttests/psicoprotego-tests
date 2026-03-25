/**
 * @file app/[lang]/privacidad/page.tsx
 * @description Privacy policy — GDPR/LOPD compliant, no server-side data collection.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://psicoprotego.es'
const LANGS = ['es', 'en', 'pt']

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
  en: {
    metaTitle:       'Privacy Policy — Psicoprotego',
    metaDescription: 'Psicoprotego collects no personal data. Your responses are stored only on your device. GDPR compliant.',
    heading:         'Privacy Policy',
    sections: [
      { title: 'Data controller', body: 'Psicoprotego. Contact: hola@psicoprotego.es' },
      { title: 'Data we do NOT collect', body: 'Psicoprotego does not collect, store or process personal data on our servers. There is no user registration, no accounts, no data collection forms. We never ask for your name, email, age, or any identifying information.' },
      { title: 'Local storage', body: 'Your test responses and results are stored exclusively in your browser localStorage, on your own device. This data is never transmitted to our servers or to third parties. You have full control and can delete it at any time from your browser settings.' },
      { title: 'No profiling or data selling', body: 'We do not create psychological or behavioral profiles. We do not sell, transfer, or share any data with third parties. We do not engage in targeted or personalized advertising.' },
      { title: 'Your rights', body: 'Although we do not store personal data on our systems, if you have any questions about data processing or wish to exercise your GDPR rights (access, rectification, erasure, portability, objection), you can contact us at hola@psicoprotego.es.' },
      { title: 'Regulatory compliance', body: 'This policy complies with the General Data Protection Regulation (GDPR, EU 2016/679) and applicable data protection legislation.' },
      { title: 'Policy updates', body: 'We reserve the right to update this privacy policy. Significant changes will be communicated on this page.' },
    ],
  },
  pt: {
    metaTitle:       'Política de Privacidade — Psicoprotego',
    metaDescription: 'O Psicoprotego não coleta dados pessoais. Suas respostas ficam apenas no seu dispositivo. Em conformidade com o RGPD.',
    heading:         'Política de Privacidade',
    sections: [
      { title: 'Responsável pelo tratamento', body: 'Psicoprotego. Contato: hola@psicoprotego.es' },
      { title: 'Dados que NÃO coletamos', body: 'O Psicoprotego não coleta, armazena nem processa dados pessoais em nossos servidores. Não há registro de usuários, não há contas, não há formulários de coleta de dados. Nunca pedimos seu nome, e-mail, idade ou qualquer dado identificativo.' },
      { title: 'Armazenamento local', body: 'Suas respostas aos testes e seus resultados são armazenados exclusivamente no localStorage do seu navegador, no seu próprio dispositivo. Esses dados nunca são transmitidos aos nossos servidores ou a terceiros. Você tem controle total e pode apagá-los a qualquer momento nas configurações do navegador.' },
      { title: 'Sem perfilamento ou venda de dados', body: 'Não criamos perfis psicológicos ou comportamentais. Não vendemos, cedemos nem compartilhamos dados com terceiros. Não realizamos publicidade direcionada ou personalizada.' },
      { title: 'Seus direitos', body: 'Embora não armazenemos dados pessoais em nossos sistemas, se tiver alguma dúvida sobre o tratamento de dados ou desejar exercer seus direitos (acesso, retificação, exclusão, portabilidade, oposição), entre em contato: hola@psicoprotego.es.' },
      { title: 'Conformidade regulatória', body: 'Esta política está em conformidade com o Regulamento Geral de Proteção de Dados (RGPD, UE 2016/679) e a legislação de proteção de dados aplicável.' },
      { title: 'Atualizações desta política', body: 'Reservamo-nos o direito de atualizar esta política de privacidade. Mudanças significativas serão comunicadas nesta página.' },
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
