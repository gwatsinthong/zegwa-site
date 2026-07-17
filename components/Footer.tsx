'use client'

import Link from 'next/link'
import { SocialLinks } from './Social'
import { HELV } from './sections'
import { REOPEN_EVENT } from './CookieConsent'

// Figma-faithful footer (frame 321:1659) in the Helvetica stack, matching the
// body. Dark band: gradient #272729 to #0c0c0d, #cecece top rule, #9d9a9a
// labels, #cecece bold links. The STUDIO wordmark is red per the frame.

// CAPTURE CARVE-OUT: no "Capture" link — /capture is out of scope. The item is
// omitted (not repointed) so the footer offers only real routes.
const OFFERS = [
  { label: 'Get free audit', href: '/start' },
  { label: 'Pricing', href: '/pricing' },
]

// HIDDEN (reversible): the "Found" link pointed at "/", which is already
// reachable via the Home nav item and reads oddly grouped under Offers (it's
// the product name, not something you can click through to buy separately
// from the home page itself). Lifted out rather than deleted. To restore,
// move this back into the OFFERS array above.
const hiddenFoundOffer = { label: 'Found', href: '/' }

// HIDDEN (reversible, restore when these pages exist): the Verticals column
// linked to /hvac, /plumbing, /roofing, /electrical, /weight-loss-clinics,
// /med-spa, and /dental -- none of those routes exist yet. Lifted out of the
// rendered columns and preserved verbatim here rather than deleted; every
// other footer link was checked and does resolve to a real route. To
// restore, move this back into the LinkColumn grid below.
const VERTICALS = [
  { label: 'HVAC', href: '/hvac' },
  { label: 'Plumbing', href: '/plumbing' },
  { label: 'Roofing', href: '/roofing' },
  { label: 'Electrical', href: '/electrical' },
  { label: 'Weight-loss clinics', href: '/weight-loss-clinics' },
  { label: 'Med spa', href: '/med-spa' },
  { label: 'Dental', href: '/dental' },
]

const EXPLORE = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
]

const LEGAL = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
]

const LABEL = 'text-[14px] font-medium uppercase leading-none text-[#9d9a9a]'
const LINK = 'text-[16px] font-bold tracking-[0.16px] text-[#cecece] outline-none transition-colors hover:text-white focus-visible:text-white'

function LinkColumn({
  title,
  links,
  extra,
}: {
  title: string
  links: { label: string; href: string }[]
  extra?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className={LABEL}>{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className={LINK}>
              {l.label}
            </Link>
          </li>
        ))}
        {extra}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      style={{ fontFamily: HELV }}
      className="border-t-2 border-[#cecece] bg-gradient-to-b from-[#272729] to-[#0c0c0d] text-[#cecece]"
    >
      <div className="mx-auto w-full max-w-shell px-6 py-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* Brand lockup (frame Group 9). Gwatsin's real logo asset, dark-bg
              variant (white wordmark, light Z badge) at the natural 205x34. */}
          <div className="flex max-w-[250px] flex-col gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-inverse.svg"
              alt="Zegwa Studio"
              width={205}
              height={34}
              className="h-[34px] w-auto"
            />
            <p className="max-w-[197px] text-[14px] font-bold text-[#cecece]">
              Helping businesses get found and book more.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            <LinkColumn title="Offers" links={OFFERS} />
            {/* HIDDEN: Verticals column lifted into the unused `VERTICALS`
                const above -- none of its routes exist yet. Restore this
                column (and grid-cols-3 -> grid-cols-4 above) when they do. */}
            <LinkColumn title="Explore" links={EXPLORE} />
            <LinkColumn
              title="Legal"
              links={LEGAL}
              extra={
                <li>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event(REOPEN_EVENT))}
                    className={`text-left ${LINK}`}
                  >
                    Cookie settings
                  </button>
                </li>
              }
            />
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <p className={LABEL}>Get in touch</p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:hello@zegwastudio.com"
                  className="text-[14px] font-bold text-[#cecece] outline-none transition-colors hover:text-white focus-visible:text-white"
                >
                  hello@zegwastudio.com
                </a>
                <SocialLinks linkClassName="text-[#cecece] hover:text-white focus-visible:text-white" />
              </div>
            </div>

            <div className="flex max-w-[253px] flex-col gap-4">
              <p className={LABEL}>Company</p>
              <address className="text-[14px] font-bold not-italic leading-relaxed text-[#cecece]">
                Zegwa Studio (OPC) Private Limited
                <br />
                <br />
                No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk, Bangalore
                South, Karnataka, India 560095
              </address>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-[14px] font-bold text-[#9d9a9a] md:flex-row md:justify-between">
          <p>© 2026 Zegwa Studio (OPC) Private Limited. All rights reserved.</p>
          <p>CIN: U62012KA2026OPC218915</p>
        </div>
      </div>
    </footer>
  )
}
