import type { Metadata } from 'next'
import { HELV, FRAME_TYPE, RuleRow, Mark, PillCta } from '@/components/sections'
import StartAuditForm from '@/components/StartAuditForm'

// ORPHAN PAGE: noindex, not in nav, not in footer, no inbound internal links,
// absent from app/sitemap.ts (leave it that way). This is the landing target
// for the business-card QR: a standalone software-services page, India-facing,
// unrelated to the Found product the rest of the site sells. Built from the
// locked sections.tsx primitives, pattern (b) -- the centered pillar-page hero
// and section rhythm used by local-seo/google-business-profile -- rather than
// the trade-page BrowserFrame hero, since there's no single demo site to show
// here. metadata is hand-written (skips pageMeta) so robots can be set.

export const metadata: Metadata = {
  title: 'Zegwa Studio',
  description: 'Websites, apps, and software, designed, built, and run for you.',
  robots: { index: false, follow: false },
}

const WHATSAPP_HREF = 'https://wa.me/917026949689'
const CALL_HREF = 'tel:+917026949689'
const EMAIL_HREF = 'mailto:hello@zegwastudio.com'

const BUILD_ITEMS = [
  {
    label: 'Web design and development',
    desc: 'Modern, fast websites and web apps, built to convert and easy to run.',
  },
  {
    label: 'Mobile app development',
    desc: 'iOS and Android apps, built cross-platform to keep cost and timelines down.',
  },
  {
    label: 'Custom software and AI',
    desc: 'Dashboards, portals, and AI tools shaped around how you actually work.',
  },
  {
    label: 'Online stores and e-commerce',
    desc: 'Sell online with catalog, payments, and delivery, including ONDC.',
  },
]

const GROW_ITEMS = [
  {
    label: 'Local SEO and Google presence',
    desc: 'Rank on Google and Maps so customers find you and trust you.',
  },
  {
    label: 'Cloud setup and accounts',
    desc: 'Your tools, accounts, and services set up right and kept secure.',
  },
  {
    label: 'Automation and WhatsApp',
    desc: 'Bookings, reminders, and follow-ups handled without hiring for it.',
  },
  {
    label: 'Care and maintenance',
    desc: 'One point of contact for everything technical, on a simple monthly plan.',
  },
]

const HOW_WE_WORK_ITEMS = [
  {
    label: 'Fixed scope, clear price',
    desc: "You know what you're getting and the cost before we start.",
  },
  {
    label: 'You own everything',
    desc: 'Your site, your accounts, and your data, always in your name.',
  },
  {
    label: 'One point of contact',
    desc: 'You deal with us directly, from start to finish.',
  },
  {
    label: 'No jargon, plain answers',
    desc: 'You never need to understand the technical part.',
  },
]

const CONTACT_ROWS = [
  { label: 'WhatsApp', value: '+91 70269 49689', href: WHATSAPP_HREF },
  { label: 'Call', value: '+91 70269 49689', href: CALL_HREF },
  { label: 'Email', value: 'hello@zegwastudio.com', href: EMAIL_HREF },
  { label: 'Based in', value: 'Bangalore', href: null },
]

// Service cards (Build, Grow and run): image slot on top, then title and
// line. No outer grey shell -- cards sit directly on the page background.
// The image slot is a plain grey placeholder block (not a real screenshot);
// swap the div for a real <img> per card once real product/site images exist.
function ServiceGrid({ items }: { items: { label: string; desc: string }[] }) {
  return (
    <div className="grid w-full grid-cols-1 gap-[24px] sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-[16px] rounded-[16px] bg-[#fefefe] p-[16px] shadow-[-1px_-1px_2px_0px_rgba(0,0,0,0.1),1px_1px_2px_0px_rgba(0,0,0,0.1)]"
        >
          <div aria-hidden="true" className="aspect-[16/10] w-full rounded-[8px] bg-[#e0e0e0]" />
          <div className="flex flex-col gap-[8px] px-[8px] pb-[8px]">
            <h3 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.cardTitle}`}>
              {item.label}
            </h3>
            <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// How-we-work cards: a small stroke-line icon instead of an image slot (these
// are principles, not services -- nothing to screenshot). One glyph per
// principle, same stroke weight/box, muted grey to keep red reserved for CTAs.
const ICON_PROPS = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
}

function TagIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M13 3 21 11 13 19a2 2 0 0 1-2.8 0L4 12.8V5a2 2 0 0 1 2-2h7Z" />
      <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 3 19 6v6c0 5-3.2 7.6-7 9-3.8-1.4-7-4-7-9V6l7-3Z" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5 20c0-4 3-6 7-6s7 2 7 6" />
    </svg>
  )
}

function SpeechIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M4 5h16v11H9l-3 3v-3H4V5Z" />
      <path d="M8 9h8M8 12h5" />
    </svg>
  )
}

const HOW_WE_WORK_ICONS = [TagIcon, ShieldIcon, PersonIcon, SpeechIcon]

function PrincipleGrid({ items }: { items: { label: string; desc: string }[] }) {
  return (
    <div className="grid w-full grid-cols-1 gap-[24px] sm:grid-cols-2">
      {items.map((item, i) => {
        const Icon = HOW_WE_WORK_ICONS[i]
        return (
          <div
            key={item.label}
            className="flex flex-col gap-[12px] rounded-[16px] bg-[#fefefe] p-[24px] shadow-[-1px_-1px_2px_0px_rgba(0,0,0,0.1),1px_1px_2px_0px_rgba(0,0,0,0.1)]"
          >
            <span className="text-[#5c5c5c]">
              <Icon />
            </span>
            <h3 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.cardTitle}`}>
              {item.label}
            </h3>
            <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{item.desc}</p>
          </div>
        )
      })}
    </div>
  )
}

export default function StartServicesPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ============================== FREE AUDIT FORM ============================== */}
      <section className="px-6 pb-[64px] pt-[64px] sm:pb-[80px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-[40px]">
          <div className="flex flex-col items-center gap-[16px] text-center">
            <RuleRow>Free audit</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`text-balance text-center text-[#202020] ${FRAME_TYPE.h3}`}
            >
              Tell us what you&#39;re building.
            </h2>
            <p className="max-w-[440px] text-[16px] leading-[1.5] text-[#5c5c5c]">
              Pick what you need and send it over. We&#39;ll take a look and tell you what it
              would take, free.
            </p>
          </div>
          <StartAuditForm />
        </div>
      </section>

      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            {/* RuleRow's label span is whitespace-nowrap (locked in
                sections.tsx), so the full eyebrow overflows at narrow
                viewports. Swap to a shorter mobile-safe variant below sm;
                the full verbatim copy renders from sm up. */}
            <div className="sm:hidden">
              <RuleRow>Zegwa Studio</RuleRow>
            </div>
            <div className="hidden sm:block">
              <RuleRow>Zegwa Studio &middot; Software</RuleRow>
            </div>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              We build websites, apps, and software.
            </h1>
            <p className="max-w-[560px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              Design, development, and everything technical, handled for you. You get on with
              running your business.
            </p>
          </div>
          <div className="flex flex-col items-center gap-[16px] sm:flex-row">
            <PillCta label="Message on WhatsApp" href={WHATSAPP_HREF} tone="black" />
            <PillCta label="Call" href={CALL_HREF} tone="white" />
          </div>
        </div>
      </section>

      {/* =============================== BUILD =================================== */}
      <section className="px-6 py-[64px] sm:py-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark />
            <RuleRow>Build</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[500px] text-balance text-center text-[#202020] ${FRAME_TYPE.h2}`}
            >
              Design and development.
            </h2>
          </div>
          <ServiceGrid items={BUILD_ITEMS} />
        </div>
      </section>

      {/* ============================ GROW AND RUN ================================ */}
      <section className="px-6 pb-[64px] sm:pb-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark />
            <RuleRow>Grow and run</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[500px] text-balance text-center text-[#202020] ${FRAME_TYPE.h2}`}
            >
              Get found, stay running.
            </h2>
          </div>
          <ServiceGrid items={GROW_ITEMS} />
        </div>
      </section>

      {/* ============================== HOW WE WORK =============================== */}
      <section className="px-6 pb-[64px] sm:pb-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark />
            <RuleRow>How we work</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[500px] text-balance text-center text-[#202020] ${FRAME_TYPE.h2}`}
            >
              Simple and accountable.
            </h2>
          </div>
          <PrincipleGrid items={HOW_WE_WORK_ITEMS} />
        </div>
      </section>

      {/* ================================ CONTACT =================================== */}
      <section className="border-y-2 border-[#cecece] bg-[#202020] px-6 py-[64px] text-[#fefefe] sm:py-[80px]">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-[40px] text-center">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark onDark />
            <RuleRow onDark>Get in touch</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className="text-balance text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#fefefe] sm:text-[48px] sm:tracking-[-1.44px]"
            >
              Zegwa Studio
            </h2>
            <p className="max-w-[400px] text-[18px] leading-[1.5] text-[#9d9a9a] sm:text-[20px]">
              Tell us what you need. We&#39;ll tell you what it takes.
            </p>
          </div>

          <div className="flex w-full flex-col gap-[16px] text-left">
            {CONTACT_ROWS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-[16px] border-t border-white/10 pt-[16px]"
              >
                <span className="text-[14px] font-medium uppercase leading-none text-[#9d9a9a]">
                  {row.label}
                </span>
                {row.href ? (
                  <a
                    href={row.href}
                    className="text-[16px] font-bold tracking-[0.16px] text-[#fefefe] outline-none transition-colors hover:text-[#cecece] focus-visible:text-[#cecece]"
                  >
                    {row.value}
                  </a>
                ) : (
                  <span className="text-[16px] font-bold tracking-[0.16px] text-[#fefefe]">
                    {row.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== PAGE FOOTNOTE ================================ */}
      <p className="px-6 py-[24px] text-center text-[12px] font-medium leading-[1.5] text-[#9d9a9a]">
        Zegwa Studio &middot; Software &middot; Bangalore
      </p>
    </div>
  )
}
