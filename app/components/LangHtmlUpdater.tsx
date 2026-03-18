'use client'

import { useEffect } from 'react'

/**
 * Sets <html lang> and <html dir> client-side from the [lang] segment.
 * The root layout renders <html lang="es"> as default (SSR fallback).
 * This component corrects it immediately after hydration.
 */
export function LangHtmlUpdater({ lang, dir }: { lang: string; dir: 'ltr' | 'rtl' }) {
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])
  return null
}
