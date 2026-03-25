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

'use client'

import React from 'react'
import AdStrategy from '@/components/ads/AdStrategy'

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
  /** URL a abrir al finalizar el delay (WhatsApp u otro destino) */
  shareUrl: string
  /** Callback para volver a la pantalla anterior (resultados) */
  onDone: () => void
  category?: 'psychometric' | 'quiz'
}

const DELAY_MS = 1500

// ── Componente ────────────────────────────────────────────────────────────────

const SharingScreen: React.FC<SharingScreenProps> = ({ lang, shareUrl, onDone, category = 'psychometric' }) => {
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
    <div className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-8">
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
      <AdStrategy category={category} position="post-share" />
    </div>
  )
}

export default SharingScreen
