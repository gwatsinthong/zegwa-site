// Prototype primitive for the redesigned vertical service pages. Kept
// separate from components/sections.tsx (the locked Found design system)
// because this device -- a browser-chrome frame around a demo screenshot --
// hasn't propagated to the rest of the site yet. Everything else the
// vertical pages need (Framed, RuleRow, Mark, PillCta, CheckList, FaqList,
// SOFT_DROP_SHADOW) is reused directly from sections.tsx, matching the
// exact section patterns already established on app/page.tsx.

// ---------------------------------------------------------------------------
// BrowserFrame: a screenshot shown inside a plain, monochrome browser chrome.
// The source images are full-page captures (see public/work/thumbs.json), so
// the image is cropped to its top edge at a fixed aspect ratio to show
// what's actually above the fold.

export function BrowserFrame({
  src,
  url,
  alt,
  className = '',
}: {
  src: string
  url: string
  alt: string
  className?: string
}) {
  return (
    <div className={`w-full border border-[#202020]/15 bg-white ${className}`}>
      <div className="flex items-center gap-[16px] border-b border-[#202020]/15 bg-[#f0f0f0] px-[16px] py-[10px]">
        <div className="flex gap-[6px]" aria-hidden="true">
          <span className="h-[8px] w-[8px] rounded-full bg-[#cecece]" />
          <span className="h-[8px] w-[8px] rounded-full bg-[#cecece]" />
          <span className="h-[8px] w-[8px] rounded-full bg-[#cecece]" />
        </div>
        <span className="flex-1 truncate rounded-[999px] border border-[#202020]/10 bg-white px-[12px] py-[3px] text-center text-[12px] text-[#777]">
          {url}
        </span>
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CheckListDark: CheckList's on-dark counterpart. sections.tsx's CheckList
// hardcodes a dark stroke/text (#202020, #5c5c5c) sized for the light body,
// so it disappears against a dark band. Same list shape, palette flipped to
// the site's own on-dark tokens (#fefefe text, #f91626 accent stroke).

export function CheckListDark({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-[16px]">
      {items.map((it) => (
        <div key={it} className="flex items-start gap-[12px]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f91626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-[2px] h-[20px] w-[20px] shrink-0"
            aria-hidden="true"
          >
            <polyline points="4 12.5 9.5 18 20 6" />
          </svg>
          <p className="flex-1 text-balance text-left text-[18px] font-bold leading-[1.4] tracking-[-0.4px] text-[#fefefe]">
            {it}
          </p>
        </div>
      ))}
    </div>
  )
}
