import type { Metadata } from 'next'
import Link from 'next/link'
import AuditCta from '@/components/AuditCta'
import { Check, Play, Arrow } from '@/components/icons'
import { Container, Kicker, SectionMark, ToggleSign } from '@/components/sections'

export const metadata: Metadata = {
  title: 'Zegwa · Get found before your competitor',
  description:
    'A website and online presence that puts you on Google, maps, directories, and AI search. Live in days.',
}

// Copy is verbatim from Figma frame 321:1283 (the locked, polished version).

const FEATURES = [
  { title: 'Show up in search', desc: 'On Google, maps, and even when they ask AI search.' },
  { title: 'A site that converts', desc: 'Fast, clean, and built to turn a visit into a booking.' },
  { title: 'Listed everywhere', desc: 'Consistent across directories, so you rank and look trusted.' },
  { title: 'Win back old leads', desc: 'A one-time sweep of past inquiries who never booked you.' },
]

const BUILD_ROWS = [
  { build: 'Conversion website', does: 'Fast, clean, built to turn visits into bookings' },
  { build: 'Google Business Profile', does: 'Optimized so you show up in maps and local search' },
  { build: 'Directory listings', does: 'Consistent across the web so you rank and look trusted' },
  { build: 'AI search optimization', does: 'Found when customers ask AI, not just Google' },
  { build: 'Lead reactivation', does: 'A one-time sweep that re-books past inquiries' },
  { build: 'One dashboard', does: 'Every visit, lead, and call tracked in one place you own' },
]

const DELIVERABLES = [
  {
    title: 'Your website',
    items: [
      'Conversion website, built to book',
      'A page for each core service',
      'Location pages for the areas you serve',
      'Booking embed, click-to-call, click-to-WhatsApp',
      'Lead capture forms',
      'Instant-quote / estimator tool',
      'Form auto-reply with instant text-back',
      'Fast, mobile-ready, and speed-optimized',
      'Domain, hosting, and SSL handled',
      'Privacy and terms pages',
    ],
  },
  {
    title: 'Getting found',
    items: [
      'On-page SEO, titles, meta, structured markup',
      'Local and service keyword research',
      'Google Business Profile setup and optimization',
      'Maps and map-pack optimization',
      'Local and industry directory listings',
      'AI search (AEO/GEO) optimization',
      'AI-first FAQ content',
    ],
  },
  {
    title: 'Day-one win',
    items: [
      'One-time dead-lead reactivation sweep, re-books past inquiries who never booked',
    ],
  },
  {
    title: 'Trust & conversion',
    items: [
      'Review-request flow setup',
      'Before/after gallery and social-proof blocks',
      'Social profile claim and setup',
      'FAQ chat widget',
      'Photo and media cleanup',
      'Lead magnet / offer funnel',
    ],
  },
  {
    title: 'Tracking & ownership',
    items: [
      'Analytics and conversion tracking',
      'One dashboard, every visit and lead logged',
      'The site, content, and data are yours to keep',
    ],
  },
  {
    title: 'Ongoing (monthly)',
    items: [
      'Listings and citation upkeep',
      'Review monitoring with AI-drafted responses',
      'AI search (AEO) maintenance',
      'Monthly performance report',
    ],
  },
]

const SETUP_ITEMS = [
  'The whole site and presence, built for you',
  'Google, maps, directories, and AI search set up',
  'Reviews, photos, and social profiles handled',
  'Everything is yours to keep',
]

const ONGOING_ITEMS = [
  'Your listings and citations kept accurate everywhere',
  'New reviews answered for you, in your voice',
  'Your AI and local presence maintained as things shift',
  'A monthly report showing calls, clicks, and bookings',
]

const FAQS = [
  {
    q: 'Is there a contract?',
    a: "No minimum on Found. It's month to month. Cancel anytime.",
  },
  {
    q: 'I already have a website. Do I need a new one?',
    a: "Not always. The audit shows what's working and what's costing you bookings. Sometimes we improve what you have, sometimes a rebuild pays for itself.",
  },
  {
    q: 'Do I own everything?',
    a: 'Yes. The site, the content, the domain, the data. All yours, whether you stay or not.',
  },
]

export default function FoundPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-12 text-center">
          <div className="flex max-w-3xl flex-col items-center gap-6">
            <Kicker>Found</Kicker>
            <h1>Show up when they search, before your competitor.</h1>
            <p className="max-w-xl text-lg text-muted">
              A website and online presence that puts you on Google, maps, directories, and AI
              search. Live in days.
            </p>
          </div>

          {/* VSL: poster placeholder with the reserved red play button */}
          <div className="relative aspect-video w-full max-w-4xl overflow-hidden border border-hairline bg-gradient-to-br from-[#e6e5e2] to-[#d6d5d2]">
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                aria-label="Play the video"
                className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-accent-red text-white shadow-sm outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#d6d5d2]"
              >
                <Play className="ml-0.5" />
              </button>
            </div>
          </div>

          <AuditCta />
        </Container>
      </section>

      {/* Statement */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col gap-8 border-y border-hairline py-12 text-center">
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              Most businesses are invisible online. They don&#39;t show up in search, and the site
              they have just sits there. The customers looking right now are finding someone else.
              We&#39;re new. No case studies yet. So we don&#39;t ask you to trust us. The free audit
              shows you exactly where you&#39;re losing customers first. Then you decide.
            </p>
          </div>
        </Container>
      </section>

      {/* What you get */}
      <section className="border-t border-hairline py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-14">
          <div className="flex flex-col items-center gap-6 text-center">
            <SectionMark />
            <Kicker>What you get</Kicker>
            <div className="flex max-w-xl flex-col gap-4">
              <h2>A website alone won&#39;t get you found.</h2>
              <p className="text-muted">
                Being found takes search, maps, directories, and reviews. We handle all of it.
              </p>
            </div>
          </div>

          <div className="grid w-full gap-6 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col gap-6 border border-hairline bg-white p-8">
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-2xl sm:text-3xl">{f.title}</h3>
                  <p className="text-muted">{f.desc}</p>
                </div>
                <div className="aspect-video w-full border border-hairline bg-gradient-to-br from-[#efeeeb] to-[#e2e1de]" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* The cost of waiting (money band) */}
      <section className="border-y-2 border-[#cecece] bg-[#202020] py-20 text-white sm:py-28">
        <Container className="flex flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-6">
            <SectionMark onDark />
            <Kicker onDark>The cost of waiting</Kicker>
            <h2 className="max-w-xl text-white">
              Right now, someone&#39;s searching. They&#39;re not finding you.
            </h2>
          </div>

          <p className="max-w-md text-xl font-semibold text-[#9d9a9a] sm:text-2xl">
            Every day you&#39;re invisible is a customer who found your competitor instead.
          </p>

          <p className="max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
            Recover 10 bookings. That&#39;s about{' '}
            <span className="text-accent-red">$10,000</span> you almost lost.
          </p>

          <div className="flex max-w-md flex-col gap-4 text-lg text-[#9d9a9a] sm:text-xl">
            <p>And that&#39;s just the first month.</p>
            <p>
              Being found isn&#39;t luck. It&#39;s the setup most businesses never get around to. We
              do it in a few days.
            </p>
          </div>

          <AuditCta variant="red" onDark className="mt-2" />
        </Container>
      </section>

      {/* What's included */}
      <section className="py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-14">
          <div className="flex flex-col items-center gap-6 text-center">
            <SectionMark />
            <Kicker>What&#39;s included</Kicker>
            <div className="flex max-w-xl flex-col gap-4">
              <h2>Everything we build and run for you.</h2>
              <p className="text-muted">
                Set up, optimized, and yours to keep. You don&#39;t touch any of it.
              </p>
            </div>
          </div>

          <div className="w-full border border-hairline bg-white">
            <div className="hidden grid-cols-2 gap-8 border-b border-hairline px-8 py-5 sm:grid">
              <p className="text-sm font-medium uppercase tracking-wide text-muted">What we build</p>
              <p className="text-sm font-medium uppercase tracking-wide text-muted">What it does</p>
            </div>
            {BUILD_ROWS.map((r) => (
              <div
                key={r.build}
                className="grid gap-1 border-b border-hairline px-8 py-5 last:border-b-0 sm:grid-cols-2 sm:gap-8"
              >
                <p className="font-display text-lg">{r.build}</p>
                <p className="text-muted">{r.does}</p>
              </div>
            ))}
          </div>

          <details className="group w-full">
            <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 text-sm font-medium text-text outline-none [&::-webkit-details-marker]:hidden">
              See everything included
              <Arrow className="rotate-90 transition-transform group-open:-rotate-90" />
            </summary>

            <div className="mt-10 border border-hairline bg-white p-8 sm:p-10">
              <p className="mb-8 text-center font-display text-xl">Full deliverables list</p>
              <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {DELIVERABLES.map((group) => (
                  <div key={group.title} className="flex flex-col gap-4">
                    <p className="text-sm uppercase tracking-wide text-muted">{group.title}</p>
                    <ul className="flex flex-col gap-2.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <Check className="mt-0.5 shrink-0 text-text" />
                          <span className="text-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </Container>
      </section>

      {/* Pricing */}
      <section className="border-t border-hairline py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-14">
          <div className="flex flex-col items-center gap-6 text-center">
            <SectionMark />
            <Kicker>Pricing</Kicker>
            <div className="flex max-w-xl flex-col gap-4">
              <h2>The price is on the page. Always.</h2>
              <p className="text-muted">
                Everything built once, then a small monthly to keep you found. No minimum, cancel
                anytime.
              </p>
            </div>
          </div>

          <div className="w-full border border-hairline bg-white">
            <div className="grid gap-10 p-8 sm:grid-cols-2 sm:gap-0">
              <PriceColumn label="Setup" price="$1,500" suffix="one-time" items={SETUP_ITEMS} />
              <PriceColumn
                label="Ongoing"
                price="$500"
                suffix="/mo"
                items={ONGOING_ITEMS}
                className="sm:border-l sm:border-hairline sm:pl-10"
              />
            </div>
          </div>

          <p className="text-center text-muted">
            Want the calls handled too? The Found + Capture bundle saves on both.{' '}
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 font-medium text-text underline underline-offset-4"
            >
              See pricing
              <Arrow />
            </Link>
          </p>

          <AuditCta />
        </Container>
      </section>

      {/* Let's get started + FAQ */}
      <section className="border-t border-hairline py-16 sm:py-24" id="faq">
        <Container className="flex flex-col items-center gap-14">
          <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
            <SectionMark />
            <Kicker>Let&#39;s get started</Kicker>
            <h2>
              The customers are searching. Let&#39;s make sure they find you.
            </h2>
            <p className="max-w-lg text-lg text-muted">
              Get your free audit in 24 hours. See exactly where you&#39;re losing customers before
              you decide anything.
            </p>
            <AuditCta className="mt-2" />
          </div>

          <div className="flex w-full max-w-2xl flex-col gap-3">
            {FAQS.map((item) => (
              <details key={item.q} className="group border border-hairline bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 outline-none [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-lg sm:text-xl">{item.q}</span>
                  <ToggleSign />
                </summary>
                <p className="-mt-2 px-6 pb-6 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}

function PriceColumn({
  label,
  price,
  suffix,
  items,
  className = '',
}: {
  label: string
  price: string
  suffix: string
  items: string[]
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <p className="text-lg uppercase tracking-wide text-muted">{label}</p>
      <p className="font-display leading-none">
        <span className="text-5xl">{price}</span>{' '}
        <span className="text-2xl text-muted">{suffix}</span>
      </p>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <Check className="mt-0.5 shrink-0 text-text" />
            <span className="text-muted">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
