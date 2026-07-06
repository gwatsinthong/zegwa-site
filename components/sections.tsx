import Link from 'next/link'
import ZMark from './ZMark'

// Red money figure. Reserved for loss-framing dollars in the sample report
// (the leak, per-gap slices, the one-thing number, the do-nothing delta).
export function Money({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-accent-red">{children}</span>
}

// Bordered emphasis box (sharp corners) for report callouts.
export function Callout({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`border border-hairline bg-white p-6 sm:p-8 ${className}`}>{children}</div>
}

// Shared section-building blocks used across marketing pages (Found, About, ...).

export function Container({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`mx-auto w-full max-w-shell px-6 ${className}`}>{children}</div>
}

export function Kicker({
  children,
  onDark = false,
}: {
  children: React.ReactNode
  onDark?: boolean
}) {
  const rule = onDark ? 'via-[#4a4a4a]' : 'via-hairline'
  const text = onDark ? 'text-[#9d9a9a]' : 'text-muted'
  return (
    <div className="flex items-center justify-center gap-3">
      <span className={`h-px w-16 bg-gradient-to-r from-transparent ${rule} to-transparent`} />
      <span className={`text-sm uppercase tracking-[0.15em] ${text}`}>{children}</span>
      <span className={`h-px w-16 bg-gradient-to-r from-transparent ${rule} to-transparent`} />
    </div>
  )
}

export function SectionMark({ onDark = false }: { onDark?: boolean }) {
  return <ZMark className={`h-5 w-auto ${onDark ? 'text-[#9d9a9a]' : 'text-muted'}`} />
}

// Plus that becomes a minus when its parent <details className="group"> is open.
export function ToggleSign() {
  return (
    <span aria-hidden="true" className="relative flex h-6 w-6 shrink-0 items-center justify-center">
      <span className="absolute h-0.5 w-3.5 bg-current" />
      <span className="absolute h-3.5 w-0.5 bg-current transition-opacity group-open:opacity-0" />
    </span>
  )
}

// A price figure. `old` (if present) is the pre-bundle price, struck through in
// accent red (the frame draws a hand-tilted red line; a straight red
// line-through reads the same). `now` is the live figure. Setup renders `now`
// large (48px, or 36px when an `old` sits beside it); monthly renders 32px.
export type Price = {
  prefix?: string
  old?: string
  now: string
  suffix: string
}

// Faint red wash behind the Bundle tier. Swap: the Figma "Pattern / 50% alt /
// 90°" red squiggle tile, blended hard-light at 4%. This interlocking-arc tile
// is a self-contained stand-in at the same 75px cell size and opacity.
const BUNDLE_WASH =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='75' height='75'%3E%3Cg fill='none' stroke='%23f91626' stroke-width='6'%3E%3Ccircle cx='0' cy='0' r='19'/%3E%3Ccircle cx='75' cy='0' r='19'/%3E%3Ccircle cx='0' cy='75' r='19'/%3E%3Ccircle cx='75' cy='75' r='19'/%3E%3Ccircle cx='37.5' cy='37.5' r='19'/%3E%3C/g%3E%3C/svg%3E\")"

function TierPrice({ price, lead }: { price: Price; lead?: boolean }) {
  // lead = the large setup line (48px, or 36px when an old price sits beside it).
  const nowSize = price.old
    ? 'text-[36px] leading-[1.32] tracking-[-1.08px]'
    : lead
      ? 'text-[48px] leading-[1.24]'
      : 'text-[32px] leading-[1.26] tracking-[-0.96px]'
  const oldSize = lead
    ? 'text-[36px] leading-[1.32] tracking-[-1.08px]'
    : 'text-[32px] leading-[1.26] tracking-[-0.96px]'
  const track = lead ? 'tracking-[-1.44px]' : 'tracking-[-0.72px]'
  return (
    <p style={{ fontFamily: HELV }} className={`whitespace-normal font-bold text-[#202020] sm:whitespace-nowrap ${track}`}>
      {price.prefix && (
        <span className="text-[32px] leading-[1.26] tracking-[-0.96px]">{price.prefix} </span>
      )}
      {price.old && (
        <span className={`text-[#9d9a9a] line-through decoration-[#f91626] decoration-2 ${oldSize}`}>
          {price.old}{' '}
        </span>
      )}
      <span className={nowSize}>{price.now}</span>
      <span className="text-[24px] leading-[1.26] tracking-[-0.72px]"> {price.suffix}</span>
    </p>
  )
}

// Frame-faithful pricing tier card (Figma 348:2771 / 348:2938). Fixed 520px
// height with the CTA pinned to the bottom. `highlighted` adds the Bundle
// treatment: red border, faint red wash, red BEST VALUE tag, and red price
// strikethroughs (driven by each Price's `old`).
export function TierCard({
  name,
  tagline,
  setup,
  monthly,
  features,
  cta,
  highlighted = false,
  bestValue,
}: {
  name: string
  tagline: string
  setup: Price
  monthly: Price
  features: string[]
  cta: { label: string; href: string; tone: 'white' | 'blackFlat' }
  highlighted?: boolean
  bestValue?: string
}) {
  return (
    <div
      style={{ fontFamily: HELV }}
      className={`relative flex h-[520px] flex-1 flex-col items-center justify-between overflow-hidden rounded-[16px] bg-[#fefefe] p-[24px] shadow-[-1px_-1px_2px_0px_rgba(0,0,0,0.15),1px_1px_2px_0px_rgba(0,0,0,0.15)] ${
        highlighted ? 'border border-[#f91626]' : ''
      }`}
    >
      {highlighted && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: BUNDLE_WASH, backgroundSize: '75px 75px' }}
          />
          {bestValue && (
            <span className="absolute right-[24px] top-[24px] z-10 text-[14px] font-bold leading-[1.5] text-[#f91626]">
              {bestValue}
            </span>
          )}
        </>
      )}

      <div className="relative flex w-full flex-col items-start gap-[24px] overflow-hidden">
        <p className="w-full text-[14px] font-bold leading-[1.5] text-[#777]">{name}</p>
        <p className="w-full text-[16px] leading-[1.5] text-[#5c5c5c]">{tagline}</p>

        <div className="flex w-full flex-col gap-[16px]">
          <div className="flex flex-col">
            <TierPrice price={setup} lead />
            <TierPrice price={monthly} />
          </div>
          <div
            className="h-[2px] w-full"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #fefefe 0%, #dedede 30%, #dedede 70%, #fefefe 100%)',
            }}
          />
          <CheckList items={features} gap="gap-[8px]" />
        </div>
      </div>

      <PillCta
        label={cta.label}
        href={cta.href}
        tone={cta.tone}
        block
        className="relative z-10"
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Legal pages (Privacy, Terms, Cookies). Shared reading layout driven by a
// structured content model so the three pages stay visually consistent and
// edits happen in one place.

export type LegalBlock =
  | { k: 'p'; text: string; label?: string }
  | { k: 'sub'; text: string }
  | { k: 'ul'; items: Array<string | { label: string; text: string }> }
  | { k: 'table'; head: string[]; rows: string[][] }

export type LegalSection = { heading: string; blocks: LegalBlock[] }

export type LegalContent = {
  kicker: string
  title: string
  org: string
  updated: string
  sections: LegalSection[]
}

// Frame-faithful legal styling (Privacy 364:5158 / Terms 387:1819 / Cookie
// 387:2000). Body is 16px Helvetica in #202020; section headings are 24px bold.
// Labels are bold inline lead-ins.

function Labeled({ label, text }: { label: string; text: string }) {
  return (
    <>
      <strong className="font-bold">{label}</strong>
      {text}
    </>
  )
}

function LegalBlockView({ block, first = false }: { block: LegalBlock; first?: boolean }) {
  switch (block.k) {
    case 'p':
      return (
        <p>{block.label ? <Labeled label={block.label} text={block.text} /> : block.text}</p>
      )
    case 'sub':
      // A bold lead-in that starts a new group; extra top space unless it opens
      // the section (matches the frame's blank-line grouping).
      return <p className={`font-bold text-[#202020] ${first ? '' : 'mt-[12px]'}`}>{block.text}</p>
    case 'ul':
      return (
        <ul className="flex list-disc flex-col gap-[8px] pl-[20px] marker:text-[#202020]">
          {block.items.map((item, i) => (
            <li key={i} className="pl-[4px]">
              {typeof item === 'string' ? item : <Labeled label={item.label} text={item.text} />}
            </li>
          ))}
        </ul>
      )
    case 'table':
      // The frame renders these as borderless text columns: 14px bold headers,
      // 16px cells, column gaps, no rules or fills. Scrolls on narrow screens.
      return (
        <div className="overflow-x-auto pt-[8px]">
          <table className="w-full min-w-[460px] border-collapse text-left align-top">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th
                    key={h}
                    className="pb-[12px] pr-[24px] align-top text-[14px] font-bold leading-[1.5] text-[#202020] last:pr-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="align-top">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="py-[6px] pr-[24px] align-top text-[16px] leading-[1.5] text-[#202020] last:pr-0"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

export function LegalPage({ content }: { content: LegalContent }) {
  return (
    <div style={{ fontFamily: HELV }} className="text-[#202020]">
      {/* Hero (e.g. 364:5161): rule kicker, 56px title, org + last-updated. */}
      <section className="px-6 pb-[64px] pt-[64px] sm:pb-[80px] sm:pt-[80px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-[26px] text-center">
          <RuleRow>{content.kicker}</RuleRow>
          <h1
            style={{ fontFamily: HELV }}
            className={`max-w-[704px] text-[#202020] ${FRAME_TYPE.display}`}
          >
            {content.title}
          </h1>
          <div className="max-w-[503px]">
            <p className="text-[24px] font-bold leading-[1.26] tracking-[-0.72px] text-[#202020]">
              {content.org}
            </p>
            <p className="text-[20px] leading-[1.5] text-[#5c5c5c]">{content.updated}</p>
          </div>
        </div>
      </section>

      {/* Reading column (frame 500px). Sections stacked with 64px gaps. */}
      <section className="px-6 pb-[80px] sm:pb-[100px]">
        <div className="mx-auto flex max-w-[500px] flex-col gap-[64px]">
          {content.sections.map((section, i) => (
            <div key={i} className="flex flex-col gap-[8px] text-[16px] leading-[1.5] text-[#202020]">
              <h2
                style={{ fontFamily: HELV }}
                className="text-[24px] font-bold leading-[1.26] tracking-[-0.72px] text-[#202020]"
              >
                {section.heading}
              </h2>
              {section.blocks.map((block, j) => (
                <LegalBlockView key={j} block={block} first={j === 0} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ===========================================================================
// Frame-faithful primitives (Figma frame 321:1283 "Found").
// Extracted verbatim from app/page.tsx so every page reuses the exact same
// treatment. Font target is Helvetica Now Display with a Helvetica fallback.
// ===========================================================================

export const HELV = "'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial, sans-serif"

// Exact frame color tokens.
export const FRAME = {
  text: '#202020',
  secondary: '#5c5c5c',
  tertiary: '#777',
  tertiaryInv: '#9d9a9a',
  white: '#fefefe',
  counter: '#e0e0e0',
  chrome: '#e8e8e8',
  accent: '#f91626',
  accentDeep: '#a80813',
  dark: '#0c0c0d',
} as const

// The Helvetica display scale (desktop sizes/weights/tracking/leading) as
// reusable className strings. Colour and max-width are applied per use.
export const FRAME_TYPE = {
  display: 'text-[40px] font-bold leading-[1.24] tracking-[-1.6px] sm:text-[56px] sm:tracking-[-2.24px]',
  h2: 'text-[32px] font-bold leading-[1.24] tracking-[-0.96px] sm:text-[48px] sm:tracking-[-1.44px]',
  h3: 'text-[24px] font-bold leading-[1.32] tracking-[-0.72px] sm:text-[36px] sm:tracking-[-1.08px]',
  cardTitle: 'text-[24px] font-bold leading-[1.26] tracking-[-0.72px] sm:text-[32px] sm:tracking-[-0.96px]',
  h5: 'text-[20px] font-bold leading-[1.26] tracking-[-0.72px] sm:text-[24px]',
  bodyL: 'text-[18px] leading-[1.5] sm:text-[20px]',
  bodyM: 'text-[16px] leading-[1.5]',
  tag: 'text-[14px] font-medium uppercase leading-none',
} as const

export function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
    </svg>
  )
}

export function ArrowDown({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="12" y1="4" x2="12" y2="20" />
      <polyline points="5 13 12 20 19 13" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#202020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[24px] w-[24px] shrink-0" aria-hidden="true">
      <polyline points="4 12.5 9.5 18 20 6" />
    </svg>
  )
}

// The frame's card: white 1px border, #e0e0e0 counter backing, inner #fefefe
// card with layered drop shadows, plus an inset ring on the outer frame.
export function Framed({
  outer = 'p-[12px]',
  inner = 'p-[32px]',
  innerClass = '',
  innerShadow = 'shadow-[-1px_-1px_2px_0px_rgba(0,0,0,0.15),1px_1px_2px_0px_rgba(0,0,0,0.15)]',
  bare = false,
  className = '',
  children,
}: {
  outer?: string
  inner?: string
  innerClass?: string
  innerShadow?: string
  // bare: no single white inner card; children (their own white cards) float
  // directly on the #e0e0e0 counter backing, as the features grid and FAQ do.
  bare?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`relative rounded-[24px] border border-[#fefefe] ${outer} ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[24px] bg-[#e0e0e0]" />
      {bare ? (
        <div className="relative">{children}</div>
      ) : (
        <div className={`relative rounded-[16px] bg-[#fefefe] ${innerShadow} ${inner} ${innerClass}`}>
          {children}
        </div>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-[-1px] rounded-[inherit] shadow-[inset_1px_1px_2px_0px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_0px_rgba(0,0,0,0.2)]" />
    </div>
  )
}

export function RuleRow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  // Verbatim from frame 321:1308 / 321:1310: each 2px x 80px bar carries the
  // gradient plus a 1px bottom border (#f0f0f0 left, #ffffff right).
  const left = onDark
    ? 'from-[#101010] to-[#7d7d7d]'
    : 'from-[#f0f0f0] to-[#cecece] border-b border-[#f0f0f0]'
  const right = onDark
    ? 'from-[#7d7d7d] to-[#101010]'
    : 'from-[#cecece] to-[#f0f0f0] border-b border-white'
  const tag = onDark ? 'text-[#9d9a9a]' : 'text-[#777]'
  return (
    <div className="flex items-center gap-[8px]">
      <span className={`h-[2px] w-[80px] bg-gradient-to-r ${left}`} />
      <span className={`whitespace-nowrap text-[14px] font-medium uppercase leading-none ${tag}`}>
        {children}
      </span>
      <span className={`h-[2px] w-[80px] bg-gradient-to-r ${right}`} />
    </div>
  )
}

export function Mark({ onDark = false }: { onDark?: boolean }) {
  return <ZMark className={`h-[23px] w-[24px] ${onDark ? 'text-[#9d9a9a]' : 'text-[#202020]'}`} />
}

// Pill CTA. black is the ringed body CTA (grey #cecece tray around a black
// gradient pill, per the frame); red is the money-band body CTA (standalone
// gradient pill, no ring, on the dark band); light is the frame's header CTA
// (single #e8e8e8 pill, no ring). white/blackFlat are the flat, ringless pills
// used inside the pricing tier cards and problem rows: `white` is the #fefefe
// "See the fix" pill, `blackFlat` the black-gradient "Get free audit" / "Get the
// Bundle" pill. `block` makes the pill span its container (tier CTAs); left off,
// it hugs its label (problem-row CTAs, under an items-start parent). All reuse
// this one component.
export function PillCta({
  label = 'Get free audit',
  href = '/start',
  tone = 'black',
  block = false,
  className = '',
  onClick,
  type = 'button',
}: {
  label?: string
  href?: string
  tone?: 'black' | 'red' | 'light' | 'white' | 'blackFlat'
  block?: boolean
  className?: string
  // When onClick is set (flat tones only), render a <button> instead of a Link,
  // for form actions like Contact's Send that run JS rather than navigate.
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  if (tone === 'light') {
    return (
      <Link
        href={href}
        style={{ fontFamily: HELV }}
        className={`flex items-center justify-center gap-[10px] rounded-[999px] border border-[#fefefe] bg-[#e8e8e8] px-[24px] py-[8px] drop-shadow-[-1px_-1px_2px_rgba(0,0,0,0.15),1px_1px_2px_rgba(0,0,0,0.15)] outline-none focus-visible:ring-2 focus-visible:ring-[#202020]/30 ${className}`}
      >
        <span className="whitespace-nowrap text-[16px] font-bold tracking-[0.16px] text-[#202020]">{label}</span>
        <ArrowRight className="h-[24px] w-[24px] text-[#202020]" />
      </Link>
    )
  }
  if (tone === 'white' || tone === 'blackFlat') {
    const bg =
      tone === 'blackFlat'
        ? 'bg-gradient-to-b from-[#4a4a4a] to-black'
        : 'border border-[#fefefe] bg-[#fefefe]'
    const fg = tone === 'blackFlat' ? 'text-[#fefefe]' : 'text-[#202020]'
    const cls = `${block ? 'w-full ' : ''}flex items-center justify-center gap-[10px] rounded-[999px] ${bg} px-[24px] py-[8px] drop-shadow-[-1px_-1px_2px_rgba(0,0,0,0.15),1px_1px_2px_rgba(0,0,0,0.15)] outline-none focus-visible:ring-2 focus-visible:ring-[#202020]/30 ${className}`
    const inner = (
      <>
        <span className={`whitespace-nowrap text-[16px] font-bold tracking-[0.16px] ${fg}`}>{label}</span>
        <ArrowRight className={`h-[24px] w-[24px] ${fg}`} />
      </>
    )
    if (onClick) {
      return (
        <button type={type} onClick={onClick} style={{ fontFamily: HELV }} className={cls}>
          {inner}
        </button>
      )
    }
    return (
      <Link href={href} style={{ fontFamily: HELV }} className={cls}>
        {inner}
      </Link>
    )
  }
  // Body CTA (black tone): the authored frame (nodes 321:1326 tray / 321:1327
  // pill) wraps the black gradient pill in a flat 6px #cecece "tray" ring that
  // HUGS the pill — the tray's render bounds are 308×60 = pill 296×48 + 12px,
  // i.e. exactly the 6px stroke per side with NO transparent gap. So the border
  // sits flush against the pill (no padding); a p-[6px] gap would double the
  // ring zone and read as a raised bezel. Radius 999px, NO fill, NO shadow. The
  // pill is also shadowless: gradient #4a4a4a→#000 top-to-bottom, padding
  // 12px/80px, gap 10px, text 16px/1.5. The Link is the tray; the inner span is
  // the pill.
  if (tone === 'black') {
    return (
      <Link
        href={href}
        style={{ fontFamily: HELV }}
        className={`inline-flex items-center justify-center rounded-[999px] border-[6px] border-[#cecece] outline-none focus-visible:ring-2 focus-visible:ring-[#202020]/40 ${className}`}
      >
        <span className="flex items-center justify-center gap-[10px] rounded-[999px] bg-gradient-to-b from-[#4a4a4a] to-black px-[80px] py-[12px]">
          <span className="text-[16px] font-bold leading-[1.5] tracking-[0.16px] text-[#fefefe]">{label}</span>
          <ArrowRight className="h-[24px] w-[24px] text-[#fefefe]" />
        </span>
      </Link>
    )
  }
  // Red tone: the money-band CTA sits on the dark "cost of waiting" surface and
  // has no authored ring node, so it keeps its standalone gradient pill with a
  // plain soft drop shadow (a light ring/halo would glow on dark).
  return (
    <Link
      href={href}
      style={{ fontFamily: HELV }}
      className={`inline-flex items-center justify-center gap-[10px] rounded-[999px] bg-gradient-to-b from-[#f91626] to-[#a80813] px-[48px] py-[14px] shadow-[0_10px_24px_rgba(0,0,0,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-[#202020]/40 sm:px-[80px] ${className}`}
    >
      <span className="text-[16px] font-bold tracking-[0.16px] text-[#fefefe]">{label}</span>
      <ArrowRight className="h-[24px] w-[24px] text-[#fefefe]" />
    </Link>
  )
}

export function CheckList({ items, gap = 'gap-[4px]' }: { items: string[]; gap?: string }) {
  return (
    <div className={`flex flex-col ${gap}`}>
      {items.map((it) => (
        <div key={it} className="flex items-start gap-[4px]">
          <CheckIcon />
          <p className="flex-1 text-[16px] leading-[1.5] text-[#5c5c5c]">{it}</p>
        </div>
      ))}
    </div>
  )
}

// Two-column image + text block (Figma "Frame 170", e.g. About 364:4815). A
// framed image card (empty white inner at the frame's 293px height) beside a
// column of 24px-bold Helvetica paragraphs; stacks on mobile, image-left on
// desktop. Body paragraphs are separated by one line of leading, matching the
// frame's blank-line gaps.
export function SplitFeature({ body }: { body: string[] }) {
  return (
    <div className="flex w-full max-w-[984px] flex-col items-center gap-[24px] md:flex-row">
      {/* Swap: section image (frame inner card 456x293) */}
      <Framed
        outer="p-[12px]"
        inner=""
        innerClass="flex h-[293px] items-center justify-center"
        innerShadow="shadow-[-1px_-1px_2px_0px_rgba(0,0,0,0.15),1px_1px_2px_0px_rgba(0,0,0,0.15)]"
        className="w-full md:flex-1"
      >
        <span className="text-[12px] uppercase tracking-wide text-[#777]">image</span>
      </Framed>
      <div
        style={{ fontFamily: HELV }}
        className="flex w-full flex-col gap-[1.26em] text-[24px] font-bold leading-[1.26] tracking-[-0.72px] text-[#202020] md:flex-1"
      >
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  )
}

// FAQ accordion (Figma "Frame 126", e.g. About 364:4863). Native <details> in
// white cards floating on the grey counter backing: 24px-bold question, a
// plus/minus toggle that flips on open, and a 16px secondary answer.
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Framed outer="p-[12px]" bare className="w-full max-w-[700px]">
      <div className="flex flex-col gap-[10px]">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-[12px] bg-[#fefefe] p-[24px] drop-shadow-[-1px_-1px_2px_rgba(0,0,0,0.15),1px_1px_2px_rgba(0,0,0,0.15)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-[16px] [&::-webkit-details-marker]:hidden">
              <span
                style={{ fontFamily: HELV }}
                className="text-[20px] font-bold leading-[1.26] tracking-[-0.72px] text-[#202020] sm:text-[24px]"
              >
                {item.q}
              </span>
              <span aria-hidden="true" className="relative flex size-[40px] shrink-0 items-center justify-center">
                <span className="absolute h-[2px] w-[16px] bg-[#202020]" />
                <span className="absolute h-[16px] w-[2px] bg-[#202020] transition-opacity group-open:opacity-0" />
              </span>
            </summary>
            <p className="mt-[16px] max-w-[500px] text-[16px] leading-[1.5] text-[#5c5c5c]">{item.a}</p>
          </details>
        ))}
      </div>
    </Framed>
  )
}
