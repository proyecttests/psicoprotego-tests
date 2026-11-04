/**
 * @file components/pdf/TestReportDocument.tsx
 * @description PDF del informe de resultados. Nombre y fecha editables (prerrellenados); las
 * respuestas van marcadas y fijas para que cuadren con la puntuación. Si el resultado es de
 * crisis, la línea de ayuda urgente va antes de la puntuación, como en pantalla.
 */

import React from 'react'
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { TestLangFile, AnswersMap } from '@/types/test'
import { getMaxScore, type QuestionWithScoring, type ScoringResult } from '@/utils/scoringFunctions'
import { getCrisisPhone } from '@/config/crisisPhones'
import {
  COLORS,
  styles,
  PdfHeader,
  NameDateFields,
  ItemsTable,
  RangesTable,
  AboutBlock,
  Disclaimer,
  PdfFooter,
  type PdfLinks,
  type PdfValidation,
} from './pdfTheme'

export interface TestReportDocumentProps {
  testData: TestLangFile
  answers: AnswersMap
  result: ScoringResult
  /** Nombre opcional escrito en el modal de descarga (prerrellena el campo) */
  userName?: string
  /** Fecha en que se completó el test, ISO (prerrellena el campo «Fecha») */
  completedAt: string
  validation?: PdfValidation
  links: PdfLinks
}

const EMERGENCY = getCrisisPhone('112')
const SUICIDE   = getCrisisPhone('024')
const URGENT_HELP_LINE =
  `¿Necesitas ayuda urgente? Llama al ${EMERGENCY.number} (${EMERGENCY.label.toLowerCase()}) ` +
  `o al ${SUICIDE.number} (${SUICIDE.situation.toLowerCase()}).`

const local = StyleSheet.create({
  crisis: { marginTop: 16, padding: 10, borderRadius: 4, borderWidth: 1.5, borderColor: COLORS.primary },
  crisisText: { fontSize: 10, fontWeight: 700, color: COLORS.primary },
  result: { flexDirection: 'row', alignItems: 'center', marginTop: 16, padding: 14, backgroundColor: COLORS.cream, borderRadius: 4 },
  score: { fontFamily: 'SourceSerif4', fontWeight: 700, fontSize: 30, color: COLORS.primary, lineHeight: 1 },
  scoreMax: { fontSize: 9, color: COLORS.muted, marginTop: 2 },
  scoreCol: { width: 76, alignItems: 'center', borderRightWidth: 1, borderRightColor: COLORS.line, marginRight: 14 },
  category: { fontFamily: 'SourceSerif4', fontWeight: 600, fontSize: 13, color: COLORS.primary },
  note: { fontSize: 8.5, color: COLORS.text, marginTop: 4 },
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const TestReportDocument: React.FC<TestReportDocumentProps> = ({
  testData,
  answers,
  result,
  userName,
  completedAt,
  validation,
  links,
}) => {
  const answered = testData.questions.filter((q) => answers[q.id] !== undefined)
  const maxScore = getMaxScore(testData.questions as QuestionWithScoring[])

  return (
    <Document
      title={`${testData.name} — Informe de resultados — Psicoprotego`}
      author="Psicólogos Protego"
      subject="Informe de resultados"
      creator="psicoprotego.es"
    >
      <Page size="A4" style={styles.page}>
        <PdfHeader title={testData.name} subtitle="Informe de resultados" />
        <NameDateFields name={userName} date={formatDate(completedAt)} />

        {result.resultType === 'CRISIS' && (
          <View style={local.crisis} wrap={false}>
            <Text style={local.crisisText}>{URGENT_HELP_LINE}</Text>
          </View>
        )}

        {result.score !== null && (
          <View style={local.result} wrap={false}>
            <View style={local.scoreCol}>
              <Text style={local.score}>{result.score}</Text>
              <Text style={local.scoreMax}>{`de ${maxScore}`}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={local.category}>{result.category?.label ?? ''}</Text>
              {result.message?.notes?.map((n) => <Text key={n} style={local.note}>{n}</Text>)}
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Respuestas</Text>
        {testData.instructions ? <Text style={styles.instructions}>{testData.instructions}</Text> : null}
        <ItemsTable testData={testData} questions={answered} answers={answers} />

        <RangesTable scoring={testData.scoring} current={result.category?.messageKey} />
        <AboutBlock validation={validation} links={links} />
        <Disclaimer />
        <PdfFooter />
      </Page>
    </Document>
  )
}

export default TestReportDocument
