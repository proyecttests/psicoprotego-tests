/**
 * @file utils/localData.ts
 * @description Borrado de lo que un test deja en el navegador (botón «Borrar mis respuestas»).
 *
 * Las respuestas viven en la memoria de la pestaña (estado de React); el componente que llama
 * las vacía. Aquí se borra el resto: el nombre del PDF y el pase de /start (sessionStorage) y el
 * token de un enlace de resultado antiguo (#d= o ?d=) de la dirección y del historial.
 */

const SESSION_KEYS = ['psico_pdf_name', 'test_access_granted']

export function eraseLocalData(): void {
  if (typeof window === 'undefined') return
  for (const key of SESSION_KEYS) {
    try { sessionStorage.removeItem(key) } catch { /* almacenamiento bloqueado: nada que borrar */ }
  }
  const url = new URL(window.location.href)
  if (url.hash || url.searchParams.has('d')) {
    url.searchParams.delete('d')
    url.hash = ''
    window.history.replaceState(null, '', url.toString())
  }
}
