'use client'

import Link from 'next/link'
import { useState } from 'react'
import Logo from './Logo'

const NAV = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-bg">
      <div className="mx-auto flex w-full max-w-shell items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Zegwa home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-text"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/start"
            className="bg-text px-5 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Get free audit
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-hairline bg-bg px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base text-muted transition-colors hover:text-text"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/start"
              onClick={() => setOpen(false)}
              className="mt-2 bg-text px-5 py-3 text-center text-sm font-medium text-bg"
            >
              Get free audit
            </Link>
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
