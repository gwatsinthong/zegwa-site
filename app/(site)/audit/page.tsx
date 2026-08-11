import type { Metadata } from 'next'
import AuditForm from '@/components/AuditForm'
import { HELV, FRAME_TYPE, RuleRow } from '@/components/sections'
import { pageMeta } from '@/lib/seo'
import FadeUp from '@/components/FadeUp'

export const metadata: Metadata = pageMeta({
  title: 'Get your free audit',
  description:
    'Tell us about your business and we show you where customers are slipping, in 24 hours, free. No calls and no commitment.',
  path: '/audit',
})

// Figma-faithful rebuild of frame 395:2244 "Start" (body only; the shell
// supplies Header + Footer). Exact radii, colors, shadows, and type sizes are
// read per node. Font target is Helvetica Now Display. The form lives in
// AuditForm (live endpoint, five response states); this page only supplies
// the hero copy and the trust-line row around it.

export default function AuditPage() {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* ============================= HERO (395:2247) ========================= */}
      <FadeUp>
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
      </FadeUp>

      {/* ============================= DEMO / FORM (395:2285) =================== */}
      <FadeUp delay={100}>
      <section className="px-6 pt-[64px] pb-[80px] sm:pt-[100px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[984px] flex-col items-center gap-[32px]">
          <AuditForm />

          {/* Trust line (399:2430): 3 items, justified, single row on desktop. */}
          <div className="flex w-full flex-col items-start gap-[16px] text-[14px] font-bold leading-[1.5] text-[#5c5c5c] sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <p className="sm:whitespace-nowrap">You&#39;ll see the actual gaps in your presence.</p>
            <p className="sm:whitespace-nowrap">
              A real person reviews your business before it sends.
            </p>
            <p className="sm:whitespace-nowrap">Nothing to buy. Decide after you&#39;ve seen it.</p>
          </div>

          {/* Sample-audit peek: a real screenshot of slide 1 of the live
              /sample-audit deck (captured via Playwright, not mocked), faded
              at the bottom to signal there's more, linking out to the full
              deck in a new tab. Not an audit CTA -- the form above already
              is that -- just proof of what the free audit actually looks
              like. */}
          <div className="flex w-full flex-col items-center gap-[16px] border-t border-[#e0e0e0] pt-[32px]">
            <p className="text-center text-[16px] leading-[1.5] text-[#5c5c5c]">
              Not sure what you&#39;ll get? Here&#39;s a real sample audit.
            </p>
            <div className="relative w-full max-w-[600px] overflow-hidden rounded-[16px] border border-[#e0e0e0] shadow-[-1px_-1px_4px_0px_rgba(0,0,0,0.1),1px_1px_4px_0px_rgba(0,0,0,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/sample-audit-peek.png"
                alt="Preview of a sample audit report: estimated monthly lost leads and audit score"
                className="block w-full"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[64px] bg-gradient-to-t from-[#e8e8e8] to-transparent"
              />
            </div>
            <a
              href="/sample-audit"
              target="_blank"
              rel="noopener"
              className="text-[16px] font-bold text-[#202020] underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[#202020]/30"
            >
              View the full sample audit
            </a>
          </div>
        </div>
      </section>
      </FadeUp>
    </div>
  )
}
