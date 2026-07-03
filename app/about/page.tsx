import type { Metadata } from 'next'
import AuditCta from '@/components/AuditCta'
import { ToggleSign, Container, Kicker, SectionMark } from '@/components/sections'

export const metadata: Metadata = {
  title: 'About · Zegwa',
  description:
    'A studio built to deliver, not to bill hours. We build it, run it, and hand you everything.',
}

// Copy is verbatim from Figma frame 360:4180 (the locked, polished version).

const WORK = [
  {
    kicker: 'How we work',
    heading: 'Small team. High standards. Someone accountable.',
    body: [
      'We keep the team small on purpose. The people who scope your work are the people who build and run it, no handoffs, no account managers, no one hiding behind a ticket queue.',
      'That means someone is accountable for your result, every month. We earn the renewal or you cancel. Simple as that.',
    ],
  },
  {
    kicker: 'No lock-in',
    heading: 'Everything we build is yours to keep.',
    body: [
      'The website, the content, the phone number, the agent, the data. Every piece we build is yours. If you ever leave, you take it all with you.',
      "No lock-in, no assets held hostage, no proprietary formats you can't export. We don't trap you into staying. We earn it every month, or you walk with everything.",
    ],
  },
]

const FAQS = [
  {
    q: 'Who actually does the work?',
    a: 'The same small team that scopes your project builds and runs it. No handoffs, no account managers, no surprises.',
  },
  {
    q: 'How long have you been doing this?',
    a: "Zegwa is new, and we're honest about that. What we have instead of a logo wall is a live product, real math, and a free audit with nothing attached.",
  },
  {
    q: 'What makes you different from other AI agencies?',
    a: 'We do two things and do them well. We charge for the outcome, not the hours. And you own everything we build.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-10 text-center">
          <div className="flex max-w-3xl flex-col items-center gap-6">
            <Kicker>About</Kicker>
            <h1>A studio built to deliver, not to bill hours.</h1>
            <p className="max-w-xl text-lg text-muted">
              Businesses hire us to get found and stop missing bookings. We build it, run it, and
              hand you everything.
            </p>
          </div>
          <AuditCta />
        </Container>
      </section>

      {/* Statement */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col gap-8 border-y border-hairline py-12 text-center">
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              The old way of hiring this out is broken. Getting found and answering every call used
              to mean an agency retainer, a full-time front desk, or both. Most local businesses
              couldn&#39;t justify either. New tools changed the math. We can now build and run the
              whole thing for a fraction of what it used to cost, and hand you finished work, not a
              stack of hours billed. That gap is the entire reason Zegwa exists.
            </p>
          </div>
        </Container>
      </section>

      {/* How we work + No lock-in */}
      {WORK.map((section, i) => (
        <section key={section.kicker} className="border-t border-hairline py-16 sm:py-24">
          <Container className="flex flex-col items-center gap-14">
            <div className="flex flex-col items-center gap-6 text-center">
              <SectionMark />
              <Kicker>{section.kicker}</Kicker>
              <h2 className="max-w-2xl">{section.heading}</h2>
            </div>

            <div className="grid w-full max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-12">
              <div
                className="aspect-[3/2] w-full border border-hairline bg-gradient-to-br from-[#efeeeb] to-[#e2e1de]"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-4 text-xl leading-relaxed text-text">
                {section.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* Let's get started + FAQ */}
      <section className="border-t border-hairline py-16 sm:py-24" id="faq">
        <Container className="flex flex-col items-center gap-14">
          <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
            <SectionMark />
            <Kicker>Let&#39;s get started</Kicker>
            <h2>You know who we are. One step left.</h2>
            <p className="max-w-lg text-lg text-muted">
              Get your free audit in 24 hours. See exactly where you&#39;re losing bookings before
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
