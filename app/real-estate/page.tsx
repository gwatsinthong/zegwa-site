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
  title: 'Marketing for real estate agents',
  description:
    'Get found by buyers and sellers searching nearby. Website, Google presence, and reviews, done for you. Setup $1,500, then $500 a month. No minimum. You own everything.',
  path: '/real-estate',
})

// Conversion page, not an SEO vertical page: no keyword targeting, no
// AEO/ranking explainer, no "outranking competitors" copy. Built from the
// same primitives and visual system as app/weight-loss/page.tsx, keeping the
// trust/proof/pricing/demo/CTA spine.

const WHAT_YOU_GET = [
  'A fast, professional website built to get buyers and sellers to reach out',
  'Your Google Business Profile set up and ranking when clients search nearby',
  'Consistent listings across the directories clients check',
  'Reviews set up so new client reviews keep coming in',
  'One dashboard to see every search, visit, and review',
]

const FAQS = [
  {
    q: 'What do you need from me to get started?',
    a: 'An hour at the start, and your details and photos if you have them. After that, nothing. We set it all up and keep it running.',
  },
  {
    q: 'Do I own the website and everything you set up?',
    a: 'Yes. You own everything: the site, the Google Business Profile, the listings, and the reviews. If you ever leave, you keep all of it.',
  },
  {
    q: 'Are you an established agency?',
    a: "No. We're new and we don't have case studies yet. That's why we lead with a free audit that shows you exactly where clients are looking, so you can judge the work before you decide anything.",
  },
]

const jsonLd = pageJsonLd({
  service: {
    name: 'Marketing for real estate agents',
    description:
      'Done-for-you web presence for real estate agents: website, Google Business Profile, listings, and reviews.',
    url: `${SITE_URL}/real-estate`,
    serviceType: 'Local SEO',
  },
  faqs: FAQS,
})

export default function RealEstatePage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>Real estate</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              Get found by buyers and sellers
            </h1>
            <p className="max-w-[560px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              We build your web presence and get you found by the buyers and sellers already
              searching for an agent nearby. Set up in days, then kept running.
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
              audit shows you exactly where clients are looking and whether they can find you
              first. Then you decide.
            </p>
          </Callout>
        </div>
      </section>

      {/* ================================ WHAT YOU GET =========================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[40px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <Mark />
            <RuleRow>What you get</RuleRow>
            <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
              Everything that gets you found, set up once and kept running:
            </p>
          </div>
          <CheckList items={WHAT_YOU_GET} gap="gap-[16px]" />
        </div>
      </section>

      {/* ============================ SAMPLE SITE =============================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[8px] text-center">
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
            Want to see the kind of site we build? Here&#39;s a sample real estate site.
          </p>
          <a
            href="https://real-estate.zegwastudio.com"
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
              See where your clients are looking.
            </h2>
            <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              The free audit shows you exactly where clients search and whether they can find
              you, before you decide anything.
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
