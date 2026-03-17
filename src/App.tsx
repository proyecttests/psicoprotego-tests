/**
 * @file App.tsx
 * @description Componente raíz con rutas /:lang/test/:testId y page tracking via GTM/GA4.
 */

import { Routes, Route, Navigate, Link, useLocation, useParams } from 'react-router-dom'
import React from 'react'
import TestContainer from '@/components/test-framework/TestContainer'
import { trackPageView } from '@/config/analytics'

const VALID_LANGS = ['es', 'en', 'pt', 'fr', 'de', 'it', 'ar', 'he', 'ku', 'tr', 'el', 'hi', 'ja', 'ko'] as const
const RTL_LANGS = ['ar', 'he', 'ku']

type Lang = typeof VALID_LANGS[number]

function isValidLang(lang: string): lang is Lang {
  return (VALID_LANGS as readonly string[]).includes(lang)
}

/**
 * Página de inicio temporal con navegación al test GAD-7.
 */
const FEATURED_TESTS = [
  { id: 'gad7',  label: 'GAD-7 — Ansiedad Generalizada' },
  { id: 'phq9',  label: 'PHQ-9 — Depresión' },
]

const HomePage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8" style={{ backgroundColor: 'var(--color-cream)' }}>
    <div className="card max-w-md w-full text-center">
      <h1 className="text-2xl mb-2">Psicoprotego</h1>
      <p className="text-neutral-600 text-sm mb-6 font-sans">
        Plataforma de evaluación psicológica — Tests validados clínicamente
      </p>
      <div className="flex flex-col gap-3">
        {FEATURED_TESTS.map((t) => (
          <Link
            key={t.id}
            to={`/es/test/${t.id}`}
            className="btn-primary inline-block w-full"
          >
            {t.label} →
          </Link>
        ))}
      </div>
    </div>
  </div>
)

/**
 * Ruta dinámica /:lang/test/:testId.
 * Valida el idioma y aplica dir="rtl" si corresponde.
 * Redirige a /es/test/:testId si el idioma no es válido.
 */
const TestRoute: React.FC = () => {
  const { lang = 'es', testId = 'gad7' } = useParams<{ lang: string; testId: string }>()

  if (!isValidLang(lang)) {
    return <Navigate to={`/es/test/${testId}`} replace />
  }

  const isRtl = RTL_LANGS.includes(lang)

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <TestContainer testId={testId} lang={lang} />
    </div>
  )
}

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
      {/* Rutas canónicas */}
      <Route path="/"                        element={<HomePage />} />
      <Route path="/:lang/test/:testId"      element={<TestRoute />} />

      {/* Compatibilidad hacia atrás con rutas legacy */}
      <Route path="/:lang/test"              element={<LangTestRedirect />} />
      <Route path="/test/:testId"            element={<LegacyTestRedirect />} />
      <Route path="/tests"                   element={<Navigate to="/es/test/gad7" replace />} />

      {/* Fallback */}
      <Route path="*"                        element={<Navigate to="/" replace />} />
    </Routes>
  )
}

/**
 * Redirige /:lang/test → /:lang/test/gad7
 */
const LangTestRedirect: React.FC = () => {
  const { lang = 'es' } = useParams<{ lang: string }>()
  const target = isValidLang(lang) ? lang : 'es'
  return <Navigate to={`/${target}/test/gad7`} replace />
}

/**
 * Redirige /test/:testId → /es/test/:testId
 */
const LegacyTestRedirect: React.FC = () => {
  const { testId = 'gad7' } = useParams<{ testId: string }>()
  return <Navigate to={`/es/test/${testId}`} replace />
}

export default App
