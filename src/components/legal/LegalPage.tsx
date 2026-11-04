/**
 * @file components/legal/LegalPage.tsx
 * @description Páginas legales e informativas (aviso legal, condiciones, privacidad, cookies,
 * acerca de) — Server Component.
 * En `body`: párrafos separados por línea en blanco, listas con líneas que empiezan por «- »,
 * **negrita** y enlaces [texto](url). Cada sección puede llevar además una tabla.
 */

import React from 'react'
import Link from 'next/link'

export interface LegalSection {
  title: string
  body: string
  table?: { head: string[]; rows: string[][] }
}

export interface LegalContent {
  metaTitle: string
  metaDescription: string
  heading: string
  /** Fecha de la última actualización, tal como se muestra (ej. «4 de noviembre de 2026») */
  updated?: string
  sections: LegalSection[]
}

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g

function renderInline(text: string): React.ReactNode[] {
  return text.split(INLINE).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (link) {
      const [, label, href] = link
      const className = 'underline underline-offset-2'
      const style = { color: 'var(--color-accent)' }
      return href.startsWith('/')
        ? <Link key={i} href={href} className={className} style={style}>{label}</Link>
        : <a key={i} href={href} className={className} style={style} rel="noopener">{label}</a>
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

function renderBlock(block: string, key: number): React.ReactNode {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.every((l) => l.startsWith('- '))) {
    return (
      <ul key={key} className="list-disc space-y-1 pl-5 text-neutral-700 leading-relaxed">
        {lines.map((l, i) => <li key={i}>{renderInline(l.slice(2))}</li>)}
      </ul>
    )
  }
  return <p key={key} className="text-neutral-700 leading-relaxed">{renderInline(lines.join(' '))}</p>
}

const LegalPage: React.FC<{ content: LegalContent }> = ({ content: c }) => (
  <div style={{ backgroundColor: 'var(--color-cream)' }} className="min-h-screen py-12">
    <div className="mx-auto max-w-2xl px-4">
      <h1
        className="font-['Source_Serif_4',serif] text-4xl font-bold mb-10"
        style={{ color: 'var(--color-primary)' }}
      >
        {c.heading}
      </h1>

      <div className="flex flex-col gap-8">
        {c.sections.map((s) => (
          <section key={s.title}>
            <h2
              className="font-['Source_Serif_4',serif] text-xl font-semibold mb-2"
              style={{ color: 'var(--color-primary)' }}
            >
              {s.title}
            </h2>
            <div className="flex flex-col gap-3">
              {s.body.split(/\n\s*\n/).map((block, i) => renderBlock(block, i))}
            </div>
            {s.table && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-700">
                  <thead>
                    <tr>
                      {s.table.head.map((h) => (
                        <th key={h} className="border-b border-neutral-300 px-2 py-2 font-semibold" style={{ color: 'var(--color-primary)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, i) => (
                          <td key={i} className="border-b border-neutral-200 px-2 py-2 align-top">{renderInline(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      {c.updated && (
        <p className="mt-10 text-sm text-neutral-500">Última actualización: {c.updated}</p>
      )}
    </div>
  </div>
)

export default LegalPage
