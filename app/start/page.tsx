import type { Metadata } from 'next'
import AuditForm from '@/components/AuditForm'
import { HELV, FRAME_TYPE, RuleRow } from '@/components/sections'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Get your free audit',
  description:
    'Tell us about your business and we show you where customers are slipping, in 24 hours, free. No calls and no commitment.',
  path: '/start',
})

// Figma-faithful rebuild of frame 395:2244 "Start" (body only; the shell
// supplies Header + Footer). Exact radii, colors, shadows, and type sizes are
// read per node. Font target is Helvetica Now Display. The form lives in
// AuditForm (live endpoint, five response states); this page only supplies
// the hero copy and the trust-line row around it.

export default function StartPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ============================= HERO (395:2247) ========================= */}
      <section className="px-6 pb-[26px] pt-[64px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[26px] text-center">
          <RuleRow>Free audit</RuleRow>
          <h1
            style={{ fontFamily: HELV }}
            className={`max-w-[704px] text-[#202020] ${FRAME_TYPE.display}`}
          >
            Let&#39;s see what you&#39;re missing.
          </h1>
          <p className="max-w-[503px] text-[18px] leading-[1.5] text-[#5c5c5c] sm:text-[20px]">
            Tell us your business. We&#39;ll show you where the customers are slipping, in 24 hours,
            free.
          </p>
        </div>
      </section>

      {/* ============================= DEMO / FORM (395:2285) =================== */}
      <section className="px-6 pt-[64px] pb-[80px] sm:pt-[100px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[984px] flex-col items-center gap-[32px]">
          <AuditForm />

          {/* Trust line (399:2430): 3 items, justified, single row on desktop. */}
          <div className="flex w-full flex-col items-start gap-[16px] text-[14px] font-bold leading-[1.5] text-[#5c5c5c] sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <p className="sm:whitespace-nowrap">You&#39;ll see the actual gaps, not a sales pitch</p>
            <p className="sm:whitespace-nowrap">
              A real person reviews your business, not just a report
            </p>
            <p className="sm:whitespace-nowrap">Nothing to buy. Decide after you&#39;ve seen it.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
