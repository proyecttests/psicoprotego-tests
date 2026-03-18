const RTL_LANGS = ['ar', 'he', 'ku']

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr'
  return <div dir={dir}>{children}</div>
}
