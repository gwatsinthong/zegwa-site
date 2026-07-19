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
  title: 'AI search optimization',
  description:
    "Get your business found in AI search. When someone asks ChatGPT or Google's AI for a recommendation, we make sure you show up. Setup $1,500, then $500 a month. No minimum. You own everything.",
  path: '/ai-search-optimization',
})

// Positioning pillar page, built in the same shape as app/local-seo/page.tsx
// and app/google-business-profile/page.tsx: same primitives, same section
// rhythm, same FAQS-array-shared-with-pageJsonLd approach. No demo section --
// this is the AEO/AI-search differentiator, not tied to a demo subdomain.
// Written to read plainly for an owner and to be cleanly citable by AI
// assistants: direct definitions, clear Q&A, no invented adoption stats.

const WHY_IT_MATTERS =
  'More people now ask an AI assistant for a recommendation instead of scrolling through search results. Most local businesses have done nothing to show up there yet. Being one of the first in your area to get this right is the advantage, before it becomes as competitive as regular search.'

const WHAT_WE_DO = [
  'Make sure your business information is clear and consistent everywhere AI assistants read it',
  'Optimize your Google Business Profile and listings, the sources AI pulls from',
  'Build up your reviews, which AI assistants weigh when they recommend',
  'Structure your website so AI can understand what you do and who you serve',
  'Give you one dashboard to see your search, visit, and review data in one place',
]

const FAQS = [
  {
    q: 'How do I get my business to show up in ChatGPT or AI search?',
    a: 'AI assistants recommend businesses they can find clear, consistent information about: an optimized Google Business Profile, accurate listings, real reviews, and a website that plainly states what you do and where. Setting all of that up the right way is what we handle.',
  },
  {
    q: 'Is AI search optimization different from regular SEO?',
    a: 'It overlaps. Both rely on a strong, consistent web presence. AI search adds a focus on structured, clear information that AI assistants can read and trust when they answer a question. We do both together.',
  },
  {
    q: 'Do I own everything you set up?',
    a: 'Yes. You own everything: the site, the Google Business Profile, the listings, and the reviews. If you ever leave, you keep all of it.',
  },
  {
    q: 'Are you an established agency?',
    a: "No. We're new and we don't have case studies yet. That's why we lead with a free audit that shows you whether AI assistants know your business yet, so you can judge the work before you decide anything.",
  },
]

const jsonLd = pageJsonLd({
  service: {
    name: 'AI search optimization',
    description:
      "Done-for-you AI search and answer engine optimization: making your business findable and recommendable by AI assistants like ChatGPT and Google's AI.",
    url: `${SITE_URL}/ai-search-optimization`,
    serviceType: 'Local SEO',
  },
  faqs: FAQS,
})

export default function AiSearchOptimizationPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>AI search</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              Get found in AI search
            </h1>
            <p className="max-w-[560px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              When someone asks ChatGPT, Perplexity, or Google&#39;s AI for a business like yours,
              we make sure you&#39;re the one it recommends. Set up in days, then kept running.
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
              audit shows you whether AI assistants even know your business exists yet. Then you
              decide.
            </p>
          </Callout>
        </div>
      </section>

      {/* =================== WHAT IS AI SEARCH OPTIMIZATION (explainer) ========= */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[24px] text-center">
          <h2 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h2}`}>
            What is AI search optimization?
          </h2>
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c] sm:text-[18px]">
            AI search optimization is the work that makes AI assistants like ChatGPT and
            Google&#39;s AI recommend your business when someone asks. Those assistants pull from
            your web presence: your Google Business Profile, your listings, your reviews, and
            clear information about what you do and where. When all of that is complete and
            consistent, you become a business the AI can confidently recommend. Some people call
            this answer engine optimization (AEO); others just call it ai search optimization
            services. It&#39;s the same work either way.
          </p>
        </div>
      </section>

      {/* ============================ WHY IT MATTERS ============================= */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[24px] text-center">
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c] sm:text-[18px]">
            {WHY_IT_MATTERS}
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

      {/* ============================ SIBLING PILLARS ============================ */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center text-center">
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
            AI search builds on the same foundation as the rest of getting found. See{' '}
            <Link href="/local-seo" className="font-bold text-[#202020] underline underline-offset-4">
              Local SEO
            </Link>{' '}
            and{' '}
            <Link
              href="/google-business-profile"
              className="font-bold text-[#202020] underline underline-offset-4"
            >
              Google Business Profile
            </Link>
            .
          </p>
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
              Find out if AI knows your business.
            </h2>
            <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              The free audit shows you whether AI assistants can find and recommend you yet,
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
