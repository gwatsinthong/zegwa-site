'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

// Site-wide momentum smooth scrolling (Lenis), mounted once in the root layout.
// Renders nothing. Reduced-motion users are left on native scrolling: Lenis is
// never started. Same-page hash links (#deliverables on home, /#faq in the
// footer) are routed through lenis.scrollTo so they glide instead of jumping;
// cross-page hash links fall through to normal Next navigation.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis()

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    })

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return
      const anchor = (e.target as HTMLElement | null)?.closest('a')
      if (!anchor) return
      const url = new URL(anchor.href, window.location.href)
      // Only handle same-page in-document hashes; let Next route the rest.
      if (url.origin !== window.location.origin) return
      if (!url.hash || url.hash === '#') return
      if (url.pathname !== window.location.pathname) return
      let target: Element | null = null
      try {
        target = document.querySelector(url.hash)
      } catch {
        return
      }
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement)
      history.pushState(null, '', url.hash)
    }
    document.addEventListener('click', onClick)

    // Honor a hash already in the URL on load.
    if (window.location.hash) {
      try {
        const target = document.querySelector(window.location.hash)
        if (target) lenis.scrollTo(target as HTMLElement, { immediate: true })
      } catch {
        /* invalid selector — ignore */
      }
    }

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return null
}
