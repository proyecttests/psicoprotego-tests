import { redirect } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { VALID_LANGS } from '@/generated/validLangs'
import { LangHtmlUpdater } from '../components/LangHtmlUpdater'

// ── Constantes ────────────────────────────────────────────────────────────────

const RTL_LANGS = ['ar', 'he', 'ku'] as const

// ── Layout ────────────────────────────────────────────────────────────────────

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!VALID_LANGS.includes(lang)) redirect('/es')

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
        <Footer showCrisisFooter={false} lang={lang} />
      </div>
    </>
  )
}
