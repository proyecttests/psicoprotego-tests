/**
 * @file components/results/ResultCard.tsx
 * @description Tarjeta de resultados del test psicológico.
 *
 * Renderiza dos tipos de resultado:
 *
 * - NORMAL: score animado (0→final, 600ms), fade-in, categoría destacada,
 *   recomendación visible, botones neutrales.
 *
 * - CRISIS: alerta roja prominente, teléfonos con botones grandes (48px),
 *   animate-pulse en llamadas, sin score.
 */

import React from 'react'
import type { ScoringResult } from '@/utils/scoringFunctions'
import type { TestDefinition, CrisisPhone, CrisisResource } from '@/types/test'

// ── Props ────────────────────────────────────────────────────────────────────

interface ResultCardProps {
  /** Resultado calculado por TestContainer */
  result: ScoringResult
  /** Tipo de resultado: flujo normal o flujo de crisis */
  type: 'NORMAL' | 'CRISIS'
  /** Definición del test (para nombre y contexto) */
  testData: TestDefinition | null
  /** Callback para reiniciar el test */
  onReset: () => void
}

// ── Paleta de colores por categoría ──────────────────────────────────────────

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-300',  badge: 'bg-green-100 text-green-800'  },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300', badge: 'bg-yellow-100 text-yellow-800' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', badge: 'bg-orange-100 text-orange-800' },
  red:    { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-300',    badge: 'bg-red-100 text-red-800'      },
}

// ── Hook: contador animado ────────────────────────────────────────────────────

/** Anima un número de 0 hasta `target` en `duration` ms. */
function useCountUp(target: number, duration = 600): number {
  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => {
    if (target === 0) { setDisplay(0); return }

    const steps    = 20
    const interval = duration / steps
    const increment = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplay(target)
        clearInterval(timer)
      } else {
        setDisplay(Math.round(current))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [target, duration])

  return display
}

// ── Hook: fade-in al montar ───────────────────────────────────────────────────

function useFadeIn(): boolean {
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return visible
}

// ── Sub-componente: NormalResult ──────────────────────────────────────────────

const NormalResult: React.FC<{ result: ScoringResult; onReset: () => void }> = ({
  result,
  onReset,
}) => {
  const visible      = useFadeIn()
  const displayScore = useCountUp(result.score ?? 0)
  const colorKey     = result.category?.color ?? 'green'
  const colors       = COLOR_MAP[colorKey] ?? COLOR_MAP['green']
  const message      = result.message

  // Scroll al inicio al mostrar el resultado
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div
      className={`w-full max-w-2xl space-y-4 px-4 py-6 sm:px-6 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* ── Score + categoría ────────────────────────────────────────────── */}
      <div className={`card text-center ${colors.bg} ${colors.border} border-2`}>
        <div
          aria-label={`Puntuación: ${result.score}`}
          className={`mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full border-4 ${colors.border} ${colors.bg}`}
        >
          <span className={`text-5xl font-extrabold ${colors.text}`}>
            {displayScore}
          </span>
        </div>

        <span className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${colors.badge}`}>
          {result.category?.label}
        </span>
      </div>

      {/* ── Mensaje de resultado ─────────────────────────────────────────── */}
      <div className="card space-y-4">
        <h1 className="text-xl font-bold text-gray-800">{message?.title}</h1>
        <p className="text-sm leading-relaxed text-gray-600" style={{ lineHeight: '1.6' }}>
          {message?.body}
        </p>

        {/* Recomendación destacada */}
        <div className="rounded-lg border border-[#0066CC]/20 bg-blue-50 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#0066CC]">
            Recomendación
          </p>
          <p className="text-sm font-medium leading-relaxed text-blue-900">
            {message?.recommendation}
          </p>
        </div>

        {/* Disclaimer obligatorio */}
        <p className="border-t border-gray-100 pt-3 text-xs italic text-gray-400">
          Estos resultados tienen fines exclusivamente educativos y orientativos.
          No constituyen un diagnóstico clínico ni sustituyen la valoración de un
          profesional de la salud mental.
        </p>
      </div>

      {/* ── Botones ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary w-full sm:w-auto"
          aria-label="Volver a realizar el test"
        >
          ↺ Volver a intentar
        </button>

        <button
          type="button"
          disabled
          className="btn-primary w-full cursor-not-allowed opacity-50 sm:w-auto"
          aria-label="Compartir resultado (próximamente)"
          title="Función próximamente disponible"
        >
          Compartir resultados
        </button>
      </div>
    </div>
  )
}

// ── Sub-componente: CrisisResult ──────────────────────────────────────────────

const CrisisResult: React.FC<{ result: ScoringResult; onReset: () => void }> = ({
  result,
  onReset,
}) => {
  const visible   = useFadeIn()
  const message   = result.message
  const phones    = (message?.phones    ?? []) as CrisisPhone[]
  const resources = (message?.resources ?? []) as CrisisResource[]

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div
      className={`w-full max-w-2xl space-y-4 px-4 py-6 sm:px-6 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* ── Alerta de crisis ─────────────────────────────────────────────── */}
      <div
        role="alert"
        className="rounded-xl border-2 border-red-400 bg-red-50 p-6 text-center shadow-md"
      >
        <p aria-hidden="true" className="mb-3 text-5xl">⚠️</p>
        <h1 className="text-xl font-extrabold uppercase tracking-wide text-red-800">
          {message?.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-red-700" style={{ lineHeight: '1.6' }}>
          {message?.body}
        </p>
      </div>

      {/* ── Teléfonos de crisis ──────────────────────────────────────────── */}
      <div className="card space-y-3">
        <h2 className="text-base font-semibold text-gray-700">
          Llama ahora — es gratuito y confidencial
        </h2>

        {phones.map((phone: CrisisPhone, i: number) => (
          <a
            key={i}
            href={`tel:${phone.number}`}
            className="
              flex min-h-[48px] items-center justify-between gap-3 rounded-xl
              border-2 border-red-400 bg-red-600 px-5 py-4
              text-white shadow-sm transition-colors
              hover:bg-red-700
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              animate-pulse
            "
            aria-label={`Llamar al ${phone.number} — ${phone.label}`}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="text-xl">📞</span>
              <span>
                <span className="text-2xl font-extrabold tracking-wider">{phone.number}</span>
                <span className="ml-3 text-sm font-medium opacity-90">{phone.label}</span>
              </span>
            </span>
            <span aria-hidden="true" className="text-red-200">→</span>
          </a>
        ))}
      </div>

      {/* ── Recursos adicionales ─────────────────────────────────────────── */}
      {resources.length > 0 && (
        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Más recursos de apoyo</h2>
          <ul className="space-y-2">
            {resources.map((resource: CrisisResource, i: number) => (
              <li key={i}>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#0066CC] underline hover:text-blue-800 focus:outline-none focus:ring-1 focus:ring-[#0066CC] rounded"
                  >
                    {resource.label}
                  </a>
                ) : (
                  <span className="text-sm text-gray-600">{resource.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Botones de acción directa ────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="tel:024"
          className="
            flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg
            bg-red-700 px-5 py-3 text-sm font-bold text-white shadow-sm
            transition-colors hover:bg-red-800
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          "
          aria-label="Llamar al 024 ahora"
        >
          <span aria-hidden="true">📞</span> Llamar al 024
        </a>
        <a
          href="tel:112"
          className="
            flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg
            border-2 border-red-400 px-5 py-3 text-sm font-bold text-red-700
            transition-colors hover:bg-red-50
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          "
          aria-label="Llamar al 112 ahora"
        >
          <span aria-hidden="true">📞</span> Llamar al 112
        </a>
      </div>

      {/* Volver al inicio */}
      <div className="text-center">
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-400 underline hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded"
        >
          Volver al inicio del test
        </button>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

/**
 * ResultCard — renderizador de resultados del test.
 *
 * Detecta el tipo del resultado (NORMAL | CRISIS) y delega
 * al sub-componente correspondiente.
 *
 * @param result   - Resultado calculado (ScoringResult)
 * @param type     - Tipo de resultado ('NORMAL' | 'CRISIS')
 * @param testData - Definición del test
 * @param onReset  - Reiniciar el test
 */
const ResultCard: React.FC<ResultCardProps> = ({ result, type, onReset }) => {
  if (type === 'CRISIS') {
    return <CrisisResult result={result} onReset={onReset} />
  }
  return <NormalResult result={result} onReset={onReset} />
}

export default ResultCard
