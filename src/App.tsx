/**
 * @file App.tsx
 * @description Enrutamiento principal de la aplicación.
 *
 * Flujo del test (subrutas con historial nativo del navegador):
 *
 *   /:lang/test/:testId         → TestLandingPage  (indexable por Google)
 *   /:lang/test/:testId/start   → TestInterstitial (disclaimer + ad; redirige a landing si acceso directo)
 *   /:lang/test/:testId/play    → TestContainer    (test real; redirige a landing si acceso directo)
 *
 * El botón Atrás funciona correctamente porque cada paso empuja una entrada
 * al historial del navegador con React Router navigate().
 *
 * Protección de acceso directo: cada subruta requiere location.state del paso
 * anterior. Sin él, redirige a la landing.
 */

import { Routes, Route, Navigate, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import React from 'react'
import TestContainer      from '@/components/test-framework/TestContainer'
import TestLandingPage    from '@/pages/TestLandingPage'
import TestInterstitial   from '@/pages/TestInterstitial'
import HelpResourcesPage  from '@/pages/HelpResourcesPage'
import { trackPageView } from '@/config/analytics'

// ── Constantes ────────────────────────────────────────────────────────────────

const VALID_LANGS = ['es', 'en', 'pt', 'fr', 'de', 'it', 'ar', 'he', 'ku', 'tr', 'el', 'hi', 'ja', 'ko'] as const
const RTL_LANGS   = ['ar', 'he', 'ku'] as const

type Lang = typeof VALID_LANGS[number]

function isValidLang(lang: string): lang is Lang {
  return (VALID_LANGS as readonly string[]).includes(lang)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Lee location.state de forma segura (RRv6 lo tipifica como `unknown`).
 * Devuelve las flags de flujo o un objeto vacío.
 */
function getFlowState(state: unknown): { fromLanding?: boolean; fromInterstitial?: boolean } {
  if (state !== null && typeof state === 'object') {
    return state as { fromLanding?: boolean; fromInterstitial?: boolean }
  }
  return {}
}

/**
 * Guarda y aplica dirección RTL al contenedor raíz del test.
 */
const RtlWrapper: React.FC<{ lang: string; children: React.ReactNode }> = ({ lang, children }) => (
  <div dir={RTL_LANGS.includes(lang as typeof RTL_LANGS[number]) ? 'rtl' : 'ltr'}>
    {children}
  </div>
)

// ── HomePage ──────────────────────────────────────────────────────────────────

const FEATURED_TESTS = [
  { id: 'gad7', label: 'GAD-7 — Ansiedad Generalizada' },
  { id: 'phq9', label: 'PHQ-9 — Depresión' },
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

// ── Ruta 1: Landing /:lang/test/:testId ───────────────────────────────────────
//
// URL canónica del test. Google indexa esta página.
// Al pulsar "Iniciar test" → navega a /start con state { fromLanding: true }.

const TestLandingRoute: React.FC = () => {
  const { lang = 'es', testId = 'gad7' } = useParams<{ lang: string; testId: string }>()
  const navigate = useNavigate()

  if (!isValidLang(lang)) return <Navigate to={`/es/test/${testId}`} replace />

  return (
    <RtlWrapper lang={lang}>
      <TestLandingPage
        testId={testId}
        lang={lang}
        onStart={() =>
          navigate(`/${lang}/test/${testId}/start`, {
            state: { fromLanding: true },
          })
        }
      />
    </RtlWrapper>
  )
}

// ── Ruta 2: Intersticial /:lang/test/:testId/start ────────────────────────────
//
// Disclaimer clínico + ad de mayor valor.
// Acceso directo (sin state.fromLanding) → redirige a la landing.
// Botón "Cancelar" → navigate(-1) vuelve a la landing (historial nativo).
// Al aceptar → navega a /play con state { fromInterstitial: true }.

const TestInterstitialRoute: React.FC = () => {
  const { lang = 'es', testId = 'gad7' } = useParams<{ lang: string; testId: string }>()
  const navigate  = useNavigate()
  const location  = useLocation()
  const flowState = getFlowState(location.state)

  if (!isValidLang(lang)) return <Navigate to={`/es/test/${testId}`} replace />

  // Protección de acceso directo: sin pasar por la landing, vuelve a ella
  if (!flowState.fromLanding) return <Navigate to={`/${lang}/test/${testId}`} replace />

  return (
    <RtlWrapper lang={lang}>
      <TestInterstitial
        testId={testId}
        lang={lang}
        onContinue={() =>
          navigate(`/${lang}/test/${testId}/play`, {
            state: { fromInterstitial: true },
          })
        }
        onCancel={() => navigate(-1)}
      />
    </RtlWrapper>
  )
}

// ── Ruta 3: Test /:lang/test/:testId/play ─────────────────────────────────────
//
// El test propiamente dicho (preguntas → resultados).
// Acceso directo (sin state.fromInterstitial) → redirige a la landing,
// asegurando que el usuario siempre vea el disclaimer antes de empezar.

const TestPlayRoute: React.FC = () => {
  const { lang = 'es', testId = 'gad7' } = useParams<{ lang: string; testId: string }>()
  const location  = useLocation()
  const flowState = getFlowState(location.state)

  if (!isValidLang(lang)) return <Navigate to={`/es/test/${testId}`} replace />

  // Protección de acceso directo: sin pasar por el intersticial, vuelve a landing
  if (!flowState.fromInterstitial) return <Navigate to={`/${lang}/test/${testId}`} replace />

  return (
    <RtlWrapper lang={lang}>
      <TestContainer testId={testId} lang={lang} />
    </RtlWrapper>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  const location = useLocation()

  React.useEffect(() => {
    trackPageView(location.pathname)
  }, [location])

  return (
    <Routes>
      {/* Inicio */}
      <Route path="/" element={<HomePage />} />

      {/* Flujo del test: 3 subrutas con historial independiente */}
      <Route path="/:lang/test/:testId"        element={<TestLandingRoute />} />
      <Route path="/:lang/test/:testId/start"  element={<TestInterstitialRoute />} />
      <Route path="/:lang/test/:testId/play"   element={<TestPlayRoute />} />

      {/* Enlace de resultado compartido — redirige a la landing del test */}
      <Route path="/:lang/test/:testId/result" element={<ResultPageRedirect />} />

      {/* Páginas de ayuda urgente — una URL por idioma */}
      <Route path="/es/ayuda-urgente" element={<HelpResourcesPage lang="es" />} />
      <Route path="/en/urgent-help"   element={<HelpResourcesPage lang="en" />} />
      <Route path="/pt/ajuda-urgente" element={<HelpResourcesPage lang="pt" />} />

      {/* Redirects legacy */}
      <Route path="/:lang/test"    element={<LangTestRedirect />} />
      <Route path="/test/:testId"  element={<LegacyTestRedirect />} />
      <Route path="/tests"         element={<Navigate to="/es/test/gad7" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// ── Redirects ─────────────────────────────────────────────────────────────────

/** Enlace de resultado compartido → landing del test (el ?r= se procesa en el futuro). */
const ResultPageRedirect: React.FC = () => {
  const { lang = 'es', testId = 'gad7' } = useParams<{ lang: string; testId: string }>()
  return <Navigate to={`/${isValidLang(lang) ? lang : 'es'}/test/${testId}`} replace />
}

/** /:lang/test → /:lang/test/gad7 */
const LangTestRedirect: React.FC = () => {
  const { lang = 'es' } = useParams<{ lang: string }>()
  return <Navigate to={`/${isValidLang(lang) ? lang : 'es'}/test/gad7`} replace />
}

/** /test/:testId → /es/test/:testId */
const LegacyTestRedirect: React.FC = () => {
  const { testId = 'gad7' } = useParams<{ testId: string }>()
  return <Navigate to={`/es/test/${testId}`} replace />
}

export default App
