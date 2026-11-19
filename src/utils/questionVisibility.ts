/**
 * @file utils/questionVisibility.ts
 * @description Preguntas condicionales (`showIf`) y preguntas de ejemplo en texto libre.
 *
 * Una pregunta `text` con `showIf` es el ejemplo de la pregunta de la que depende (DES-II
 * comentada: aparece si el ítem se responde con 30 % o más). El texto libre solo se muestra en
 * pantalla y en el PDF: no va a la analítica ni al enlace compartido.
 */

import type { AnswersMap, Question, ResponseOption } from '@/types/test'
import { getResponseOptions } from './responseOptions'

/** Evalúa si una pregunta debe mostrarse según su condición `showIf`. */
export function shouldShowQuestion(question: Question, answers: AnswersMap): boolean {
  if (!question.showIf) return true
  const { questionId, value, notIn, minValue } = question.showIf
  if (minValue !== undefined) {
    const answer = answers[questionId]
    return typeof answer === 'number' && answer >= minValue
  }
  if (notIn) return !notIn.includes(answers[questionId])
  return answers[questionId] === value
}

/** Número de cada ítem contando solo los que se puntúan (las preguntas de ejemplo no cuentan). */
export function itemNumber(questions: Question[], question: Question): number {
  return questions.filter((q) => q.type !== 'text').indexOf(question) + 1
}

export interface ExampleEntry {
  n: number
  item: string
  answerLabel: string
  text: string
}

/** Ejemplos escritos para los ítems que los piden, en orden, con el ítem y la respuesta. */
export function getExamples(
  questions: Question[],
  answers: AnswersMap,
  testOptions?: ResponseOption[],
): ExampleEntry[] {
  return questions.flatMap((q) => {
    const text = answers[q.id]
    if (q.type !== 'text' || !q.showIf || typeof text !== 'string' || !text.trim()) return []
    if (!shouldShowQuestion(q, answers)) return []
    const item = questions.find((i) => i.id === q.showIf?.questionId)
    if (!item) return []
    const answer = answers[item.id]
    const option = getResponseOptions(item, testOptions).find((o) => o.value === answer)
    return [{ n: itemNumber(questions, item), item: item.text, answerLabel: option?.label ?? String(answer), text: text.trim() }]
  })
}
