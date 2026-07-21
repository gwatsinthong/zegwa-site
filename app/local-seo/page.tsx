import Link from 'next/link'
import type { Metadata } from 'next'
import { pageMeta, pageJsonLd, SITE_URL } from '@/lib/seo'
import { HELV, FRAME_TYPE, RuleRow, Mark, PillCta, Framed, FaqList } from '@/components/sections'
import PricingCards from '@/components/PricingCards'

export const metadata: Metadata = pageMeta({
  title: 'Local SEO for small business',
  description:
    'Local SEO for small businesses done for you. Get found on Google, maps, and AI search. Setup $1,500, then $500 a month. No minimum. You own everything.',
  path: '/local-seo',
})

// Flagship service pillar page (Found-only launch). Built from scratch (no
// Figma frame) in the locked Found design system -- same RuleRow/PillCta/
// FaqList primitives and Helvetica stack as every other page. Marketing-site
// page selling the service; no NAP, no click-to-call, no LocalBusiness
// schema (that belongs on a client's own site, not here).
//
// PROPAGATION: structure adapted from the redesigned app/roofing/page.tsx
// for a PILLAR page -- centered hero (no demo/BrowserFrame, unlike the
// vertical pages), gradient statement, dark band carrying the AEO explainer
// as prose (not a checklist -- this pillar has no fixed deliverable set),
// bento WHAT_WE_DO, and the signature section: the industry hub rebuilt as
// a card grid matching app/industries/page.tsx instead of a plain bullet
// list. Pricing, you-own-everything, FAQ, final CTA follow the same shape.
// Copy is local-seo's own, unchanged. FAQS and jsonLd are unchanged.

const WHAT_WE_DO = [
  { title: 'Map pack ranking', desc: 'Rank in the map pack near you' },
  { title: 'Directory listings', desc: 'Fixed everywhere people look you up' },
  { title: 'AI search', desc: 'Found when they ask ChatGPT' },
  { title: 'Reviews', desc: 'New reviews, always answered' },
  { title: 'One dashboard', desc: 'Every search and visit in one place' },
]

type Industry = { label: string; href: string; desc: string }

const INDUSTRIES: Industry[] = [
  { label: 'Roofing', href: '/roofing', desc: 'Get found when someone needs a roof.' },
  { label: 'Plumbing', href: '/plumbing', desc: 'Get found when a pipe bursts.' },
  { label: 'HVAC', href: '/hvac', desc: 'Get found when the AC quits.' },
  { label: 'Electrical', href: '/electrical', desc: "Get found when the power's out." },
  { label: 'Auto repair', href: '/auto-repair', desc: 'Get found when the car breaks down.' },
  { label: 'Landscaping', href: '/landscaping', desc: 'Get found when they want the yard done.' },
  { label: 'Law firms', href: '/law-firm-seo', desc: 'Get found when someone needs a lawyer.' },
  { label: 'Dental', href: '/dental', desc: 'Get found by new patients nearby.' },
  { label: 'Chiropractic', href: '/chiropractic', desc: "Get found when someone's in pain." },
  { label: 'Med spa', href: '/med-spa', desc: 'Get found when they research treatments.' },
  { label: 'Veterinary', href: '/veterinary', desc: 'Get found when a pet needs care.' },
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
              audit shows you exactly where your competitors are outranking you first. Then you
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

      {/* ============ WHAT IS LOCAL SEO (home dark-band pattern) ================ */}
      <section className="border-y-2 border-[#cecece] bg-[#202020] px-6 py-[64px] text-[#fefefe] sm:py-[80px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[40px] text-center">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark onDark />
            <RuleRow onDark>How it works</RuleRow>
            <h2 style={{ fontFamily: HELV }} className="text-balance text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#fefefe] sm:text-[48px] sm:tracking-[-1.44px]">
              What is local SEO for a small business?
            </h2>
          </div>

          <p className="text-[16px] leading-[1.5] text-[#9d9a9a] sm:text-[18px]">
            Local SEO is the work that makes your business show up when someone nearby searches
            for what you do. It comes from a fully set-up Google Business Profile, accurate
            listings across the directories people check, a steady flow of reviews, and being
            found in AI search when someone asks for a recommendation. That&#39;s what local SEO
            services for small business actually cover: all of it, kept running together.
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
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark />
            <RuleRow>What we do</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[500px] text-balance text-center text-[#202020] ${FRAME_TYPE.h2}`}
            >
              Everything that gets you found.
            </h2>
          </div>

          <Framed outer="p-[16px]" bare className="w-full">
            {/* Bento: row 1 is two half-width tiles, row 2 is three third-width
                tiles, so all 5 items get a home. */}
            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-6">
              {WHAT_WE_DO.map((item, i) => (
                <div
                  key={item.title}
                  className={`flex flex-col gap-[24px] rounded-[16px] bg-[#fefefe] p-[32px] shadow-[-1px_-1px_4px_0px_rgba(0,0,0,0.15),1px_1px_4px_0px_rgba(0,0,0,0.15)] ${
                    i < 2 ? 'sm:col-span-3' : 'sm:col-span-2'
                  }`}
                >
                  <div className="flex flex-col gap-[8px]">
                    <h3
                      style={{ fontFamily: HELV }}
                      className={`text-[#202020] ${FRAME_TYPE.cardTitle}`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{item.desc}</p>
                  </div>
                  <div
                    aria-hidden="true"
                    className={`w-full rounded-[8px] bg-[#e8e8e8] ${i < 2 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
                  />
                </div>
              ))}
            </div>
          </Framed>
        </div>
      </section>

      {/* ========================= LOCAL SEO BY INDUSTRY ========================= */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[16px] text-center">
            <RuleRow>Local SEO by industry</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[500px] text-balance text-center text-[#202020] ${FRAME_TYPE.h2}`}
            >
              We build the same system for specific trades.
            </h2>
          </div>

          <Framed outer="p-[16px]" bare className="w-full">
            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
              {INDUSTRIES.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col gap-[8px] rounded-[16px] bg-[#fefefe] p-[32px] shadow-[-1px_-1px_4px_0px_rgba(0,0,0,0.15),1px_1px_4px_0px_rgba(0,0,0,0.15)] outline-none transition-shadow hover:shadow-[-1px_-1px_6px_0px_rgba(0,0,0,0.2),1px_1px_6px_0px_rgba(0,0,0,0.2)] focus-visible:ring-2 focus-visible:ring-[#202020]/30"
                >
                  <h3 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.cardTitle}`}>
                    {item.label}
                  </h3>
                  <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{item.desc}</p>
                </Link>
              ))}
            </div>
          </Framed>
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
