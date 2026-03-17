/**
 * @file components/common/LangSwitcher.tsx
 * @description Selector de idioma para la página inicial de cada test.
 * Muestra solo los idiomas disponibles para ese test concreto.
 * Navega a /:lang/test/:testId al seleccionar.
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'

// ── Props ─────────────────────────────────────────────────────────────────────

interface LangSwitcherProps {
  currentLang: string
  testId: string
  availableLangs: string[]
}

// ── Etiquetas nativas por código ISO ─────────────────────────────────────────

const LANG_LABELS: Record<string, string> = {
  es: 'ES',
  en: 'EN',
  pt: 'PT',
  fr: 'FR',
  de: 'DE',
  it: 'IT',
  ar: 'AR',
  he: 'HE',
  ku: 'KU',
  tr: 'TR',
  el: 'EL',
  hi: 'HI',
  ja: 'JA',
  ko: 'KO',
}

// ── Componente ────────────────────────────────────────────────────────────────

const LangSwitcher: React.FC<LangSwitcherProps> = ({ currentLang, testId, availableLangs }) => {
  const navigate = useNavigate()

  if (availableLangs.length <= 1) return null

  return (
    <div
      role="navigation"
      aria-label="Seleccionar idioma"
      className="flex items-center gap-2 flex-wrap"
    >
      {availableLangs.map((lang) => {
        const isActive = lang === currentLang
        return (
          <button
            key={lang}
            type="button"
            onClick={() => navigate(`/${lang}/test/${testId}`, { replace: true })}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`Cambiar idioma a ${lang.toUpperCase()}`}
            className={[
              'min-w-[40px] rounded-full px-3 py-1 text-xs font-semibold font-sans',
              'border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
              isActive
                ? 'border-transparent text-white'
                : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700',
            ].join(' ')}
            style={
              isActive
                ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)' }
                : undefined
            }
          >
            {LANG_LABELS[lang] ?? lang.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

export default LangSwitcher
