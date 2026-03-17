/**
 * @file components/test-framework/SharingScreen.tsx
 * @description Pantalla intermedia "Recopilando resultados…"
 *
 * Se muestra tras pulsar compartir por WhatsApp (o futuras acciones de sharing).
 * Contiene un slot publicitario post-share de alto valor.
 * Tras ~1.5s abre la URL destino y llama a `onDone()` para volver a resultados.
 *
 * Diseñado para ser extensible: en el futuro alojará otras acciones de sharing
 * (Twitter/X, copiar enlace con confirmación animada, "enviar a un amigo", etc.)
 */

import React from 'react'
import Header  from '@/components/common/Header'
import Footer  from '@/components/common/Footer'
import AdSlot  from '@/components/ads/AdSlot'

// ── UI strings ────────────────────────────────────────────────────────────────

const STRINGS: Record<string, { title: string; subtitle: string }> = {
  es: { title: 'Recopilando resultados…',            subtitle: 'Preparando tu enlace para compartir' },
  en: { title: 'Preparing your share…',               subtitle: 'Getting your results ready'          },
  pt: { title: 'Preparando compartilhamento…',        subtitle: 'Reunindo seus resultados'             },
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface SharingScreenProps {
  /** Código de idioma para UI strings */
  lang: string
  /** Nombre del test para el Header */
  testName?: string
  /** URL a abrir al finalizar el delay (WhatsApp u otro destino) */
  shareUrl: string
  /** Callback para volver a la pantalla anterior (resultados) */
  onDone: () => void
}

const DELAY_MS = 1500

// ── Componente ────────────────────────────────────────────────────────────────

const SharingScreen: React.FC<SharingScreenProps> = ({ lang, testName, shareUrl, onDone }) => {
  const s = STRINGS[lang] ?? STRINGS['es']

  React.useEffect(() => {
    const id = setTimeout(() => {
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
      onDone()
    }, DELAY_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header testName={testName} />

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-4">
        {/* Indicador + texto */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200"
            style={{ borderTopColor: 'var(--color-primary)' }}
            aria-hidden="true"
          />
          <h2
            className="text-xl font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            {s.title}
          </h2>
          <p className="text-sm text-gray-500 font-sans">{s.subtitle}</p>
        </div>

        {/* Slot publicitario post-share */}
        <AdSlot position="post-share" size="rectangle" />
      </main>

      <Footer showCrisisFooter={false} />
    </div>
  )
}

export default SharingScreen
