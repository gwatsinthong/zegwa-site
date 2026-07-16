import { Framed, HELV, Mark, RuleRow } from './sections'

// "What's included" section (eyebrow, H2, sub, and the 9-row summary table),
// extracted verbatim from app/page.tsx's WHAT'S INCLUDED section so other
// pages can reuse the exact same section without duplicating the markup.
// Deliberately excludes the trailing <Deliverables />, which is specific to
// home.

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

export default function IncludedTable() {
  return (
    <section className="px-6 py-[80px] sm:py-[100px]">
      <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
        <div className="flex flex-col items-center gap-[24px]">
          <Mark />
          <RuleRow>What&#39;s included</RuleRow>
          <div className="flex max-w-[500px] flex-col items-center gap-[16px] text-center">
            <h2
              style={{ fontFamily: HELV }}
              className="text-balance text-[32px] font-bold leading-[1.24] tracking-[-0.96px] text-[#202020] sm:text-[48px] sm:tracking-[-1.44px]"
            >
              Here&#39;s the whole list.
            </h2>
            <p className="max-w-[441px] text-[16px] leading-[1.5] text-[#5c5c5c]">
              All of it set up, then kept running. Nothing for you to do.
            </p>
          </div>
        </div>

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
                <div
                  key={r.build}
                  className="flex flex-col items-start justify-between gap-[16px] sm:flex-row sm:items-center"
                >
                  <div className="flex w-full items-center gap-[24px] sm:w-[400px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.icon}
                      alt=""
                      className="size-[64px] shrink-0 rounded-[12px] bg-[#fefefe] object-cover shadow-[-1px_-1px_4px_0px_rgba(0,0,0,0.15),1px_1px_4px_0px_rgba(0,0,0,0.15)]"
                    />
                    <p
                      style={{ fontFamily: HELV }}
                      className="text-[26px] font-bold leading-[1.26] tracking-[-0.96px] text-[#202020] sm:text-[32px]"
                    >
                      {r.build}
                    </p>
                  </div>
                  <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.4px] text-[#5c5c5c] sm:w-[400px] sm:text-[20px]">
                    {r.does}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Framed>
      </div>
    </section>
  )
}
