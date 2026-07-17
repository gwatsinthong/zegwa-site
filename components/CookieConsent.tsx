'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HELV } from './sections'
import { type ConsentChoice, applyConsent, readConsentCookie, writeConsentCookie } from '@/lib/consent'

// Bottom-fixed consent bar (not a modal, so it never covers the hero on
// first visit). Shows only when no choice is stored, and reopens when the
// Footer's "Cookie settings" button dispatches the event below (per
// app/cookies/page.tsx: "change your choice anytime via the cookie settings
// link in the footer"). Copy is verbatim from the task brief; do not reword.
const COPY = 'We use analytics cookies to see how the site gets used. Nothing else, and nothing shared.'

export const REOPEN_EVENT = 'zegwa:open-cookie-settings'

// Both buttons share this base: solid black, sharp corners, no gradient, so
// Accept and Decline carry identical visual weight. Only the label differs.
const BTN =
  'flex-1 border border-[#202020] bg-[#202020] px-[24px] py-[10px] text-[16px] font-bold tracking-[0.16px] text-[#fefefe] outline-none transition-colors hover:bg-black focus-visible:ring-2 focus-visible:ring-[#fefefe] sm:flex-none'

export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [choice, setChoice] = useState<ConsentChoice | null>(null)

  useEffect(() => {
    const stored = readConsentCookie()
    setChoice(stored)
    if (!stored) setOpen(true)

    function reopen() {
      setOpen(true)
    }
    window.addEventListener(REOPEN_EVENT, reopen)
    return () => window.removeEventListener(REOPEN_EVENT, reopen)
  }, [])

  function decide(next: ConsentChoice) {
    writeConsentCookie(next)
    applyConsent(next)
    setChoice(next)
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      style={{ fontFamily: HELV }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-[#e8e8e8]"
    >
      <div className="mx-auto flex w-full max-w-shell flex-col gap-[16px] px-6 py-[20px] sm:flex-row sm:items-center sm:justify-between sm:gap-[24px]">
        <div className="flex flex-col gap-[4px]">
          <p className="max-w-[560px] text-[14px] leading-[1.5] text-[#202020]">
            {COPY}{' '}
            <Link
              href="/cookies"
              className="font-bold underline underline-offset-2 outline-none focus-visible:text-[#5c5c5c]"
            >
              Cookie Policy
            </Link>
          </p>
          {choice && (
            <p className="text-[12px] leading-[1.5] text-[#5c5c5c]">
              Current choice: {choice === 'accepted' ? 'Accepted' : 'Declined'}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-[12px]">
          <button type="button" onClick={() => decide('declined')} aria-pressed={choice === 'declined'} className={BTN}>
            Decline
          </button>
          <button type="button" onClick={() => decide('accepted')} aria-pressed={choice === 'accepted'} className={BTN}>
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
