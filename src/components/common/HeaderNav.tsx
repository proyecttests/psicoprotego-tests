'use client'

/**
 * @file components/common/HeaderNav.tsx
 * @description Enlaces de la cabecera al blog y a la web de Psicoprotego.
 * Se ocultan durante el test (/play): una pregunta por pantalla, sin distracciones (ux-rules.md).
 */

import React from 'react'
import { usePathname } from 'next/navigation'
import { BLOG_URL, MAIN_SITE_URL } from '@/config/site'

const HeaderNav: React.FC = () => {
  const pathname = usePathname()
  if (pathname?.endsWith('/play')) return null

  return (
    <nav aria-label="Psicoprotego" className="flex items-center gap-4 text-sm font-medium">
      <a href={BLOG_URL} className="hover:underline" style={{ color: 'var(--color-primary)' }}>
        Artículos
      </a>
      <a href={MAIN_SITE_URL} className="hover:underline" style={{ color: 'var(--color-primary)' }}>
        Psicoprotego
      </a>
    </nav>
  )
}

export default HeaderNav
