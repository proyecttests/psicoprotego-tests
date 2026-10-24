/**
 * @file utils/responseOptions.ts
 * @description Resuelve las opciones de respuesta de una pregunta Likert:
 * primero las propias de la pregunta, si no las del test.
 */

import type { Question, ResponseOption } from '@/types/test'

export function getResponseOptions(
  question: Question,
  testOptions: ResponseOption[] | undefined,
): ResponseOption[] {
  return question.responseOptions ?? testOptions ?? []
}
