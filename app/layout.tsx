import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Psicoprotego — Tests Psicológicos',
  description: 'Tests psicológicos validados clínicamente. GAD-7, PHQ-9 y más.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
