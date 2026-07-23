import Link from 'next/link'
import type { Metadata } from 'next'
import { pageMeta, pageJsonLd, SITE_URL } from '@/lib/seo'
import { HELV, FRAME_TYPE, RuleRow, Mark, PillCta, Framed, FaqList } from '@/components/sections'
import WhatWeDoBento from '@/components/WhatWeDoBento'
import IndustryCardGrid, { type Industry } from '@/components/IndustryCardGrid'
import PricingCards from '@/components/PricingCards'

export const metadata: Metadata = pageMeta({
  title: 'Google Business Profile optimization',
  description:
    'Google Business Profile optimization services done for you. Rank in the map pack, get more calls and visits. Setup $1,500, then $500 a month. No minimum. You own everything.',
  path: '/google-business-profile',
})

// Service pillar page, built in the same shape as app/local-seo/page.tsx: same
// primitives, same section rhythm, same FAQS-array-shared-with-pageJsonLd
// approach, plus a hub section linking all vertical pages. No demo section --
// GBP work is not tied to a single demo subdomain. Marketing-site page
// selling the service; no NAP, no LocalBusiness schema.
//
// PROPAGATION: structure copied from the redesigned app/local-seo/page.tsx --
// centered hero, gradient statement, dark band carrying the AEO explainer as
// prose, bento WHAT_WE_DO (the 5 generic cards), and the industry hub rebuilt
// as a card grid matching app/industries/page.tsx instead of a plain bullet
// list. Copy is GBP's own, unchanged. FAQS and jsonLd are unchanged.

const WHAT_WE_DO = [
  { title: 'Map pack ranking', desc: 'Rank in the map pack near you' },
  { title: 'Directory listings', desc: 'Fixed everywhere people look you up' },
  { title: 'AI search', desc: 'Found when they ask ChatGPT' },
  { title: 'Reviews', desc: 'New reviews, always answered' },
  { title: 'One dashboard', desc: 'Every search and visit in one place' },
]

const INDUSTRIES: Industry[] = [
  { label: 'Roofing', href: '/roofing', desc: 'Get found when someone needs a roof.', image: '/images/industry-roofing.jpg' },
  { label: 'Plumbing', href: '/plumbing', desc: 'Get found when a pipe bursts.', image: '/images/industry-plumbing.jpg' },
  { label: 'HVAC', href: '/hvac', desc: 'Get found when the AC quits.', image: '/images/industry-hvac.jpg' },
  { label: 'Electrical', href: '/electrical', desc: "Get found when the power's out.", image: '/images/industry-electrical.jpg' },
  { label: 'Auto repair', href: '/auto-repair', desc: 'Get found when the car breaks down.', image: '/images/industry-auto-repair.jpg' },
  { label: 'Landscaping', href: '/landscaping', desc: 'Get found when they want the yard done.', image: '/images/industry-landscaping.jpg' },
  { label: 'Law firms', href: '/law-firm-seo', desc: 'Get found when someone needs a lawyer.', image: '/images/industry-law-firm.jpg' },
  { label: 'Dental', href: '/dental', desc: 'Get found by new patients nearby.', image: '/images/industry-dental.jpg' },
  { label: 'Chiropractic', href: '/chiropractic', desc: "Get found when someone's in pain.", image: '/images/industry-chiropractic.jpg' },
  { label: 'Med spa', href: '/med-spa', desc: 'Get found when they research treatments.', image: '/images/industry-med-spa.jpg' },
  { label: 'Veterinary', href: '/veterinary', desc: 'Get found when a pet needs care.', image: '/images/industry-veterinary.jpg' },
]

const FAQS = [
  {
    q: 'How do I rank higher on Google Maps?',
    a: "It comes down to a complete, active Google Business Profile, consistent listings across the web, and a steady flow of real reviews. That's the core of what we set up and keep running for you.",
  },
  {
    q: "Can't I just manage my Google Business Profile myself?",
    a: "You can, and the tool is free. Most owners don't have time to keep it optimized, post regularly, and stay on top of reviews. That ongoing work is what actually moves you up in the map pack, and it's what we handle.",
  },
  {
    q: 'Do I own the profile and everything you set up?',
    a: 'Yes. You own everything: the profile, the site, the listings, and the reviews. If you ever leave, you keep all of it.',
  },
  {
    q: 'Are you an established agency?',
    a: "No. We're new and we don't have case studies yet. That's why we lead with a free audit that shows you exactly where your profile is costing you customers, so you can judge the work before you decide anything.",
  },
]

const jsonLd = pageJsonLd({
  service: {
    name: 'Google Business Profile optimization',
    description:
      'Done-for-you Google Business Profile optimization: setup, map-pack ranking, listings, reviews, and AI-search visibility.',
    url: `${SITE_URL}/google-business-profile`,
    serviceType: 'Local SEO',
  },
  faqs: FAQS,
})

export default function GoogleBusinessProfilePage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>Google Business Profile</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              Google Business Profile optimization
            </h1>
            <p className="max-w-[560px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              We set up and optimize your Google Business Profile so you rank in the map pack and
              show up when people nearby search for what you do. Set up in days, then kept
              running.
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
              audit shows you exactly where your profile is losing you customers first. Then you
              decide.
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

      {/* ============ WHAT IS GBP OPTIMIZATION (home dark-band pattern) ========= */}
      <section className="border-y-2 border-[#cecece] bg-[#202020] px-6 py-[64px] text-[#fefefe] sm:py-[80px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[40px] text-center">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark onDark />
            <RuleRow onDark>How it works</RuleRow>
            <h2 style={{ fontFamily: HELV }} className="text-balance text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#fefefe] sm:text-[48px] sm:tracking-[-1.44px]">
              What is Google Business Profile optimization?
            </h2>
          </div>

          <p className="text-[16px] leading-[1.5] text-[#9d9a9a] sm:text-[18px]">
            Google Business Profile optimization is the work that makes your business rank in the
            map pack and show up in local search. It comes from a complete and accurate profile:
            the right categories, photos, posts, reviews, and consistent listings across the web,
            plus being found in AI search when someone asks ChatGPT or Google&#39;s AI for a
            recommendation. That&#39;s what google business profile optimization services
            actually cover, and it&#39;s the core of what it takes to manage google business
            profile the right way over time.
          </p>

          <div className="flex flex-col items-center gap-[12px]">
            <PillCta tone="red" />
            <p className="max-w-[448px] text-[16px] leading-[1.5] text-[#9d9a9a]">
              Your audit in 24 hours. No strings.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== WHAT WE DO (home WHAT YOU GET pattern) =========== */}
      <WhatWeDoBento items={WHAT_WE_DO} />

      {/* ============================ LOCAL SEO SIBLING ========================= */}
      <section className="px-6 pb-[64px] sm:pb-[80px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center text-center">
          <p className="text-[16px] leading-[1.5] text-[#777]">
            Your Google Business Profile is one piece of local SEO. See how the whole system
            works:{' '}
            <Link href="/local-seo" className="underline underline-offset-2 hover:text-[#202020]">
              Local SEO
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ==================== GOOGLE BUSINESS PROFILE BY INDUSTRY =============== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[16px] text-center">
            <RuleRow>Google Business Profile by industry</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[500px] text-balance text-center text-[#202020] ${FRAME_TYPE.h2}`}
            >
              We optimize profiles for specific trades and practices.
            </h2>
          </div>

          <IndustryCardGrid items={INDUSTRIES} />
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

      {/* ========================== YOU OWN EVERYTHING ========================== */}
      <section className="px-6 pb-[64px] sm:pb-[80px]">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-[16px]">
          <p className="text-balance text-center text-[20px] font-bold leading-[1.4] tracking-[-0.4px] text-[#202020] sm:text-[24px]">
            You own everything. The website, the profile, the listings, the reviews, all of it
            stays yours. If you ever leave, you keep it.
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

      {/* ============================== FINAL CTA ================================ */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[40px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <Mark />
            <RuleRow>Let&#39;s get started</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[897px] text-balance text-[#202020] ${FRAME_TYPE.display}`}
            >
              See what your profile is missing.
            </h2>
            <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              The free audit shows you exactly where your Google Business Profile is losing you
              customers, before you decide anything.
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
