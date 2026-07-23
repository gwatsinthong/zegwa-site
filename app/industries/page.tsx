import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import { HELV, FRAME_TYPE, RuleRow, Mark, PillCta } from '@/components/sections'
import IndustryCardGrid, { type Industry } from '@/components/IndustryCardGrid'

export const metadata: Metadata = pageMeta({
  title: 'Industries we serve',
  description:
    'Done-for-you marketing and local SEO for home services, health practices, and professional businesses. Find your industry and see what we build.',
  path: '/industries',
})

// Index page: the single hub that links out to every vertical/conversion
// page, so none of them are orphaned (reachable only by direct URL/sitemap).
// Grouped into three plain, real-world groups rather than by product type
// (SEO vertical vs. conversion page), since a visitor looking for their own
// business doesn't care about that internal distinction.

const HOME_AND_TRADES: Industry[] = [
  { label: 'Roofing', href: '/roofing', desc: 'Get found when someone needs a roof.', image: '/images/industry-roofing.jpg' },
  { label: 'Plumbing', href: '/plumbing', desc: 'Get found when a pipe bursts.', image: '/images/industry-plumbing.jpg' },
  { label: 'HVAC', href: '/hvac', desc: 'Get found when the AC quits.', image: '/images/industry-hvac.jpg' },
  { label: 'Electrical', href: '/electrical', desc: "Get found when the power's out.", image: '/images/industry-electrical.jpg' },
  { label: 'Auto repair', href: '/auto-repair', desc: 'Get found when the car breaks down.', image: '/images/industry-auto-repair.jpg' },
  { label: 'Landscaping', href: '/landscaping', desc: 'Get found when they want the yard done.', image: '/images/industry-landscaping.jpg' },
  { label: 'Cleaning', href: '/cleaning', desc: 'Get found when they need a cleaner.', image: '/images/industry-cleaning.jpg' },
]

const HEALTH_AND_WELLNESS: Industry[] = [
  { label: 'Dental', href: '/dental', desc: 'Get found by new patients nearby.', image: '/images/industry-dental.jpg' },
  { label: 'Chiropractic', href: '/chiropractic', desc: "Get found when someone's in pain.", image: '/images/industry-chiropractic.jpg' },
  { label: 'Med spa', href: '/med-spa', desc: 'Get found when they research treatments.', image: '/images/industry-med-spa.jpg' },
  { label: 'Veterinary', href: '/veterinary', desc: 'Get found when a pet needs care.', image: '/images/industry-veterinary.jpg' },
  { label: 'Weight-loss clinics', href: '/weight-loss', desc: 'Get found by patients searching nearby.', image: '/images/industry-weight-loss.jpg' },
]

const PROFESSIONAL_AND_OTHER: Industry[] = [
  { label: 'Law firms', href: '/law-firm-seo', desc: 'Get found when someone needs a lawyer.', image: '/images/industry-law-firm.jpg' },
  { label: 'Accounting', href: '/accounting', desc: 'Get found when they need an accountant.', image: '/images/industry-accounting.jpg' },
  { label: 'Gyms', href: '/gym', desc: 'Get found by people looking to train.', image: '/images/industry-gym.jpg' },
  { label: 'Real estate', href: '/real-estate', desc: 'Get found by buyers and sellers.', image: '/images/industry-real-estate.jpg' },
]

function IndustryGrid({ title, items }: { title: string; items: Industry[] }) {
  return (
    <div className="flex w-full flex-col items-center gap-[32px]">
      <h3 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h5}`}>
        {title}
      </h3>
      <IndustryCardGrid items={items} />
    </div>
  )
}

export default function IndustriesPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ================================ HERO ================================= */}
      <section className="px-6 pb-[80px] pt-[64px] sm:pb-[100px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[26px]">
            <RuleRow>Industries</RuleRow>
            <h1
              style={{ fontFamily: HELV }}
              className={`max-w-[704px] text-center text-[#202020] ${FRAME_TYPE.display}`}
            >
              Who we help
            </h1>
            <p className="max-w-[560px] text-center text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              We build the web presence and get you found, whatever you do. Find your business
              below.
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

      {/* ============================== INDUSTRY GROUPS ========================== */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
          <IndustryGrid title="Home & trades" items={HOME_AND_TRADES} />
          <IndustryGrid title="Health & wellness" items={HEALTH_AND_WELLNESS} />
          <IndustryGrid title="Professional & other" items={PROFESSIONAL_AND_OTHER} />
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
              Don&#39;t see your business? We probably still help.
            </h2>
            <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
              The free audit works for any local business. See where you&#39;re losing customers.
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
    </div>
  )
}
