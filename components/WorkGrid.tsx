'use client'

import { useMemo, useState } from 'react'
import { HELV, SOFT_DROP_SHADOW } from './sections'

export type WorkSample = {
  trade: string
  label: string
  businessName: string
  // Live subdomain, e.g. "https://ridgeline-hvac.zegwastudio.com". Empty
  // until Gwatsin supplies the real one -- the card renders as a
  // non-clickable "Coming soon" state instead of a dead link.
  url: string
  // Future real screenshot path (not created yet -- Gwatsin's call per the
  // brief). The card always renders the labeled gradient placeholder below
  // regardless of this value; swap the placeholder for an <img src={thumb}>
  // once real screenshots exist.
  thumb: string
}

const CHIP_BASE =
  'whitespace-nowrap rounded-[999px] border px-[16px] py-[8px] text-[14px] font-bold tracking-[0.16px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#202020]/30'
const CHIP_ACTIVE = 'border-[#202020] bg-[#202020] text-[#fefefe]'
const CHIP_INACTIVE = 'border-[#e0e0e0] bg-[#fefefe] text-[#5c5c5c] hover:border-[#202020] hover:text-[#202020]'

function WorkCard({ item }: { item: WorkSample }) {
  const isLive = item.url !== ''

  const card = (
    <div
      className={`flex h-full flex-col gap-[16px] rounded-[16px] bg-[#fefefe] p-[16px] transition-transform ${SOFT_DROP_SHADOW} ${
        isLive ? 'group-hover:-translate-y-[2px]' : ''
      }`}
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[8px] bg-gradient-to-br from-[#efeeeb] to-[#e2e1de]">
        {/* Swap: real screenshot of {item.businessName} -> public{item.thumb} */}
        <span className="absolute inset-0 flex items-center justify-center text-center text-[12px] uppercase leading-[1.5] tracking-wide text-[#9d9a9a]">
          Site screenshot
        </span>
        <span
          className={`absolute left-[12px] top-[12px] rounded-[999px] px-[10px] py-[4px] text-[11px] font-bold uppercase tracking-wide ${
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
