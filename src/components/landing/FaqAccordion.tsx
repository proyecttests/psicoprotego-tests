'use client'

import React from 'react'

interface FaqItem {
  q: string
  a: string
}

interface FaqAccordionProps {
  items: FaqItem[]
  title: string
}

export function FaqAccordion({ items, title }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <section className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      <h2
        className="text-xl sm:text-2xl font-semibold"
        style={{ color: 'var(--color-primary)' }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(45,74,62,0.15)' }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
              style={{
                backgroundColor: openIndex === i ? '#fff' : 'var(--color-cream)',
                color: 'var(--color-primary)',
              }}
            >
              <span className="text-sm sm:text-base">{item.q}</span>
              <span
                aria-hidden="true"
                className="flex-shrink-0 transition-transform duration-200 text-lg"
                style={{
                  transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  color: 'var(--color-accent)',
                }}
              >
                +
              </span>
            </button>

            <div
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
              hidden={openIndex !== i}
            >
              <p
                className="px-5 pb-5 pt-2 text-sm sm:text-base leading-relaxed"
                style={{ color: 'var(--color-primary)', opacity: 0.85 }}
              >
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
