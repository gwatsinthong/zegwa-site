import { HELV } from './sections'

// Prototype primitives for the redesigned vertical service pages (roofing
// first). Kept separate from components/sections.tsx (the locked Found
// design system) because this introduces a new accent color and new visual
// devices that haven't propagated to the rest of the site yet. Same base
// tokens as sections.tsx: Helvetica Now Display, #202020/#5c5c5c text, sharp
// corners, 1px hairline borders, no gradients. New accent: indigo #5B4BE8,
// used only for icon strokes, the admission accent bar, diagram elements,
// and subtle section-band tints -- never on CTAs, never replacing red on
// money.

export const INDIGO = '#5B4BE8'

// ---------------------------------------------------------------------------
// BrowserFrame: a screenshot shown inside a stylized browser chrome. The
// source images are full-page captures (see public/work/thumbs.json), so the
// image is cropped to its top edge at a fixed aspect ratio to show what's
// actually above the fold.

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
// bordered cards with a small indigo icon.

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
  return <div className="grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2">{children}</div>
}

// ---------------------------------------------------------------------------
// AccentBand: a full-width section band with a very subtle indigo tint,
// for content that should read as a quiet, distinct beat (not a CTA, not
// money) in the page rhythm.

export function AccentBand({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`w-full ${className}`} style={{ backgroundColor: 'rgba(91, 75, 232, 0.05)' }}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// AeoDiagram: a simple, decorative-functional illustration of a search
// question resolving to a local result (map pin + rating + an AI answer
// line). Indigo for accents, grey for structure. ~400x300, scales via
// viewBox.

export function AeoDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label="A search question resolving to a local business result with a map pin, star rating, and AI answer"
    >
      {/* Left: search/question box */}
      <rect x="16" y="110" width="150" height="80" rx="2" fill="none" stroke="#cecece" strokeWidth="1.5" />
      <circle cx="42" cy="136" r="7" fill="none" stroke={INDIGO} strokeWidth="1.5" />
      <line x1="47" y1="141" x2="52" y2="146" stroke={INDIGO} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="64" y1="133" x2="140" y2="133" stroke="#dedede" strokeWidth="4" strokeLinecap="round" />
      <line x1="32" y1="160" x2="150" y2="160" stroke="#e8e8e8" strokeWidth="4" strokeLinecap="round" />
      <line x1="32" y1="172" x2="120" y2="172" stroke="#e8e8e8" strokeWidth="4" strokeLinecap="round" />

      {/* Arrow */}
      <line x1="180" y1="150" x2="222" y2="150" stroke="#cecece" strokeWidth="1.5" />
      <polyline points="212,142 222,150 212,158" fill="none" stroke="#cecece" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Right: result card */}
      <rect x="236" y="70" width="150" height="160" rx="2" fill="none" stroke="#202020" strokeWidth="1.5" />

      {/* Map pin */}
      <path
        d="M311 96c-10 0-18 8-18 18 0 13 18 32 18 32s18-19 18-32c0-10-8-18-18-18z"
        fill="none"
        stroke={INDIGO}
        strokeWidth="1.5"
      />
      <circle cx="311" cy="114" r="6" fill={INDIGO} />

      {/* Star rating */}
      <g transform="translate(258,160)" stroke={INDIGO} strokeWidth="1.2" fill="none">
        <path d="M6 0l1.8 3.6L12 4.2 9 7l0.7 4L6 9l-3.7 2 0.7-4-3-2.8 4.2-0.6z" />
        <path d="M20 0l1.8 3.6L26 4.2 23 7l0.7 4L20 9l-3.7 2 0.7-4-3-2.8 4.2-0.6z" />
        <path d="M34 0l1.8 3.6L40 4.2 37 7l0.7 4L34 9l-3.7 2 0.7-4-3-2.8 4.2-0.6z" />
        <path d="M48 0l1.8 3.6L54 4.2 51 7l0.7 4L48 9l-3.7 2 0.7-4-3-2.8 4.2-0.6z" fill={INDIGO} />
        <path d="M62 0l1.8 3.6L68 4.2 65 7l0.7 4L62 9l-3.7 2 0.7-4-3-2.8 4.2-0.6z" />
      </g>

      {/* AI answer line */}
      <rect x="250" y="188" width="112" height="26" rx="2" fill="none" stroke="#cecece" strokeWidth="1" />
      <line x1="260" y1="197" x2="352" y2="197" stroke="#dedede" strokeWidth="3" strokeLinecap="round" />
      <line x1="260" y1="205" x2="330" y2="205" stroke="#dedede" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// What We Do icons: simple ~24px indigo-stroke SVGs, one per checklist item.

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: INDIGO,
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
