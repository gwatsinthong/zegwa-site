import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMeta } from '@/lib/seo'
import Deliverables from '@/components/Deliverables'
import SearchOrbit from '@/components/SearchOrbit'
import {
  HELV,
  ArrowRight,
  Framed,
  RuleRow,
  Mark,
  PillCta,
  CheckList,
  SOFT_DROP_SHADOW,
} from '@/components/sections'

export const metadata: Metadata = pageMeta({
  title: 'Zegwa Studio: get found and never miss a booking',
  description:
    'We build your web presence and an AI front desk so local businesses show up in search and answer every call. Get a free audit in 24 hours.',
  path: '/',
  absoluteTitle: true,
})

// Figma-faithful rebuild of frame 321:1283 "Found" (body only; the shell
// supplies Header + Footer). Exact radii, colors, gradients, shadows, and type
// sizes are read per node. Font target is Helvetica Now Display; the closest
// available stack is used as a fallback until the licensed font is installed.
// Images render from public/images/home-*.jpg at the frame's exact
// dimensions. CAPTURE CARVE-OUT: the pricing "Found + Capture bundle"
// line is kept verbatim as text; "See pricing" points to /pricing, and no
// /capture link is created. All audit CTAs point to /start.


const FEATURES = [
  {
    title: 'Show up in search',
    desc: 'On Google, maps, and even when they ask AI search.',
    image: '/images/home-feature-search.jpg',
  },
  {
    title: 'A site that converts',
    desc: 'Fast, clean, and built to turn a visit into a booking.',
    image: '/images/home-feature-converts.jpg',
  },
  {
    title: 'Listed everywhere',
    desc: 'Consistent across directories, so you rank and look trusted.',
    image: '/images/home-feature-listed.jpg',
  },
  {
    title: 'Win back old leads',
    desc: 'A one-time sweep of past inquiries who never booked you.',
    image: '/images/home-feature-winback.jpg',
  },
]

const BUILD_ROWS = [
  {
    build: 'Conversion website',
    does: 'Fast, clean, built to turn visits into bookings',
    icon: '/images/home-build-website.jpg',
  },
  {
    build: 'Google Business Profile',
    does: 'Optimized so you show up in maps and local search',
    icon: '/images/home-build-gbp.jpg',
  },
  {
    build: 'Directory listings',
    does: 'Consistent across the web so you rank and look trusted',
    icon: '/images/home-build-directories.jpg',
  },
  {
    build: 'AI search optimization',
    does: 'Found when customers ask AI, not just Google',
    icon: '/images/home-build-ai-search.jpg',
  },
  {
    build: 'Lead reactivation',
    does: 'A one-time sweep that re-books past inquiries',
    icon: '/images/home-build-reactivation.jpg',
  },
  {
    build: 'One dashboard',
    does: 'Every visit, lead, and call tracked in one place you own',
    icon: '/images/home-build-dashboard.jpg',
  },
]

const SETUP_ITEMS = [
  'The whole site and presence, built for you',
  'Google, maps, directories, and AI search',
  'Reviews, photos, and social handled',
  'Monthly upkeep and reporting',
  'No minimum. Cancel anytime.',
]

const PRICING_ONGOING_ITEMS = [
  'Your listings and citations kept accurate everywhere',
  'New reviews answered for you, in your voice',
  'Your AI and local presence maintained as things shift',
  'A monthly report showing calls, clicks, and bookings',
]

const FAQS = [
  { q: 'Is there a contract?', a: "No minimum on Found. It's month to month. Cancel anytime." },
  {
    q: 'I already have a website. Do I need a new one?',
    a: "Not always. The audit shows what's working and what's costing you bookings. Sometimes we improve what you have, sometimes a rebuild pays for itself.",
  },
  {
    q: 'Do I own everything?',
    a: 'Yes. The site, the content, the domain, the data. All yours, whether you stay or not.',
  },
]


export default function FoundPage() {
  // HIDDEN (temporary, restore when the real video is ready): the VSL block is
  // lifted out of the returned JSX and preserved verbatim here so it's a
  // straight swap back in later. The search-orbit illustration below the hero
  // copy renders in its place; the marker comment at the render site points
  // back to this const.
  const hiddenVslBlock = (
    // VSL block (frame 321:1318 / 1319 / 1320): outer bezel rounded-[24px]
    // border #fefefe + #e0e0e0 backing + inset ring; inner white card
    // rounded-[15px]; 903x508 screen rounded-[15px]. Outer width 947 =
    // 903 + 20 (inner pad) + 24 (outer pad). Image: public/images/
    // home-vsl-poster.jpg (903x508) -- replace that file with the real
    // poster/thumbnail.
    <div className="relative w-full max-w-[947px] rounded-[24px] border border-[#fefefe] p-[12px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[24px] bg-[#e0e0e0]" />
      <div className="relative rounded-[15px] bg-[#fefefe] p-[10px] shadow-[-1px_-1px_4px_0px_rgba(0,0,0,0.15),1px_1px_4px_0px_rgba(0,0,0,0.15)]">
        <div className={`relative aspect-[903/508] w-full overflow-hidden rounded-[15px] ${SOFT_DROP_SHADOW}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home-vsl-poster.jpg"
            alt="Video preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-[999px] border-[6px] border-[#cecece] p-[6px]">
              <div className="flex items-center justify-center rounded-[999px] bg-gradient-to-b from-[#f91626] to-[#a80813] p-[12px]">
                <svg viewBox="0 0 24 24" fill="#fefefe" className="h-[24px] w-[24px]" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-[-1px] rounded-[inherit] shadow-[inset_1px_1px_2px_0px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_0px_rgba(0,0,0,0.2)]" />
    </div>
  )

  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ============================ HERO (321:1286) ============================ */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>Found</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className="max-w-[704px] text-center text-[40px] font-bold leading-[1.24] tracking-[-1.6px] text-[#202020] sm:text-[56px] sm:tracking-[-2.24px]"
            >
              Show up when they search, before your competitor.
            </h1>
            <p className="max-w-[503px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              A website and online presence that puts you on Google, maps, directories, and AI
              search. Live in days.
            </p>
          </div>

          {/* HIDDEN (temporary, restore when video ready): the VSL block is
              lifted into `hiddenVslBlock` above. To restore, move it back
              here in place of <SearchOrbit />. */}
          <SearchOrbit />

          <div className="flex flex-col items-center gap-[12px]">
            <PillCta />
            <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
              Your audit in 24 hours. No strings.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= STATEMENT (321:1331) ========================= */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[550px] flex-col items-center gap-[64px]">
          <div className="h-[2px] w-full" style={{ backgroundImage: 'linear-gradient(90deg, #f0f0f0 0%, #cecece 30%, #cecece 70%, #f0f0f0 100%)' }} />
          <div className="text-[24px] font-bold leading-[1.32] tracking-[-0.72px] text-[#202020] sm:text-[36px] sm:tracking-[-1.08px]">
            <p>
              Most businesses are invisible online. They don&#39;t show up in search, and the site
              they have just sits there. The customers looking right now are finding someone else.
            </p>
            <p className="mt-[1.32em] text-[#777]">
              We&#39;re new. No case studies yet. So we don&#39;t ask you to trust us. The free
              audit shows you exactly where you&#39;re losing customers first. Then you decide.
            </p>
          </div>
          <div className="h-[2px] w-full" style={{ backgroundImage: 'linear-gradient(90deg, #f0f0f0 0%, #cecece 10%, #cecece 90%, #f0f0f0 100%)' }} />
        </div>
      </section>

      {/* ========================= WHAT YOU GET (321:1336) ====================== */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark />
            <RuleRow>What you get</RuleRow>
            <div className="flex max-w-[500px] flex-col items-center gap-[24px] text-center">
              <h2 style={{ fontFamily: HELV }} className="text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#202020] sm:text-[48px] sm:tracking-[-1.44px]">
                A website alone won&#39;t get you found.
              </h2>
              <p className="max-w-[441px] text-[16px] leading-[1.5] text-[#5c5c5c]">
                Being found takes search, maps, directories, and reviews. We handle all of it.
              </p>
            </div>
          </div>

          <Framed outer="p-[16px]" bare className="w-full">
            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex flex-col gap-[24px] rounded-[16px] bg-[#fefefe] p-[32px] shadow-[-1px_-1px_4px_0px_rgba(0,0,0,0.15),1px_1px_4px_0px_rgba(0,0,0,0.15)]">
                  <div className="flex flex-col gap-[8px]">
                    <h3 style={{ fontFamily: HELV }} className="text-[24px] font-bold leading-[1.26] tracking-[-0.72px] text-[#202020] sm:text-[32px] sm:tracking-[-0.96px]">
                      {f.title}
                    </h3>
                    <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{f.desc}</p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.image}
                    alt=""
                    className="aspect-[160/90] w-full rounded-[8px] object-cover"
                  />
                </div>
              ))}
            </div>
          </Framed>
        </div>
      </section>

      {/* ===================== THE COST OF WAITING (321:1380) =================== */}
      <section className="border-y-2 border-[#cecece] bg-[#202020] px-6 py-[80px] text-[#fefefe] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px] text-center">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark onDark />
            <RuleRow onDark>The cost of waiting</RuleRow>
            <h2 style={{ fontFamily: HELV }} className="max-w-[522px] text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#fefefe] sm:text-[48px] sm:tracking-[-1.44px]">
              Right now, someone&#39;s searching. They&#39;re not finding you.
            </h2>
          </div>

          <p className="max-w-[416px] text-[20px] font-bold leading-[1.26] tracking-[-0.72px] text-[#9d9a9a] sm:text-[24px]">
            Every day you&#39;re invisible is a customer who found your competitor instead.
          </p>

          <p className="max-w-[828px] text-[40px] font-bold leading-[1.24] tracking-[-1.6px] text-[#fefefe] sm:text-[56px] sm:tracking-[-2.24px]">
            Recover 10 bookings. That&#39;s about <span className="text-[#f91626]">$10,000</span> you
            almost lost.
          </p>

          <div className="max-w-[416px] text-[20px] font-bold leading-[1.26] tracking-[-0.72px] text-[#9d9a9a] sm:text-[24px]">
            <p>And that&#39;s just the first month.</p>
            <p className="mt-[1.26em]">
              Being found isn&#39;t luck. It&#39;s the setup most businesses never get around to. We
              do it in a few days.
            </p>
          </div>

          <div className="flex flex-col items-center gap-[12px]">
            <PillCta tone="red" />
            <p className="max-w-[448px] text-[16px] leading-[1.5] text-[#9d9a9a]">
              Your audit in 24 hours. No strings.
            </p>
          </div>
        </div>
      </section>

      {/* ======================= WHAT'S INCLUDED (321:1397) ===================== */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark />
            <RuleRow>What&#39;s included</RuleRow>
            <div className="flex max-w-[500px] flex-col items-center gap-[16px] text-center">
              <h2 style={{ fontFamily: HELV }} className="text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#202020] sm:text-[48px] sm:tracking-[-1.44px]">
                Everything we build and run for you.
              </h2>
              <p className="max-w-[441px] text-[16px] leading-[1.5] text-[#5c5c5c]">
                Set up, optimized, and yours to keep. You don&#39;t touch any of it.
              </p>
            </div>
          </div>

          {/* Summary table */}
          <Framed outer="p-[12px]" inner="p-[24px] sm:p-[32px]" className="w-full max-w-[947px]">
            <div className="flex flex-col gap-[24px]">
              <div className="hidden items-start justify-between sm:flex">
                <div className="flex w-[400px] flex-col gap-[8px]">
                  <p className="text-[24px] font-bold leading-[1.26] tracking-[-0.72px] text-[#777]">What we build</p>
                  <div className="h-[2px] w-[178px] bg-gradient-to-r from-[#cecece] to-[#f0f0f0]" />
                </div>
                <div className="flex w-[400px] flex-col gap-[8px]">
                  <p className="text-[24px] font-bold leading-[1.26] tracking-[-0.72px] text-[#777]">What it does</p>
                  <div className="h-[2px] w-[155px] bg-gradient-to-r from-[#cecece] to-[#f0f0f0]" />
                </div>
              </div>
              <div className="flex flex-col gap-[24px]">
                {BUILD_ROWS.map((r) => (
                  <div key={r.build} className="flex flex-col items-start justify-between gap-[16px] sm:flex-row sm:items-center">
                    <div className="flex w-full items-center gap-[24px] sm:w-[400px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.icon}
                        alt=""
                        className="size-[64px] shrink-0 rounded-[12px] bg-[#fefefe] object-cover shadow-[-1px_-1px_4px_0px_rgba(0,0,0,0.15),1px_1px_4px_0px_rgba(0,0,0,0.15)]"
                      />
                      <p style={{ fontFamily: HELV }} className="text-[26px] font-bold leading-[1.26] tracking-[-0.96px] text-[#202020] sm:text-[32px]">{r.build}</p>
                    </div>
                    <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.4px] text-[#5c5c5c] sm:w-[400px] sm:text-[20px]">{r.does}</p>
                  </div>
                ))}
              </div>
            </div>
          </Framed>

          <Deliverables />
        </div>
      </section>

      {/* ============================ PRICING (321:1567) ======================== */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark />
            <RuleRow>Pricing</RuleRow>
            <div className="flex max-w-[500px] flex-col items-center gap-[16px] text-center">
              <h2 style={{ fontFamily: HELV }} className="text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#202020] sm:text-[48px] sm:tracking-[-1.44px]">
                The price is on the page. Always.
              </h2>
              <p className="max-w-[441px] text-[16px] leading-[1.5] text-[#5c5c5c]">
                Everything built once, then a small monthly to keep you found. No minimum, cancel
                anytime.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-[16px]">
            <div className="flex w-full flex-col gap-[32px]">
              <div className="h-[2px] w-full" style={{ backgroundImage: 'linear-gradient(90deg, #f0f0f0 0%, #cecece 30%, #cecece 70%, #f0f0f0 100%)' }} />
              <Framed outer="p-[16px]" inner="p-[24px] sm:p-[32px]" className="w-full">
                <div className="flex flex-col gap-[32px] sm:flex-row">
                  <div className="flex flex-1 flex-col gap-[40px] px-[16px] py-[24px]">
                    <p className="text-[20px] leading-[1.5] text-[#202020]">SETUP</p>
                    <div className="flex flex-col gap-[16px]">
                      <p style={{ fontFamily: HELV }} className="font-bold tracking-[-1.44px] text-[#202020]">
                        <span className="text-[48px] leading-[1.24]">$1,500 </span>
                        <span className="text-[32px] leading-[1.26] tracking-[-0.96px]">one-time</span>
                      </p>
                      <CheckList items={SETUP_ITEMS} gap="gap-[8px]" />
                    </div>
                  </div>
                  <div className="h-[2px] w-full self-stretch bg-gradient-to-r from-[#fefefe] via-[#dedede] to-[#fefefe] sm:h-auto sm:w-[2px] sm:bg-gradient-to-b" />
                  <div className="flex flex-1 flex-col gap-[40px] px-[16px] py-[24px]">
                    <p className="text-[20px] leading-[1.5] text-[#202020]">ONGOING</p>
                    <div className="flex flex-col gap-[16px]">
                      <p style={{ fontFamily: HELV }} className="font-bold tracking-[-1.44px] text-[#202020]">
                        <span className="text-[48px] leading-[1.24]">$500</span>
                        <span className="text-[24px] leading-[1.26]">/mo</span>
                      </p>
                      <CheckList items={PRICING_ONGOING_ITEMS} gap="gap-[8px]" />
                    </div>
                  </div>
                </div>
              </Framed>
            </div>

            {/* CAPTURE CARVE-OUT: verbatim bundle text kept; "See pricing" -> /pricing */}
            <div className="flex flex-wrap items-end justify-center gap-[4px] text-center">
              <p className="text-[16px] leading-[1.5] text-[#777]">
                Want the calls handled too? The Found + Capture bundle saves on both.
              </p>
              <Link href="/pricing" className="inline-flex items-center gap-[4px] text-[16px] font-bold tracking-[0.16px] text-[#202020]">
                See pricing
                <ArrowRight className="h-[24px] w-[24px]" />
              </Link>
            </div>

            <div className="mt-[16px] flex flex-col items-center gap-[12px]">
              <PillCta />
              <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
                Your audit in 24 hours. No strings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LET'S GET STARTED + FAQ (321:1623) ================= */}
      <section id="faq" className="border-b border-[#fefefe] px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
          <div className="flex flex-col items-center gap-[40px]">
            <div className="flex flex-col items-center gap-[24px] text-center">
              <Mark />
              <RuleRow>Let&#39;s get started</RuleRow>
              <h2 style={{ fontFamily: HELV }} className="max-w-[897px] text-[40px] font-bold leading-[1.24] tracking-[-1.6px] text-[#202020] sm:text-[56px] sm:tracking-[-2.24px]">
                The customers are searching. Let&#39;s make sure they find you.
              </h2>
              <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
                Get your free audit in 24 hours. See exactly where you&#39;re losing customers
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

          <Framed outer="p-[12px]" bare className="w-full max-w-[700px]">
            <div className="flex flex-col gap-[10px]">
              {FAQS.map((item) => (
                <details key={item.q} className={`group rounded-[12px] bg-[#fefefe] p-[24px] ${SOFT_DROP_SHADOW}`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-[16px] [&::-webkit-details-marker]:hidden">
                    <span style={{ fontFamily: HELV }} className="text-[20px] font-bold leading-[1.26] tracking-[-0.72px] text-[#202020] sm:text-[24px]">
                      {item.q}
                    </span>
                    <span aria-hidden="true" className="relative flex size-[40px] shrink-0 items-center justify-center">
                      <span className="absolute h-[2px] w-[16px] bg-[#202020]" />
                      <span className="absolute h-[16px] w-[2px] bg-[#202020] transition-opacity group-open:opacity-0" />
                    </span>
                  </summary>
                  <p className="mt-[16px] max-w-[500px] text-[16px] leading-[1.5] text-[#5c5c5c]">{item.a}</p>
                </details>
              ))}
            </div>
          </Framed>
        </div>
      </section>
    </div>
  )
}
