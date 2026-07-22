'use client'

import { useEffect, useRef } from 'react'

// Continuously darkens (or lightens) this paragraph's text color as it
// scrolls through the viewport: fully `from` while its top sits at the
// bottom edge of the viewport, fully `to` once its top reaches the very top.
// Reversible (scrolling back up lightens it again) -- it's a live readout of
// scroll position, not a one-shot reveal like Reveal.tsx. Runs its own rAF
// loop and writes `color` straight to the DOM via ref rather than React
// state, since state would mean a re-render on every scroll frame.
export default function ScrollTint({
  from,
  to,
  className = '',
  style,
  children,
}: {
  from: string
  to: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.color = to
      return
    }

    const [fr, fg, fb] = hexToRgb(from)
    const [tr, tg, tb] = hexToRgb(to)
    let rafId: number

    function update() {
      const rect = el!.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight))
      const r = Math.round(fr + (tr - fr) * progress)
      const g = Math.round(fg + (tg - fg) * progress)
      const b = Math.round(fb + (tb - fb) * progress)
      el!.style.color = `rgb(${r}, ${g}, ${b})`
      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [from, to])

  return (
    <p ref={ref} className={className} style={style}>
      {children}
    </p>
  )
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
