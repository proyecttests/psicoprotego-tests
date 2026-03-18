import HelpResourcesPage from '@/views/HelpResourcesPage'

export default function AyudaUrgenteRoute({
  params,
}: {
  params: { lang: string }
}) {
  return <HelpResourcesPage lang={params.lang} />
}
