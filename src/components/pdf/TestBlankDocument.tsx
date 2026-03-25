/**
 * @file components/pdf/TestBlankDocument.tsx
 * @description React-PDF document for a blank (unanswered) test to print and fill in.
 */

import React from 'react'
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer'
import type { TestLangFile } from '@/types/test'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TestBlankDocumentProps {
  testData: TestLangFile
  metadata: {
    generatedAt: string   // ISO date string
    testId: string
  }
}

// ── Color palette ─────────────────────────────────────────────────────────────

const COLORS = {
  primary:   '#2d4a3e',
  accent:    '#c8a96e',
  cream:     '#f5f3ef',
  text:      '#1a1a1a',
  gray:      '#666666',
  lightGray: '#e8e4dd',
  white:     '#ffffff',
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily:      'Helvetica',
    backgroundColor: COLORS.white,
    paddingBottom:   60,
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 36,
    paddingTop:        28,
    paddingBottom:     24,
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerTestName: {
    color:      COLORS.white,
    fontSize:   20,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.2,
  },
  headerSubtitle: {
    color:    COLORS.accent,
    fontSize: 11,
    fontFamily: 'Helvetica',
    marginTop: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerBrandingRight: {
    color:      COLORS.accent,
    fontSize:   12,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },
  headerBrandingSub: {
    color:    COLORS.accent,
    fontSize: 9,
    fontFamily: 'Helvetica',
    marginTop: 2,
  },

  // Metadata bar
  metadataBar: {
    backgroundColor:   COLORS.cream,
    paddingHorizontal: 36,
    paddingVertical:   10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    flexDirection:     'row',
    justifyContent:    'space-between',
  },
  metadataText: {
    color:      COLORS.gray,
    fontSize:   9,
    fontFamily: 'Helvetica',
  },

  // Body
  body: {
    paddingHorizontal: 36,
    paddingTop:        20,
  },

  // Section title
  sectionTitle: {
    fontSize:      11,
    fontFamily:    'Helvetica-Bold',
    color:         COLORS.primary,
    marginBottom:  10,
    marginTop:     4,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },

  // Question items
  questionItem: {
    marginBottom:  14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  questionNumber: {
    fontSize:   8,
    fontFamily: 'Helvetica-Bold',
    color:      COLORS.accent,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize:   11,
    fontFamily: 'Helvetica-Bold',
    color:      COLORS.text,
    lineHeight: 1.4,
    marginBottom: 6,
  },
  optionsRow: {
    flexDirection: 'column',
    gap:           4,
    marginTop:     4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           6,
  },
  optionBullet: {
    fontSize:   11,
    fontFamily: 'Helvetica',
    color:      COLORS.gray,
    lineHeight: 1.3,
    width:      14,
    flexShrink: 0,
  },
  optionLabel: {
    fontSize:   10,
    fontFamily: 'Helvetica',
    color:      COLORS.gray,
    lineHeight: 1.4,
    flex:       1,
  },

  // Text answer lines
  textAnswerLines: {
    marginTop:  6,
  },
  answerLine: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    height:            20,
    marginBottom:      6,
  },

  // Watermark
  watermark: {
    position:  'absolute',
    top:       '40%',
    left:      60,
    right:     60,
    transform: 'rotate(-45deg)',
    opacity:   0.04,
  },
  watermarkText: {
    fontSize:   72,
    fontFamily: 'Helvetica-Bold',
    color:      COLORS.primary,
    textAlign:  'center',
    letterSpacing: 8,
  },

  // Footer
  footer: {
    position:       'absolute',
    bottom:         20,
    left:           36,
    right:          36,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop:     6,
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  footerText: {
    fontSize:   7,
    fontFamily: 'Helvetica',
    color:      COLORS.gray,
  },
  footerBold: {
    fontFamily: 'Helvetica-Bold',
    color:      COLORS.primary,
  },
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatShortDate(isoString: string): string {
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return isoString
  }
}

// ── Main Component ────────────────────────────────────────────────────────────

export const TestBlankDocument: React.FC<TestBlankDocumentProps> = ({
  testData,
  metadata,
}) => {
  const questionCount = testData.questions.length

  return (
    <Document
      title={`Psicoprotego - ${testData.name} (Para rellenar)`}
      author="Psicoprotego.es"
      subject="Test psicológico para imprimir"
    >
      <Page size="A4" style={styles.page}>
        {/* ── Watermark ─────────────────────────────────────────────────────── */}
        <View style={styles.watermark} fixed>
          <Text style={styles.watermarkText}>USO EDUCATIVO</Text>
        </View>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTestName}>{testData.name} — Para rellenar</Text>
            <Text style={styles.headerSubtitle}>Cuestionario de evaluación psicológica</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerBrandingRight}>PSICOPROTEGO</Text>
            <Text style={styles.headerBrandingSub}>psicoprotego.es</Text>
          </View>
        </View>

        {/* ── Metadata bar ─────────────────────────────────────────────────── */}
        <View style={styles.metadataBar}>
          <Text style={styles.metadataText}>
            {`Test: ${testData.name}  ·  ${questionCount} preguntas  ·  Generado: ${formatShortDate(metadata.generatedAt)}`}
          </Text>
          <Text style={styles.metadataText}>
            {`ID: ${metadata.testId}`}
          </Text>
        </View>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Preguntas</Text>

          {testData.questions.map((question, index) => (
            <View key={question.id} style={styles.questionItem} wrap={false}>
              <Text style={styles.questionNumber}>
                {`Pregunta ${index + 1}`}
              </Text>
              <Text style={styles.questionText}>{question.text}</Text>

              {/* Options (multipleChoice or boolean with explicit options) */}
              {question.options && question.options.length > 0 && (
                <View style={styles.optionsRow}>
                  {question.options.map((opt) => (
                    <View key={opt.value} style={styles.optionItem}>
                      <Text style={styles.optionBullet}>{'\u25CB'}</Text>
                      <Text style={styles.optionLabel}>{opt.label}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Likert: show all scale values as empty circles */}
              {question.type === 'likert' && (
                <View style={styles.optionsRow}>
                  {Array.from(
                    { length: (question.scale?.max ?? 3) - (question.scale?.min ?? 0) + 1 },
                    (_, i) => (question.scale?.min ?? 0) + i
                  ).map((val) => {
                    const labelMin = question.labels?.min
                    const labelMax = question.labels?.max
                    const scaleMax = question.scale?.max ?? 3
                    const scaleMin = question.scale?.min ?? 0
                    const labelText = val === scaleMin && labelMin
                      ? `${val} – ${labelMin}`
                      : val === scaleMax && labelMax
                      ? `${val} – ${labelMax}`
                      : String(val)
                    return (
                      <View key={val} style={styles.optionItem}>
                        <Text style={styles.optionBullet}>{'\u25CB'}</Text>
                        <Text style={styles.optionLabel}>{labelText}</Text>
                      </View>
                    )
                  })}
                </View>
              )}

              {/* Boolean */}
              {question.type === 'boolean' && !question.options && (
                <View style={styles.optionsRow}>
                  {[
                    question.booleanOptions?.yes ?? 'Sí',
                    question.booleanOptions?.no  ?? 'No',
                  ].map((label) => (
                    <View key={label} style={styles.optionItem}>
                      <Text style={styles.optionBullet}>{'\u25CB'}</Text>
                      <Text style={styles.optionLabel}>{label}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Text: draw answer lines */}
              {question.type === 'text' && (
                <View style={styles.textAnswerLines}>
                  <View style={styles.answerLine} />
                  <View style={styles.answerLine} />
                  <View style={styles.answerLine} />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            <Text style={styles.footerBold}>Psicoprotego.es</Text>
            {' · Confidencial · Generado el '}
            {formatShortDate(metadata.generatedAt)}
          </Text>
          <Text style={styles.footerText}>
            Uso educativo, no diagnóstico clínico
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default TestBlankDocument
