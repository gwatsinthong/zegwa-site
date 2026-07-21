import type { Metadata } from 'next'
import { pageMeta, pageJsonLd, SITE_URL } from '@/lib/seo'
import { HELV, FRAME_TYPE, RuleRow, Mark, PillCta, Framed, FaqList } from '@/components/sections'

export const metadata: Metadata = pageMeta({
  title: 'SEO company in Bangalore',
  description:
    'An SEO and digital marketing company in Bangalore helping businesses get found on Google. Honest work, clear reporting, and you own everything. Get a quote.',
  path: '/seo-bangalore',
})

// India-market service page, built in the same shape as
// app/web-design-bangalore/page.tsx: no pricing card (India pricing isn't
// set yet), no demo section, and the CTA is "Get a quote" -> /contact
// instead of the US audit -> /start. Keyword-targeted, so AEO explainer +
// FAQ schema stay in place.
//
// PROPAGATION: structure copied from the redesigned
// app/web-design-bangalore/page.tsx -- centered hero with the quote CTA,
// gradient statement, dark band carrying the AEO explainer + why-us as
// prose with NO CTA (there's no audit to offer here), bento WHAT_WE_DO
// using this page's OWN 5 SEO deliverables (not the US-generic set). NO
// pricing section. Copy is seo-bangalore's own, unchanged. FAQS and jsonLd
// are unchanged.

const WHAT_WE_DO = [
  { title: 'Search rankings', desc: 'Get your website ranking for the searches your customers actually use' },
  { title: 'Google Business Profile', desc: 'Set up and optimize your Google Business Profile so you show up on maps' },
  { title: 'Web presence', desc: 'Build your presence across the web so Google trusts you' },
  { title: 'Tracking', desc: "Track every ranking and visit so you see what's working" },
  { title: 'Plain reporting', desc: 'Report in plain language, no jargon, no vanity metrics' },
]

const WHY_US =
  "We're a Bangalore-based studio doing SEO the honest way: real work, clear reporting, no long lock-in contracts or inflated retainers. We're new, so we work harder to earn it."

const FAQS = [
  {
    q: 'How much does SEO cost?',
    a: "It depends on your business and your goals. Tell us what you're after and we'll put together a clear quote, no surprises, no hidden fees.",
  },
  {
    q: 'How long until SEO works?',
    a: "SEO builds over weeks and months, not days. Anyone promising instant rankings isn't being honest. We'll set clear expectations with your quote.",
  },
  {
    q: 'Do I own everything you set up?',
    a: "Yes. You own everything: your website, your Google profile, and your rankings. There's no lock-in. If you ever leave, you keep all of it.",
  },
  {
    q: 'Are you an established company?',
    a: "No. We're new and we don't have case studies yet. That's why we start with a clear quote and honest expectations, so you can judge the work before you commit to anything.",
  },
]

const jsonLd = pageJsonLd({
  service: {
    name: 'SEO company in Bangalore',
    description:
      'SEO and digital marketing for businesses in Bangalore: search rankings, Google Business Profile, and clear reporting.',
    url: `${SITE_URL}/seo-bangalore`,
    serviceType: 'SEO',
  },
  faqs: FAQS,
})

export default function SeoBangalorePage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>SEO Bangalore</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              SEO company in Bangalore
            </h1>
            <p className="max-w-[560px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              We help businesses in Bangalore get found on Google and bring in more customers.
              Honest work, clear reporting, no long lock-in contracts.
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
              We&#39;re new. No case studies yet. So we don&#39;t ask you to trust us. Tell us
              what you need, see what we&#39;d do and what it costs, and then you decide.
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

      {/* ===== WHAT DOES AN SEO COMPANY DO (home dark-band pattern) ============= */}
      <section className="border-y-2 border-[#cecece] bg-[#202020] px-6 py-[64px] text-[#fefefe] sm:py-[80px]">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-[40px] text-center">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark onDark />
            <RuleRow onDark>What we do</RuleRow>
            <h2 style={{ fontFamily: HELV }} className="text-balance text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#fefefe] sm:text-[48px] sm:tracking-[-1.44px]">
              What does an SEO company in Bangalore actually do?
            </h2>
          </div>

          <p className="text-[16px] leading-[1.5] text-[#9d9a9a] sm:text-[18px]">
            An SEO company helps your business show up on Google when people search for what you
            offer. That means optimizing your website, building your Google presence, earning
            quality links, and tracking what works. It&#39;s the same core work behind any
            digital marketing agency bangalore businesses hire to get found.
          </p>

          <p className="text-[16px] leading-[1.5] text-[#9d9a9a] sm:text-[18px]">{WHY_US}</p>
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

      {/* ========================== YOU OWN EVERYTHING ========================== */}
      <section className="px-6 pb-[64px] sm:pb-[80px]">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-[16px]">
          <p className="text-balance text-center text-[20px] font-bold leading-[1.4] tracking-[-0.4px] text-[#202020] sm:text-[24px]">
            You own everything. Your website, your Google profile, your rankings, all of it stays
            yours. If you ever leave, you keep it, no lock-in.
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
            <RuleRow>Let&#39;s talk</RuleRow>
            <h2
              style={{ fontFamily: HELV }}
              className={`max-w-[897px] text-balance text-[#202020] ${FRAME_TYPE.display}`}
            >
              Let&#39;s get you found.
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
