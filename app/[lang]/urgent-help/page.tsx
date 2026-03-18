import HelpResourcesPage from '@/views/HelpResourcesPage'

export default function UrgentHelpRoute({
  params,
}: {
  params: { lang: string }
}) {
  return <HelpResourcesPage lang={params.lang} />
}
