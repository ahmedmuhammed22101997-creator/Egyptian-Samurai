'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

export default function PageViewTracker() {
  const pathname = usePathname()
  const locale = useLocale()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    // Don't track admin or api paths
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return
    // Don't double-track the same path on hot-reload / re-render
    if (lastTracked.current === pathname) return
    lastTracked.current = pathname

    // Fire and forget; ignore failures
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, locale }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname, locale])

  return null
}
