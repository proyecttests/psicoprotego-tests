/**
 * @file components/landing/RichText.tsx
 * @description Texto de es.content.json — Server Component.
 * Párrafos separados por línea en blanco; dentro de cada uno, **negrita** y citas [n]
 * enlazadas a la referencia `#ref-n` de la sección de validación.
 */

import React from 'react'

const INLINE = /(\*\*[^*]+\*\*|\[\d+\])/g

function renderInline(text: string): React.ReactNode[] {
  return text.split(INLINE).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    const cite = part.match(/^\[(\d+)\]$/)
    if (cite) {
      return (
        <a key={i} href={`#ref-${cite[1]}`} className="underline underline-offset-2" aria-label={`Referencia ${cite[1]}`}>
          [{cite[1]}]
        </a>
      )
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

interface RichTextProps {
  text: string
}

const RichText: React.FC<RichTextProps> = ({ text }) => (
  <div className="flex flex-col gap-4">
    {text.split(/\n\s*\n/).map((para, i) => (
      <p
        key={i}
        className="text-base leading-relaxed"
        style={{ color: 'var(--color-primary)', opacity: 0.88 }}
      >
        {renderInline(para.trim())}
      </p>
    ))}
  </div>
)

export default RichText
