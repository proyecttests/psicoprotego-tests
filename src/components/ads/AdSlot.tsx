/**
 * @file components/ads/AdSlot.tsx
 * @description Reserva de espacio para anuncios (Phase 1: placeholder sin red).
 *
 * Phase 1: div con dimensiones fijas para prevenir CLS.
 * Phase 2: inyectar código AdSense/red publicitaria según `position`.
 *
 * Uso:
 * ```tsx
 * <AdSlot position="pre-result" size="rectangle" />
 * ```
 */

import React from 'react'

// ── Props ─────────────────────────────────────────────────────────────────────

export type AdPosition = 'intro' | 'pre-result' | 'post-share' | 'test-intro'
export type AdSize     = 'rectangle' | 'banner' | 'leaderboard'

interface AdSlotProps {
  /** Posición semántica del slot (para targeting futuro) */
  position: AdPosition
  /** Tamaño estándar IAB del slot */
  size?: AdSize
}

// ── Dimensiones IAB estándar ──────────────────────────────────────────────────

interface AdDimension {
  width: number
  height: number
  /** Si true, el ancho es max-width (responsive) en lugar de fijo */
  responsive?: boolean
}

const DIMENSIONS: Record<AdSize, AdDimension> = {
  rectangle:   { width: 300, height: 250 },                      // IAB Medium Rectangle
  banner:      { width: 320, height:  50 },                      // IAB Mobile Banner
  leaderboard: { width: 728, height:  90, responsive: true },    // IAB Leaderboard
}

// ── Componente ────────────────────────────────────────────────────────────────

const AdSlot: React.FC<AdSlotProps> = ({ position, size = 'rectangle' }) => {
  const { width, height, responsive } = DIMENSIONS[size]

  const style: React.CSSProperties = responsive
    ? { width: '100%', maxWidth: width, height, minHeight: height }
    : { width, height, minWidth: width, minHeight: height }

  return (
    <div
      aria-hidden="true"
      data-ad-slot={position}
      data-ad-size={size}
      style={style}
      className="mx-auto rounded-lg bg-gray-100 flex items-center justify-center"
    />
  )
}

export default AdSlot
