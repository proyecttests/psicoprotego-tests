/**
 * @file components/pdf/buildPdf.ts
 * @description Genera en el navegador los PDF del test (en blanco y con resultados): carga la
 * validación de metadata.json, arma el enlace a la ficha del test (en la web desde la que se
 * descarga, con su prefijo si va detrás del proxy /tests) y su QR, y devuelve el Blob.
 */

import React from 'react'
import type { TestLangFile, AnswersMap } from '@/types/test'
import type { ScoringResult } from '@/utils/scoringFunctions'
import type { PdfLinks, PdfValidation } from './pdfTheme'

async function loadValidation(testId: string, lang: string): Promise<PdfValidation | undefined> {
  try {
    const meta = await (await fetch(`/data/tests/${testId}/metadata.json`)).json()
    const vd = meta?.validationDetails
    if (!vd) return undefined
    return {
      validated:         vd.translations?.[lang]?.validated ?? false,
      reference:         vd.translations?.[lang]?.reference,
      originalReference: vd.original?.reference,
      originalJournal:   vd.original?.journal,
    }
  } catch {
    return undefined
  }
}

async function buildLinks(testId: string, lang: string): Promise<PdfLinks> {
  // Prefijo de la ruta actual antes de /{lang}/ (vacío hoy; «/tests» detrás del proxy)
  const prefix  = window.location.pathname.split(`/${lang}/`)[0]
  const testUrl = `${window.location.origin}${prefix}/${lang}/test/${testId}`
  try {
    const QRCode = (await import('qrcode')).default
    const qrDataUrl = await QRCode.toDataURL(testUrl, {
      margin: 1,
      width: 320,
      color: { dark: '#2d4a3e', light: '#ffffff' },
    })
    return { testUrl, qrDataUrl }
  } catch {
    return { testUrl }
  }
}

export async function buildBlankPdf(testId: string, lang: string, testData?: TestLangFile): Promise<Blob> {
  const [{ pdf }, { TestBlankDocument }, data, validation, links] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./TestBlankDocument'),
    testData ?? fetch(`/data/tests/${testId}/${lang}.json`).then((r) => r.json() as Promise<TestLangFile>),
    loadValidation(testId, lang),
    buildLinks(testId, lang),
  ])
  const doc = React.createElement(TestBlankDocument, { testData: data, validation, links })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return pdf(doc as any).toBlob()
}

export async function buildReportPdf(params: {
  testId: string
  lang: string
  testData: TestLangFile
  answers: AnswersMap
  result: ScoringResult
  userName?: string
}): Promise<Blob> {
  const { testId, lang, testData, answers, result, userName } = params
  const [{ pdf }, { TestReportDocument }, validation, links] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./TestReportDocument'),
    loadValidation(testId, lang),
    buildLinks(testId, lang),
  ])
  const doc = React.createElement(TestReportDocument, {
    testData,
    answers,
    result,
    userName,
    completedAt: new Date().toISOString(),
    validation,
    links,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return pdf(doc as any).toBlob()
}
