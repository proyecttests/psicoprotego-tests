/**
 * @file components/pdf/pdfTheme.tsx
 * @description Piezas comunes de los PDF (en blanco y con resultados): fuentes y colores de marca,
 * cabecera con logo, campos editables de nombre y fecha, tabla de ítems con casillas, tabla de
 * rangos, bloque «Sobre este cuestionario» (validación, enlaces y QR), aviso y pie con enlaces.
 *
 * Campos editables (AcroForm): funcionan en Adobe Reader, el visor de Chrome y Vista Previa de
 * macOS; algunos visores móviles los muestran sin dejar rellenarlos.
 */

import React from 'react'
import {
  Font,
  View,
  Text,
  Image,
  Link,
  TextInput,
  Checkbox,
  StyleSheet,
} from '@react-pdf/renderer'
import type { Question, ResponseOption, ScoringRule, TestLangFile } from '@/types/test'
import { getResponseOptions } from '@/utils/responseOptions'

// ── Fuentes (TTF de Fontsource, licencia OFL: public/fonts/) ──────────────────

Font.register({
  family: 'Montserrat',
  fonts: [
    { src: '/fonts/montserrat-400-normal.ttf', fontWeight: 400 },
    { src: '/fonts/montserrat-400-italic.ttf', fontWeight: 400, fontStyle: 'italic' },
    { src: '/fonts/montserrat-600-normal.ttf', fontWeight: 600 },
    { src: '/fonts/montserrat-700-normal.ttf', fontWeight: 700 },
  ],
})
Font.register({
  family: 'SourceSerif4',
  fonts: [
    { src: '/fonts/source-serif-4-600-normal.ttf', fontWeight: 600 },
    { src: '/fonts/source-serif-4-700-normal.ttf', fontWeight: 700 },
  ],
})
// Sin guiones de corte (react-pdf parte palabras con reglas del inglés)
Font.registerHyphenationCallback((word) => [word])

// ── Marca ─────────────────────────────────────────────────────────────────────

export const COLORS = {
  primary:  '#2d4a3e',   // Verde Bosque
  accent:   '#8b6914',   // Dorado
  cream:    '#f5f0eb',   // Crema
  line:     '#d9d2c7',
  text:     '#2b2b2b',
  muted:    '#6b6b6b',
  white:    '#ffffff',
}

export const SITE_URL = 'https://psicoprotego.es'

export const DISCLAIMER =
  'Este test tiene un carácter exclusivamente informativo y orientativo, y no constituye en ningún caso un instrumento diagnóstico ni sustituye la evaluación realizada por un profesional de la psicología debidamente cualificado. Los resultados deben interpretarse con cautela, teniendo en cuenta que pueden estar influidos por múltiples factores y que no reflejan necesariamente una situación clínica real. Para una valoración adecuada y un posible diagnóstico, es imprescindible acudir a un psicólogo colegiado que realice una evaluación completa mediante entrevista clínica y, en su caso, instrumentos validados administrados correctamente. Al completar este test, usted reconoce haber sido informado de sus limitaciones y acepta su uso con fines meramente orientativos.'

export interface PdfLinks {
  /** Ficha del test (landing), en la web desde la que se genera el PDF */
  testUrl: string
  /** QR de testUrl como data URL PNG (opcional) */
  qrDataUrl?: string
}

export interface PdfValidation {
  validated: boolean
  reference?: string
  originalReference?: string
  originalJournal?: string
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const OPTION_COL = 58

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Montserrat',
    fontSize: 9,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    paddingTop: 36,
    paddingHorizontal: 56,
    paddingBottom: 44,
    lineHeight: 1.4,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 109, height: 40 },
  headerKicker: { fontSize: 7.5, fontWeight: 600, color: COLORS.accent, letterSpacing: 1.2, textAlign: 'right' },
  rule: { height: 1.5, backgroundColor: COLORS.accent, marginTop: 10, marginBottom: 14 },
  title: { fontFamily: 'SourceSerif4', fontWeight: 700, fontSize: 19, color: COLORS.primary, lineHeight: 1.2 },
  subtitle: { fontSize: 9.5, color: COLORS.muted, marginTop: 3 },

  fieldsRow: { flexDirection: 'row', marginTop: 12, marginBottom: 2 },
  field: { marginRight: 16 },
  fieldLabel: { fontSize: 7.5, fontWeight: 600, color: COLORS.muted, letterSpacing: 0.6, marginBottom: 3 },
  fieldBox: { borderBottomWidth: 1, borderBottomColor: COLORS.primary, height: 20 },
  // Tamaño de letra automático (ajustado al alto): 14 pt de alto ≈ 10 pt de letra
  fieldInput: { height: 14, marginTop: 5 },

  sectionTitle: { fontFamily: 'SourceSerif4', fontWeight: 600, fontSize: 12.5, color: COLORS.primary, marginTop: 12, marginBottom: 6 },
  instructions: { backgroundColor: COLORS.cream, borderRadius: 4, paddingVertical: 7, paddingHorizontal: 10, fontSize: 9, color: COLORS.primary, marginBottom: 6 },

  tableHead: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.primary, paddingBottom: 4, alignItems: 'flex-end' },
  headItem: { flex: 1, fontSize: 7.5, fontWeight: 600, color: COLORS.muted, letterSpacing: 0.6 },
  headOption: { width: OPTION_COL, fontSize: 7, fontWeight: 600, color: COLORS.primary, textAlign: 'center', paddingHorizontal: 2 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: COLORS.line },
  rowAlt: { backgroundColor: '#faf7f3' },
  rowNumber: { width: 18, fontSize: 8.5, fontWeight: 700, color: COLORS.accent },
  rowText: { flex: 1, fontSize: 9, paddingRight: 8 },
  rowNote: { fontSize: 7, fontStyle: 'italic', color: COLORS.muted },
  cell: { width: OPTION_COL, alignItems: 'center', justifyContent: 'center' },
  checkbox: { width: 9, height: 9 },
  mark: { width: 11, height: 11, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 2 },
  markOn: { backgroundColor: COLORS.primary },

  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 },
  totalLabel: { fontSize: 9, fontWeight: 600, color: COLORS.primary, marginRight: 8 },
  totalBox: { width: 48, height: 22, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 3 },

  rangeRow: { flexDirection: 'row', paddingVertical: 3, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: COLORS.line },
  rangeOn: { backgroundColor: COLORS.cream, borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  rangeScore: { width: 60, fontWeight: 600, color: COLORS.primary },
  rangeLabel: { flex: 1 },

  aboutBox: { flexDirection: 'row', alignItems: 'center', marginTop: 14, paddingVertical: 9, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.line, borderRadius: 4 },
  aboutText: { flex: 1, paddingRight: 12 },
  aboutLabel: { fontSize: 7.5, fontWeight: 600, color: COLORS.accent, letterSpacing: 1, marginBottom: 4 },
  aboutLine: { fontSize: 8, marginBottom: 1 },
  aboutMuted: { fontSize: 7.5, fontStyle: 'italic', color: COLORS.muted, marginBottom: 2 },
  link: { color: COLORS.primary, fontWeight: 600, textDecoration: 'underline' },
  qr: { width: 62, height: 62 },
  qrCaption: { fontSize: 6.5, color: COLORS.muted, textAlign: 'center', marginTop: 1, width: 62 },

  disclaimer: { marginTop: 8, fontSize: 6.5, color: COLORS.muted, lineHeight: 1.35 },

  // Con `top` y no `bottom`: un elemento fijo sin alto conocido (número de página) acaba fuera de
  // la página si se ancla abajo. A4 = 841,89 pt de alto.
  footer: {
    position: 'absolute', top: 806, left: 56, right: 56,
    borderTopWidth: 0.5, borderTopColor: COLORS.line, paddingTop: 6,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  footerText: { fontSize: 7, color: COLORS.muted },
  footerLink: { fontSize: 7, color: COLORS.primary, fontWeight: 600 },
})

// ── Piezas ────────────────────────────────────────────────────────────────────

export const PdfHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <View>
    <View style={styles.header}>
      <Link src={SITE_URL}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no es <img> */}
        <Image src="/images/logo-horizontal-verde.png" style={styles.logo} />
      </Link>
      <Text style={styles.headerKicker}>PSICOPROTEGO TESTS</Text>
    </View>
    <View style={styles.rule} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
)

/**
 * Los campos de texto toman como fuente la última usada en el documento. Si es Montserrat (embebida
 * solo con los caracteres del texto), faltan glifos al rellenarlos. Este texto invisible en
 * Helvetica, justo antes de cada campo, hace que usen Helvetica estándar (todo el latín).
 */
const FieldFont: React.FC = () => (
  <Text style={{ position: 'absolute', fontFamily: 'Helvetica', fontSize: 1, color: COLORS.white }}>{'\u00a0'}</Text>
)

/** Nombre y fecha, editables en el PDF (prerrellenados en el informe de resultados) */
export const NameDateFields: React.FC<{ name?: string; date?: string }> = ({ name, date }) => (
  <View style={styles.fieldsRow}>
    <View style={[styles.field, { flex: 2 }]}>
      <Text style={styles.fieldLabel}>NOMBRE</Text>
      <View style={styles.fieldBox}>
        <FieldFont />
        <TextInput name="nombre" value={name ?? ''} maxLength={80} style={styles.fieldInput} />
      </View>
    </View>
    <View style={[styles.field, { flex: 1, marginRight: 0 }]}>
      <Text style={styles.fieldLabel}>FECHA</Text>
      <View style={styles.fieldBox}>
        <FieldFont />
        <TextInput name="fecha" value={date ?? ''} maxLength={20} style={styles.fieldInput} />
      </View>
    </View>
  </View>
)

/** Bloques consecutivos de preguntas con las mismas opciones de respuesta */
function groupByOptions(testData: TestLangFile, questions: Question[]) {
  const groups: Array<{ options: ResponseOption[]; items: Array<{ q: Question; n: number }> }> = []
  questions.forEach((q) => {
    const options = getResponseOptions(q, testData.responseOptions)
    const key = JSON.stringify(options)
    const last = groups[groups.length - 1]
    const n = testData.questions.indexOf(q) + 1
    if (last && JSON.stringify(last.options) === key) last.items.push({ q, n })
    else groups.push({ options, items: [{ q, n }] })
  })
  return groups
}

/**
 * Tabla de ítems Likert con una columna por opción.
 * Sin `answers`: casillas editables (PDF en blanco). Con `answers`: marcas fijas (informe).
 */
export const ItemsTable: React.FC<{
  testData: TestLangFile
  questions: Question[]
  answers?: Record<string, string | number | boolean>
}> = ({ testData, questions, answers }) => (
  <View>
    {groupByOptions(testData, questions).map((group, gi) => (
      <View key={gi} style={{ marginTop: gi === 0 ? 0 : 14 }}>
        {group.items.map(({ q, n }, i) => {
          const noScore = q.scoring?.method === 'none'
          const row = (
            <View key={q.id} style={i % 2 === 1 ? [styles.row, styles.rowAlt] : styles.row} wrap={false}>
              <Text style={styles.rowNumber}>{n}</Text>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={{ fontSize: 9 }}>{q.text}</Text>
                {noScore && <Text style={styles.rowNote}>No suma a la puntuación.</Text>}
              </View>
              {group.options.map((o) => (
                <View key={o.value} style={styles.cell}>
                  {answers
                    ? <View style={Number(answers[q.id]) === o.value && answers[q.id] !== undefined ? [styles.mark, styles.markOn] : styles.mark} />
                    : (
                      // El recuadro se dibuja aparte: sin marcar, la casilla del formulario no pinta nada
                      <View style={[styles.mark, { alignItems: 'center', justifyContent: 'center' }]}>
                        {/* xMark: sin marcar, vacía; marcada, «✘» (sin él, react-pdf pinta «✘» en la vacía) */}
                        <Checkbox name={`${q.id}_${o.value}`} xMark style={styles.checkbox} />
                      </View>
                    )}
                </View>
              ))}
            </View>
          )
          if (i > 0) return row
          // La cabecera no se queda sola al final de una página: va unida a la primera fila
          return (
            <View key={q.id} wrap={false}>
              <View style={styles.tableHead}>
                <Text style={styles.headItem}>{gi === 0 ? 'PREGUNTA' : ''}</Text>
                {group.options.map((o) => (
                  <Text key={o.value} style={styles.headOption}>{`${o.label} (${o.value})`}</Text>
                ))}
              </View>
              {row}
            </View>
          )
        })}
      </View>
    ))}
  </View>
)

/** Casilla editable para la suma (PDF en blanco: el PDF no suma solo) */
export const TotalField: React.FC<{ max: number }> = ({ max }) => (
  <View style={styles.totalRow} wrap={false}>
    <Text style={styles.totalLabel}>{`Puntuación total (0–${max})`}</Text>
    <View style={styles.totalBox}>
      <FieldFont />
      <TextInput name="puntuacion_total" align="center" maxLength={3} style={{ height: 16, marginTop: 3 }} />
    </View>
  </View>
)

/** Rangos orientativos de interpretación; resalta el del resultado si se indica */
export const RangesTable: React.FC<{ scoring: ScoringRule[]; current?: string }> = ({ scoring, current }) => (
  <View wrap={false}>
    <Text style={styles.sectionTitle}>Interpretación orientativa</Text>
    {scoring.map((r) => (
      <View key={r.messageKey} style={r.messageKey === current ? [styles.rangeRow, styles.rangeOn] : styles.rangeRow}>
        <Text style={styles.rangeScore}>{r.max === null ? `${r.min} o más` : `${r.min}–${r.max}`}</Text>
        <Text style={styles.rangeLabel}>{r.category}</Text>
      </View>
    ))}
  </View>
)

/** Validación, enlaces a la ficha del test y a psicoprotego.es, y QR */
export const AboutBlock: React.FC<{ validation?: PdfValidation; links: PdfLinks }> = ({ validation, links }) => (
  <View style={styles.aboutBox} wrap={false}>
    <View style={styles.aboutText}>
      <Text style={styles.aboutLabel}>SOBRE ESTE CUESTIONARIO</Text>
      {validation?.validated && validation.reference && (
        <Text style={styles.aboutLine}>{`Versión española validada: ${validation.reference}.`}</Text>
      )}
      {validation?.originalReference && (
        <Text style={styles.aboutMuted}>
          {`Original: ${validation.originalReference}${validation.originalJournal ? `, ${validation.originalJournal}` : ''}.`}
        </Text>
      )}
      <Text style={[styles.aboutLine, { marginTop: 4 }]}>
        {'Ficha clínica del test: '}
        <Link src={links.testUrl} style={styles.link}>{links.testUrl.replace(/^https?:\/\//, '')}</Link>
      </Text>
      <Text style={styles.aboutLine}>
        {'Psicólogos Protego: '}
        <Link src={SITE_URL} style={styles.link}>psicoprotego.es</Link>
      </Text>
    </View>
    {links.qrDataUrl && (
      <Link src={links.testUrl}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no es <img> */}
        <Image src={links.qrDataUrl} style={styles.qr} />
        <Text style={styles.qrCaption}>Ficha del test</Text>
      </Link>
    )}
  </View>
)

export const Disclaimer: React.FC = () => <Text style={styles.disclaimer}>{DISCLAIMER}</Text>

/**
 * Pie en todas las páginas, sin fecha. Sin enlaces: react-pdf coloca fuera de la página los
 * <Link> de los elementos fijos; los enlaces van en el logo, en «Sobre este cuestionario» y en el QR.
 */
export const PdfFooter: React.FC = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerLink}>psicoprotego.es</Text>
    <Text style={styles.footerText}>Herramienta de cribado · No sustituye la valoración de un profesional</Text>
    <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
  </View>
)
