'use client'

import { useState } from 'react'
import { ArrowDown, CheckList, Framed, HELV, SOFT_DROP_SHADOW } from './sections'

// Full deliverables list (321:1455 toggle / the list itself below it). Collapsed
// by default; "See everything included" reveals it, and toggles it back closed
// on a second click (arrow flips to point up while open).

const DELIVERABLES_LEFT = [
  {
    title: 'YOUR WEBSITE',
    items: [
      'Conversion website, built to book',
      'A page for each core service',
      'Location pages for the areas you serve',
      'Booking embed, click-to-call, click-to-WhatsApp',
      'Lead capture forms',
      'Instant-quote / estimator tool',
      'Form auto-reply with instant text-back',
      'Fast, mobile-ready, and speed-optimized',
      'Domain, hosting, and SSL handled',
      'Privacy and terms pages',
    ],
  },
  {
    title: 'TRUST & CONVERSION',
    items: [
      'Review-request flow setup',
      'Before/after gallery and social-proof blocks',
      'Social profile claim and setup',
      'FAQ chat widget',
      'Photo and media cleanup',
      'Lead magnet / offer funnel',
    ],
  },
]

const DELIVERABLES_RIGHT = [
  {
    title: 'GETTING FOUND',
    items: [
      'On-page SEO, titles, meta, structured markup',
      'Local and service keyword research',
      'Google Business Profile setup and optimization',
      'Maps and map-pack optimization',
      'Local and industry directory listings',
      'AI search (AEO/GEO) optimization',
      'AI-first FAQ content',
    ],
  },
  {
    title: 'DAY-ONE WIN',
    items: ['One-time dead-lead reactivation sweep, re-books past inquiries who never booked'],
  },
  {
    title: 'TRACKING & OWNERSHIP',
    items: [
      'Analytics and conversion tracking',
      'One dashboard, every visit and lead logged',
      'The site, content, and data are yours to keep',
    ],
  },
]

const ONGOING = [
  'Listings and citation upkeep',
  'Review monitoring with AI-drafted responses',
  'AI search (AEO) maintenance',
  'Monthly performance report',
]

export default function Deliverables() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* See everything included (321:1455) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="deliverables"
        style={{ fontFamily: HELV }}
        className={`flex items-center gap-[10px] rounded-[999px] border border-[#fefefe] bg-[#e8e8e8] px-[24px] py-[8px] ${SOFT_DROP_SHADOW} outline-none focus-visible:ring-2 focus-visible:ring-[#202020]/30`}
      >
        <span className="text-[16px] font-bold tracking-[0.16px] text-[#202020]">
          See everything included
        </span>
        <ArrowDown className={`h-[24px] w-[24px] text-[#202020] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Full deliverables list: collapsed until the toggle above is clicked. */}
      {open && (
        <Framed outer="p-[12px]" inner="p-[24px] sm:p-[32px]" className="w-full max-w-[947px]">
          <div id="deliverables" className="flex flex-col gap-[32px]">
            <div className="flex flex-col items-center gap-[8px]">
              <p
                style={{ fontFamily: HELV }}
                className="text-center text-[26px] font-bold leading-[1.26] tracking-[-0.96px] text-[#777] sm:text-[32px]"
              >
                Full Deliverables List
              </p>
              <div
                className="h-[2px] w-[298px] max-w-full"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #f0f0f0 0%, #cecece 30%, #cecece 70%, #f0f0f0 100%)',
                }}
              />
            </div>
            <div className="flex flex-col gap-[40px] sm:flex-row">
              <div className="flex flex-1 flex-col gap-[32px]">
                {DELIVERABLES_LEFT.map((group) => (
                  <div key={group.title} className="flex flex-col gap-[16px]">
                    <p className="text-[24px] font-bold leading-[1.26] tracking-[-0.72px] text-[#777]">
                      {group.title}
                    </p>
                    <CheckList items={group.items} />
                  </div>
                ))}
              </div>
              <div className="flex flex-1 flex-col gap-[32px]">
                {DELIVERABLES_RIGHT.map((group) => (
                  <div key={group.title} className="flex flex-col gap-[16px]">
                    <p className="text-[24px] font-bold leading-[1.26] tracking-[-0.72px] text-[#777]">
                      {group.title}
                    </p>
                    <CheckList items={group.items} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-[16px]">
              <p className="text-[24px] font-bold leading-[1.26] tracking-[-0.72px] text-[#777]">
                ONGOING (monthly)
              </p>
              <CheckList items={ONGOING} />
            </div>
          </div>
        </Framed>
      )}
    </>
  )
}
