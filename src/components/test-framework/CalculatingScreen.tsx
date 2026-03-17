/**
 * @file components/test-framework/CalculatingScreen.tsx
 * @description Pantalla intermedia "Calculando resultados…"
 *
 * Se muestra tras pulsar "Ver resultados" durante ~2.5s antes de mostrar
 * el ResultCard. Contiene un slot publicitario pre-result de alto valor.
 *
 * Llama a `onDone()` automáticamente cuando expira el delay.
 */

import React from 'react'
import Header  from '@/components/common/Header'
import Footer  from '@/components/common/Footer'
import AdSlot  from '@/components/ads/AdSlot'

// ── UI strings ────────────────────────────────────────────────────────────────

const STRINGS: Record<string, { title: string; subtitle: string }> = {
  es: { title: 'Calculando resultados…',        subtitle: 'Analizando tus respuestas' },
  en: { title: 'Calculating results…',           subtitle: 'Analyzing your answers'    },
  pt: { title: 'Calculando resultados…',         subtitle: 'Analisando suas respostas' },
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface CalculatingScreenProps {
  lang: string
  testName?: string
  onDone: () => void
}

const DELAY_MS = 2500

// ── Componente ────────────────────────────────────────────────────────────────

const CalculatingScreen: React.FC<CalculatingScreenProps> = ({ lang, testName, onDone }) => {
  const s = STRINGS[lang] ?? STRINGS['es']

  React.useEffect(() => {
    const id = setTimeout(onDone, DELAY_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header testName={testName} />

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-4">
        {/* Spinner + texto */}
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

        {/* Slot publicitario pre-result (máximo valor) */}
        <AdSlot position="pre-result" size="rectangle" />
      </main>

      <Footer showCrisisFooter={false} />
    </div>
  )
}

export default CalculatingScreen
