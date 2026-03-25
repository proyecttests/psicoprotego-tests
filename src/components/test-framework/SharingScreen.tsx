/**
 * @file components/test-framework/SharingScreen.tsx
 * @description Panel de compartir resultados.
 *
 * Botones primarios: WhatsApp, TikTok, Instagram.
 * TikTok e Instagram usan Web Share API (selector nativo del OS en móvil).
 * En escritorio sin Web Share API: copia el enlace al portapapeles.
 * Botones secundarios: Twitter/X, Copiar enlace.
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
  tiktok: string
  instagram: string
  twitter: string
  copy: string
  copied: string
  back: string
  mobileHint: string
}> = {
  es: {
    title:      'Compartir resultados',
    subtitle:   'Elige cómo quieres compartir tu resultado',
    shareText:  'Acabo de completar este test psicológico. ¿Lo intentas tú también?',
    whatsapp:   'WhatsApp',
    tiktok:     'TikTok',
    instagram:  'Instagram',
    twitter:    'Twitter / X',
    copy:       'Copiar enlace',
    copied:     '¡Copiado!',
    back:       'Volver a resultados',
    mobileHint: 'Se abrirá el selector de apps',
  },
  en: {
    title:      'Share your results',
    subtitle:   'Choose how to share your result',
    shareText:  'I just completed this psychological test. Want to try?',
    whatsapp:   'WhatsApp',
    tiktok:     'TikTok',
    instagram:  'Instagram',
    twitter:    'Twitter / X',
    copy:       'Copy link',
    copied:     'Copied!',
    back:       'Back to results',
    mobileHint: 'App selector will open',
  },
  pt: {
    title:      'Compartilhar resultados',
    subtitle:   'Escolha como compartilhar seu resultado',
    shareText:  'Acabei de completar este teste psicológico. Quer tentar?',
    whatsapp:   'WhatsApp',
    tiktok:     'TikTok',
    instagram:  'Instagram',
    twitter:    'Twitter / X',
    copy:       'Copiar link',
    copied:     'Copiado!',
    back:       'Voltar aos resultados',
    mobileHint: 'O seletor de apps será aberto',
  },
  ku: {
    title:      'ئەنجامەکان بڵاوبکەرەوە',
    subtitle:   'هەڵبژێرە چۆن ئەنجامەکەت بڵاوبکەیتەوە',
    shareText:  'ئەم کوێزی پسیکۆلۆژیم تازە تەواو کرد. تۆیش هەوڵ بدە؟',
    whatsapp:   'WhatsApp',
    tiktok:     'TikTok',
    instagram:  'Instagram',
    twitter:    'Twitter / X',
    copy:       'لینکەکە کۆپی بکە',
    copied:     'کۆپیکرا!',
    back:       'گەڕانەوە بۆ ئەنجامەکان',
    mobileHint: 'هەڵبژاردەری ئەپ دەکرێتەوە',
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
  const ui = UI[lang] ?? UI['es']
  const [copied, setCopied] = React.useState(false)
  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share

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

  const handleNative = async (platform: 'tiktok' | 'instagram') => {
    trackEvent(`share_${platform}`, { shareUrl })
    if (hasNativeShare) {
      try {
        await navigator.share({ title: ui.title, text: ui.shareText, url: shareUrl })
      } catch { /* user cancelled */ }
    } else {
      // Desktop fallback: copy to clipboard
      await handleCopy(true)
    }
  }

  const handleCopy = async (silent = false) => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      trackEvent('share_copy', { shareUrl })
      if (!silent) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
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

        {/* Primary buttons: WhatsApp + TikTok + Instagram */}
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

          {/* TikTok */}
          <button
            type="button"
            onClick={() => handleNative('tiktok')}
            className="flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition active:opacity-80"
            style={{ backgroundColor: '#010101' }}
            title={!hasNativeShare ? ui.mobileHint : undefined}
          >
            {/* TikTok icon */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.84 4.84 0 01-1.01-.07z"/>
            </svg>
            {ui.tiktok}
          </button>

          {/* Instagram */}
          <button
            type="button"
            onClick={() => handleNative('instagram')}
            className="flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white transition active:opacity-80"
            style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
            title={!hasNativeShare ? ui.mobileHint : undefined}
          >
            {/* Instagram icon */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            {ui.instagram}
          </button>
        </div>

        {/* Secondary: Twitter + Copy */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleTwitter}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition active:opacity-80"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            {ui.twitter}
          </button>

          <button
            type="button"
            onClick={() => handleCopy()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition active:opacity-80"
            style={{ borderColor: '#e5e7eb', color: copied ? '#16a34a' : '#374151' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" aria-hidden="true">
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
