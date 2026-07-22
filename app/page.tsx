import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMeta } from '@/lib/seo'
import Deliverables from '@/components/Deliverables'
import SearchOrbit from '@/components/SearchOrbit'
import Reveal from '@/components/Reveal'
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
  title: 'Zegwa Studio: get found where your customers are looking',
  description:
    'We build your web presence and everything that brings people to it. Google, maps, directories, AI search. Get a free audit in 24 hours.',
  path: '/',
  absoluteTitle: true,
})

// Figma-faithful rebuild of frame 321:1283 "Found" (body only; the shell
// supplies Header + Footer). Exact radii, colors, gradients, shadows, and type
// sizes are read per node. Font target is Helvetica Now Display; the closest
// available stack is used as a fallback until the licensed font is installed.
// Images render from public/images/home-*.jpg at the frame's exact
// dimensions. CAPTURE CARVE-OUT: the pricing "Found + Capture bundle" line
// is hidden for the Found-only launch (see hiddenBundleUpsell below); no
// /capture link is created. All audit CTAs point to /start.


const FEATURES = [
  {
    title: 'Show up in search',
    desc: 'On Google, on maps, and when they ask ChatGPT.',
    image: '/images/home-feature-search.jpg',
  },
  {
    title: 'A site built to book',
    desc: 'Fast on a phone, easy to read, and built to get you called.',
    image: '/images/home-feature-converts.jpg',
  },
  {
    title: 'Listed everywhere',
    desc: 'Directories, maps, review sites. Wherever they look you up, they find you.',
    image: '/images/home-feature-listed.jpg',
  },
  {
    title: 'You can see all of it',
    desc: 'Every search, visit, and review, in one place you can open any time.',
    image: '/images/home-feature-winback.jpg',
  },
]

// Rows 3, 6, and 9 reuse the closest existing icon (no dedicated image
// exists yet for "Photos and posts", "Reviews answered", or "Monthly
// report") -- swap in a real icon for each when one's available.
const BUILD_ROWS = [
  {
    build: 'Your website',
    does: 'Fast on a phone, built to get you called',
    icon: '/images/home-build-website.jpg',
  },
  {
    build: 'Google Business Profile',
    does: 'You show up in maps when they search nearby',
    icon: '/images/home-build-gbp.jpg',
  },
  {
    build: 'Photos and posts',
    does: 'Updated regularly, because Google rewards it',
    icon: '/images/home-build-gbp.jpg',
  },
  {
    build: 'Directory listings',
    does: 'Your details right everywhere they look you up',
    icon: '/images/home-build-directories.jpg',
  },
  {
    build: 'AI search setup',
    does: 'You come up when they ask ChatGPT, not just Google',
    icon: '/images/home-build-ai-search.jpg',
  },
  {
    build: 'Reviews answered',
    does: 'Every one, in your voice, without you lifting a finger',
    icon: '/images/home-build-gbp.jpg',
  },
  {
    build: 'Old leads worked',
    does: 'One sweep of everyone who asked and never booked',
    icon: '/images/home-build-reactivation.jpg',
  },
  {
    build: 'Your dashboard',
    does: 'Every search, visit, and review in one place',
    icon: '/images/home-build-dashboard.jpg',
  },
  {
    build: 'Monthly report',
    does: "What it's doing, in plain English, every month",
    icon: '/images/home-build-dashboard.jpg',
  },
]

const SETUP_ITEMS = [
  'Your website, built and live in days',
  'Google Business Profile set up right',
  'Your details fixed across every directory',
  'Set up to be found in AI search',
  'One sweep of your old leads',
]

const PRICING_ONGOING_ITEMS = [
  'Listings kept accurate as things change',
  'New reviews answered in your voice',
  'Photos and posts kept current',
  'Your AI and local presence maintained',
  'A monthly report, plus the dashboard any time',
]

const FAQS = [
  { q: 'Is there a contract?', a: "No minimum on Found. It's month to month. Cancel anytime." },
  {
    q: 'What do you need from me?',
    a: "An hour at the start, and your photos if you have them. After that, nothing. We don't need you on calls.",
  },
  {
    q: 'I already have a website. Do I need a new one?',
    a: "Not always. The audit shows what's working and what's costing you customers. Sometimes we improve what you have, sometimes a rebuild pays for itself.",
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

  // HIDDEN (Found-only launch, restore later): the bundle up-sell line is
  // lifted out of the returned JSX and preserved verbatim here. To restore,
  // move it back into the Pricing section, after the ongoing-price Framed
  // block and before the free-audit PillCta.
  const hiddenBundleUpsell = (
    <div className="flex flex-wrap items-end justify-center gap-[4px] text-center">
      <p className="text-[16px] leading-[1.5] text-[#777]">
        Want the calls handled too? The Found + Capture bundle saves on both.
      </p>
      <Link href="/pricing" className="inline-flex items-center gap-[4px] text-[16px] font-bold tracking-[0.16px] text-[#202020]">
        See pricing
        <ArrowRight className="h-[24px] w-[24px]" />
      </Link>
    </div>
  )

  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ============================ HERO (321:1286) ============================ */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[32px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[24px]">
          <div className="flex flex-col items-center gap-[20px]">
            <RuleRow>Found</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className="max-w-[750px] text-balance text-center text-[40px] font-bold leading-[1.24] tracking-[-1.6px] text-[#202020] sm:text-[56px] sm:tracking-[-2.24px]"
            >
              Anyone can build you a website. Making people find it is the job.
            </h1>
            <p className="max-w-[527px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              We do both. The site, and everything that brings people to it. Live in days.
            </p>
          </div>

          <div className="flex flex-col items-center gap-[12px]">
            <PillCta />
            <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
              Your audit in 24 hours. No strings.
            </p>
          </div>

          {/* HIDDEN (temporary, restore when video ready): the VSL block is
              lifted into `hiddenVslBlock` above. To restore, move it back
              here in place of <SearchOrbit />. */}
          <SearchOrbit />
        </div>
      </section>

      {/* ========================= STATEMENT (321:1331) ========================= */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        {/* Scroll-triggered reveal (below the fold, so an on-load animation
            like the hero's would already be finished by the time it's seen):
            both rules draw in from the center, the line flanking the text
            starts first, the text fades/rises up between them, then the
            second rule draws in last. motion-reduce skips the transition
            (Reveal still flips data-visible regardless of that preference,
            so the end state always renders -- only the animated
            interpolation is suppressed). */}
        <Reveal className="mx-auto flex max-w-[590px] flex-col items-center gap-[64px]">
          <div
            className="h-[2px] w-full origin-center scale-x-0 transition-transform duration-700 ease-out motion-reduce:transition-none group-data-[visible=true]:scale-x-100"
            style={{ backgroundImage: 'linear-gradient(90deg, #f0f0f0 0%, #cecece 30%, #cecece 70%, #f0f0f0 100%)' }}
          />
          <div className="text-[24px] font-bold leading-[1.32] tracking-[-0.72px] text-[#202020] sm:text-[36px] sm:tracking-[-1.08px]">
            {/* Reversible removal: redundant against the new hero H1. Keep
                recoverable, do not delete.
            <p>
              Most businesses are invisible online. They don't show up in search, and the site
              they have just sits there. The customers looking right now are finding someone else.
            </p>
            */}
            <p
              className="translate-y-[12px] text-balance text-[#777] opacity-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none group-data-[visible=true]:translate-y-0 group-data-[visible=true]:opacity-100"
              style={{ transitionDelay: '150ms' }}
            >
              We&#39;re new. No case studies yet. So we don&#39;t ask you to trust us. The free
              audit shows you exactly where you&#39;re losing customers first. Then you decide.
            </p>
          </div>
          <div
            className="h-[2px] w-full origin-center scale-x-0 transition-transform duration-700 ease-out motion-reduce:transition-none group-data-[visible=true]:scale-x-100"
            style={{
              backgroundImage: 'linear-gradient(90deg, #f0f0f0 0%, #cecece 10%, #cecece 90%, #f0f0f0 100%)',
              transitionDelay: '350ms',
            }}
          />
        </Reveal>
      </section>

      {/* ========================= WHAT YOU GET (321:1336) ====================== */}
      <section className="px-6 py-[80px] sm:py-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
          <div className="flex flex-col items-center gap-[24px]">
            <Mark />
            <RuleRow>What you get</RuleRow>
            <div className="flex max-w-[500px] flex-col items-center gap-[24px] text-center">
              <h2 style={{ fontFamily: HELV }} className="text-balance text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#202020] sm:text-[48px] sm:tracking-[-1.44px]">
                We handle every part of getting you found.
              </h2>
              <p className="max-w-[344px] text-[16px] leading-[1.5] text-[#5c5c5c]">
                Set up once, then kept running as things change. You just watch the results come
                in.
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
            <RuleRow onDark>The missing number</RuleRow>
            <h2 style={{ fontFamily: HELV }} className="max-w-[700px] text-balance text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#fefefe] sm:text-[48px] sm:tracking-[-1.44px]">
              Right now, someone&#39;s searching. They&#39;re not finding you.
            </h2>
          </div>

          <p className="max-w-[500px] text-balance text-[20px] font-bold leading-[1.26] tracking-[-0.72px] text-[#9d9a9a] sm:text-[24px]">
            Every day you&#39;re invisible is a customer who found your competitor instead.
          </p>

          <p className="max-w-[828px] text-balance text-[40px] font-bold leading-[1.24] tracking-[-1.6px] text-[#fefefe] sm:text-[56px] sm:tracking-[-2.24px]">
            How many a month? You&#39;d like to know.
          </p>

          <div className="max-w-[580px] text-[20px] font-bold leading-[1.26] tracking-[-0.72px] text-[#9d9a9a] sm:text-[24px]">
            <p className="text-balance">
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
              <h2 style={{ fontFamily: HELV }} className="text-balance text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#202020] sm:text-[48px] sm:tracking-[-1.44px]">
                Here&#39;s the whole list.
              </h2>
              <p className="max-w-[441px] text-[16px] leading-[1.5] text-[#5c5c5c]">
                All of it set up, then kept running. Nothing for you to do.
              </p>
            </div>
          </div>

          {/* Summary table */}
          <Framed outer="p-[12px]" inner="p-[24px] sm:p-[32px]" className="w-full max-w-[947px]">
            <div className="flex flex-col gap-[24px]">
              <div className="hidden items-start justify-between sm:flex">
                <div className="flex w-[400px] flex-col gap-[8px]">
                  <p className="text-[24px] font-bold leading-[1.26] tracking-[-0.72px] text-[#777]">What we do</p>
                  <div className="h-[2px] w-[178px] bg-gradient-to-r from-[#cecece] to-[#f0f0f0]" />
                </div>
                <div className="flex w-[400px] flex-col gap-[8px]">
                  <p className="text-[24px] font-bold leading-[1.26] tracking-[-0.72px] text-[#777]">What you get</p>
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
            <div className="flex max-w-[620px] flex-col items-center gap-[16px] text-center">
              <h2 style={{ fontFamily: HELV }} className="text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#202020] sm:text-[48px] sm:tracking-[-1.44px]">
                No quote call. Here&#39;s the price.
              </h2>
              <p className="max-w-[441px] text-[16px] leading-[1.5] text-[#5c5c5c]">
                Everything built once, then a small monthly to keep you found.
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

            <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
              No minimum. Cancel anytime.
            </p>

            {/* HIDDEN (Found-only launch, restore later): the bundle up-sell
                line is lifted into `hiddenBundleUpsell` above. To restore,
                move it back here. */}

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
              <h2 style={{ fontFamily: HELV }} className="max-w-[897px] text-balance text-[40px] font-bold leading-[1.24] tracking-[-1.6px] text-[#202020] sm:text-[56px] sm:tracking-[-2.24px]">
                Let&#39;s find out what you&#39;re missing.
              </h2>
              <p className="max-w-[395px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
                See exactly where you&#39;re losing customers, before you decide anything.
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
