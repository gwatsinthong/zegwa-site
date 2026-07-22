import Link from 'next/link'
import type { Metadata } from 'next'
import { pageMeta, pageJsonLd, SITE_URL } from '@/lib/seo'
import { HELV, FRAME_TYPE, RuleRow, Mark, PillCta, FaqList } from '@/components/sections'
import WhatWeDoBento from '@/components/WhatWeDoBento'
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
//
// PROPAGATION: structure copied from the redesigned app/local-seo/page.tsx --
// centered hero, gradient statement, dark band carrying the AEO explainer as
// prose, bento WHAT_WE_DO (the 5 generic cards). NO industry hub -- this
// page has sibling pillar links instead, kept as a one-line link section.
// Copy is ai-search's own, unchanged. FAQS and jsonLd are unchanged.

const WHY_IT_MATTERS =
  'More people now ask an AI assistant for a recommendation instead of scrolling through search results. Most local businesses have done nothing to show up there yet. Being one of the first in your area to get this right is the advantage, before it becomes as competitive as regular search.'

const WHAT_WE_DO = [
  { title: 'Map pack ranking', desc: 'Rank in the map pack near you' },
  { title: 'Directory listings', desc: 'Fixed everywhere people look you up' },
  { title: 'AI search', desc: 'Found when they ask ChatGPT' },
  { title: 'Reviews', desc: 'New reviews, always answered' },
  { title: 'One dashboard', desc: 'Every search and visit in one place' },
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
              audit shows you whether AI assistants even know your business exists yet. Then you
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

      {/* === WHAT IS AI SEARCH OPTIMIZATION + WHY IT MATTERS (dark-band pattern) === */}
      <section className="border-y-2 border-[#cecece] bg-[#202020] px-6 py-[64px] text-[#fefefe] sm:py-[80px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[40px] text-center">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark onDark />
            <RuleRow onDark>How it works</RuleRow>
            <h2 style={{ fontFamily: HELV }} className="text-balance text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#fefefe] sm:text-[48px] sm:tracking-[-1.44px]">
              What is AI search optimization?
            </h2>
          </div>

          <p className="text-[16px] leading-[1.5] text-[#9d9a9a] sm:text-[18px]">
            AI search optimization is the work that makes AI assistants like ChatGPT and
            Google&#39;s AI recommend your business when someone asks. Those assistants pull from
            your web presence: your Google Business Profile, your listings, your reviews, and
            clear information about what you do and where. When all of that is complete and
            consistent, you become a business the AI can confidently recommend. Some people call
            this answer engine optimization (AEO); others just call it ai search optimization
            services. It&#39;s the same work either way.
          </p>

          <p className="text-[16px] leading-[1.5] text-[#9d9a9a] sm:text-[18px]">
            {WHY_IT_MATTERS}
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

      {/* ============================ SIBLING PILLARS ============================ */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center text-center">
          <p className="text-[16px] leading-[1.5] text-[#777]">
            AI search builds on the same foundation as the rest of getting found. See{' '}
            <Link href="/local-seo" className="underline underline-offset-2 hover:text-[#202020]">
              Local SEO
            </Link>{' '}
            and{' '}
            <Link
              href="/google-business-profile"
              className="underline underline-offset-2 hover:text-[#202020]"
            >
              Google Business Profile
            </Link>
            .
          </p>
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
