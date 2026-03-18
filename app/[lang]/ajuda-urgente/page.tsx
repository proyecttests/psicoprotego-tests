import HelpResourcesPage from '@/views/HelpResourcesPage'

export default function AjudaUrgenteRoute({
  params,
}: {
  params: { lang: string }
}) {
  return <HelpResourcesPage lang={params.lang} />
}
