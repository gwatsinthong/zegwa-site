'use client'

import Link from 'next/link'
import { SocialLinks } from './Social'
import { HELV } from './sections'
import { REOPEN_EVENT } from './CookieConsent'

// Figma-faithful footer (frame 321:1659) in the Helvetica stack, matching the
// body. Dark band: gradient #272729 to #0c0c0d, #cecece top rule, #9d9a9a
// labels, #cecece bold links. The STUDIO wordmark is red per the frame.

// CAPTURE CARVE-OUT: no "Capture" link (/capture is out of scope). The item is
// omitted (not repointed) so the footer offers only real routes.
//
// FOLDED (not deleted): the standalone "Offers" column (Get free audit,
// Pricing) is gone, but both links survive inside EXPLORE below.
const hiddenOffersColumn = [
  { label: 'Get free audit', href: '/start' },
  { label: 'Pricing', href: '/pricing' },
]

// HIDDEN (reversible): the "Found" link pointed at "/", which is already
// reachable via the Home nav item and reads oddly grouped under Offers (it's
// the product name, not something you can click through to buy separately
// from the home page itself). Lifted out rather than deleted. To restore,
// move this back into the EXPLORE array below.
const hiddenFoundOffer = { label: 'Found', href: '/' }

const SERVICES = [
  { label: 'Local SEO', href: '/local-seo' },
  { label: 'Google Business Profile', href: '/google-business-profile' },
  { label: 'AI search', href: '/ai-search-optimization' },
  { label: 'Reviews', href: '/review-management' },
]

const EXPLORE = [
  { label: 'Work', href: '/work' },
  { label: 'Industries', href: '/industries' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Get free audit', href: '/start' },
]

const LEGAL = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
]

const BANGALORE = [
  { label: 'Web design Bangalore', href: '/web-design-bangalore' },
  { label: 'SEO Bangalore', href: '/seo-bangalore' },
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

// Compliance fine print, ~11px muted grey, shared type treatment for the
// full-width band below (see FOOTER, CHANGE 1). Kept quiet on purpose: this
// text is legally required, not something a visitor is meant to read first.
const FINE_PRINT = 'text-[11px] font-medium leading-relaxed text-[#9d9a9a]'
const FINE_PRINT_STRONG = 'text-[11px] font-bold leading-relaxed text-[#cecece]'

export default function Footer() {
  return (
    <footer
      style={{ fontFamily: HELV }}
      className="border-t-2 border-[#cecece] bg-gradient-to-b from-[#272729] to-[#0c0c0d] text-[#cecece]"
    >
      <div className="mx-auto w-full max-w-shell px-6 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          {/* Brand lockup (frame Group 9). Gwatsin's real logo asset, dark-bg
              variant (white wordmark, light Z badge) at the natural 205x34.
              Socials and the contact email live here too now that "Get in
              touch" no longer has its own column. */}
          <div className="flex max-w-[220px] flex-col gap-6">
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
            <SocialLinks size={20} linkClassName="text-[#cecece] hover:text-white focus-visible:text-white" />
            <a
              href="mailto:hello@zegwastudio.com"
              className="text-[14px] font-bold text-[#cecece] outline-none transition-colors hover:text-white focus-visible:text-white"
            >
              hello@zegwastudio.com
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4 lg:grid-cols-4 lg:gap-x-12">
            <LinkColumn title="Services" links={SERVICES} />
            <LinkColumn title="Explore" links={EXPLORE} />
            <LinkColumn title="Bangalore" links={BANGALORE} />
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
        </div>

        {/* ============ COMPLIANCE BAND (full-width, quiet, required) ========= */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:gap-0 sm:divide-x sm:divide-white/10">
          <div className={`flex flex-col gap-1 sm:pr-8 ${FINE_PRINT}`}>
            <p className={FINE_PRINT_STRONG}>Zegwa Studio (OPC) Private Limited</p>
            <address className="not-italic">
              Registered office: No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI
              Bk, Bangalore South, Karnataka 560095, India
            </address>
          </div>
          <div className={`flex flex-col gap-1 sm:px-8 ${FINE_PRINT}`}>
            <p>
              Phone:{' '}
              <a
                href="tel:+917026949689"
                className="outline-none transition-colors hover:text-white focus-visible:text-white"
              >
                +91 7026949689
              </a>
            </p>
            <p>For queries or grievances: Gwatsin Thong</p>
          </div>
          {/* US mailing address: a mailing address only, not an office, HQ, or
              place of business -- Zegwa Studio is an Indian company. Shown here
              so it matches the address in outbound email signatures. */}
          <div className={`flex flex-col gap-1 sm:pl-8 ${FINE_PRINT}`}>
            <p className="uppercase tracking-wide">US mailing address</p>
            <address className="not-italic">
              2232 Dell Range Blvd, Suite 303 1743, Cheyenne, WY 82009, United States
            </address>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-5 text-[14px] font-bold text-[#9d9a9a] md:flex-row md:justify-between">
          <p>© 2026 Zegwa Studio (OPC) Private Limited. All rights reserved.</p>
          <p>CIN: U62012KA2026OPC218915</p>
        </div>
      </div>
    </footer>
  )
}
