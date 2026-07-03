import type { Metadata } from 'next'
import Link from 'next/link'
import AuditCta from '@/components/AuditCta'
import { Arrow } from '@/components/icons'
import { Container, Kicker, SectionMark, TierCard, type Price } from '@/components/sections'

export const metadata: Metadata = {
  title: 'Pricing · Zegwa',
  description:
    'The price is on the page. Always. Pick what fixes your problem, or fix both and save.',
}

// Copy and figures are verbatim from Figma frame 348:1723.

type Tier = {
  name: string
  tagline: string
  setup: Price
  monthly: Price
  features: string[]
  cta: { label: string; href: string }
  highlighted?: boolean
}

const TIERS: Tier[] = [
  {
    name: 'Found',
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
    cta: { label: 'See the fix', href: '/start' },
  },
  {
    name: 'Capture',
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
    cta: { label: 'See the fix', href: '/start' },
  },
  {
    name: 'Bundle',
    tagline: 'Get found and never miss a booking.',
    setup: { old: '$4,500', now: '$4,000', suffix: 'setup' },
    monthly: { prefix: '+', old: '$1,500', now: '$1,300', suffix: '/mo' },
    features: [
      'Everything in Found and Capture',
      'One shared knowledge base, one onboarding',
      'Built together so nothing falls through',
      'Save $500 upfront and $200/mo.',
    ],
    cta: { label: 'Get free audit', href: '/start' },
    highlighted: true,
  },
]

const PROBLEMS = [
  {
    name: 'Found',
    heading: 'Nobody can find you online?',
    body: 'Get seen, get the site working, catch the easy leads.',
    cta: 'Start with Found',
  },
  {
    name: 'Capture',
    heading: 'Getting calls but missing them?',
    body: 'Every call answered, every booking kept. Nothing slips.',
    cta: 'Start with Capture',
  },
  {
    name: 'Bundle',
    heading: 'Got both problems?',
    body: 'The full system, built together, at a lower price.',
    cta: 'Get the Bundle',
  },
]

export default function PricingPage() {
  return (
    <>
      {/* Hero + tiers */}
      <section className="py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-14">
          <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
            <Kicker>Pricing</Kicker>
            <h1>The price is on the page. Always.</h1>
            <p className="max-w-xl text-lg text-muted">
              No calls to book, no quotes to chase. Pick what fixes your problem, or fix both and
              save.
            </p>
          </div>

          <div className="grid w-full gap-6 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <TierCard key={tier.name} {...tier} />
            ))}
          </div>

          <p className="text-center text-muted">
            Not sure which fits? We&#39;ll help you decide.{' '}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 font-medium text-text underline underline-offset-4"
            >
              Contact us
              <Arrow />
            </Link>
          </p>

          <AuditCta />
        </Container>
      </section>

      {/* Not sure which one? */}
      <section className="border-t border-hairline py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-14">
          <div className="flex flex-col items-center gap-6 text-center">
            <SectionMark />
            <Kicker>Not sure which one?</Kicker>
            <div className="flex max-w-xl flex-col gap-4">
              <h2>Spot your problem below, then start there.</h2>
              <p className="text-muted">
                We handle the building, the setup, and the launch. You&#39;re live and booking in
                two weeks.
              </p>
            </div>
          </div>

          <div className="flex w-full max-w-5xl flex-col gap-6">
            {PROBLEMS.map((p) => (
              <div
                key={p.name}
                className="grid items-center gap-8 border border-hairline bg-white p-6 md:grid-cols-2 md:gap-10 md:p-8"
              >
                <div
                  className="aspect-video w-full border border-hairline bg-gradient-to-br from-[#efeeeb] to-[#e2e1de]"
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium uppercase tracking-wide text-muted">
                    {p.name}
                  </p>
                  <h3 className="font-display text-2xl">{p.heading}</h3>
                  <p className="text-muted">{p.body}</p>
                  <Link
                    href="/start"
                    className="mt-2 inline-flex items-center gap-1.5 font-medium text-text underline underline-offset-4"
                  >
                    {p.cta}
                    <Arrow />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Let's get started */}
      <section className="border-t border-hairline py-16 sm:py-24">
        <Container className="flex max-w-2xl flex-col items-center gap-6 text-center">
          <SectionMark />
          <Kicker>Let&#39;s get started</Kicker>
          <h2>Still deciding? Start with the free audit.</h2>
          <p className="max-w-lg text-lg text-muted">
            We&#39;ll show you exactly what you&#39;re missing and which fix pays off first. No
            pressure, no commitment.
          </p>
          <AuditCta className="mt-2" />
        </Container>
      </section>
    </>
  )
}
