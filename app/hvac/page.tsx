import Link from 'next/link'
import type { Metadata } from 'next'
import { pageMeta, pageJsonLd, SITE_URL } from '@/lib/seo'
import {
  HELV,
  FRAME_TYPE,
  RuleRow,
  Mark,
  PillCta,
  FaqList,
} from '@/components/sections'
import WhatWeDoBento from '@/components/WhatWeDoBento'
import { BrowserFrame, CheckListDark } from '@/components/vertical-sections'
import PricingCards from '@/components/PricingCards'

export const metadata: Metadata = pageMeta({
  title: 'HVAC SEO',
  description:
    "HVAC SEO done for you. Get found on Google, maps, and AI search when someone's heating or cooling breaks. Setup $1,500, then $500 a month. No minimum. You own everything.",
  path: '/hvac',
})

// Vertical service page, built in the same shape as app/roofing/page.tsx
// (the pillar): same primitives, same section rhythm, same
// FAQS-array-shared-with-pageJsonLd approach. Marketing-site page selling
// the service to HVAC companies; no NAP, no LocalBusiness schema.
//
// PROPAGATION: structure copied from the redesigned app/roofing/page.tsx
// (split hero with BrowserFrame, gradient statement, bento WHAT_WE_DO, dark
// how-it-works band with CheckListDark, pricing, you-own-everything+link,
// FAQ, final CTA). Copy is HVAC's own -- carried over from the previous
// version of this page. FAQS and jsonLd are unchanged.

const WHAT_WE_DO = [
  { title: 'Map pack ranking', desc: 'Rank in the map pack near you' },
  { title: 'Directory listings', desc: 'Fixed everywhere people look you up' },
  { title: 'AI search', desc: 'Found when they ask ChatGPT' },
  { title: 'Reviews', desc: 'New reviews, always answered' },
  { title: 'One dashboard', desc: 'Every search and visit in one place' },
]

const HOW_IT_WORKS = [
  'A fully set-up Google Business Profile',
  'Map pack ranking and accurate directory listings',
  'A steady flow of new reviews',
  "Found in AI search, when someone asks ChatGPT or Google's AI for an HVAC company",
]

const FAQS = [
  {
    q: 'How do I get more HVAC customers from Google?',
    a: "Show up where people look when their heating or cooling breaks. That means a complete Google Business Profile, consistent listings, and a steady flow of reviews, so you appear in the map pack and in search. That's the core of what we set up and keep running.",
  },
  {
    q: 'How long until HVAC SEO shows results?',
    a: 'Listings and profile work show up in days. Ranking movement in local search builds over weeks, not overnight. The free audit shows you where you stand today.',
  },
  {
    q: 'Do I own the website and everything you set up?',
    a: 'Yes. You own everything: the site, the Google Business Profile, the listings, and the reviews. If you ever leave, you keep all of it.',
  },
  {
    q: 'Are you an established agency?',
    a: "No. We're new and we don't have case studies yet. That's why we lead with a free audit that shows you exactly where you're losing HVAC customers, so you can judge the work before you decide anything.",
  },
]

const jsonLd = pageJsonLd({
  service: {
    name: 'HVAC SEO',
    description:
      'Done-for-you SEO for HVAC companies: Google Business Profile, listings, reviews, and AI-search visibility.',
    url: `${SITE_URL}/hvac`,
    serviceType: 'Local SEO',
  },
  faqs: FAQS,
})

export default function HvacPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1140px] flex-col items-start gap-[48px] md:flex-row md:gap-[64px]">
          <div className="flex w-full flex-col items-start gap-[32px] md:max-w-[480px]">
            <div className="flex flex-col items-start gap-[20px]">
              <span className="whitespace-nowrap text-[14px] font-medium uppercase leading-none text-[#777]">
                Local SEO
              </span>
              <h1
                style={{ fontFamily: HELV }}
                className={`text-balance text-left text-[#202020] ${FRAME_TYPE.display}`}
              >
                HVAC SEO
              </h1>
              <p className="text-left text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
                We get your HVAC company found on Google, on maps, and in AI search, so when
                someone&#39;s AC quits in a heatwave or the furnace dies in a cold snap,
                you&#39;re the company they find first. Set up in days, then kept running.
              </p>
            </div>

            <div className="flex flex-col items-start gap-[12px]">
              <PillCta />
              <p className="max-w-[448px] text-left text-[16px] leading-[1.5] text-[#777]">
                Your audit in 24 hours. No strings.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col items-center gap-[12px]">
            <BrowserFrame
              src="/work/hvac.webp"
              url="hvac.zegwastudio.com"
              alt="Sample HVAC site"
              className="w-full max-w-[520px]"
            />
            <div className="flex w-full max-w-[520px] items-center justify-between text-[14px] text-[#777]">
              <span>A real site we built.</span>
              <a
                href="https://hvac.zegwastudio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#202020] underline underline-offset-4"
              >
                See it live →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= STATEMENT (home 321:1331 pattern) ============ */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[590px] flex-col items-center gap-[64px]">
          <div
            className="h-[2px] w-full"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #f0f0f0 0%, #cecece 30%, #cecece 70%, #f0f0f0 100%)',
            }}
          />
          <div className="text-[24px] font-bold leading-[1.32] tracking-[-0.72px] text-[#202020] sm:text-[36px] sm:tracking-[-1.08px]">
            <p className="text-balance text-[#777]">
              We&#39;re new. No case studies yet. So we don&#39;t ask you to trust us. The free
              audit shows you exactly where other HVAC companies are outranking you first. Then
              you decide.
            </p>
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

      {/* ===================== WHAT WE DO (home WHAT YOU GET pattern) =========== */}
      <WhatWeDoBento items={WHAT_WE_DO} />

      {/* ============ WHAT DOES HVAC SEO DO (home dark-band pattern) =========== */}
      <section className="border-y-2 border-[#cecece] bg-[#202020] px-6 py-[64px] text-[#fefefe] sm:py-[80px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[40px] text-center">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark onDark />
            <RuleRow onDark>How it works</RuleRow>
            <h2 style={{ fontFamily: HELV }} className="text-balance text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#fefefe] sm:text-[48px] sm:tracking-[-1.44px]">
              What does HVAC SEO actually do?
            </h2>
            <p className="text-balance text-[24px] font-bold leading-[1.32] tracking-[-0.72px] text-[#fefefe] sm:text-[28px]">
              HVAC SEO makes your company show up when someone nearby searches for heating or air
              conditioning help.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-[24px]">
            <div className="inline-flex flex-col items-start gap-[16px]">
              <CheckListDark items={HOW_IT_WORKS} />
            </div>
            <p className="text-[16px] leading-[1.5] text-[#9d9a9a]">
              All of it kept running together, not a one-time setup.
            </p>
          </div>

          <div className="flex flex-col items-center gap-[12px]">
            <PillCta tone="red" />
            <p className="max-w-[448px] text-[16px] leading-[1.5] text-[#9d9a9a]">
              Your audit in 24 hours. No strings.
            </p>
          </div>
        </div>
      </section>

      {/* ================================ PRICING =============================== */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[32px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <RuleRow>Pricing</RuleRow>
            <h2 style={{ fontFamily: HELV }} className={`max-w-[572px] text-[#202020] ${FRAME_TYPE.h2}`}>
              No quote call. Here&#39;s the price.
            </h2>
          </div>
          <PricingCards />
        </div>
      </section>

      {/* ==================== YOU OWN EVERYTHING + LOCAL SEO LINK-UP ============ */}
      <section className="px-6 pb-[64px] sm:pb-[80px]">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-[16px]">
          <p className="text-balance text-center text-[20px] font-bold leading-[1.4] tracking-[-0.4px] text-[#202020] sm:text-[24px]">
            You own everything. The website, the profile, the listings, the reviews, all of it
            stays yours. If you ever leave, you keep it.
          </p>
          <p className="text-center text-[14px] leading-[1.5] text-[#777]">
            HVAC SEO is local SEO built for one trade.{' '}
            <Link href="/local-seo" className="underline underline-offset-2 hover:text-[#202020]">
              See how the whole system works.
            </Link>
          </p>
          <div
            className="h-[2px] w-full"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #f0f0f0 0%, #cecece 10%, #cecece 90%, #f0f0f0 100%)',
            }}
          />
        </div>
      </section>

      {/* ================================= FAQ =================================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* ================== LET'S GET STARTED (home 321:1623 pattern) =========== */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[40px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <Mark />
            <RuleRow>Let&#39;s get started</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[897px] text-balance text-[#202020] ${FRAME_TYPE.display}`}
            >
              See where you&#39;re losing HVAC jobs.
            </h2>
            <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              The free audit shows you exactly where other HVAC companies are outranking you,
              before you decide anything.
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
