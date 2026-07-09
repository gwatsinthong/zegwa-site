import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMeta } from '@/lib/seo'
import {
  HELV,
  FRAME_TYPE,
  ArrowRight,
  Framed,
  RuleRow,
  Mark,
  PillCta,
  TierCard,
  type Price,
} from '@/components/sections'

export const metadata: Metadata = pageMeta({
  title: 'Pricing',
  description:
    'See the price on the page. Get found with Found, answer every call with Capture, or bundle both and save. No quotes to chase.',
  path: '/pricing',
})

// Figma-faithful rebuild of frame 348:1723 "Pricing" (body only; the shell
// supplies Header + Footer). Exact radii, colors, gradients, shadows, and type
// sizes are read per node. Font target is Helvetica Now Display. Images are
// labeled placeholders at the frame's dimensions; swap points are commented.
// CAPTURE CARVE-OUT: the Capture tier and the Capture problem row render as
// designed, but every CTA points to /start and no /capture route is linked.
// Each Capture touchpoint is flagged inline.

type Tier = {
  name: string
  tagline: string
  setup: Price
  monthly: Price
  features: string[]
  cta: { label: string; href: string; tone: 'white' | 'blackFlat' }
  highlighted?: boolean
  bestValue?: string
}

const TIERS: Tier[] = [
  {
    name: 'FOUND',
    tagline: 'Get found everywhere they look.',
    setup: { now: '$1,500', suffix: 'setup' },
    monthly: { prefix: '+', now: '$500', suffix: '/mo' },
    features: [
      'The whole site and presence, built for you',
      'Google, maps, directories, and AI search',
      'Reviews, photos, and social handled',
      'Monthly upkeep and reporting',
      'No minimum. Cancel anytime.',
    ],
    cta: { label: 'See the fix', href: '/start', tone: 'white' },
  },
]

// HIDDEN (Found-only launch, restore later): the Capture and Bundle tiers are
// lifted out of TIERS and preserved verbatim here. To restore, move these two
// entries back into the TIERS array above, in this order (Capture, then
// Bundle), after the Found entry.
const hiddenCaptureAndBundleTiers: Tier[] = [
  {
    // CAPTURE CARVE-OUT: Capture tier renders as designed; CTA -> /start.
    name: 'CAPTURE',
    tagline: 'Never miss a call or a booking.',
    setup: { now: '$3,000', suffix: 'setup' },
    monthly: { prefix: '+', now: '$1,000', suffix: '/mo per location' },
    features: [
      'AI front desk on calls, text, and chat',
      'Qualifies leads and books your calendar',
      'Reminders and no-show recovery',
      '1,000 voice minutes, tuning, reporting',
      '3-month minimum, then cancel anytime.',
    ],
    cta: { label: 'See the fix', href: '/start', tone: 'white' },
  },
  {
    name: 'BUNDLE',
    tagline: 'Get found and never miss a booking.',
    setup: { old: '$4,500', now: '$4,000', suffix: 'setup' },
    monthly: { prefix: '+', old: '$1,500', now: '$1,300', suffix: '/mo' },
    features: [
      'Everything in Found and Capture',
      'One shared knowledge base, one onboarding',
      'Built together so nothing falls through',
      'Save $500 upfront and $200/mo.',
    ],
    cta: { label: 'Get free audit', href: '/start', tone: 'blackFlat' },
    highlighted: true,
    bestValue: 'BEST VALUE',
  },
]

type Problem = {
  name: string
  heading: string
  body: string
  cta: { label: string; tone: 'light' | 'blackFlat' }
}

const PROBLEMS: Problem[] = [
  {
    name: 'FOUND',
    heading: 'Nobody can find you online?',
    body: 'Get seen, get the site working, catch the easy leads.',
    cta: { label: 'Start with Found', tone: 'light' },
  },
  {
    // CAPTURE CARVE-OUT: Capture problem row renders as designed; CTA -> /start.
    name: 'CAPTURE',
    heading: 'Getting calls but missing them?',
    body: 'Every call answered, every booking kept. Nothing slips.',
    cta: { label: 'Start with Capture', tone: 'light' },
  },
  {
    name: 'BUNDLE',
    heading: 'Got both problems?',
    body: 'The full system, built together, at a lower price.',
    cta: { label: 'Get the Bundle', tone: 'blackFlat' },
  },
]

export default function PricingPage() {
  // HIDDEN (Found-only launch, restore later): these two sections are lifted out
  // of the returned JSX so the Pricing page ends after the tier cards. Their
  // markup is preserved verbatim in the unused consts below; the render site
  // keeps a marker comment for each. Shared components (Framed, PillCta, Mark,
  // RuleRow) and the PROBLEMS data stay imported/defined because these consts —
  // and other pages — still reference them.
  const hiddenProblemSpotter = (
    <>
      {/* ===================== NOT SURE WHICH ONE? (348:4043) ================== */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark />
            <RuleRow>Not sure which one?</RuleRow>
            <div className="flex max-w-[500px] flex-col items-center gap-[16px] text-center">
              <h2 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h2}`}>
                Spot your problem below, then start there.
              </h2>
              <p className="max-w-[441px] text-[16px] leading-[1.5] text-[#5c5c5c]">
                We handle the building, the setup, and the launch. You&#39;re live and booking in two
                weeks.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-[24px]">
            {PROBLEMS.map((p) => (
              <Framed key={p.name} outer="p-[12px]" inner="p-[32px]" className="w-full">
                <div className="flex flex-col items-center gap-[24px] sm:flex-row">
                  {/* Swap: problem image for "{p.name}" (frame 400x267) */}
                  <div className="flex aspect-[400/267] w-full shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-br from-[#efeeeb] to-[#e2e1de] sm:aspect-auto sm:h-[267px] sm:w-[400px]">
                    <span className="text-[12px] uppercase tracking-wide text-[#777]">image</span>
                  </div>

                  <div className="flex flex-1 flex-col items-start gap-[32px]">
                    <div className="flex w-full flex-col gap-[8px]">
                      <p className="text-[14px] font-bold leading-[1.5] text-[#777]">{p.name}</p>
                      <h3 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h3}`}>
                        {p.heading}
                      </h3>
                      <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{p.body}</p>
                    </div>
                    {/* CAPTURE CARVE-OUT applies to the Capture row; all rows -> /start */}
                    <PillCta label={p.cta.label} href="/start" tone={p.cta.tone} />
                  </div>
                </div>
              </Framed>
            ))}
          </div>
        </div>
      </section>
    </>
  )
  const hiddenClosingCta = (
    <>
      {/* ====================== LET'S GET STARTED (348:2081) =================== */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[40px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <Mark />
            <RuleRow>Let&#39;s get started</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[897px] text-[#202020] ${FRAME_TYPE.display}`}
            >
              Still deciding? Start with the free audit.
            </h2>
            <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              We&#39;ll show you exactly what you&#39;re missing and which fix pays off first. No
              pressure, no commitment.
            </p>
          </div>
          <div className="flex flex-col items-center gap-[12px]">
            <PillCta />
            <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
              Your audit in 24 hours. No strings.
            </p>
          </div>
        </div>
      </section>
    </>
  )

  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ============================= HERO (348:1726) ========================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1188px] flex-col items-center gap-[64px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>Pricing</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              The price is on the page. Always.
            </h1>
            <p className="max-w-[503px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              No calls to book, no quotes to chase. See the price and get started.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-[16px]">
            {/* Tier cards (348:2770): three cards float on the grey counter backing.
                Found-only launch: TIERS currently holds one entry, so this
                centers a single fixed-width card instead of stretching it
                full-width; restoring the hidden tiers (TIERS.length > 1)
                switches this back to the original flex-row layout automatically. */}
            <Framed outer="p-[16px]" bare className="w-full">
              <div
                className={
                  TIERS.length > 1
                    ? 'flex flex-col gap-[16px] lg:flex-row'
                    : 'mx-auto flex max-w-[380px] flex-col gap-[16px]'
                }
              >
                {TIERS.map((tier) => (
                  <TierCard key={tier.name} {...tier} />
                ))}
              </div>
            </Framed>

            {/* Contact line (348:2807) -> /contact */}
            <p className="text-center text-[16px] leading-[1.5] text-[#777]">
              Not sure which fits? We&#39;ll help you decide.{' '}
              <Link
                href="/contact"
                className="inline-flex items-center gap-[4px] align-middle text-[16px] font-bold tracking-[0.16px] text-[#202020]"
              >
                Contact us
                <ArrowRight className="h-[24px] w-[24px]" />
              </Link>
            </p>

            <div className="mt-[16px] flex flex-col items-center gap-[12px]">
              <PillCta />
              <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
                Your audit in 24 hours. No strings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HIDDEN (Found-only launch, restore later): the "Not sure which one?"
          problem-spotter section (348:4043) is lifted into the unused
          `hiddenProblemSpotter` const above. To restore, move that <section>
          back here. */}
      {/* HIDDEN (Found-only launch, restore later): the "Let's get started"
          closing CTA section (348:2081) is lifted into the unused
          `hiddenClosingCta` const above. To restore, move that <section>
          back here. */}
    </div>
  )
}
