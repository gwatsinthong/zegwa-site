import type { Metadata } from 'next'
import { pageMeta, pageJsonLd, SITE_URL } from '@/lib/seo'
import { HELV, FRAME_TYPE, RuleRow, Mark, PillCta, Framed, CheckList, FaqList } from '@/components/sections'
import { BrowserFrame } from '@/components/vertical-sections'
import PricingCards from '@/components/PricingCards'

export const metadata: Metadata = pageMeta({
  title: 'Marketing for accounting firms',
  description:
    'Get your accounting firm found by clients searching nearby. Website, Google presence, and reviews, done for you. Setup $1,500, then $500 a month. No minimum. You own everything.',
  path: '/accounting',
})

// Conversion page, not an SEO vertical page: no keyword targeting, no
// AEO/ranking explainer, no "outranking competitors" copy. Built from the
// same primitives and visual system as app/weight-loss/page.tsx, keeping the
// trust/proof/pricing/demo/CTA spine.
//
// PROPAGATION: structure copied from the redesigned app/weight-loss/page.tsx
// -- split hero with BrowserFrame, gradient statement, light "what you get"
// split (Framed grey placeholder image left, CheckList right, no dark band,
// no bento), pricing, you-own-everything (no pillar link-up -- conversion
// pages aren't part of the SEO vertical system), FAQ, final CTA. Copy is
// accounting's own, unchanged. FAQS and jsonLd are unchanged.

const WHAT_YOU_GET = [
  'A fast, professional website built to get clients to reach out',
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
    name: 'Marketing for accounting firms',
    description:
      'Done-for-you web presence for accounting firms: website, Google Business Profile, listings, and reviews.',
    url: `${SITE_URL}/accounting`,
    serviceType: 'Local SEO',
  },
  faqs: FAQS,
})

export default function AccountingPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1140px] flex-col items-start gap-[48px] md:flex-row md:gap-[64px]">
          <div className="flex w-full flex-col items-start gap-[32px] md:max-w-[480px]">
            <div className="flex flex-col items-start gap-[20px]">
              <span className="whitespace-nowrap text-[14px] font-medium uppercase leading-none text-[#777]">
                Accounting firms
              </span>
              <h1
                style={{ fontFamily: HELV }}
                className={`text-balance text-left text-[#202020] ${FRAME_TYPE.display}`}
              >
                Get your accounting firm found
              </h1>
              <p className="text-left text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
                We build your web presence and get your firm found by the clients already
                searching for an accountant nearby. Set up in days, then kept running.
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
              src="/work/accounting.webp"
              url="accounting.zegwastudio.com"
              alt="Sample accounting firm site"
              className="w-full max-w-[520px]"
            />
            <div className="flex w-full max-w-[520px] items-center justify-between text-[14px] text-[#777]">
              <span>A real site we built.</span>
              <a
                href="https://accounting.zegwastudio.com"
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
              audit shows you exactly where clients are looking and whether they can find you
              first. Then you decide.
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

      {/* ================================ WHAT YOU GET =========================== */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[16px] text-center">
            <Mark />
            <RuleRow>What you get</RuleRow>
            <h2 style={{ fontFamily: HELV }} className={`text-balance text-[#202020] ${FRAME_TYPE.h2}`}>
              Everything that gets your firm found.
            </h2>
          </div>

          <div className="flex w-full flex-col items-center gap-[48px] md:flex-row md:gap-[64px]">
            <Framed
              outer="p-[12px]"
              inner=""
              innerClass="relative aspect-[4/3] overflow-hidden"
              innerShadow="shadow-[-1px_-1px_2px_0px_rgba(0,0,0,0.15),1px_1px_2px_0px_rgba(0,0,0,0.15)]"
              className="w-full md:flex-1"
            >
              <div aria-hidden="true" className="absolute inset-0 h-full w-full bg-[#e8e8e8]" />
            </Framed>

            <div className="flex w-full flex-col items-start gap-[16px] md:flex-1">
              <CheckList items={WHAT_YOU_GET} gap="gap-[16px]" />
              <p className="text-[16px] leading-[1.5] text-[#777]">
                Set up once, then kept running.
              </p>
            </div>
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
