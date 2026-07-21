import Link from 'next/link'
import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import { HELV, FRAME_TYPE, RuleRow, Mark, PillCta, Framed } from '@/components/sections'

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

type Industry = { label: string; href: string; desc: string }

const HOME_AND_TRADES: Industry[] = [
  { label: 'Roofing', href: '/roofing', desc: 'Get found when someone needs a roof.' },
  { label: 'Plumbing', href: '/plumbing', desc: 'Get found when a pipe bursts.' },
  { label: 'HVAC', href: '/hvac', desc: 'Get found when the AC quits.' },
  { label: 'Electrical', href: '/electrical', desc: "Get found when the power's out." },
  { label: 'Auto repair', href: '/auto-repair', desc: 'Get found when the car breaks down.' },
  { label: 'Landscaping', href: '/landscaping', desc: 'Get found when they want the yard done.' },
  { label: 'Cleaning', href: '/cleaning', desc: 'Get found when they need a cleaner.' },
]

const HEALTH_AND_WELLNESS: Industry[] = [
  { label: 'Dental', href: '/dental', desc: 'Get found by new patients nearby.' },
  { label: 'Chiropractic', href: '/chiropractic', desc: "Get found when someone's in pain." },
  { label: 'Med spa', href: '/med-spa', desc: 'Get found when they research treatments.' },
  { label: 'Veterinary', href: '/veterinary', desc: 'Get found when a pet needs care.' },
  { label: 'Weight-loss clinics', href: '/weight-loss', desc: 'Get found by patients searching nearby.' },
]

const PROFESSIONAL_AND_OTHER: Industry[] = [
  { label: 'Law firms', href: '/law-firm-seo', desc: 'Get found when someone needs a lawyer.' },
  { label: 'Accounting', href: '/accounting', desc: 'Get found when they need an accountant.' },
  { label: 'Gyms', href: '/gym', desc: 'Get found by people looking to train.' },
  { label: 'Real estate', href: '/real-estate', desc: 'Get found by buyers and sellers.' },
]

function IndustryGrid({ title, items }: { title: string; items: Industry[] }) {
  return (
    <div className="flex w-full flex-col items-center gap-[32px]">
      <h3 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.h5}`}>
        {title}
      </h3>
      <Framed outer="p-[16px]" bare className="w-full">
        <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col gap-[8px] rounded-[16px] bg-[#fefefe] p-[32px] shadow-[-1px_-1px_4px_0px_rgba(0,0,0,0.15),1px_1px_4px_0px_rgba(0,0,0,0.15)] outline-none transition-shadow hover:shadow-[-1px_-1px_6px_0px_rgba(0,0,0,0.2),1px_1px_6px_0px_rgba(0,0,0,0.2)] focus-visible:ring-2 focus-visible:ring-[#202020]/30"
            >
              <h4 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.cardTitle}`}>
                {item.label}
              </h4>
              <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{item.desc}</p>
            </Link>
          ))}
        </div>
      </Framed>
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
