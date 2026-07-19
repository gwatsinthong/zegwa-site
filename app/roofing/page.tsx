import Link from 'next/link'
import type { Metadata } from 'next'
import { pageMeta, pageJsonLd, SITE_URL } from '@/lib/seo'
import {
  HELV,
  FRAME_TYPE,
  RuleRow,
  Mark,
  PillCta,
  CheckList,
  FaqList,
} from '@/components/sections'
import {
  BrowserFrame,
  FeatureCard,
  CardGrid,
  AccentBand,
  AeoDiagram,
  MapPinIcon,
  ListingsIcon,
  AiSparkleIcon,
  ReviewStarIcon,
  DashboardIcon,
} from '@/components/vertical-sections'
import PricingCards from '@/components/PricingCards'

export const metadata: Metadata = pageMeta({
  title: 'Roofing SEO',
  description:
    'Roofing SEO done for you. Get found on Google, maps, and AI search when homeowners need a roofer. Setup $1,500, then $500 a month. No minimum. You own everything.',
  path: '/roofing',
})

// Vertical service page, built in the same shape as app/local-seo/page.tsx
// (the pillar): same primitives, same section rhythm, same
// FAQS-array-shared-with-pageJsonLd approach. Marketing-site page selling the
// service to roofing companies; no NAP, no LocalBusiness schema.
//
// DESIGN PROTOTYPE: this page is the first to use the richer layout from
// components/vertical-sections.tsx (split hero, browser-frame demo, card
// grid, AEO diagram, indigo accent). Copy, FAQS, and jsonLd are unchanged
// from the previous version -- only the layout/visual treatment changed.
// Not yet propagated to the other vertical pages.

const WHAT_WE_DO = [
  'Get your Google Business Profile ranking in the map pack for roof searches near you',
  'Fix and build your listings across the directories homeowners and insurers check',
  'Get you found in AI search, when someone asks ChatGPT or Google’s AI for a roofer',
  'Set up review generation so new roof-job reviews keep coming in',
  'Give you one dashboard to see every search, visit, and review',
]

// Pairs each WHAT_WE_DO string (copy, unchanged) with the icon and short
// label used only by the new card-grid layout below. Not a copy change: the
// full original sentence still renders in each card, verbatim.
const WHAT_WE_DO_CARDS = [
  { icon: <MapPinIcon />, label: 'Map pack ranking' },
  { icon: <ListingsIcon />, label: 'Directory listings' },
  { icon: <AiSparkleIcon />, label: 'AI search' },
  { icon: <ReviewStarIcon />, label: 'Reviews' },
  { icon: <DashboardIcon />, label: 'One dashboard' },
]

const FAQS = [
  {
    q: 'How do I get more roofing leads from Google?',
    a: "Show up where homeowners look. That means a complete Google Business Profile, consistent listings, and a steady flow of reviews, so you appear in the map pack and in search when someone needs a roof. That's the core of what we set up and keep running.",
  },
  {
    q: 'How long until roofing SEO shows results?',
    a: 'Listings and profile work show up in days. Ranking movement in local search builds over weeks, not overnight. The free audit shows you where you stand today.',
  },
  {
    q: 'Do I own the website and everything you set up?',
    a: 'Yes. You own everything: the site, the Google Business Profile, the listings, and the reviews. If you ever leave, you keep all of it.',
  },
  {
    q: 'Are you an established agency?',
    a: "No. We're new and we don't have case studies yet. That's why we lead with a free audit that shows you exactly where you're losing roofing customers, so you can judge the work before you decide anything.",
  },
]

const jsonLd = pageJsonLd({
  service: {
    name: 'Roofing SEO',
    description:
      'Done-for-you SEO for roofing companies: Google Business Profile, listings, reviews, and AI-search visibility.',
    url: `${SITE_URL}/roofing`,
    serviceType: 'Local SEO',
  },
  faqs: FAQS,
})

export default function RoofingPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1140px] flex-col items-center gap-[48px] lg:flex-row lg:items-center lg:gap-[64px]">
          <div className="flex w-full flex-col items-start gap-[32px] lg:flex-1">
            <div className="flex flex-col items-start gap-[26px]">
              <RuleRow>Roofing SEO</RuleRow>
              <h1
                style={{ fontFamily: HELV }}
                className={`max-w-[560px] text-left text-[#202020] ${FRAME_TYPE.display}`}
              >
                Roofing SEO
              </h1>
              <p className="max-w-[480px] text-left text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
                We get your roofing company found on Google, on maps, and in AI search, so the
                storm-season leads land with you instead of the contractor who ranks above you.
                Set up in days, then kept running.
              </p>
            </div>
            <div className="flex flex-col items-start gap-[12px]">
              <PillCta />
              <p className="max-w-[448px] text-left text-[16px] leading-[1.5] text-[#777]">
                Your audit in 24 hours. No strings.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-[12px] lg:flex-1">
            <BrowserFrame
              src="/work/roofing.webp"
              url="roofing.zegwastudio.com"
              alt="Sample roofing site"
              className="max-w-[520px]"
            />
            <div className="flex w-full max-w-[520px] items-center justify-between text-[14px] text-[#777]">
              <span>A real site we built.</span>
              <a
                href="https://roofing.zegwastudio.com"
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

      {/* ========================== DAMAGING ADMISSION ========================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto max-w-[700px]">
          <div className="border-l-[4px] border-[#5B4BE8] bg-[#5B4BE8]/[0.04] py-[16px] pl-[24px] pr-[16px]">
            <p className="text-left text-[18px] leading-[1.5] text-[#202020] sm:text-[20px]">
              We&#39;re new. No case studies yet. So we don&#39;t ask you to trust us. The free
              audit shows you exactly where other roofers are outranking you first. Then you
              decide.
            </p>
          </div>
        </div>
      </section>

      {/* ================ WHAT DOES ROOFING SEO DO (AEO explainer) ============= */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px] lg:flex-row lg:items-center lg:gap-[64px]">
          <div className="flex w-full flex-col items-start gap-[16px] text-left lg:flex-1">
            <h2 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h2}`}>
              What does roofing SEO actually do?
            </h2>
            <p className="text-[16px] leading-[1.5] text-[#5c5c5c] sm:text-[18px]">
              Roofing SEO makes your company show up when a homeowner nearby searches for a
              roofer or a roof repair. It comes from a fully set-up Google Business Profile, the
              map pack, accurate directory listings, a steady flow of reviews, and being found in
              AI search when someone asks ChatGPT or Google&#39;s AI for a roofer. That&#39;s
              what search engine optimization for roofing companies actually covers: all of it,
              kept running together.
            </p>
          </div>
          <div className="flex w-full items-center justify-center lg:flex-1">
            <AeoDiagram className="w-full max-w-[400px]" />
          </div>
        </div>
      </section>

      {/* ================================ WHAT WE DO ============================ */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[40px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <Mark />
            <RuleRow>What we do</RuleRow>
          </div>
          <CardGrid>
            {WHAT_WE_DO.map((text, i) => (
              <FeatureCard
                key={text}
                icon={WHAT_WE_DO_CARDS[i].icon}
                label={WHAT_WE_DO_CARDS[i].label}
                text={text}
              />
            ))}
          </CardGrid>
        </div>
      </section>

      {/* ============================ SAMPLE SITE =============================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[16px] text-center">
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
            Want to see the kind of site we build? Here&#39;s a sample roofing site.
          </p>
          <a
            href="https://roofing.zegwastudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-[10px] rounded-[999px] border border-[#fefefe] bg-[#e8e8e8] px-[24px] py-[8px] shadow-[-1px_-1px_2px_0px_rgba(0,0,0,0.15),1px_1px_2px_0px_rgba(0,0,0,0.15)]"
          >
            <span className="whitespace-nowrap text-[16px] font-bold tracking-[0.16px] text-[#202020]">
              See the sample site
            </span>
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
      <AccentBand className="px-6 py-[64px]">
        <div className="mx-auto max-w-[600px] text-center">
          <p className="text-[20px] leading-[1.5] text-[#202020] sm:text-[24px]">
            You own everything. The website, the profile, the listings, the reviews, all of it
            stays yours. If you ever leave, you keep it.
          </p>
        </div>
      </AccentBand>

      {/* ============================ LOCAL SEO LINK-UP ========================= */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center text-center">
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
            Roofing SEO is local SEO built for one trade. See how the whole system works:{' '}
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
      <AccentBand className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[40px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <Mark />
            <RuleRow>Let&#39;s get started</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[897px] text-[#202020] ${FRAME_TYPE.display}`}
            >
              See where you&#39;re losing roofing jobs.
            </h2>
            <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              The free audit shows you exactly where other roofers are outranking you, before you
              decide anything.
            </p>
          </div>
          <div className="flex flex-col items-center gap-[12px]">
            <PillCta />
            <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
              Your audit in 24 hours. No strings.
            </p>
          </div>
        </div>
      </AccentBand>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
