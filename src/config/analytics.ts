/**
 * @file config/analytics.ts
 * @description GTM / GA4 analytics helpers para Psicoprotego.
 * Los eventos se envían al dataLayer de GTM (GTM-MN3QW7Q7),
 * que los reenvía automáticamente a GA4 (G-6H96S2FN53).
 */

interface WindowWithDataLayer extends Window {
  dataLayer: Record<string, unknown>[]
}

/**
 * Envía un evento personalizado al dataLayer de GTM.
 * No lanza excepción si dataLayer no está disponible.
 */
export function trackEvent(
  eventName: string,
  data?: Record<string, unknown>,
): void {
  try {
    const w = window as unknown as WindowWithDataLayer
    if (!Array.isArray(w.dataLayer)) return

    w.dataLayer.push({
      event: eventName,
      ...data,
      timestamp: Date.now(),
    })

    if (import.meta.env.DEV) {
      console.log('[Analytics]', eventName, data)
    }
  } catch {
    // Silently ignore — analytics never break UX
  }
}

/**
 * Dispara un evento page_view.
 * Se llama desde App.tsx en cada cambio de ruta.
 */
export function trackPageView(path: string): void {
  trackEvent('page_view', {
    page_path: path,
    page_location: window.location.href,
  })
}
