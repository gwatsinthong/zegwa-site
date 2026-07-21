'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { ArrowDown } from './sections'

export type NavDropdownGroup = {
  heading?: string
  items: { label: string; href: string }[]
}

const TRIGGER =
  'flex items-center gap-[6px] text-[16px] font-bold tracking-[0.16px] text-[#5c5c5c] outline-none transition-colors hover:text-[#202020] focus-visible:text-[#202020]'

const PANEL =
  'absolute left-0 top-full z-20 mt-[8px] w-max border border-[#e0e0e0] bg-[#fefefe] py-[8px]'

const PANEL_STATIC = 'mt-[8px] w-full border border-[#e0e0e0] bg-[#fefefe] py-[8px]'

const ROW =
  'block whitespace-nowrap px-[16px] py-[8px] text-[14px] text-[#202020] transition-colors hover:bg-[#f0f0f0]'

// Hover-open, keyboard-accessible nav dropdown. Opens on hover, focus, or
// click (so it works on touch where hover never fires); closes on
// mouse-leave, blur to outside the panel, or Escape. `variant="mobile"`
// drops the hover/absolute-panel behavior for the stacked mobile menu, where
// the panel opens in normal flow and only toggles on tap.
export default function NavDropdown({
  label,
  groups,
  onNavigate,
  variant = 'desktop',
}: {
  label: string
  groups: NavDropdownGroup[]
  onNavigate?: () => void
  variant?: 'desktop' | 'mobile'
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = variant === 'mobile'

  function close() {
    setOpen(false)
  }

  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      close()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      close()
      containerRef.current?.querySelector('button')?.focus()
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={isMobile ? undefined : () => setOpen(true)}
      onMouseLeave={isMobile ? undefined : close}
      onFocus={isMobile ? undefined : () => setOpen(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={`${TRIGGER}${isMobile ? ' w-full justify-between' : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ArrowDown className={`h-[12px] w-[12px] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={isMobile ? PANEL_STATIC : PANEL}>
          <div className={isMobile ? 'flex flex-col gap-[16px] px-[8px]' : 'flex items-start gap-[24px] px-[8px]'}>
            {groups.map((group, i) => (
              <div key={group.heading ?? i} className="flex min-w-[160px] flex-col">
                {group.heading && (
                  <p className="px-[16px] pb-[4px] pt-[8px] text-[12px] font-bold uppercase tracking-[0.4px] text-[#777]">
                    {group.heading}
                  </p>
                )}
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={ROW}
                    onClick={() => {
                      close()
                      onNavigate?.()
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
