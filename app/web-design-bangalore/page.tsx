import type { Metadata } from 'next'
import { pageMeta, pageJsonLd, SITE_URL } from '@/lib/seo'
import { HELV, FRAME_TYPE, RuleRow, Mark, PillCta, Callout, CheckList, FaqList } from '@/components/sections'

export const metadata: Metadata = pageMeta({
  title: 'Web design company in Bangalore',
  description:
    'A web design company in Bangalore building fast, modern websites for businesses. Clean design, built to convert, and you own everything. Get a quote.',
  path: '/web-design-bangalore',
})

// India-market service page: sells web design to Bangalore businesses, not
// the US Found product. Built from the same primitives and visual system as
// app/local-seo/page.tsx, with key differences: no pricing card (India
// pricing isn't set yet), no demo section (all demos are US businesses), and
// the CTA is "Get a quote" -> /contact instead of the US audit -> /start.
// Keyword-targeted (unlike the US conversion pages), so AEO explainer + FAQ
// schema stay in place.

const WHAT_WE_BUILD = [
  'A fast, modern website designed around your business',
  'Built to work perfectly on phones, where most people will see it',
  'Clean, professional design that builds trust',
  'Set up so customers can find you on Google',
  'Yours to keep, with no lock-in',
]

const WHY_US =
  "We're a Bangalore-based studio building websites the modern way, fast and clean, with no bloated agency retainers or long timelines. We're new, so we work harder to earn it."

const FAQS = [
  {
    q: 'How much does a website cost?',
    a: "It depends on what you need. Tell us about your business and we'll put together a clear quote, no surprises, no hidden fees.",
  },
  {
    q: 'How long does it take to build?',
    a: "Most sites are ready in days, not months. We work fast without cutting corners. We'll give you a timeline with your quote.",
  },
  {
    q: 'Do I own the website?',
    a: "Yes. You own everything: the design, the content, and the site itself. There's no lock-in. If you ever leave, you keep all of it.",
  },
  {
    q: 'Are you an established company?',
    a: "No. We're new and we don't have case studies yet. That's why we start with a clear quote and show you what we'd build, so you can judge the work before you commit to anything.",
  },
]

const jsonLd = pageJsonLd({
  service: {
    name: 'Web design company in Bangalore',
    description:
      'Web design and development for businesses in Bangalore: fast, modern, mobile-responsive websites.',
    url: `${SITE_URL}/web-design-bangalore`,
    serviceType: 'Web design',
  },
  faqs: FAQS,
})

export default function WebDesignBangalorePage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>Web design Bangalore</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              Web design company in Bangalore
            </h1>
            <p className="max-w-[560px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              We build fast, modern websites for businesses in Bangalore and beyond. Clean
              design, built to bring you customers, delivered in days.
            </p>
          </div>
          <div className="flex flex-col items-center gap-[12px]">
            <PillCta label="Get a quote" href="/contact" tone="black" />
            <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
              Tell us what you need. We&#39;ll put together a quote.
            </p>
          </div>
        </div>
      </section>

      {/* ========================== DAMAGING ADMISSION ========================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center">
          <Callout className="text-center">
            <p className="text-[18px] leading-[1.5] text-[#202020] sm:text-[20px]">
              We&#39;re new. No case studies yet. So we don&#39;t ask you to trust us. Tell us
              what you need, see what we&#39;d build and what it costs, and then you decide.
            </p>
          </Callout>
        </div>
      </section>

      {/* ================= WHAT DOES A WEB DESIGN COMPANY DO (AEO) ============= */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[24px] text-center">
          <h2 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h2}`}>
            What does a web design company in Bangalore actually do for you?
          </h2>
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c] sm:text-[18px]">
            A good web design company builds you a website that loads fast, looks professional,
            and turns visitors into customers. That means design, build, mobile-responsive
            layouts, speed, and being set up so people can actually find you. That&#39;s the
            standard a website designer bangalore businesses hire should be held to.
          </p>
        </div>
      </section>

      {/* ================================ WHAT WE BUILD ========================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[40px]">
          <div className="flex flex-col items-center gap-[24px] text-center">
            <Mark />
            <RuleRow>What we build</RuleRow>
          </div>
          <CheckList items={WHAT_WE_BUILD} gap="gap-[16px]" />
        </div>
      </section>

      {/* ================================ WHY US ================================= */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[24px] text-center">
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c] sm:text-[18px]">{WHY_US}</p>
        </div>
      </section>

      {/* ========================== YOU OWN EVERYTHING ========================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[500px] flex-col items-center text-center">
          <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">
            You own everything. The website, the design, the content, all of it is yours. If you
            ever leave, you keep it, no lock-in.
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
            <RuleRow>Let&#39;s talk</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[897px] text-[#202020] ${FRAME_TYPE.display}`}
            >
              Let&#39;s build your website.
            </h2>
            <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              Tell us what your business needs, and we&#39;ll put together a quote.
            </p>
          </div>
          <div className="flex flex-col items-center gap-[12px]">
            <PillCta label="Get a quote" href="/contact" tone="black" />
            <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
              We&#39;ll get back to you within a day.
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
