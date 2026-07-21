'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HELV, PillCta } from './sections'
import NavDropdown, { type NavDropdownGroup } from './NavDropdown'

// Figma-faithful header (frame 321:1287) on the Helvetica stack. Nav order:
// Home / Work / Industries / Services / Pricing / About / Contact, plus the
// "Get free audit" pill. Industries and Services are hover/keyboard
// dropdowns (see NavDropdown); the rest are flat links.

const NAV_BEFORE = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
]

const NAV_AFTER = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const INDUSTRIES_GROUPS: NavDropdownGroup[] = [
  {
    heading: 'Home & trades',
    items: [
      { label: 'Roofing', href: '/roofing' },
      { label: 'Plumbing', href: '/plumbing' },
      { label: 'HVAC', href: '/hvac' },
      { label: 'Electrical', href: '/electrical' },
      { label: 'Auto repair', href: '/auto-repair' },
      { label: 'Landscaping', href: '/landscaping' },
    ],
  },
  {
    heading: 'Health & wellness',
    items: [
      { label: 'Dental', href: '/dental' },
      { label: 'Chiropractic', href: '/chiropractic' },
      { label: 'Med spa', href: '/med-spa' },
      { label: 'Veterinary', href: '/veterinary' },
      { label: 'Weight loss', href: '/weight-loss' },
      { label: 'Gym', href: '/gym' },
    ],
  },
  {
    heading: 'Professional & other',
    items: [
      { label: 'Law firm SEO', href: '/law-firm-seo' },
      { label: 'Accounting', href: '/accounting' },
      { label: 'Real estate', href: '/real-estate' },
      { label: 'Cleaning', href: '/cleaning' },
    ],
  },
]

const SERVICES_GROUPS: NavDropdownGroup[] = [
  {
    items: [
      { label: 'Local SEO', href: '/local-seo' },
      { label: 'Google Business Profile', href: '/google-business-profile' },
      { label: 'AI search optimization', href: '/ai-search-optimization' },
      { label: 'Review management', href: '/review-management' },
    ],
  },
]

const NAV_LINK =
  'text-[16px] font-bold tracking-[0.16px] text-[#5c5c5c] transition-colors hover:text-[#202020]'

// Header-only override of the shared `light` PillCta: on hover it lifts,
// picks up a soft shadow, and darkens toward near-black (no red). Text/icon
// stay #202020 throughout; only the arrow nudges. Uses arbitrary child
// selectors instead of editing the locked PillCta markup in sections.tsx.
const CTA_HOVER =
  'transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out ' +
  'hover:-translate-y-[1px] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:shadow-lg ' +
  '[&_span]:transition-colors [&_span]:duration-200 [&_span]:ease-out hover:[&_span]:text-[#fefefe] ' +
  '[&_svg]:transition-[color,transform] [&_svg]:duration-200 [&_svg]:ease-out hover:[&_svg]:text-[#fefefe] hover:[&_svg]:translate-x-[4px]'

export default function Header() {
  const [open, setOpen] = useState(false)

  // Transparent, non-sticky header (frame 321:1287 authors no header fill and
  // the frame is a static artboard). The page surface #e8e8e8 shows through and
  // the vertical margin rules pass behind it. In normal flow the header paints
  // over the surface (above the -z-10 rules) and scrolls away with the page, so
  // it never overlaps the dark band or footer.
  return (
    <header style={{ fontFamily: HELV }}>
      {/* px-6 up to 1240px (where layout.tsx's decorative vertical rules stay
          hidden); min-[1240px]:px-[52px] beyond that, since at 1280px nav
          width the rules sit only ~4px past the plain px-6 edge -- 52px
          keeps a consistent ~32px clearance from the rules at every width
          once they're visible. */}
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-[32px] px-6 py-[24px] min-[1240px]:px-[52px]">
        {/* Logo lockup (frame 321:1287): Gwatsin's real logo asset (dark Z badge
            + "Zegwa Studio") at ~22% over the natural 205x34 (250x41) for more
            presence. logo-inverse.svg is the dark-bg companion, used on the
            Footer. h-[41px] pins the render height so it can't stretch the bar
            taller than the nav items' own line height allows. */}
        <Link
          href="/"
          aria-label="Zegwa Studio home"
          onClick={() => setOpen(false)}
          className="flex flex-1 items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Zegwa Studio" width={250} height={41} className="h-[41px] w-auto" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-[32px] md:flex">
          {NAV_BEFORE.map((item) => (
            <Link key={item.href} href={item.href} className={NAV_LINK}>
              {item.label}
            </Link>
          ))}
          <NavDropdown label="Industries" groups={INDUSTRIES_GROUPS} />
          <NavDropdown label="Services" groups={SERVICES_GROUPS} />
          {NAV_AFTER.map((item) => (
            <Link key={item.href} href={item.href} className={NAV_LINK}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 justify-end md:flex">
          <PillCta tone="light" href="/start" label="Get free audit" className={CTA_HOVER} />
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
          <div className="mx-auto flex max-w-[1280px] flex-col gap-4">
            {NAV_BEFORE.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={NAV_LINK}>
                {item.label}
              </Link>
            ))}
            <NavDropdown
              label="Industries"
              groups={INDUSTRIES_GROUPS}
              variant="mobile"
              onNavigate={() => setOpen(false)}
            />
            <NavDropdown
              label="Services"
              groups={SERVICES_GROUPS}
              variant="mobile"
              onNavigate={() => setOpen(false)}
            />
            {NAV_AFTER.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={NAV_LINK}>
                {item.label}
              </Link>
            ))}
            <div className="mt-2">
              <PillCta tone="light" href="/start" label="Get free audit" className={CTA_HOVER} />
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
