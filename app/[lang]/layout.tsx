import { redirect } from 'next/navigation'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { discoverLangs } from '@/utils/discoverTests'
import { LangHtmlUpdater } from '../components/LangHtmlUpdater'

// ── Constantes ────────────────────────────────────────────────────────────────

const RTL_LANGS = ['ar', 'he', 'ku'] as const

// Cache para no releer el filesystem en cada request
let _validLangsCache: string[] | null = null
async function getValidLangs(): Promise<string[]> {
  if (_validLangsCache) return _validLangsCache
  _validLangsCache = await discoverLangs()
  return _validLangsCache
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

  const validLangs = await getValidLangs()
  if (!validLangs.includes(lang)) redirect('/es')

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
