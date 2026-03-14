/**
 * @file App.tsx
 * @description Componente raíz. Define las rutas principales de la aplicación
 * usando React Router v6.
 */

import { Routes, Route, Navigate } from 'react-router-dom'

// ── Páginas (se crearán en FASE 2) ─────────────────────────────────────────
// import HomePage    from '@/pages/HomePage'
// import TestPage    from '@/pages/TestPage'
// import ResultsPage from '@/pages/ResultsPage'

/**
 * Placeholder temporal hasta implementar las páginas reales.
 */
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8">
    <div className="card max-w-md w-full text-center">
      <h1 className="text-2xl font-bold text-brand-700 mb-2">Psicoprotego</h1>
      <p className="text-gray-500 text-sm mb-4">GAD-7 — Evaluación de ansiedad generalizada</p>
      <div className="rounded-lg bg-brand-50 px-4 py-3">
        <p className="text-brand-700 font-medium">{title}</p>
      </div>
      <p className="mt-4 text-xs text-gray-400">
        Stack: React 18 · Vite · Tailwind CSS · TypeScript · React Router v6
      </p>
    </div>
  </div>
)

/**
 * App — componente raíz con enrutamiento.
 *
 * Rutas planificadas:
 *  /          → Inicio / bienvenida
 *  /test      → Cuestionario GAD-7
 *  /results   → Resultados e interpretación
 */
function App() {
  return (
    <Routes>
      {/* Ruta principal */}
      <Route path="/" element={<PlaceholderPage title="Inicio — FASE 1 completada" />} />

      {/* Rutas futuras */}
      <Route path="/test"    element={<PlaceholderPage title="Test GAD-7 (próximamente)" />} />
      <Route path="/results" element={<PlaceholderPage title="Resultados (próximamente)" />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
