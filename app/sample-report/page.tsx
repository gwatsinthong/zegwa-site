import type { Metadata } from 'next'
import Link from 'next/link'
import { Money, Callout } from '@/components/sections'
import { Arrow, Check } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Sample audit report · Zegwa',
  description:
    'A sample of the free audit. The business shown is fictional. Your report uses your real numbers.',
  robots: { index: false, follow: false },
}

// Static sample report. Not linked from nav or footer. Fictional business.
// Numbers are coherent across sections: Capture $3,200 (estimate) + Found $1,500
// (observed) = $4,700/mo; x12 ≈ $56,000.

const ESTIMATE_NOTE = 'Confirmed exactly via a two-week call-tracking test once we start.'
const SEARCH_TERM = '"emergency AC repair Columbus"'

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border border-hairline px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-muted">
      {children}
    </span>
  )
}

function Section({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-hairline pt-10">
      <p className="text-sm font-medium text-muted">{index}</p>
      <h2 className="mt-1 font-display text-2xl sm:text-3xl">{title}</h2>
      <div className="mt-5 flex flex-col gap-4 text-base leading-relaxed text-text">{children}</div>
    </section>
  )
}

const GAPS = [
  {
    title: 'Missed and after-hours calls',
    finding: 'You miss calls, and after hours you miss most of them.',
    proof: 'Your site has no click-to-call and no way to book online. Emergency callers do not wait.',
    cost: 'A person with no heat calls the next name on the list.',
    dollar: '$3,200',
    kind: 'Estimate',
  },
  {
    title: 'No booking path on mobile',
    finding: 'A phone visitor cannot book you in a few taps.',
    proof: 'Your mobile pages score 41 out of 100 for speed. There is no booking button.',
    cost: 'People give up before they reach you.',
    dollar: '$700',
    kind: 'Observed',
  },
  {
    title: 'Unanswered reviews',
    finding: 'Nine reviews have no reply, and your newest review is three weeks old.',
    proof: 'Your rating is 4.1 from 32 reviews. New customers read the replies first.',
    cost: 'A quiet page looks like a closed business.',
    dollar: '$400',
    kind: 'Observed',
  },
  {
    title: 'Citation gaps',
    finding: 'You are listed on 6 of 12 key directories.',
    proof: 'On 3 of those 6, your name, address, or phone does not match.',
    cost: 'Search engines trust you less, so you rank lower.',
    dollar: '$250',
    kind: 'Observed',
  },
  {
    title: 'AI-search absence',
    finding: 'You do not show up when people ask AI for help.',
    proof: `For ${SEARCH_TERM} you are absent from Google AI, ChatGPT, and Perplexity.`,
    cost: 'More people ask AI first every month, and they never see your name.',
    dollar: '$150',
    kind: 'Observed',
  },
]

const CITATIONS = [
  { name: 'Google Business Profile', status: 'Listed' },
  { name: 'Bing Places', status: 'Listed' },
  { name: 'Apple Maps', status: 'Listed' },
  { name: 'Yelp', status: 'Listed, details do not match' },
  { name: 'Angi', status: 'Listed, details do not match' },
  { name: 'Facebook', status: 'Listed, details do not match' },
  { name: 'HomeAdvisor', status: 'Missing' },
  { name: 'Thumbtack', status: 'Missing' },
  { name: 'Better Business Bureau', status: 'Missing' },
  { name: 'Nextdoor', status: 'Missing' },
  { name: 'Yellow Pages', status: 'Missing' },
  { name: 'Houzz', status: 'Missing' },
]

const REVIEWS = [
  {
    text: '"Tech showed up late and never called to say so. Still waiting to hear back."',
    meta: '2 stars · 3 weeks ago · no reply',
  },
  {
    text: '"Good work, but no one answered when I tried to book a follow-up."',
    meta: '3 stars · 1 month ago · no reply',
  },
]

const COMPARISON = [
  { metric: 'Google rating', you: '4.1', them: '4.7' },
  { metric: 'Reviews', you: '32', them: '210' },
  { metric: 'Replies to reviews', you: 'Rarely', them: 'Usually' },
  { metric: `Ranks for ${SEARCH_TERM}`, you: 'No', them: 'Yes' },
]

const PRICING = [
  { name: 'Found', price: '$1,500 setup, then $500/mo' },
  { name: 'Capture', price: '$3,000 setup, then $1,000/mo' },
  { name: 'Bundle', price: '$4,000 setup, then $1,300/mo' },
]

function BlackCta({ label }: { label: string }) {
  return (
    <div className="pt-2">
      <Link
        href="/start"
        className="inline-flex items-center justify-center gap-2 bg-text px-6 py-3 text-base font-medium text-bg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-text/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {label}
        <Arrow />
      </Link>
    </div>
  )
}

export default function SampleReportPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
      {/* Sample banner */}
      <div className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-1 border border-hairline bg-white px-4 py-3 text-sm">
        <span className="font-medium uppercase tracking-wide text-text">Sample report</span>
        <span className="text-muted">
          Northgate Heating &amp; Air is a made-up business. Your report uses your real numbers.
        </span>
      </div>

      {/* 1. The leak, immediately */}
      <section>
        <p className="text-sm font-medium text-muted">Free audit</p>
        <h1 className="mt-2">Northgate Heating &amp; Air</h1>
        <p className="mt-2 text-lg text-muted">Columbus, OH · HVAC</p>

        <div className="mt-8">
          <p className="text-lg text-text">You are losing about</p>
          <p className="mt-1 font-display text-6xl leading-none sm:text-7xl">
            <Money>$4,700</Money>
          </p>
          <p className="mt-2 text-lg text-text">a month.</p>
        </div>

        <p className="mt-6 text-muted">
          This is an estimate. The range is about $3,900 to $5,500 a month. It comes from two
          problems: calls you miss, and a website that does not turn visits into jobs. Here is the
          basis, and the math is below.
        </p>
      </section>

      <div className="mt-12 flex flex-col gap-12">
        {/* 2. The one thing */}
        <Section index="02" title="The one thing">
          <Callout>
            <p className="text-xl">
              {"If you fix one thing, fix this. It's worth about "}
              <Money>$3,200</Money>
              {' of the '}
              <Money>$4,700</Money>.
            </p>
            <p className="mt-4 text-muted">
              The one thing is missed calls. You miss about 5 emergency calls a month. Each job is
              worth about $640. That is your single biggest gap.
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
              <Tag>Estimate</Tag>
              {ESTIMATE_NOTE}
            </p>
          </Callout>
        </Section>

        {/* 3. What we looked at */}
        <Section index="03" title="What we looked at">
          <p>We checked the public signals a new customer would see:</p>
          <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-muted">
            <li>Your Google rating, review count, replies, and how fresh the reviews are.</li>
            <li>Your website: mobile speed, click-to-call, and whether people can book.</li>
            <li>Your listings across 12 key directories, and whether the details match.</li>
            <li>{`Whether you show up in Google AI, ChatGPT, and Perplexity for ${SEARCH_TERM}.`}</li>
            <li>Your top competitor in local search.</li>
          </ul>
          <p className="text-muted">We did not log in to anything. All of this is public.</p>
        </Section>

        {/* 4. The gaps, worst first */}
        <Section index="04" title="The gaps, worst first">
          <div className="flex flex-col gap-4">
            {GAPS.map((g) => (
              <div key={g.title} className="border border-hairline bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <h3 className="font-display text-xl">{g.title}</h3>
                  <p className="text-2xl">
                    <Money>{g.dollar}</Money>
                    <span className="text-base font-normal text-muted">/mo</span>
                  </p>
                </div>
                <dl className="mt-4 flex flex-col gap-3">
                  <div>
                    <dt className="text-sm font-medium uppercase tracking-wide text-muted">
                      What we found
                    </dt>
                    <dd>{g.finding}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium uppercase tracking-wide text-muted">Proof</dt>
                    <dd>{g.proof}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium uppercase tracking-wide text-muted">
                      What it costs you
                    </dt>
                    <dd>{g.cost}</dd>
                  </div>
                </dl>
                <p className="mt-4 flex flex-wrap items-center gap-2">
                  <Tag>{g.kind}</Tag>
                  {g.kind === 'Estimate' && (
                    <span className="text-sm text-muted">{ESTIMATE_NOTE}</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 5. Visual proof */}
        <Section index="05" title="Visual proof">
          <p className="text-muted">
            In your report these are real screenshots of your listings and your site. The boxes
            below are samples.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {['Google Business Profile', 'Your website on mobile', 'PageSpeed: 41 out of 100'].map(
              (label) => (
                <div key={label} className="border border-hairline bg-white p-3">
                  <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-[#efeeeb] to-[#e2e1de]">
                    <Tag>Sample</Tag>
                  </div>
                  <p className="mt-3 text-sm text-muted">{label}</p>
                </div>
              ),
            )}
          </div>
        </Section>

        {/* 6. Citation scan */}
        <Section index="06" title="Citation scan">
          <p>
            You are listed on 6 of 12 key directories. On 3 of those, your details do not match. 6
            are missing.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[26rem] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-hairline bg-black/[0.03] px-3 py-2 text-left font-semibold">
                    Directory
                  </th>
                  <th className="border border-hairline bg-black/[0.03] px-3 py-2 text-left font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {CITATIONS.map((c) => (
                  <tr key={c.name}>
                    <td className="border border-hairline px-3 py-2">{c.name}</td>
                    <td className="border border-hairline px-3 py-2 text-muted">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 7. Reputation */}
        <Section index="07" title="Reputation">
          <p>
            You have 4.1 stars from 32 reviews. Nine reviews have no reply. Your newest review is
            three weeks old. New customers read these before they call.
          </p>
          <div className="flex flex-col gap-4">
            {REVIEWS.map((r) => (
              <blockquote key={r.meta} className="border-l-2 border-hairline pl-4">
                <p>{r.text}</p>
                <footer className="mt-2 text-sm text-muted">{r.meta}</footer>
              </blockquote>
            ))}
          </div>
        </Section>

        {/* 8. Named competitor contrast */}
        <Section index="08" title="How you compare">
          <p>
            {`Buckeye Comfort Systems shows up above you for ${SEARCH_TERM}. Here is the picture, side by side.`}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-hairline bg-black/[0.03] px-3 py-2 text-left font-semibold" />
                  <th className="border border-hairline bg-black/[0.03] px-3 py-2 text-left font-semibold">
                    Northgate Heating &amp; Air
                  </th>
                  <th className="border border-hairline bg-black/[0.03] px-3 py-2 text-left font-semibold">
                    Buckeye Comfort Systems
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((r) => (
                  <tr key={r.metric}>
                    <td className="border border-hairline px-3 py-2 font-medium">{r.metric}</td>
                    <td className="border border-hairline px-3 py-2 text-muted">{r.you}</td>
                    <td className="border border-hairline px-3 py-2 text-muted">{r.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted">
            They have more reviews and they answer them. That is most of the gap.
          </p>
        </Section>

        {/* 9. The do-nothing delta */}
        <Section index="09" title="The cost of waiting">
          <p className="text-xl">
            Left unchanged, that is about <Money>$56,000</Money> over the next 12 months.
          </p>
          <p className="text-muted">
            That is the same <Money>$4,700</Money> a month, twelve times.
          </p>
        </Section>

        {/* 10. The fix, mapped + moat seed (all black) */}
        <Section index="10" title="The fix">
          <p>We sort every gap into two groups.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-hairline bg-white p-6">
              <h3 className="font-display text-xl">Capture (response)</h3>
              <p className="mt-2 text-muted">Missed calls, after-hours calls, no click-to-call.</p>
              <p className="mt-4 text-2xl">
                $3,200<span className="text-base font-normal text-muted">/mo</span>
              </p>
              <p className="mt-2">
                <Tag>Estimate</Tag>
              </p>
            </div>
            <div className="border border-hairline bg-white p-6">
              <h3 className="font-display text-xl">Found (presence)</h3>
              <p className="mt-2 text-muted">
                Booking path, reviews, citations, and AI-search visibility.
              </p>
              <p className="mt-4 text-2xl">
                $1,500<span className="text-base font-normal text-muted">/mo</span>
              </p>
              <p className="mt-2">
                <Tag>Observed</Tag>
              </p>
            </div>
          </div>

          <p>
            Both groups are big here. We recommend the Bundle, so your calls and your presence get
            fixed together.
          </p>

          <div className="border border-hairline bg-white">
            <ul className="divide-y divide-hairline">
              {PRICING.map((p) => (
                <li
                  key={p.name}
                  className="flex flex-wrap items-center justify-between gap-2 px-5 py-3"
                >
                  <span className="font-display text-lg">{p.name}</span>
                  <span className="text-muted">{p.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-lg">
            {"As a client, you'd watch $4,700 come back against this exact $4,700 number every month."}
          </p>

          <BlackCta label="Get your free audit" />
        </Section>

        {/* 11. What we couldn't verify */}
        <Section index="11" title="What we could not verify">
          <p>Some things we cannot see from the outside:</p>
          <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-muted">
            <li>Your real call volume, and how many calls you actually miss.</li>
            <li>Your true after-hours demand.</li>
          </ul>
          <p>
            So the <Money>$3,200</Money> call number is our best estimate from public signals. We
            confirm it exactly with a two-week call-tracking test once we start.
          </p>
          <p className="text-muted">{"So let's confirm these on a 15-minute call."}</p>
          <div className="pt-2">
            <Link
              href="/start"
              className="inline-flex items-center justify-center gap-2 border border-hairline bg-white px-6 py-3 text-base font-medium text-text outline-none transition-colors hover:border-text focus-visible:ring-2 focus-visible:ring-text/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Book the call
              <Arrow />
            </Link>
          </div>
        </Section>

        {/* 12. Signed human close */}
        <Section index="12" title="One more thing">
          <div className="flex flex-col gap-4 border border-hairline bg-white p-6 sm:p-8">
            <p>
              {"We're new. No case studies yet. So we don't ask you to trust us. We ask you to check our math. If it holds up, let's fix the leak together."}
            </p>
            <p className="flex items-center gap-2 text-muted">
              <Check className="text-text" />
              The Zegwa team
            </p>
            <BlackCta label="Get your free audit" />
          </div>
        </Section>
      </div>
    </div>
  )
}
