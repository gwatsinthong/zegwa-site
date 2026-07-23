import Link from 'next/link'
import { FRAME_TYPE, Framed, HELV } from './sections'

// Card grid of industry/vertical links (image, title, one-line desc), shared
// by every page that links out to the trade/practice pages: the industries
// hub (grouped into several of these), local-seo, and google-business-profile
// (one flat grid each). Identical card markup everywhere -- only which items
// and how many groups differs per page.

export type Industry = { label: string; href: string; desc: string; image: string }

export default function IndustryCardGrid({ items }: { items: Industry[] }) {
  return (
    <Framed outer="p-[16px]" bare className="w-full">
      <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col gap-[16px] rounded-[16px] bg-[#fefefe] p-[16px] shadow-[-1px_-1px_4px_0px_rgba(0,0,0,0.15),1px_1px_4px_0px_rgba(0,0,0,0.15)] outline-none transition-shadow hover:shadow-[-1px_-1px_6px_0px_rgba(0,0,0,0.2),1px_1px_6px_0px_rgba(0,0,0,0.2)] focus-visible:ring-2 focus-visible:ring-[#202020]/30"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt="" className="aspect-[16/9] w-full rounded-[8px] object-cover" />
            <div className="flex flex-col gap-[8px] px-[16px] pb-[16px]">
              <h4 style={{ fontFamily: HELV }} className={`text-[#202020] ${FRAME_TYPE.cardTitle}`}>
                {item.label}
              </h4>
              <p className="text-[16px] leading-[1.5] text-[#5c5c5c]">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </Framed>
  )
}
