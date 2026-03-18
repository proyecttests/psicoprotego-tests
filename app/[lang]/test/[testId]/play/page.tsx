'use client'

/**
 * @file app/[lang]/test/[testId]/play/page.tsx
 * @description Página del test interactivo — Client Component.
 *
 * Protección de acceso directo: si el usuario llega a /play sin
 * haber pasado por /start (que escribe en sessionStorage), se redirige
 * a la landing del test.
 *
 * El sessionStorage token se limpia tras la comprobación inicial para
 * que recargar /play redirija a /start, forzando el flujo correcto.
 */

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import TestContainer from '@/components/test-framework/TestContainer'

export default function TestPlayRoute() {
  const { lang = 'es', testId = 'gad7' } = useParams<{ lang: string; testId: string }>()
  const router = useRouter()

  // null = comprobando, true = autorizado, false = no autorizado
  const [authorized, setAuthorized] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const token = sessionStorage.getItem('test_access_granted')

    if (token === testId) {
      // Limpiar el token para que no se pueda hacer bookmark de /play
      sessionStorage.removeItem('test_access_granted')
      setAuthorized(true)
    } else {
      // No vino desde /start → redirigir a la landing
      router.replace(`/${lang}/test/${testId}`)
    }
  }, [testId, lang, router])

  // Mientras se comprueba el token, no renderizar nada
  if (!authorized) return null

  return <TestContainer testId={testId} lang={lang} />
}
