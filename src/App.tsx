/**
 * @file App.tsx
 * @description Componente raíz con rutas y page tracking via GTM/GA4.
 */

import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import React from 'react'
import TestContainer from '@/components/test-framework/TestContainer'
import { trackPageView } from '@/config/analytics'

/**
 * Página de inicio temporal con navegación al test GAD-7.
 */
const HomePage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8" style={{ backgroundColor: 'var(--color-cream)' }}>
    <div className="card max-w-md w-full text-center">
      <h1 className="text-2xl mb-2">Psicoprotego</h1>
      <p className="text-neutral-600 text-sm mb-6 font-sans">
        Plataforma de evaluación psicológica — Tests validados clínicamente
      </p>
      <Link
        to="/test/gad7"
        className="btn-primary inline-block w-full"
      >
        Iniciar GAD-7 →
      </Link>
    </div>
  </div>
)

/**
 * App — componente raíz con enrutamiento y page tracking automático.
 */
function App() {
  const location = useLocation()

  React.useEffect(() => {
    trackPageView(location.pathname)
  }, [location])

  return (
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/test/gad7" element={<TestContainer testId="gad7" lang="es" />} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
