/**
 * @file components/test-framework/UrgentHelpLine.tsx
 * @description Ayuda urgente mientras se responde un test: una línea fija abajo, siempre visible,
 * que sustituye al pie (oculto en modo test para ganar pantalla; decisión de Emmanuel,
 * 2026-11-20). Teléfonos escritos y pulsables, y enlace a /ayuda-urgente en otra pestaña.
 */

import React from 'react'
import { getCrisisPhone } from '@/config/crisisPhones'

const EMERGENCY = getCrisisPhone('112')
const SUICIDE   = getCrisisPhone('024')

const UrgentHelpLine: React.FC<{ lang: string }> = ({ lang }) => (
  <div
    className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 px-3 py-1.5 text-center text-sm font-sans"
    style={{ backgroundColor: 'var(--color-cream)', color: 'var(--color-primary)', paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
  >
    <span className="font-semibold">Ayuda urgente:</span>{' '}
    <a href={`tel:${EMERGENCY.tel}`} className="font-bold underline underline-offset-2">{EMERGENCY.number}</a>
    {' · '}
    <a href={`tel:${SUICIDE.tel}`} className="font-bold underline underline-offset-2">{SUICIDE.number}</a>
    {' · '}
    {/* En otra pestaña: abrirla no borra las respuestas del test */}
    <a href={`/${lang}/ayuda-urgente`} target="_blank" rel="noopener" className="underline underline-offset-2" style={{ color: 'var(--color-accent)' }}>
      Más recursos
    </a>
  </div>
)

export default UrgentHelpLine
