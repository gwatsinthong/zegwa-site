'use client'

import { useEffect, useRef, useState } from 'react'

// Wraps a block (typically a whole <section>) and fades/rises it in the
// first time it crosses into the viewport, then stays -- an entrance, not a
// repeating/scroll-linked effect (see ScrollTint for that). Unlike Reveal
// (which exposes `data-visible` for children to react to individually via
// Tailwind's `group-data-` variant, needed when only PART of a block should
// animate on its own timing, e.g. the statement section's rules drawing in
// before its text), FadeUp animates itself as a single unit with zero
// changes required to whatever's inside it -- the fast, low-risk way to wrap
// existing sections wholesale across many pages.
export default function FadeUp({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      // threshold near 0 so this fires as soon as any part of the wrapped
      // element enters the viewport -- a percentage threshold (e.g. 0.15)
      // requires that fraction of the ELEMENT'S OWN height to be visible,
      // which a tall wrapped section (e.g. a whole page body) may never
      // reach from a normal scroll position, leaving it stuck at opacity-0
      // indefinitely (only "fixed" by a reflow, like opening DevTools).
      { threshold: 0.01, rootMargin: '0px 0px -80px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-[24px] opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
