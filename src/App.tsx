/**
 * @file App.tsx
 * @description Componente raíz. Define las rutas principales de la aplicación
 * usando React Router v6.
 */

import { Routes, Route, Navigate, Link } from 'react-router-dom'
import TestContainer from '@/components/test-framework/TestContainer'

/**
 * Página de inicio temporal con navegación al test GAD-7.
 */
const HomePage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8">
    <div className="card max-w-md w-full text-center">
      <h1 className="text-2xl font-bold text-brand-700 mb-2">Psicoprotego</h1>
      <p className="text-gray-500 text-sm mb-6">
        Plataforma de evaluación psicológica — Tests validados clínicamente
      </p>
      <Link
        to="/test/gad7"
        className="btn-primary inline-block w-full"
      >
        Iniciar GAD-7 →
      </Link>
      <p className="mt-4 text-xs text-gray-400">
        Stack: React 18 · Vite · Tailwind CSS · TypeScript · React Router v6
      </p>
    </div>
  </div>
)

/**
 * App — componente raíz con enrutamiento.
 *
 * Rutas:
 *  /            → Inicio / bienvenida
 *  /test/:id    → Test dinámico (cualquier test por ID)
 *  *            → Redirect a /
 */
function App() {
  return (
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/test/gad7" element={<TestContainer testId="gad7" lang="es" />} />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
