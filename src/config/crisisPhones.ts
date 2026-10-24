/**
 * @file config/crisisPhones.ts
 * @description Teléfonos de ayuda de la UI de crisis — única fuente.
 * Los usan SupportBlock (ResultCard) y CrisisBar (TestContainer).
 * Lista y rótulos según .claude/rules/safety.md: no cambiar sin instrucción de Emmanuel.
 * (La página /ayuda-urgente tiene su propio directorio en src/data/help-resources/.)
 */

export interface CrisisPhone {
  /** Para qué situación es (se muestra delante del número) */
  situation: string
  /** Número tal como se lee */
  number: string
  /** Número para el enlace tel: */
  tel: string
  /** Nombre del servicio */
  label: string
}

export const CRISIS_PHONES: CrisisPhone[] = [
  { situation: 'Peligro inmediato',           number: '112',          tel: '112',       label: 'Emergencias' },
  { situation: 'Crisis o conducta suicida',   number: '024',          tel: '024',       label: 'Línea de atención a la conducta suicida' },
  { situation: 'Apoyo emocional',             number: '717 003 717',  tel: '717003717', label: 'Teléfono de la Esperanza' },
  { situation: 'Menores',                     number: '900 20 20 10', tel: '900202010', label: 'Fundación ANAR' },
]

/** Busca un teléfono por su número de marcación */
export function getCrisisPhone(tel: string): CrisisPhone {
  const phone = CRISIS_PHONES.find((p) => p.tel === tel)
  if (!phone) throw new Error(`Teléfono de crisis no definido: ${tel}`)
  return phone
}
