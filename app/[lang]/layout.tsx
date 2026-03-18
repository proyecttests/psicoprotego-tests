import { redirect } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { LangHtmlUpdater } from '../components/LangHtmlUpdater'

// ── Constantes ────────────────────────────────────────────────────────────────

const VALID_LANGS = ['es', 'en', 'pt'] as const
const RTL_LANGS   = ['ar', 'he', 'ku'] as const

type ValidLang = typeof VALID_LANGS[number]

function isValidLang(lang: string): lang is ValidLang {
  return (VALID_LANGS as readonly string[]).includes(lang)
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!isValidLang(lang)) redirect('/es')

  const dir = (RTL_LANGS as readonly string[]).includes(lang) ? 'rtl' : 'ltr'

  return (
    <>
      {/* Actualiza <html lang> y <html dir> en cliente tras hidratación */}
      <LangHtmlUpdater lang={lang} dir={dir} />

      <div dir={dir} className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer showCrisisFooter={false} />
      </div>
    </>
  )
}
