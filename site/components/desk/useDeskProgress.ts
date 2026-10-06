'use client'
import { useEffect, useState } from 'react'

/** Tiny localStorage-backed "read" checklist. Per-device only, no backend, single user. */
export function useDeskProgress(storageKey: string) {
  const [done, setDone] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      setDone(raw ? JSON.parse(raw) : [])
    } catch {
      setDone([])
    }
    setLoaded(true)
  }, [storageKey])

  function toggle(slug: string) {
    setDone(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  return { done, toggle, loaded }
}
