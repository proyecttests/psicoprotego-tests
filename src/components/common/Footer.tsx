/**
 * @file components/common/Footer.tsx
 * @description Pie de página de la aplicación.
 * Incluye copyright, enlaces legales, referencias científicas y
 * el teléfono de crisis 024.
 */

import React from 'react'

// ── Constantes ────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear()

/** Referencias científicas del GAD-7 */
const REFERENCES = [
  'Spitzer RL, et al. A brief measure for assessing generalized anxiety disorder. Arch Intern Med. 2006;166(10):1092–7.',
  'García-Campayo J, et al. Validación de la versión española del PHQ-9. Aten Primaria. 2008;40(11):540–7.',
]

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * Footer — pie de página con información legal y recursos.
 *
 * @returns Elemento <footer> con copyright, links, referencias y teléfono 024
 */
const Footer: React.FC = () => {
  return (
    <footer
      className="mt-auto w-full border-t border-gray-200 bg-white"
      role="contentinfo"
    >
      {/* ── Banda de crisis ────────────────────────────────────────────────── */}
      <div className="bg-red-600 px-4 py-2 text-center text-sm font-medium text-white">
        En caso de crisis llama al{' '}
        <a
          href="tel:024"
          className="underline font-bold hover:text-red-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-red-600 rounded"
          aria-label="Llama al 024 — Teléfono de atención a la conducta suicida"
        >
          024
        </a>{' '}
        · Servicio gratuito 24 horas
      </div>

      {/* ── Contenido principal ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">

        {/* Links legales */}
        <nav
          aria-label="Enlaces del pie de página"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500"
        >
          <a
            href="/contacto"
            className="hover:text-[#0066CC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2 rounded"
          >
            Contacto
          </a>
          <a
            href="/privacidad"
            className="hover:text-[#0066CC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2 rounded"
          >
            Política de privacidad
          </a>
          <a
            href="/aviso-legal"
            className="hover:text-[#0066CC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2 rounded"
          >
            Aviso legal
          </a>
          <a
            href="/cookies"
            className="hover:text-[#0066CC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2 rounded"
          >
            Cookies
          </a>
        </nav>

        {/* Divisor */}
        <hr className="my-4 border-gray-100" />

        {/* Referencias científicas */}
        <section aria-labelledby="footer-references">
          <h3
            id="footer-references"
            className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400"
          >
            Referencias científicas
          </h3>
          <ul className="space-y-1">
            {REFERENCES.map((ref, i) => (
              <li key={i} className="text-xs text-gray-400 leading-relaxed">
                {ref}
              </li>
            ))}
          </ul>
        </section>

        {/* Copyright */}
        <p className="mt-4 text-center text-xs text-gray-400">
          © {CURRENT_YEAR} Psicoprotego. Todos los derechos reservados.{' '}
          <span className="block sm:inline">
            Esta herramienta tiene fines educativos y no constituye diagnóstico clínico.
          </span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
