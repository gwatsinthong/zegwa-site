'use client'

import { useEffect, useRef, useState } from 'react'

// Fires once when the wrapped content first crosses into the viewport
// (IntersectionObserver, disconnects after the first hit -- an entrance, not
// a repeating/scroll-linked effect), then exposes that as `data-visible` on
// this wrapper rather than a render-prop function: `children` is called from
// a Server Component page in practice, and Server Components can't pass
// functions as props/children to a Client Component (only serializable
// data), so a render-prop API would crash at build time. Children stay
// ordinary static JSX and react to visibility purely via CSS, using
// Tailwind's `group-data-[visible=true]:` variant (this wrapper carries the
// `group` class).
export default function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
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
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} data-visible={visible} className={`group ${className}`}>
      {children}
    </div>
  )
}
