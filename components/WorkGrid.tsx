'use client'

import { useMemo, useState } from 'react'
import { HELV, SOFT_DROP_SHADOW } from './sections'
import thumbs from '@/public/work/thumbs.json'

type ThumbDims = { width: number; height: number }
const THUMBS: Record<string, ThumbDims> = thumbs

// The thumbnail window's fixed height (px); see the window's own className
// below (h-[340px]), not duplicated here as a literal string.
const FIXED_WINDOW_HEIGHT = 340

// Flat hover-scroll transition duration (seconds). Was previously computed
// per card from the image's rendered height; now a flat value per spec.
const HOVER_DURATION_S = 8

// Reference card image width used to compute the hover-scroll travel
// percentage (see travelPercent below): the window's height is now fixed
// (FIXED_WINDOW_HEIGHT) rather than scaling with the card's rendered width
// the way the image's height still does, so the percentage can only be
// exact at one reference width -- this is that width, and it's also where
// hover exists (the effect is hover-only, i.e. desktop). Derived from this
// page's own desktop (>=1024px) 3-col grid math, not guessed: content
// column maxes at 1040px -> Framed's own p-[16px] outer padding (1040 - 32
// = 1008) -> 3 columns with two 24px gaps (1008 - 48 = 960, /3 = 320 per
// card) -> the card's own p-[16px] padding (320 - 32 = 288).
const REFERENCE_CARD_WIDTH = 288

export type WorkSample = {
  trade: string
  label: string
  businessName: string
  // Live subdomain, e.g. "https://ridgeline-hvac.zegwastudio.com". Empty
  // until Gwatsin supplies the real one -- the card renders as a
  // non-clickable "Coming soon" state instead of a dead link.
  url: string
  // Superseded by the captured public/work/<subdomain>.webp thumbnails
  // (keyed by the subdomain parsed from `url`, see WorkCard) -- this field
  // is no longer read for rendering, kept only so existing data literals
  // don't need to drop it.
  thumb: string
}

const CHIP_BASE =
  'whitespace-nowrap rounded-[999px] border px-[16px] py-[8px] text-[14px] font-bold tracking-[0.16px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#202020]/30'
const CHIP_ACTIVE = 'border-[#202020] bg-[#202020] text-[#fefefe]'
const CHIP_INACTIVE = 'border-[#e0e0e0] bg-[#fefefe] text-[#5c5c5c] hover:border-[#202020] hover:text-[#202020]'

function WorkCard({ item }: { item: WorkSample }) {
  const isLive = item.url !== ''

  // The captured thumbnail is keyed by subdomain (e.g. "med-spa"), which only
  // reliably lives in the url ("https://med-spa.zegwastudio.com") -- item.thumb
  // is a stale placeholder-era path that doesn't always match (e.g. "auto"
  // vs. "auto-mechanic"), and item.trade has different casing/spacing.
  const subdomain = isLive ? new URL(item.url).hostname.split('.')[0] : null
  const dims = subdomain ? THUMBS[subdomain] : undefined

  // Percentage of the IMAGE'S OWN rendered height to translate it up by, so
  // it ends flush with the window's bottom edge. Computed against
  // REFERENCE_CARD_WIDTH -- see that constant's comment for why this can't
  // be a purely scale-invariant ratio anymore now that the window has a
  // fixed height instead of an aspect-ratio that scaled with card width.
  let travelPercent = 0
  if (dims) {
    const ratio = dims.height / dims.width
    const renderedHeight = ratio * REFERENCE_CARD_WIDTH
    travelPercent = Math.max(0, (1 - FIXED_WINDOW_HEIGHT / renderedHeight) * 100)
  }

  const imgStyle: React.CSSProperties & Record<string, string> = {
    transitionDuration: `${HOVER_DURATION_S}s`,
    '--work-travel': `${-travelPercent}%`,
  }

  const card = (
    <div
      className={`flex h-full flex-col gap-[16px] rounded-[16px] bg-[#fefefe] p-[16px] transition-transform ${SOFT_DROP_SHADOW} ${
        isLive ? 'group-hover:-translate-y-[2px]' : ''
      }`}
    >
      <div className="relative h-[340px] w-full overflow-hidden rounded-[8px] bg-gradient-to-br from-[#efeeeb] to-[#e2e1de]">
        {dims && subdomain ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/work/${subdomain}.webp`}
            alt=""
            loading="lazy"
            className="absolute left-0 top-0 block h-auto w-full [@media(hover:hover)]:group-hover:translate-y-[var(--work-travel)] transition-transform ease-linear"
            style={imgStyle}
          />
        ) : (
          // Swap: real screenshot of {item.businessName} -- no captured
          // thumbnail for this card yet (thumbs.json has no matching entry).
          <span className="absolute inset-0 flex items-center justify-center text-center text-[12px] uppercase leading-[1.5] tracking-wide text-[#9d9a9a]">
            Site screenshot
          </span>
        )}
        <span
          className={`absolute left-[12px] top-[12px] z-10 rounded-[999px] px-[10px] py-[4px] text-[11px] font-bold uppercase tracking-wide ${
            isLive ? 'bg-[#fefefe] text-[#202020]' : 'bg-[#fefefe]/80 text-[#9d9a9a]'
          }`}
        >
          {isLive ? 'Sample site' : 'Coming soon'}
        </span>
      </div>

      <div className="flex flex-col gap-[2px]">
        <p className="truncate text-[18px] font-bold leading-[1.3] text-[#202020]">{item.businessName}</p>
        <p className="text-[14px] leading-[1.5] text-[#5c5c5c]">{item.trade}</p>
      </div>
    </div>
  )

  if (isLive) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#202020]/30"
      >
        {card}
      </a>
    )
  }

  // Not yet live: no href, no hover lift, cursor communicates it's inert.
  return (
    <div aria-disabled="true" className="h-full cursor-default">
      {card}
    </div>
  )
}

export default function WorkGrid({ items }: { items: WorkSample[] }) {
  const trades = useMemo(() => Array.from(new Set(items.map((i) => i.trade))), [items])
  const [active, setActive] = useState('All')

  const visible = active === 'All' ? items : items.filter((i) => i.trade === active)

  return (
    <div style={{ fontFamily: HELV }} className="flex w-full flex-col items-center gap-[32px]">
      <div className="flex w-full flex-wrap items-center justify-center gap-[8px]">
        <button
          type="button"
          onClick={() => setActive('All')}
          className={`${CHIP_BASE} ${active === 'All' ? CHIP_ACTIVE : CHIP_INACTIVE}`}
        >
          All
        </button>
        {trades.map((trade) => (
          <button
            key={trade}
            type="button"
            onClick={() => setActive(trade)}
            className={`${CHIP_BASE} ${active === trade ? CHIP_ACTIVE : CHIP_INACTIVE}`}
          >
            {trade}
          </button>
        ))}
      </div>

      <div className="grid w-full grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <WorkCard key={item.businessName} item={item} />
        ))}
      </div>
    </div>
  )
}
