import Link from 'next/link'
import type { Metadata } from 'next'
import { pageMeta, pageJsonLd, SITE_URL } from '@/lib/seo'
import {
  HELV,
  FRAME_TYPE,
  RuleRow,
  Mark,
  PillCta,
  Callout,
  CheckList,
  FaqList,
} from '@/components/sections'
import PricingCards from '@/components/PricingCards'

export const metadata: Metadata = pageMeta({
  title: 'Landscaping SEO',
  description:
    'Landscaping SEO done for you. Get found on Google, maps, and AI search when someone nearby needs landscaping or lawn care. Setup $1,500, then $500 a month. No minimum. You own everything.',
  path: '/landscaping',
})

// Vertical service page, built in the same shape as app/roofing/page.tsx (and
// the app/local-seo/page.tsx pillar): same primitives, same section rhythm,
// same FAQS-array-shared-with-pageJsonLd approach. Marketing-site page
// selling the service to landscaping businesses; no NAP, no LocalBusiness
// schema.

const WHAT_WE_DO = [
  'Get your Google Business Profile ranking in the map pack for landscaping searches near you',
  'Fix and build your listings across the directories homeowners check',
  "Get you found in AI search, when someone asks ChatGPT or Google's AI for a landscaper",
  'Set up review generation so new job reviews keep coming in',
  'Give you one dashboard to see every search, visit, and review',
]

const FAQS = [
  {
    q: 'How do I get more landscaping jobs from Google?',
    a: "Show up where people look when they want their yard done. That means a complete Google Business Profile, consistent listings, and a steady flow of reviews, so you appear in the map pack and in search. That's the core of what we set up and keep running.",
  },
  {
    q: 'How long until landscaping SEO shows results?',
    a: 'Listings and profile work show up in days. Ranking movement in local search builds over weeks, not overnight. The free audit shows you where you stand today.',
  },
  {
    q: 'Do I own the website and everything you set up?',
    a: 'Yes. You own everything: the site, the Google Business Profile, the listings, and the reviews. If you ever leave, you keep all of it.',
  },
  {
    q: 'Are you an established agency?',
    a: "No. We're new and we don't have case studies yet. That's why we lead with a free audit that shows you exactly where you're losing landscaping jobs to other companies, so you can judge the work before you decide anything.",
  },
]

const jsonLd = pageJsonLd({
  service: {
    name: 'Landscaping SEO',
    description:
      'Done-for-you SEO for landscaping businesses: Google Business Profile, listings, reviews, and AI-search visibility.',
    url: `${SITE_URL}/landscaping`,
    serviceType: 'Local SEO',
  },
  faqs: FAQS,
})

export default function LandscapingPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>Landscaping SEO</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              Landscaping SEO
            </h1>
            <p className="max-w-[560px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              We get your landscaping business found on Google, on maps, and in AI search, so
              when someone nearby wants their yard done, they find you first. Set up in days,
              then kept running.
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

      {/* ========================== DAMAGING ADMISSION ========================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center">
          <Callout className="text-center">
            <p className="text-[18px] leading-[1.5] text-[#202020] sm:text-[20px]">
              We&#39;re new. No case studies yet. So we don&#39;t ask you to trust us. The free
              audit shows you exactly where other landscapers are outranking you first. Then you
              decide.
            </p>
          </Callout>
        </div>
      </section>

      {/* ================= WHAT DOES LANDSCAPING SEO DO (AEO explainer) ======== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[24px] text-center">
          <h2 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h2}`}>
            What does landscaping SEO actually do?
          </h2>
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c] sm:text-[18px]">
            Landscaping SEO makes your business show up when someone nearby searches for
            landscaping or lawn care. It comes from a fully set-up Google Business Profile, the
            map pack, accurate directory listings, a steady flow of reviews, and being found in
            AI search when someone asks ChatGPT or Google&#39;s AI for a landscaper. That&#39;s
            what a landscaping seo company actually delivers: all of it, kept running together.
          </p>
        </div>
      </section>

      {/* ================================ WHAT WE DO ============================ */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[40px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <Mark />
            <RuleRow>What we do</RuleRow>
          </div>
          <CheckList items={WHAT_WE_DO} gap="gap-[16px]" />
        </div>
      </section>

      {/* ============================ SAMPLE SITE =============================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[8px] text-center">
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
            Want to see the kind of site we build? Here&#39;s a sample landscaping site.
          </p>
          <a
            href="https://landscaping.zegwastudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px] font-bold tracking-[0.16px] text-[#202020] underline underline-offset-4"
          >
            See the sample site
          </a>
        </div>
      </section>

      {/* ================================ PRICING =============================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <RuleRow>Pricing</RuleRow>
            <h2 style={{ fontFamily: HELV }} className={`max-w-[572px] text-[#202020] ${FRAME_TYPE.h2}`}>
              No quote call. Here&#39;s the price.
            </h2>
          </div>
          <PricingCards />
        </div>
      </section>

      {/* ========================== YOU OWN EVERYTHING ========================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[500px] flex-col items-center text-center">
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
            You own everything. The website, the profile, the listings, the reviews, all of it
            stays yours. If you ever leave, you keep it.
          </p>
        </div>
      </section>

      {/* ============================ LOCAL SEO LINK-UP ========================= */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center text-center">
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
            Landscaping SEO is local SEO built for one trade. See how the whole system works:{' '}
            <Link href="/local-seo" className="font-bold text-[#202020] underline underline-offset-4">
              Local SEO
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ================================= FAQ =================================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* ============================== FINAL CTA ================================ */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[40px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <Mark />
            <RuleRow>Let&#39;s get started</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[897px] text-[#202020] ${FRAME_TYPE.display}`}
            >
              See where you&#39;re losing landscaping jobs.
            </h2>
            <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              The free audit shows you exactly where other landscapers are outranking you, before
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
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
