/**
 * @file components/pdf/TestReportDocument.tsx
 * @description React-PDF document for completed test results.
 * Supports bilingual display (userLang for questions, viewLang for headers/metadata).
 */

import React from 'react'
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer'
import type { TestLangFile, AnswersMap } from '@/types/test'
import type { ScoringResult } from '@/utils/scoringFunctions'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TestReportDocumentProps {
  testData: TestLangFile
  answers: AnswersMap
  result: ScoringResult
  metadata: {
    completedAt: string    // ISO date string
    userLang: string       // language test was filled in
    viewLang: string       // language for viewing (may differ)
    userName?: string
    testId: string
    validationDetails?: {
      validated: boolean
      reference?: string
      originalReference?: string
      originalJournal?: string
    }
  }
  viewLangData?: TestLangFile  // test data in view language (if different)
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
  green:     '#4a7c5c',
  yellow:    '#c8a96e',
  orange:    '#c47a3a',
  red:       '#8b3a3a',
}

const CATEGORY_COLOR_MAP: Record<string, string> = {
  green:  COLORS.green,
  yellow: COLORS.yellow,
  orange: COLORS.orange,
  red:    COLORS.red,
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
  headerBranding: {
    color:      COLORS.accent,
    fontSize:   10,
    fontFamily: 'Helvetica',
    marginTop:  2,
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

  // Metadata bar
  metadataBar: {
    backgroundColor:   COLORS.cream,
    paddingHorizontal: 36,
    paddingVertical:   10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  metadataText: {
    color:     COLORS.gray,
    fontSize:  9,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  metadataBold: {
    color:      COLORS.primary,
    fontSize:   9,
    fontFamily: 'Helvetica-Bold',
    marginTop:  2,
  },

  // Body content
  body: {
    paddingHorizontal: 36,
    paddingTop:        20,
  },

  // Result block
  resultBlock: {
    borderLeftWidth: 4,
    borderRadius:    4,
    paddingLeft:     14,
    paddingRight:    14,
    paddingVertical: 14,
    marginBottom:    20,
    backgroundColor: COLORS.cream,
  },
  resultCategory: {
    fontSize:   10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  resultScore: {
    fontSize:   28,
    fontFamily: 'Helvetica-Bold',
    color:      COLORS.primary,
    lineHeight: 1,
  },
  resultScoreLabel: {
    fontSize:   10,
    color:      COLORS.gray,
    fontFamily: 'Helvetica',
    marginTop:  2,
  },
  resultMessageTitle: {
    fontSize:   14,
    fontFamily: 'Helvetica-Bold',
    color:      COLORS.text,
    marginTop:  10,
    marginBottom: 6,
  },
  resultMessageBody: {
    fontSize:   10,
    color:      COLORS.gray,
    fontFamily: 'Helvetica',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  resultRecommendation: {
    fontSize:   10,
    color:      COLORS.primary,
    fontFamily: 'Helvetica-Oblique',
    lineHeight: 1.6,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop:    8,
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
    marginBottom: 3,
  },
  questionTextAlt: {
    fontSize:   9,
    fontFamily: 'Helvetica',
    color:      COLORS.gray,
    lineHeight: 1.4,
    marginBottom: 6,
  },
  optionsRow: {
    flexDirection: 'column',
    gap:           3,
    marginTop:     5,
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
  optionBulletSelected: {
    color: COLORS.primary,
  },
  optionLabel: {
    fontSize:   10,
    fontFamily: 'Helvetica',
    color:      COLORS.gray,
    lineHeight: 1.4,
    flex:       1,
  },
  optionLabelSelected: {
    fontFamily: 'Helvetica-Bold',
    color:      COLORS.text,
  },

  // Answer for non-option questions (likert slider, text, boolean)
  answerBox: {
    marginTop:       5,
    paddingLeft:     10,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.accent,
  },
  answerText: {
    fontSize:   10,
    fontFamily: 'Helvetica-Bold',
    color:      COLORS.primary,
  },

  // Footer
  footer: {
    position:     'absolute',
    bottom:       20,
    left:         36,
    right:        36,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop:   6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:   'center',
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

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('es-ES', {
      year: 'month' in {} ? 'numeric' : 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return isoString
  }
}

function formatShortDate(isoString: string): string {
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return isoString
  }
}

const LANG_LABELS: Record<string, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  ar: 'العربية',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
}

function getLangLabel(code: string): string {
  return LANG_LABELS[code] ?? code.toUpperCase()
}

const QUESTIONS_LABEL: Record<string, string> = {
  es: 'Preguntas y respuestas',
  en: 'Questions and answers',
  pt: 'Perguntas e respostas',
  ar: 'الأسئلة والإجابات',
}

function getQuestionsLabel(lang: string): string {
  return QUESTIONS_LABEL[lang] ?? QUESTIONS_LABEL['es']
}

const ANSWER_LABEL: Record<string, string> = {
  es: 'Respuesta',
  en: 'Answer',
  pt: 'Resposta',
  ar: 'الإجابة',
}

const SCORE_LABEL: Record<string, string> = {
  es: 'Puntuación',
  en: 'Score',
  pt: 'Pontuação',
  ar: 'النتيجة',
}

const RECOMMENDATION_LABEL: Record<string, string> = {
  es: 'Recomendación',
  en: 'Recommendation',
  pt: 'Recomendação',
  ar: 'التوصية',
}

// ── Sub-components ────────────────────────────────────────────────────────────

const PageFooter: React.FC<{ date: string }> = ({ date }) => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>
      <Text style={styles.footerBold}>Psicoprotego.es</Text>
      {' · Confidencial · Generado el '}
      {formatShortDate(date)}
    </Text>
    <Text style={styles.footerText}>
      Herramienta de cribado · No sustituye evaluacion clinica profesional
    </Text>
  </View>
)

// ── Main Component ────────────────────────────────────────────────────────────

export const TestReportDocument: React.FC<TestReportDocumentProps> = ({
  testData,
  answers,
  result,
  metadata,
  viewLangData,
}) => {
  const isBilingual = viewLangData !== null && viewLangData !== undefined && viewLangData.lang !== testData.lang
  const displayData = isBilingual ? viewLangData! : testData
  const categoryColor = result.category?.color
    ? (CATEGORY_COLOR_MAP[result.category.color] ?? COLORS.primary)
    : COLORS.primary
  const viewLang = metadata.viewLang
  const scoreLabel = SCORE_LABEL[viewLang] ?? SCORE_LABEL['es']
  const recommendationLabel = RECOMMENDATION_LABEL[viewLang] ?? RECOMMENDATION_LABEL['es']
  const questionsLabel = getQuestionsLabel(viewLang)

  return (
    <Document
      title={`Psicoprotego - ${testData.name}`}
      author="Psicoprotego.es"
      subject="Informe de evaluación psicológica"
    >
      <Page size="A4" style={styles.page}>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTestName}>{displayData.name}</Text>
            <Text style={styles.headerBranding}>Informe de resultados</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerBrandingRight}>PSICOPROTEGO</Text>
            <Text style={[styles.headerBranding, { marginTop: 2 }]}>psicoprotego.es</Text>
          </View>
        </View>

        {/* ── Metadata bar ─────────────────────────────────────────────────── */}
        <View style={styles.metadataBar}>
          {isBilingual ? (
            <Text style={styles.metadataText}>
              {`Rellenado en ${getLangLabel(metadata.userLang)}  |  Visualizado en ${getLangLabel(metadata.viewLang)}  ·  Completado: ${formatDate(metadata.completedAt)}`}
            </Text>
          ) : (
            <Text style={styles.metadataText}>
              {`Completado: ${formatDate(metadata.completedAt)}  ·  Idioma: ${getLangLabel(metadata.userLang)}  ·  Informe: ${getLangLabel(metadata.viewLang)}`}
            </Text>
          )}
          {metadata.userName && (
            <Text style={styles.metadataBold}>
              {`Paciente / Patient: ${metadata.userName}`}
            </Text>
          )}
        </View>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <View style={styles.body}>

          {/* ── Result block ──────────────────────────────────────────────── */}
          {result.resultType === 'NORMAL' && result.category && (
            <View style={[styles.resultBlock, { borderLeftColor: categoryColor }]}>
              <Text style={[styles.resultCategory, { color: categoryColor }]}>
                {result.category.label}
              </Text>

              {result.score !== null && (
                <>
                  <Text style={[styles.resultScore, { color: categoryColor }]}>
                    {result.score}
                  </Text>
                  <Text style={styles.resultScoreLabel}>{scoreLabel}</Text>
                </>
              )}

              {result.message?.title && (
                <Text style={styles.resultMessageTitle}>{result.message.title}</Text>
              )}
              {result.message?.body && (
                <Text style={styles.resultMessageBody}>{result.message.body}</Text>
              )}
              {result.message?.recommendation && (
                <Text style={styles.resultRecommendation}>
                  {`${recommendationLabel}: ${result.message.recommendation}`}
                </Text>
              )}
            </View>
          )}

          {/* ── Validation info ─────────────────────────────────────────── */}
          {metadata.validationDetails && (
            <View style={{ marginBottom: 16, padding: 10, backgroundColor: '#f0f7f4', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#2d4a3e' }}>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#2d4a3e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {metadata.userLang === 'en' ? 'Validation' : metadata.userLang === 'pt' ? 'Validacao' : 'Validacion'}
              </Text>
              {metadata.validationDetails.validated ? (
                <>
                  <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#2d6b4a', marginBottom: 2 }}>
                    {metadata.userLang === 'en' ? 'Validated in this language' : metadata.userLang === 'pt' ? 'Validado neste idioma' : 'Validado en este idioma'}
                  </Text>
                  {metadata.validationDetails.reference ? (
                    <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica', color: '#444444', lineHeight: 1.4 }}>
                      {metadata.validationDetails.reference}
                    </Text>
                  ) : null}
                  {metadata.validationDetails.originalReference ? (
                    <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Oblique', color: '#666666', marginTop: 3 }}>
                      {'Original: '}
                      {metadata.validationDetails.originalReference}
                      {metadata.validationDetails.originalJournal ? ' · ' + metadata.validationDetails.originalJournal : ''}
                    </Text>
                  ) : null}
                </>
              ) : (
                <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica', color: '#c0392b' }}>
                  {metadata.userLang === 'en' ? 'Not validated in this language' : metadata.userLang === 'pt' ? 'Nao validado neste idioma' : 'No validado en este idioma'}
                </Text>
              )}
            </View>
          )}

          {/* ── Questions section ─────────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>{questionsLabel}</Text>

          {testData.questions.map((question, index) => {
            const answer = answers[question.id]
            const viewQuestion = isBilingual
              ? displayData.questions.find((q) => q.id === question.id)
              : null

            return (
              <View key={question.id} style={styles.questionItem} wrap={false}>
                <Text style={styles.questionNumber}>
                  {`${index + 1}. ${metadata.userLang.toUpperCase()}`}
                </Text>

                {/* Question text in userLang */}
                <Text style={styles.questionText}>{question.text}</Text>

                {/* Question text in viewLang (bilingual) */}
                {isBilingual && viewQuestion && viewQuestion.text !== question.text && (
                  <Text style={styles.questionTextAlt}>{viewQuestion.text}</Text>
                )}

                {/* Options (multipleChoice or boolean) */}
                {question.options && question.options.length > 0 && (
                  <View style={styles.optionsRow}>
                    {question.options.map((opt) => {
                      const isSelected = String(answer) === String(opt.value)
                      return (
                        <View key={opt.value} style={styles.optionItem}>
                          <Text style={isSelected ? [styles.optionBullet, styles.optionBulletSelected] : styles.optionBullet}>
                            {isSelected ? '\u25CF' : '\u25CB'}
                          </Text>
                          <Text style={isSelected ? [styles.optionLabel, styles.optionLabelSelected] : styles.optionLabel}>
                            {opt.label}
                          </Text>
                        </View>
                      )
                    })}
                  </View>
                )}

                {/* Likert scale: show selected value */}
                {question.type === 'likert' && answer !== undefined && (
                  <View style={styles.optionsRow}>
                    {Array.from(
                      { length: (question.scale?.max ?? 3) - (question.scale?.min ?? 0) + 1 },
                      (_, i) => (question.scale?.min ?? 0) + i
                    ).map((val) => {
                      const isSelected = Number(answer) === val
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
                          <Text style={isSelected ? [styles.optionBullet, styles.optionBulletSelected] : styles.optionBullet}>
                            {isSelected ? '\u25CF' : '\u25CB'}
                          </Text>
                          <Text style={isSelected ? [styles.optionLabel, styles.optionLabelSelected] : styles.optionLabel}>
                            {labelText}
                          </Text>
                        </View>
                      )
                    })}
                  </View>
                )}

                {/* Boolean questions */}
                {question.type === 'boolean' && (
                  <View style={styles.optionsRow}>
                    {[
                      { value: 'true',  label: question.booleanOptions?.yes ?? 'Sí' },
                      { value: 'false', label: question.booleanOptions?.no  ?? 'No' },
                    ].map((opt) => {
                      const isSelected = String(answer) === opt.value
                      return (
                        <View key={opt.value} style={styles.optionItem}>
                          <Text style={isSelected ? [styles.optionBullet, styles.optionBulletSelected] : styles.optionBullet}>
                            {isSelected ? '\u25CF' : '\u25CB'}
                          </Text>
                          <Text style={isSelected ? [styles.optionLabel, styles.optionLabelSelected] : styles.optionLabel}>
                            {opt.label}
                          </Text>
                        </View>
                      )
                    })}
                  </View>
                )}

                {/* Text questions */}
                {question.type === 'text' && answer !== undefined && (
                  <View style={styles.answerBox}>
                    <Text style={styles.answerText}>{String(answer)}</Text>
                  </View>
                )}
              </View>
            )
          })}
        </View>

        {/* ── Disclaimer ────────────────────────────────────────────────────── */}
        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f5f3ef', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#2d4a3e' }}>
          <Text style={{ fontSize: 7, color: '#444444', lineHeight: 1.5 }}>
            {metadata.userLang === 'en' ? 'This test is exclusively informational and orientational in nature, and does not constitute a diagnostic instrument nor replace the assessment performed by a duly qualified psychology professional. Results should be interpreted with caution, as they may be influenced by multiple factors and do not necessarily reflect a real clinical situation. For an adequate assessment and possible diagnosis, it is essential to consult a licensed psychologist who can conduct a comprehensive evaluation through clinical interview and, where appropriate, correctly administered validated instruments. By completing this test, you acknowledge having been informed of its limitations and accept its use for merely informational purposes.' : metadata.userLang === 'pt' ? 'Este teste tem carater exclusivamente informativo e orientativo, e nao constitui em caso algum um instrumento de diagnostico nem substitui a avaliacao realizada por um profissional de psicologia devidamente qualificado. Os resultados devem ser interpretados com cautela, tendo em conta que podem ser influenciados por multiplos fatores e que nao refletem necessariamente uma situacao clinica real. Para uma avaliacao adequada e possivel diagnostico, e imprescindivel consultar um psicologo licenciado que realize uma avaliacao completa por meio de entrevista clinica e, se necessario, instrumentos validados administrados corretamente. Ao completar este teste, voce reconhece ter sido informado das suas limitacoes e aceita o seu uso com fins meramente orientativos.' : 'Este test tiene un caracter exclusivamente informativo y orientativo, y no constituye en ningun caso un instrumento diagnostico ni sustituye la evaluacion realizada por un profesional de la psicologia debidamente cualificado. Los resultados deben interpretarse con cautela, teniendo en cuenta que pueden estar influidos por multiples factores y que no reflejan necesariamente una situacion clinica real. Para una valoracion adecuada y un posible diagnostico, es imprescindible acudir a un psicologo colegiado que realice una evaluacion completa mediante entrevista clinica y, en su caso, instrumentos validados administrados correctamente. Al completar este test, usted reconoce haber sido informado de sus limitaciones y acepta su uso con fines meramente orientativos.'}
          </Text>
        </View>

        {/* ── Footer (fixed, every page) ────────────────────────────────────── */}
        <PageFooter date={metadata.completedAt} />
      </Page>
    </Document>
  )
}

export default TestReportDocument
