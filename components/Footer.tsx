import Link from 'next/link'
import ZMark from './ZMark'

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

const SOCIALS: { label: string; path: string }[] = [
  {
    label: 'LinkedIn',
    path: 'M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.7 8.65 22 10.6 22 14v7h-4v-6.2c0-1.5-.03-3.4-2.07-3.4-2.07 0-2.39 1.6-2.39 3.3V21H9V9Z',
  },
  {
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17C2.41 8.5 2.4 8.85 2.4 12s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4C15.5 4.01 15.15 4 12 4Zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.14-.94a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z',
  },
  {
    label: 'X',
    path: 'M17.53 3H20.5l-6.5 7.43L21.75 21h-5.98l-4.68-6.12L5.7 21H2.73l6.95-7.95L2.5 3h6.13l4.23 5.6L17.53 3Zm-1.05 16.2h1.65L7.6 4.72H5.83L16.48 19.2Z',
  },
  {
    label: 'Telegram',
    path: 'M21.94 4.3 18.9 19.2c-.23 1.02-.83 1.27-1.68.79l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.74 8.63-7.8c.38-.33-.08-.52-.58-.19l-10.67 6.72-4.6-1.44c-1-.31-1.02-1 .21-1.48l17.97-6.93c.83-.31 1.56.2 1.29 1.47Z',
  },
  {
    label: 'WhatsApp',
    path: 'M12 2a10 10 0 0 0-8.6 15.06L2 22l5.06-1.33A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 0 1 6.86 12.7l.02.03-.9 3.28-3.36-.88-.22.13A8.2 8.2 0 1 1 12 3.8Zm-3.1 4.03c-.15 0-.4.06-.6.29-.21.23-.8.78-.8 1.9s.82 2.2.93 2.36c.11.15 1.6 2.55 3.98 3.48 1.98.78 2.38.62 2.81.58.43-.04 1.39-.57 1.58-1.11.2-.55.2-1.02.14-1.11-.06-.1-.21-.15-.44-.27-.23-.11-1.39-.68-1.6-.76-.22-.08-.37-.11-.53.12-.15.23-.6.76-.74.91-.14.15-.27.17-.5.06-.23-.12-.98-.36-1.86-1.15-.69-.61-1.15-1.37-1.29-1.6-.13-.23-.01-.35.1-.47.11-.11.23-.27.34-.4.12-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.52-1.28-.72-1.75-.18-.44-.37-.38-.51-.39l-.43-.01Z',
  },
]

function SocialIcon({ path, label }: { path: string; label: string }) {
  return (
    <a
      href="#"
      aria-label={`Zegwa on ${label}`}
      className="text-[#cecece] outline-none transition-colors hover:text-white focus-visible:text-white"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  )
}

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
                <div className="flex items-center gap-4">
                  {SOCIALS.map((s) => (
                    <SocialIcon key={s.label} path={s.path} label={s.label} />
                  ))}
                </div>
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
