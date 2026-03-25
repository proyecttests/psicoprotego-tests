/**
 * @file components/test-framework/SharingScreen.tsx
 * @description Panel de compartir resultados.
 *
 * Muestra opciones de sharing: WhatsApp, Twitter/X, nativo (TikTok/Instagram via
 * Web Share API) y copiar enlace. Incluye slot publicitario post-share.
 *
 * El sharing nativo (navigator.share) abre el selector del SO en móvil,
 * que incluye TikTok, Instagram, Telegram, etc.
 */

'use client'

import React from 'react'
import AdStrategy from '@/components/ads/AdStrategy'
import { trackEvent } from '@/config/analytics'

// ── UI strings ────────────────────────────────────────────────────────────────

const UI: Record<string, {
  title: string
  subtitle: string
  shareText: string
  whatsapp: string
  twitter: string
  native: string
  copy: string
  copied: string
  back: string
  nativeUnavailable: string
}> = {
  es: {
    title:            'Compartir resultados',
    subtitle:         'Elige cómo quieres compartir tu resultado',
    shareText:        'Acabo de completar este test psicológico. ¿Lo intentas tú también?',
    whatsapp:         'WhatsApp',
    twitter:          'Twitter / X',
    native:           'Más opciones',
    copy:             'Copiar enlace',
    copied:           '¡Copiado!',
    back:             'Volver a resultados',
    nativeUnavailable:'Enlace copiado al portapapeles',
  },
  en: {
    title:            'Share your results',
    subtitle:         'Choose how to share your result',
    shareText:        'I just completed this psychological test. Want to try?',
    whatsapp:         'WhatsApp',
    twitter:          'Twitter / X',
    native:           'More options',
    copy:             'Copy link',
    copied:           'Copied!',
    back:             'Back to results',
    nativeUnavailable:'Link copied to clipboard',
  },
  pt: {
    title:            'Compartilhar resultados',
    subtitle:         'Escolha como compartilhar seu resultado',
    shareText:        'Acabei de completar este teste psicológico. Quer tentar?',
    whatsapp:         'WhatsApp',
    twitter:          'Twitter / X',
    native:           'Mais opções',
    copy:             'Copiar link',
    copied:           'Copiado!',
    back:             'Voltar aos resultados',
    nativeUnavailable:'Link copiado para a área de transferência',
  },
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface SharingScreenProps {
  lang: string
  shareUrl: string
  onDone: () => void
  category?: 'psychometric' | 'quiz'
}

// ── Componente ────────────────────────────────────────────────────────────────

const SharingScreen: React.FC<SharingScreenProps> = ({
  lang,
  shareUrl,
  onDone,
  category = 'psychometric',
}) => {
  const ui      = UI[lang] ?? UI['es']
  const [copied, setCopied] = React.useState(false)

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${ui.shareText} ${shareUrl}`)}`
    trackEvent('share_whatsapp', { shareUrl })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleTwitter = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(`${ui.shareText} ${shareUrl}`)}`
    trackEvent('share_twitter', { shareUrl })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleNative = async () => {
    trackEvent('share_native', { shareUrl })
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: ui.title, text: ui.shareText, url: shareUrl })
      } catch {
        // User cancelled — silent fail
      }
    } else {
      // Fallback: copy link
      await handleCopy(true)
    }
  }

  const handleCopy = async (silent = false) => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      if (!silent) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        // Brief native-unavailable feedback could be added here
      }
      trackEvent('share_copy', { shareUrl })
    } catch { /* silent */ }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Ad slot */}
        <div className="flex justify-center">
          <AdStrategy category={category} position="post-share" />
        </div>

        {/* Header */}
        <div className="text-center">
          <h2
            className="text-xl font-semibold font-serif"
            style={{ color: 'var(--color-primary)' }}
          >
            {ui.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500 font-sans">{ui.subtitle}</p>
        </div>

        {/* Sharing buttons */}
        <div className="flex flex-col gap-3">

          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition active:opacity-80"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {ui.whatsapp}
          </button>

          {/* Twitter / X */}
          <button
            type="button"
            onClick={handleTwitter}
            className="flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition active:opacity-80"
            style={{ backgroundColor: '#000000' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            {ui.twitter}
          </button>

          {/* Native share (TikTok, Instagram, etc.) */}
          <button
            type="button"
            onClick={handleNative}
            className="flex items-center justify-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition active:opacity-80"
            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {ui.native}
          </button>

          {/* Copy link */}
          <button
            type="button"
            onClick={() => handleCopy()}
            className="flex items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition active:opacity-80"
            style={{ borderColor: 'var(--color-primary)', color: copied ? '#16a34a' : 'var(--color-primary)', opacity: 0.8 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
              {copied
                ? <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                : <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>
              }
            </svg>
            {copied ? ui.copied : ui.copy}
          </button>
        </div>

        {/* Back */}
        <button
          type="button"
          onClick={onDone}
          className="text-sm underline underline-offset-2 transition-opacity hover:opacity-60 text-center"
          style={{ color: 'var(--color-primary)', opacity: 0.6 }}
        >
          {ui.back}
        </button>

      </div>
    </div>
  )
}

export default SharingScreen
