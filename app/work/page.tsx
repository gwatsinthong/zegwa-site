import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import WorkGrid, { type WorkSample } from '@/components/WorkGrid'
import { HELV, FRAME_TYPE, Framed, RuleRow, PillCta } from '@/components/sections'

export const metadata: Metadata = pageMeta({
  title: 'Our work',
  description:
    'Fifteen real, live sites across the trades. See the kind of site we build before you pay for one.',
  path: '/work',
})

// Built from scratch (no Figma frame) in the locked Found design system --
// same Framed/PillCta/RuleRow/Mark primitives and Helvetica stack as every
// other page. Data-driven: swap a `url` below and that card goes live.
//
const SAMPLES: WorkSample[] = [
  {
    trade: 'HVAC',
    label: 'Sample site',
    businessName: 'Summit Air Co.',
    url: 'https://hvac.zegwastudio.com',
    thumb: '/images/work/hvac.jpg',
  },
  {
    trade: 'Plumbing',
    label: 'Sample site',
    businessName: 'Rivercity Plumbing',
    url: 'https://plumbing.zegwastudio.com',
    thumb: '/images/work/plumbing.jpg',
  },
  {
    trade: 'Roofing',
    label: 'Sample site',
    businessName: 'Ironclad Roofing',
    url: 'https://roofing.zegwastudio.com',
    thumb: '/images/work/roofing.jpg',
  },
  {
    trade: 'Electrical',
    label: 'Sample site',
    businessName: 'Bright Path Electric',
    url: 'https://electrical.zegwastudio.com',
    thumb: '/images/work/electrical.jpg',
  },
  {
    trade: 'Med spa',
    label: 'Sample site',
    businessName: 'Lumière Aesthetics',
    url: 'https://med-spa.zegwastudio.com',
    thumb: '/images/work/med-spa.jpg',
  },
  {
    trade: 'Dental',
    label: 'Sample site',
    businessName: 'Cedar Ridge Dental',
    url: 'https://dental.zegwastudio.com',
    thumb: '/images/work/dental.jpg',
  },
  {
    trade: 'Auto mechanic',
    label: 'Sample site',
    businessName: 'Redline Auto Care',
    url: 'https://auto.zegwastudio.com',
    thumb: '/images/work/auto-mechanic.jpg',
  },
  {
    trade: 'Injury law',
    label: 'Sample site',
    businessName: 'Marek & Stone Injury Law',
    url: 'https://injury-law.zegwastudio.com',
    thumb: '/images/work/injury-law.jpg',
  },
  {
    trade: 'Weight loss',
    label: 'Sample site',
    businessName: 'Meridian Weight',
    url: 'https://weight-loss.zegwastudio.com',
    thumb: '/images/work/weight-loss.jpg',
  },
  {
    trade: 'Gym',
    label: 'Sample site',
    businessName: 'Ironline Strength',
    url: 'https://gym.zegwastudio.com',
    thumb: '/images/work/gym.jpg',
  },
  {
    trade: 'Real estate',
    label: 'Sample site',
    businessName: 'North & Oak Realty',
    url: 'https://real-estate.zegwastudio.com',
    thumb: '/images/work/real-estate.jpg',
  },
  {
    trade: 'Vet',
    label: 'Sample site',
    businessName: 'Cottonwood Animal Hospital',
    url: 'https://vet.zegwastudio.com',
    thumb: '/images/work/vet.jpg',
  },
  {
    trade: 'Cleaning',
    label: 'Sample site',
    businessName: 'Tidewell Home Cleaning',
    url: 'https://cleaning.zegwastudio.com',
    thumb: '/images/work/cleaning.jpg',
  },
  {
    trade: 'Accounting',
    label: 'Sample site',
    businessName: 'Ledgerline CPA',
    url: 'https://accounting.zegwastudio.com',
    thumb: '/images/work/accounting.jpg',
  },
  {
    trade: 'Landscaping',
    label: 'Sample site',
    businessName: 'Cedar & Stone Landscapes',
    url: 'https://landscaping.zegwastudio.com',
    thumb: '/images/work/landscaping.jpg',
  },
]

export default function WorkPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ============================== HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>See it first</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              See what we&#39;d build for you.
            </h1>
            <p className="max-w-[418px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              Fifteen sample sites we built to show the work. Click into any of them.
            </p>
          </div>

          {/* ============================ GRID ================================ */}
          <Framed outer="p-[16px]" bare className="w-full">
            <WorkGrid items={SAMPLES} />
          </Framed>

          <div className="flex max-w-[600px] flex-col items-center gap-[48px] text-center">
            <p className="text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              Pick the one closest to your trade and click through it. That&#39;s what your
              customers would see. Want yours? Get a free audit and we&#39;ll show you exactly what
              to build.
            </p>
            <div className="flex flex-col items-center gap-[12px]">
              <PillCta />
              <p className="max-w-[448px] text-center text-[16px] leading-[1.5] text-[#777]">
                Your audit in 24 hours. No strings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
