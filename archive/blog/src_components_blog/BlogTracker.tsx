'use client'
/**
 * @file components/blog/BlogTracker.tsx
 * @description Fires analytics events for blog pages on mount.
 */
import React from 'react'
import { trackEvent } from '@/config/analytics'

interface BlogTrackerProps {
  slug: string
  lang: string
  tags?: string[]
  relatedTestId?: string
}

export default function BlogTracker({ slug, lang, tags, relatedTestId }: BlogTrackerProps) {
  React.useEffect(() => {
    trackEvent('blog_view', { slug, lang, tags: tags?.join(','), relatedTestId })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
