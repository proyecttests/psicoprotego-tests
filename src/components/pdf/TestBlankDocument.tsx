/**
 * @file components/pdf/TestBlankDocument.tsx
 * @description PDF del test en blanco: para rellenar en pantalla (campos y casillas editables) o
 * impreso. Sin fecha de descarga ni línea de ayuda urgente (no contaminar la evaluación).
 */

import React from 'react'
import { Document, Page, Text } from '@react-pdf/renderer'
import type { TestLangFile } from '@/types/test'
import { getMaxScore, type QuestionWithScoring } from '@/utils/scoringFunctions'
import {
  styles,
  PdfHeader,
  NameDateFields,
  ItemsTable,
  TotalField,
  RangesTable,
  AboutBlock,
  Disclaimer,
  PdfFooter,
  type PdfLinks,
  type PdfValidation,
} from './pdfTheme'

export interface TestBlankDocumentProps {
  testData: TestLangFile
  validation?: PdfValidation
  links: PdfLinks
}

export const TestBlankDocument: React.FC<TestBlankDocumentProps> = ({ testData, validation, links }) => (
  <Document
    title={`${testData.name} — Psicoprotego`}
    author="Psicólogos Protego"
    subject="Cuestionario para rellenar"
    creator="psicoprotego.es"
  >
    <Page size="A4" style={styles.page}>
      <PdfHeader title={testData.name} subtitle="Cuestionario para rellenar" />
      <NameDateFields />

      <Text style={styles.sectionTitle}>Preguntas</Text>
      {testData.instructions ? <Text style={styles.instructions}>{testData.instructions}</Text> : null}
      <ItemsTable testData={testData} questions={testData.questions} />
      <TotalField max={getMaxScore(testData.questions as QuestionWithScoring[])} />

      <RangesTable scoring={testData.scoring} />
      <AboutBlock validation={validation} links={links} />
      <Disclaimer />
      <PdfFooter />
    </Page>
  </Document>
)

export default TestBlankDocument
