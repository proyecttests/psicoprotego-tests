/**
 * @file components/ads/AdStrategy.tsx
 * @description Renderiza slots de anuncio según la config de /public/data/ads.config.json.
 *
 * El componente lee la categoría del test y la posición solicitada.
 * Si esa posición está configurada para esa categoría, renderiza <AdSlot>.
 * Si no, no renderiza nada.
 *
 * Uso:
 *   <AdStrategy category="psychometric" position="pre-test" />
 *   <AdStrategy category="quiz" position="post-share" />
 *
 * Para cambiar qué ads aparecen, editar /public/data/ads.config.json — sin tocar código.
 */

import AdSlot, { type AdPosition, type AdSize } from './AdSlot'
import adsConfig from '../../../public/data/ads.config.json'

// ── Tipos ─────────────────────────────────────────────────────────────────────

type TestCategory = 'psychometric' | 'quiz'

interface SlotConfig {
  position: AdPosition
  size: AdSize
}

interface AdStrategyProps {
  category: TestCategory
  position: AdPosition
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function AdStrategy({ category, position }: AdStrategyProps) {
  const slots = (adsConfig[category]?.slots ?? []) as SlotConfig[]
  const slot = slots.find((s) => s.position === position)
  if (!slot) return null

  return <AdSlot position={slot.position} size={slot.size} />
}
