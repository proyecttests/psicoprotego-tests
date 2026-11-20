'use client'

/**
 * @file components/common/TextSizeControl.tsx
 * @description Botón «A+»: agranda todo el texto en tres pasos (100 %, 115 %, 130 %) cambiando el
 * tamaño de letra raíz (Tailwind mide en rem). La elección se guarda en localStorage
 * (`psico_text_size`, técnica: comodidad de quien lee) y se aplica al cargar cada página.
 */

import React from 'react'

export const TEXT_SIZE_KEY = 'psico_text_size'
const STEPS = [100, 115, 130]

function applySize(pct: number) {
  document.documentElement.style.fontSize = pct === 100 ? '' : `${pct}%`
}

function readSize(): number {
  try {
    const n = Number(localStorage.getItem(TEXT_SIZE_KEY))
    return STEPS.includes(n) ? n : 100
  } catch {
    return 100
  }
}

/** Aplica el tamaño guardado al montar (va en el layout de idioma). */
export const TextSizeInit: React.FC = () => {
  React.useEffect(() => { applySize(readSize()) }, [])
  return null
}

const TextSizeControl: React.FC<{ className?: string; compact?: boolean }> = ({ className = '', compact = false }) => {
  const [size, setSize] = React.useState(100)
  React.useEffect(() => { setSize(readSize()) }, [])

  const next = STEPS[(STEPS.indexOf(size) + 1) % STEPS.length]
  const cycle = () => {
    setSize(next)
    applySize(next)
    try {
      if (next === 100) localStorage.removeItem(TEXT_SIZE_KEY)
      else localStorage.setItem(TEXT_SIZE_KEY, String(next))
    } catch { /* sin almacenamiento: vale para esta página */ }
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className={`inline-flex ${compact ? 'h-7 min-w-[2.25rem]' : 'h-9 min-w-[2.75rem]'} items-center justify-center rounded-lg border border-gray-300 bg-white px-2 font-semibold focus:outline-none focus-visible:ring-2 ${className}`}
      style={{ color: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
      aria-label={size === 130 ? 'Volver al tamaño de letra normal' : 'Aumentar el tamaño de la letra'}
      title={size === 130 ? 'Tamaño normal' : 'Letra más grande'}
    >
      {size === 130 ? <span className="text-sm">A</span> : <span><span className="text-sm">A</span><span className="text-xs align-top">+</span></span>}
    </button>
  )
}

export default TextSizeControl
