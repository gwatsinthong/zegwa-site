'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HELV, PillCta } from './sections'

// Figma-faithful header (frame 321:1287) on the Helvetica stack. The nav is
// locked to Home / Pricing / About / Contact plus the "Get free audit" pill.
// DEVIATION (intentional): the frame's "Offers" dropdown is omitted because it
// points to Capture, which does not exist as a route.

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const NAV_LINK =
  'text-[16px] font-bold tracking-[0.16px] text-[#5c5c5c] transition-colors hover:text-[#202020]'

export default function Header() {
  const [open, setOpen] = useState(false)

  // Transparent, non-sticky header (frame 321:1287 authors no header fill and
  // the frame is a static artboard). The page surface #e8e8e8 shows through and
  // the vertical margin rules pass behind it. In normal flow the header paints
  // over the surface (above the -z-10 rules) and scrolls away with the page, so
  // it never overlaps the dark band or footer.
  return (
    <header style={{ fontFamily: HELV }}>
      <div className="mx-auto flex w-full max-w-[1040px] items-center gap-[32px] px-6 py-[24px]">
        {/* Logo lockup (frame 321:1287). Swap: /logo.svg is a reconstruction of
            the frame mark (dark Z badge + "Zegwa Studio") at the natural 205x34;
            replace it with Gwatsin's real asset at the same path. */}
        <Link
          href="/"
          aria-label="Zegwa Studio home"
          onClick={() => setOpen(false)}
          className="flex flex-1 items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Zegwa Studio" width={205} height={34} className="h-[34px] w-auto" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-[32px] md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={NAV_LINK}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 justify-end md:flex">
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
        <nav className="bg-bg px-6 pb-4 md:hidden">
          <div className="mx-auto flex max-w-[1040px] flex-col gap-4">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={NAV_LINK}>
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
