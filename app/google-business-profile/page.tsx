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

const WHAT_WE_DO = [
  'Set up and verify your Google Business Profile the right way',
  'Optimize your categories, services, hours, photos, and posts so you rank in the map pack',
  'Keep your listings consistent everywhere people look you up',
  "Get you found in AI search, when someone asks ChatGPT or Google's AI for a recommendation",
  'Set up review generation so new reviews keep coming in',
  'Give you one dashboard to see every search, visit, call, and review',
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

      {/* ========================== DAMAGING ADMISSION ========================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center">
          <Callout className="text-center">
            <p className="text-[18px] leading-[1.5] text-[#202020] sm:text-[20px]">
              We&#39;re new. No case studies yet. So we don&#39;t ask you to trust us. The free
              audit shows you exactly where your profile is losing you customers first. Then you
              decide.
            </p>
          </Callout>
        </div>
      </section>

      {/* =================== WHAT IS GBP OPTIMIZATION (AEO explainer) ========== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[24px] text-center">
          <h2 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h2}`}>
            What is Google Business Profile optimization?
          </h2>
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c] sm:text-[18px]">
            Google Business Profile optimization is the work that makes your business rank in the
            map pack and show up in local search. It comes from a complete and accurate profile:
            the right categories, photos, posts, reviews, and consistent listings across the web,
            plus being found in AI search when someone asks ChatGPT or Google&#39;s AI for a
            recommendation. That&#39;s what google business profile optimization services
            actually cover, and it&#39;s the core of what it takes to manage google business
            profile the right way over time.
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

      {/* ============================ LOCAL SEO SIBLING ========================= */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center text-center">
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
            Your Google Business Profile is one piece of local SEO. See how the whole system
            works:{' '}
            <Link href="/local-seo" className="font-bold text-[#202020] underline underline-offset-4">
              Local SEO
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ==================== GOOGLE BUSINESS PROFILE BY INDUSTRY =============== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[24px] text-center">
          <h3 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h3}`}>
            Google Business Profile by industry
          </h3>
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
            We optimize profiles for specific trades and practices:
          </p>
          <ul className="flex flex-col gap-[8px] text-[16px] font-bold text-[#202020]">
            <li><Link href="/roofing">Roofing</Link></li>
            <li><Link href="/plumbing">Plumbing</Link></li>
            <li><Link href="/hvac">HVAC</Link></li>
            <li><Link href="/electrical">Electrical</Link></li>
            <li><Link href="/auto-repair">Auto repair</Link></li>
            <li><Link href="/landscaping">Landscaping</Link></li>
            <li><Link href="/law-firm-seo">Law firms</Link></li>
            <li><Link href="/dental">Dental</Link></li>
            <li><Link href="/chiropractic">Chiropractic</Link></li>
            <li><Link href="/med-spa">Med spa</Link></li>
            <li><Link href="/veterinary">Veterinary</Link></li>
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
