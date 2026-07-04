import type { Metadata } from 'next'
import {
  HELV,
  FRAME_TYPE,
  RuleRow,
  Mark,
  PillCta,
  SplitFeature,
  FaqList,
} from '@/components/sections'

export const metadata: Metadata = {
  title: 'About · Zegwa',
  description:
    'A studio built to deliver, not to bill hours. We build it, run it, and hand you everything.',
}

// Figma-faithful rebuild of frame 360:4180 "About" (body only; the shell
// supplies Header + Footer). Exact radii, colors, gradients, shadows, and type
// sizes are read per node. Font target is Helvetica Now Display. The two
// image cards are labeled placeholders at the frame's 293px height; swap points
// are commented. All audit CTAs point to /start.

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
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ============================= HERO (360:4183) ========================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>About</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              A studio built to deliver, not to bill hours.
            </h1>
            <p className="max-w-[503px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              Businesses hire us to get found and stop missing bookings. We build it, run it, and
              hand you everything.
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

      {/* ========================== STATEMENT (360:4733) ====================== */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[550px] flex-col items-center gap-[64px]">
          <div
            className="h-[2px] w-full"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #f0f0f0 0%, #cecece 30%, #cecece 70%, #f0f0f0 100%)',
            }}
          />
          <div className="text-[24px] font-bold leading-[1.32] tracking-[-0.72px] text-[#202020] sm:text-[36px] sm:tracking-[-1.08px]">
            <p>The old way of hiring this out is broken.</p>
            <p className="mt-[1.32em]">
              Getting found and answering every call used to mean an agency retainer, a full-time
              front desk, or both. Most local businesses couldn&#39;t justify either.
            </p>
            <p className="mt-[1.32em] text-[#777]">
              New tools changed the math. We can now build and run the whole thing for a fraction of
              what it used to cost, and hand you finished work, not a stack of hours billed.
            </p>
            <p className="mt-[1.32em] text-[#777]">That gap is the entire reason Zegwa exists.</p>
          </div>
          <div
            className="h-[2px] w-full"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #f0f0f0 0%, #cecece 10%, #cecece 90%, #f0f0f0 100%)',
            }}
          />
        </div>
      </section>

      {/* =============== HOW WE WORK (360:4738) / NO LOCK-IN (364:4849) ======== */}
      {WORK.map((section) => (
        <section key={section.kicker} className="px-6 py-[80px] sm:py-[100px]">
          <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
            <div className="flex flex-col items-center gap-[24px]">
              <Mark />
              <RuleRow>{section.kicker}</RuleRow>
              <h2
                style={{ fontFamily: HELV }}
                className={`max-w-[572px] text-center text-[#202020] ${FRAME_TYPE.h2}`}
              >
                {section.heading}
              </h2>
            </div>
            <SplitFeature body={section.body} />
          </div>
        </section>
      ))}

      {/* =============== LET'S GET STARTED + FAQ (360:4361) =================== */}
      <section id="faq" className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
          <div className="flex flex-col items-center gap-[40px]">
            <div className="flex flex-col items-center gap-[24px] text-center">
              <Mark />
              <RuleRow>Let&#39;s get started</RuleRow>
              <h2
                style={{ fontFamily: HELV }}
                className={`max-w-[897px] text-[#202020] ${FRAME_TYPE.display}`}
              >
                You know who we are. One step left.
              </h2>
              <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
                Get your free audit in 24 hours. See exactly where you&#39;re losing bookings before
                you decide anything.
              </p>
            </div>
            <div className="flex flex-col items-center gap-[12px]">
              <PillCta />
              <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
                Your audit in 24 hours. No strings.
              </p>
            </div>
          </div>

          <FaqList items={FAQS} />
        </div>
      </section>
    </div>
  )
}
