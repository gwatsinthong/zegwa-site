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
  title: 'Local SEO for small business',
  description:
    'Local SEO for small businesses done for you. Get found on Google, maps, and AI search. Setup $1,500, then $500 a month. No minimum. You own everything.',
  path: '/local-seo',
})

// Flagship service pillar page (Found-only launch). Built from scratch (no
// Figma frame) in the locked Found design system -- same RuleRow/PillCta/
// Callout/CheckList/FaqList primitives and Helvetica stack as every other
// page. Marketing-site page selling the service; no NAP, no click-to-call,
// no LocalBusiness schema (that belongs on a client's own site, not here).

const WHAT_WE_DO = [
  'Get your Google Business Profile set up and ranking in the map pack',
  'Build and fix your listings across the directories people check',
  'Get you found in AI search, when someone asks ChatGPT or Google’s AI for a recommendation',
  'Set up review generation so new reviews keep coming in',
  'Give you one dashboard to see every search, visit, and review',
]

const FAQS = [
  {
    q: 'How do I rank higher on Google Maps?',
    a: "It comes down to a complete, active Google Business Profile, consistent listings across the web, and a steady flow of real reviews. That's the core of what we set up and keep running for you.",
  },
  {
    q: 'How long until I see results?',
    a: 'Listings and profile work show up in days. Ranking movement in local search builds over weeks, not overnight. The free audit shows you where you stand today.',
  },
  {
    q: 'Do I own the website and everything you set up?',
    a: 'Yes. You own everything: the site, the Google Business Profile, the listings, and the reviews. If you ever leave, you keep all of it.',
  },
  {
    q: 'Are you an established agency?',
    a: "No. We're new and we don't have case studies yet. That's why we lead with a free audit that shows you exactly where you're losing customers, so you can judge the work before you decide anything.",
  },
]

const jsonLd = pageJsonLd({
  service: {
    name: 'Local SEO for small business',
    description:
      'Done-for-you local SEO for small businesses: Google Business Profile, listings, reviews, and AI-search visibility.',
    url: `${SITE_URL}/local-seo`,
    serviceType: 'Local SEO',
  },
  faqs: FAQS,
})

export default function LocalSeoPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>Local SEO</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              Local SEO for small business
            </h1>
            <p className="max-w-[560px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              We get your business found on Google, on maps, and when someone asks an AI for a
              recommendation. Set up in days, then kept running.
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
              audit shows you exactly where your competitors are outranking you first. Then you
              decide.
            </p>
          </Callout>
        </div>
      </section>

      {/* ===================== WHAT IS LOCAL SEO (AEO explainer) =============== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[24px] text-center">
          <h2 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h2}`}>
            What is local SEO for a small business?
          </h2>
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c] sm:text-[18px]">
            Local SEO is the work that makes your business show up when someone nearby searches
            for what you do. It comes from a fully set-up Google Business Profile, accurate
            listings across the directories people check, a steady flow of reviews, and being
            found in AI search when someone asks for a recommendation. That&#39;s what local SEO
            services for small business actually cover: all of it, kept running together.
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

      {/* ========================= LOCAL SEO BY INDUSTRY ========================= */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[24px] text-center">
          <h3 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h3}`}>
            Local SEO by industry
          </h3>
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
            We build the same system for specific trades:
          </p>
          <ul className="flex flex-col gap-[8px] text-[16px] font-bold text-[#202020]">
            <li><Link href="/roofing">Roofing</Link></li>
            <li><Link href="/plumbing">Plumbing</Link></li>
            <li><Link href="/law-firm-seo">Law firms</Link></li>
          </ul>
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
              See where you&#39;re losing customers.
            </h2>
            <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              The free audit shows you exactly where your competitors are outranking you, before
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
