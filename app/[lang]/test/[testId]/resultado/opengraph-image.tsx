/**
 * @file app/[lang]/test/[testId]/resultado/opengraph-image.tsx
 * @description OG image per-test para la página de resultado compartido.
 *
 * Social crawlers no ejecutan JS y no pueden leer ?d=, por lo que se genera
 * una imagen de marca del test (igual para todos los resultados de ese test).
 * Edge runtime: rápido, sin cold start en Vercel.
 */

import { ImageResponse } from 'next/og'
import fs from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// ── OG copy per lang ─────────────────────────────────────────────────────────

const SUBTITLES: Record<string, string> = {
  es: 'Mis resultados',
  en: 'My results',
  pt: 'Meus resultados',
}

const LABELS: Record<string, string> = {
  es: 'Test psicológico validado clínicamente',
  en: 'Clinically validated psychological test',
  pt: 'Teste psicológico validado clinicamente',
}

// ── Route handler ─────────────────────────────────────────────────────────────

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; testId: string }>
}) {
  const { lang, testId } = await params

  // Load test name from lang file, fallback to testId
  let testName = testId.toUpperCase()
  try {
    const dir = path.join(process.cwd(), 'public', 'data', 'tests', testId)
    const raw = await fs.readFile(path.join(dir, `${lang}.json`), 'utf-8').catch(
      () => fs.readFile(path.join(dir, 'es.json'), 'utf-8').catch(() => null)
    )
    if (raw) {
      const data = JSON.parse(raw)
      testName = data.name ?? testName
    }
  } catch { /* use default */ }

  const subtitle = SUBTITLES[lang] ?? SUBTITLES['es']
  const label    = LABELS[lang] ?? LABELS['es']

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 60%, #3a7a50 100%)',
          fontFamily: 'Georgia, serif',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Decorative circle top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />
        {/* Decorative circle bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }}
        />

        {/* Label chip */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '100px',
            padding: '8px 24px',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', letterSpacing: '0.05em' }}>
            {label}
          </span>
        </div>

        {/* Test name */}
        <h1
          style={{
            color: '#ffffff',
            fontSize: '56px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '0 0 20px 0',
            lineHeight: 1.15,
            maxWidth: '900px',
          }}
        >
          {testName}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '30px',
            margin: '0 0 48px 0',
            fontStyle: 'italic',
          }}
        >
          {subtitle}
        </p>

        {/* Divider */}
        <div
          style={{
            width: '80px',
            height: '3px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '2px',
            marginBottom: '32px',
          }}
        />

        {/* Domain */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '20px', letterSpacing: '0.08em', margin: 0 }}>
          testpsycho.com
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
}
