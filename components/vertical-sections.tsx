import { HELV } from './sections'

// Prototype primitives for the redesigned vertical service pages (roofing
// first). Kept separate from components/sections.tsx (the locked Found
// design system) because layout devices here (browser-frame demo, card
// grid) haven't propagated to the rest of the site yet. Same tokens and
// palette as sections.tsx and the rest of the site: Helvetica Now Display,
// #202020/#5c5c5c text, #e8e8e8 surface, sharp corners, 1px hairline
// borders, no gradients, no accent color beyond black (CTAs) and red
// (money, unchanged, used only in PricingCards).

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
// FeatureCard / CardGrid: the What We Do checklist, restyled as a grid of
// bordered cards with a small monochrome icon. Three columns on desktop so
// an odd item count (five) doesn't leave a lone half-width card on its own
// row -- the last row simply has two cards instead of one.

export function FeatureCard({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode
  label: string
  text: string
}) {
  return (
    <div className="flex flex-col gap-[16px] border border-[#202020]/12 bg-white p-[24px]">
      <span aria-hidden="true">{icon}</span>
      <div className="flex flex-col gap-[4px]">
        <p style={{ fontFamily: HELV }} className="text-[16px] font-bold leading-[1.32] text-[#202020]">
          {label}
        </p>
        <p className="text-[14px] leading-[1.5] text-[#5c5c5c]">{text}</p>
      </div>
    </div>
  )
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid w-full grid-cols-1 gap-[16px] sm:grid-cols-3">{children}</div>
}

// ---------------------------------------------------------------------------
// AccentBand: a full-width section band using the site's existing counter
// surface (#f0f0f0), for content that should read as a quiet, distinct beat
// in the page rhythm without introducing a new color.

export function AccentBand({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`w-full bg-[#f0f0f0] ${className}`}>{children}</div>
}

// ---------------------------------------------------------------------------
// DiagramPlaceholder: a neutral stand-in for the AEO/local-search diagram,
// same slot size as the real illustration will occupy. Plain hairline
// border, sharp corners, muted centered label -- no accent color, no custom
// artwork yet.

export function DiagramPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex aspect-[4/3] w-full items-center justify-center border border-[#202020]/15 bg-[#f0f0f0] ${className}`}
    >
      <span className="text-[14px] uppercase tracking-[0.15em] text-[#777]">Diagram</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// What We Do icons: simple ~24px monochrome-stroke SVGs, one per checklist
// item. Same stroke color as the site's body text (#202020).

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#202020',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-[24px] w-[24px]',
  'aria-hidden': true as const,
}

export function MapPinIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

export function ListingsIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="3.5" y="4" width="17" height="16" rx="1" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="13" x2="17" y2="13" />
      <line x1="7" y1="17" x2="13" y2="17" />
    </svg>
  )
}

export function AiSparkleIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 3l1.8 4.7L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.3z" />
      <path d="M19 15l0.9 2.1L22 18l-2.1 0.9L19 21l-0.9-2.1L16 18l2.1-0.9z" />
    </svg>
  )
}

export function ReviewStarIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12 3.5l2.5 5.2 5.7 0.7-4.2 4 1.1 5.6L12 16.2l-5.1 2.8 1.1-5.6-4.2-4 5.7-0.7z" />
    </svg>
  )
}

export function DashboardIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1" />
      <rect x="13" y="3.5" width="7.5" height="4.5" rx="1" />
      <rect x="13" y="10" width="7.5" height="10.5" rx="1" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1" />
    </svg>
  )
}
