'use client'

import Link from 'next/link'
import { useState } from 'react'
import ZMark from './ZMark'
import { HELV, PillCta } from './sections'

// Figma-faithful header (frame 321:1287) in the Helvetica stack, matching the
// body so there is no font seam. CAPTURE CARVE-OUT: the frame header has a
// "Home" item and an "Offers" dropdown; we keep the Found-only nav
// (Pricing / About / Contact) and drop both. This is the one intentional
// deviation from the frame in the header.

const NAV = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{ fontFamily: HELV }} className="sticky top-0 z-50 bg-[#f6f5f2]">
      <div className="mx-auto flex w-full max-w-shell items-center px-6 py-[16px]">
        {/* Logo (frame 321:1290): 32x31 Z mark + Zegwa wordmark. Swap: real Z asset */}
        <Link href="/" aria-label="Zegwa home" onClick={() => setOpen(false)} className="flex flex-1 items-center gap-[10px]">
          <ZMark className="h-[31px] w-[32px] text-[#202020]" />
          <span className="text-[24px] font-bold leading-none tracking-[-0.24px] text-[#202020]">Zegwa</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-[32px] md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[16px] font-bold tracking-[0.16px] text-[#5c5c5c] transition-colors hover:text-[#202020]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <PillCta tone="light" href="/start" label="Get free audit" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="ml-auto flex h-10 w-10 items-center justify-center text-[#202020] md:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {open && (
        <nav className="bg-[#f6f5f2] px-6 pb-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-[16px] font-bold tracking-[0.16px] text-[#5c5c5c] transition-colors hover:text-[#202020]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2">
              <PillCta tone="light" href="/start" label="Get free audit" />
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="19" y1="5" x2="5" y2="19" />
        </>
      ) : (
        <>
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </>
      )}
    </svg>
  )
}
