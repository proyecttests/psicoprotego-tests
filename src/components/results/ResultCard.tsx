/**
 * @file components/results/ResultCard.tsx
 * @description Tarjeta de resultados del test psicológico.
 *
 * Renderiza dos tipos de resultado:
 *
 * - NORMAL: muestra el score, categoría, título, cuerpo y recomendación.
 *   Con disclaimer de "no es diagnóstico" y botones de acción.
 *
 * - CRISIS: muestra aviso de ayuda inmediata, teléfonos de crisis y
 *   recursos. NO muestra score. Botones de llamada directa.
 */

import React from 'react'
import type {
  TestResult,
  TestDefinition,
  NormalMessage,
  CrisisMessage,
  CrisisPhone,
  CrisisResource,
} from '@/types/test'

// ── Props ────────────────────────────────────────────────────────────────────

interface ResultCardProps {
  /** Resultado calculado por TestContainer */
  result: TestResult
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

// ── Sub-componentes ───────────────────────────────────────────────────────────

/**
 * Renderiza la tarjeta para resultados de tipo NORMAL.
 */
const NormalResult: React.FC<{
  result: TestResult
  message: NormalMessage
  onReset: () => void
}> = ({ result, message, onReset }) => {
  const colors = COLOR_MAP[result.color ?? 'green']

  return (
    <div className="w-full max-w-2xl space-y-4 px-4 py-6 sm:px-6">

      {/* ── Score grande + categoría ────────────────────────────────────── */}
      <div className={`card text-center ${colors.bg} ${colors.border} border-2`}>
        <div
          aria-label={`Puntuación: ${result.score}`}
          className={`mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-full border-4 ${colors.border} ${colors.bg}`}
        >
          <span className={`text-5xl font-extrabold ${colors.text}`}>
            {result.score}
          </span>
        </div>

        <span className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${colors.badge}`}>
          {result.category}
        </span>
      </div>

      {/* ── Mensaje resultado ───────────────────────────────────────────── */}
      <div className="card space-y-4">
        <h1 className="text-xl font-bold text-gray-800">{message.title}</h1>
        <p className="text-sm leading-relaxed text-gray-600">{message.body}</p>

        {/* Recomendación */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            Recomendación
          </p>
          <p className="text-sm leading-relaxed text-blue-800">{message.recommendation}</p>
        </div>

        {/* Disclaimer obligatorio */}
        <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-3">
          Estos resultados tienen fines exclusivamente educativos y orientativos.
          No constituyen un diagnóstico clínico ni sustituyen la valoración de un
          profesional de la salud mental.
        </p>
      </div>

      {/* ── Botones de acción ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary w-full sm:w-auto"
          aria-label="Volver a realizar el test"
        >
          ↺ Volver a intentar
        </button>

        {/* Compartir: deshabilitado por ahora */}
        <button
          type="button"
          disabled
          className="btn-primary w-full sm:w-auto opacity-50 cursor-not-allowed"
          aria-label="Compartir resultado (próximamente)"
          title="Función próximamente disponible"
        >
          Compartir resultados
        </button>
      </div>
    </div>
  )
}

/**
 * Renderiza la tarjeta para resultados de tipo CRISIS.
 * NO muestra score. Muestra teléfonos y recursos de ayuda.
 */
const CrisisResult: React.FC<{
  message: CrisisMessage
  onReset: () => void
}> = ({ message, onReset }) => {
  return (
    <div className="w-full max-w-2xl space-y-4 px-4 py-6 sm:px-6">

      {/* ── Alerta de crisis ────────────────────────────────────────────── */}
      <div
        role="alert"
        className="rounded-xl border-2 border-red-400 bg-red-50 p-6 text-center shadow-md"
      >
        <p aria-hidden="true" className="text-5xl mb-3">⚠️</p>
        <h1 className="text-xl font-extrabold text-red-700 uppercase tracking-wide">
          {message.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-red-700">{message.body}</p>
      </div>

      {/* ── Teléfonos de crisis ─────────────────────────────────────────── */}
      <div className="card space-y-3">
        <h2 className="text-base font-semibold text-gray-700">
          Llama ahora — es gratuito y confidencial
        </h2>

        {(message as CrisisMessage).phones.map((phone: CrisisPhone, i: number) => (
          <a
            key={i}
            href={`tel:${phone.number}`}
            className="
              flex items-center justify-between gap-3 rounded-xl border-2 border-red-400
              bg-red-600 px-5 py-4 text-white shadow-sm
              hover:bg-red-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
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

      {/* ── Recursos adicionales ────────────────────────────────────────── */}
      {(message as CrisisMessage).resources.length > 0 && (
        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Más recursos de apoyo
          </h2>
          <ul className="space-y-2">
            {(message as CrisisMessage).resources.map((resource: CrisisResource, i: number) => (
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

      {/* ── Acciones ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="tel:024"
          className="btn-primary flex-1 text-center bg-red-600 hover:bg-red-700 focus:ring-red-500"
          aria-label="Llamar al 024 ahora"
        >
          📞 Llamar al 024
        </a>
        <a
          href="tel:112"
          className="btn-secondary flex-1 text-center border-red-400 text-red-700 hover:bg-red-50"
          aria-label="Llamar al 112 ahora"
        >
          📞 Llamar al 112
        </a>
      </div>

      {/* Volver a intentar */}
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
 * @param result   - Resultado calculado (score, type, message…)
 * @param testData - Definición del test (nombre, etc.)
 * @param onReset  - Reiniciar el test
 * @returns Tarjeta de resultado apropiada al tipo
 */
const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  if (result.type === 'CRISIS') {
    return (
      <CrisisResult
        message={result.message as CrisisMessage}
        onReset={onReset}
      />
    )
  }

  return (
    <NormalResult
      result={result}
      message={result.message as NormalMessage}
      onReset={onReset}
    />
  )
}

export default ResultCard
