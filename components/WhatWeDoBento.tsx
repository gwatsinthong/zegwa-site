import { FRAME_TYPE, Framed, HELV, Mark, RuleRow } from './sections'

// The "What we do" bento grid used by every industry/service vertical page
// (roofing, plumbing, chiropractic, local-seo, ...). Identical markup and
// heading copy across all of them -- only the 5 items' desc wording differs
// per page (title and order are always the same 5 concepts), so the tile
// images are keyed by position rather than threaded through every page's
// WHAT_WE_DO data.
const TILE_IMAGES = [
  '/images/bento-map-pack.jpg',
  '/images/bento-directory-listings.jpg',
  '/images/bento-ai-search.jpg',
  '/images/bento-reviews.jpg',
  '/images/bento-one-dashboard.jpg',
]

export type WhatWeDoItem = { title: string; desc: string }

export default function WhatWeDoBento({ items }: { items: WhatWeDoItem[] }) {
  return (
    <section className="px-6 py-[80px] sm:py-[100px]">
      <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[64px]">
        <div className="flex flex-col items-center gap-[24px]">
          <Mark />
          <RuleRow>What we do</RuleRow>
          <h2
            style={{ fontFamily: HELV }}
            className={`max-w-[500px] text-balance text-center text-[#202020] ${FRAME_TYPE.h2}`}
          >
            Everything that gets you found.
          </h2>
        </div>

        <Framed outer="p-[16px]" bare className="w-full">
          {/* Bento: row 1 is two half-width tiles, row 2 is three third-width
              tiles, so all 5 items get a home. */}
          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-6">
            {items.map((item, i) => (
              <div
                key={item.title}
                className={`flex flex-col gap-[24px] rounded-[16px] bg-[#fefefe] p-[32px] shadow-[-1px_-1px_4px_0px_rgba(0,0,0,0.15),1px_1px_4px_0px_rgba(0,0,0,0.15)] ${
                  i < 2 ? 'sm:col-span-3' : 'sm:col-span-2'
                }`}
              >
                <div className="flex flex-col gap-[8px]">
                  <h3 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.cardTitle}`}>
                    {item.title}
                  </h3>
                  <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{item.desc}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={TILE_IMAGES[i]}
                  alt=""
                  className={`w-full rounded-[8px] object-cover ${i < 2 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
                />
              </div>
            ))}
          </div>
        </Framed>
      </div>
    </section>
  )
}
