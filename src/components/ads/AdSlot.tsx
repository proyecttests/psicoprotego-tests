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

export type AdPosition = 'intro' | 'pre-result' | 'post-share'
export type AdSize     = 'rectangle' | 'banner'

interface AdSlotProps {
  /** Posición semántica del slot (para targeting futuro) */
  position: AdPosition
  /** Tamaño estándar IAB del slot */
  size?: AdSize
}

// ── Dimensiones IAB estándar ──────────────────────────────────────────────────

const DIMENSIONS: Record<AdSize, { width: number; height: number }> = {
  rectangle: { width: 300, height: 250 }, // IAB Medium Rectangle
  banner:    { width: 320, height:  50 }, // IAB Mobile Banner
}

// ── Componente ────────────────────────────────────────────────────────────────

const AdSlot: React.FC<AdSlotProps> = ({ position, size = 'rectangle' }) => {
  const { width, height } = DIMENSIONS[size]

  return (
    <div
      aria-hidden="true"
      data-ad-slot={position}
      data-ad-size={size}
      style={{ width, height, minWidth: width, minHeight: height }}
      className="mx-auto rounded-lg bg-gray-100 flex items-center justify-center"
    />
  )
}

export default AdSlot
