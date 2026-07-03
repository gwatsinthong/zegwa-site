import Link from 'next/link'
import ZMark from './ZMark'
import { SocialLinks } from './Social'

// Shared footer chrome for every page. Rebuilt from Figma node 321:1659.
// Dark band: gradient #272729 to #0c0c0d, hairline top rule, muted labels.

const OFFERS = [
  { label: 'Get free audit', href: '/start' },
  { label: 'Found', href: '/' },
  { label: 'Capture', href: '/capture' },
  { label: 'Pricing', href: '/pricing' },
]

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
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
]

const LEGAL = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
]

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
      <p className="text-sm uppercase tracking-wide text-[#9d9a9a]">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[#cecece] outline-none transition-colors hover:text-white focus-visible:text-white"
            >
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
    <footer className="border-t-2 border-[#cecece] bg-gradient-to-b from-[#272729] to-[#0c0c0d] text-[#cecece]">
      <div className="mx-auto w-full max-w-shell px-6 py-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="flex max-w-[250px] flex-col gap-5">
            <span className="flex items-center gap-2">
              <ZMark className="h-7 w-auto text-[#cecece]" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl text-[#f6f5f2]">Zegwa</span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#9d9a9a]">
                  Studio
                </span>
              </span>
            </span>
            <p className="text-sm text-[#cecece]">
              Helping businesses get found and book more.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            <LinkColumn title="Offers" links={OFFERS} />
            <LinkColumn title="Verticals" links={VERTICALS} />
            <LinkColumn title="Explore" links={EXPLORE} />
            <LinkColumn
              title="Legal"
              links={LEGAL}
              extra={
                <li>
                  <button
                    type="button"
                    className="text-left text-[#cecece] outline-none transition-colors hover:text-white focus-visible:text-white"
                  >
                    Cookie settings
                  </button>
                </li>
              }
            />
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <p className="text-sm uppercase tracking-wide text-[#9d9a9a]">
                Get in touch
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:hello@zegwastudio.com"
                  className="text-sm text-[#cecece] outline-none transition-colors hover:text-white focus-visible:text-white"
                >
                  hello@zegwastudio.com
                </a>
                <SocialLinks linkClassName="text-[#cecece] hover:text-white focus-visible:text-white" />
              </div>
            </div>

            <div className="flex max-w-[253px] flex-col gap-4">
              <p className="text-sm uppercase tracking-wide text-[#9d9a9a]">Company</p>
              <address className="text-sm not-italic leading-relaxed text-[#cecece]">
                Zegwa Studio (OPC) Private Limited
                <br />
                <br />
                No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk,
                Bangalore South, Karnataka, India 560095
              </address>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-[#9d9a9a] md:flex-row md:justify-between">
          <p>© 2026 Zegwa Studio (OPC) Private Limited. All rights reserved.</p>
          <p>CIN: U62012KA2026OPC218915</p>
        </div>
      </div>
    </footer>
  )
}
