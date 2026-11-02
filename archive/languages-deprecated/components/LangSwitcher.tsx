'use client'

/**
 * @file components/common/LangSwitcher.tsx
 * @description Selector de idioma para la página inicial de cada test.
 * Muestra solo los idiomas disponibles para ese test concreto.
 * Navega a /:lang/test/:testId al seleccionar.
 */

import React from 'react'
import { useRouter } from 'next/navigation'

// ── Props ─────────────────────────────────────────────────────────────────────

interface LangSwitcherProps {
  currentLang: string
  testId: string
  availableLangs: string[]
}

// ── Etiquetas nativas por código ISO ─────────────────────────────────────────

const LANG_LABELS: Record<string, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ar: 'العربية',
  he: 'עברית',
  ku: 'Kurdî',
  tr: 'Türkçe',
  el: 'Ελληνικά',
  hi: 'हिन्दी',
  ja: '日本語',
  ko: '한국어',
}

// ── Componente ────────────────────────────────────────────────────────────────

const LangSwitcher: React.FC<LangSwitcherProps> = ({ currentLang, testId, availableLangs }) => {
  const router = useRouter()

  if (availableLangs.length <= 1) return null

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="lang-switcher" className="text-xs text-gray-400 font-sans">
        🌐
      </label>
      <select
        id="lang-switcher"
        value={currentLang}
        onChange={(e) => router.replace(`/${e.target.value}/test/${testId}`)}
        aria-label="Seleccionar idioma"
        className="
          rounded-lg border border-gray-300 bg-white px-3 py-1.5
          text-sm font-sans text-gray-700
          focus:border-transparent focus:outline-none focus:ring-2
          cursor-pointer
        "
        style={{ ['--tw-ring-color' as string]: 'var(--color-primary)' }}
      >
        {availableLangs.map((lang) => (
          <option key={lang} value={lang}>
            {LANG_LABELS[lang] ?? lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LangSwitcher
