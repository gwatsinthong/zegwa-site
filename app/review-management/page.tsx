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
  title: 'Review management',
  description:
    'Online review management done for you. Get more real reviews from your customers and keep them answered. Setup $1,500, then $500 a month. No minimum. You own everything.',
  path: '/review-management',
})

// Supporting service page, built in the same shape as app/local-seo/page.tsx
// and app/ai-search-optimization/page.tsx: same primitives, same section
// rhythm, same FAQS-array-shared-with-pageJsonLd approach. No demo, no
// industry hub -- this is a supporting service, not a hub page.
//
// LEGITIMATE REVIEWS ONLY: every line here describes asking real, recent
// customers for reviews and making it easy for them, and answering every
// review that comes in. Nothing here describes or implies buying reviews,
// incentivizing them, gating negative reviews before they post, or
// suppressing bad reviews -- that violates Google policy and FTC rules.

const WHAT_WE_DO = [
  'Set up a simple way to ask your real customers for a review right after the job',
  'Make leaving a review as easy as one tap for them',
  'Answer every review, good or bad, in your voice',
  'Keep your reviews flowing so your profile stays active and trusted',
  'Give you one dashboard to see every review as it comes in',
]

const FAQS = [
  {
    q: 'How do you get more reviews?',
    a: "We set up a simple system that asks your real customers for a review right after you've done the work, when they're most likely to leave one. No fake reviews, no shortcuts, just making it easy for happy customers to speak up.",
  },
  {
    q: 'What happens if I get a bad review?',
    a: 'We answer it, professionally and in your voice. A thoughtful reply to a bad review often does more for trust than a wall of five stars. We handle every review, good or bad.',
  },
  {
    q: 'Do I own my reviews and everything you set up?',
    a: 'Yes. You own everything: your reviews, the profile, the site, and the listings. If you ever leave, you keep all of it.',
  },
  {
    q: 'Are you an established agency?',
    a: "No. We're new and we don't have case studies yet. That's why we lead with a free audit that shows you how your reviews compare to your competitors, so you can judge the work before you decide anything.",
  },
]

const jsonLd = pageJsonLd({
  service: {
    name: 'Review management',
    description:
      'Done-for-you review management: generating real reviews from your customers and keeping them answered.',
    url: `${SITE_URL}/review-management`,
    serviceType: 'Local SEO',
  },
  faqs: FAQS,
})

export default function ReviewManagementPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>Reviews</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              Get more reviews, handled for you
            </h1>
            <p className="max-w-[560px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              We set up a simple system that asks your real customers for reviews at the right
              moment, and we keep every review answered. Set up in days, then kept running.
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
              audit shows you how your reviews stack up against your competitors first. Then you
              decide.
            </p>
          </Callout>
        </div>
      </section>

      {/* ===================== WHY REVIEWS MATTER (explainer) =================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[24px] text-center">
          <h2 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h2}`}>
            Why do reviews matter this much?
          </h2>
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c] sm:text-[18px]">
            Reviews are one of the first things people check before they call, and one of the
            strongest signals for ranking in the map pack. More real, recent reviews build trust
            and help you show up higher when people search nearby. Managing them, asking at the
            right time and answering every one, is an online review management service most
            owners don&#39;t have time to run themselves.
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
            Reviews are one piece of getting found. See how the whole system works:{' '}
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
              See how your reviews compare.
            </h2>
            <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              The free audit shows you where you stand against your competitors on reviews,
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
