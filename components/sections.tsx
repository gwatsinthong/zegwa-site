import Link from 'next/link'
import ZMark from './ZMark'
import { Arrow, Check } from './icons'

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

// A price line. `old` (if present) renders struck through, `now` is the live
// figure. Reserved-red note: the strikethrough on `old` is red on purpose, to
// match the Figma Bundle card. FLAG for review.
export type Price = {
  prefix?: string
  old?: string
  now: string
  suffix: string
}

function PriceLine({ price, lead }: { price: Price; lead?: boolean }) {
  const num = price.old ? 'text-4xl' : lead ? 'text-5xl' : 'text-3xl'
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5 font-display leading-tight">
      {price.prefix && <span className="text-3xl">{price.prefix}</span>}
      {price.old && (
        <span
          className={`${num} text-[#9d9a9a] line-through decoration-accent-red decoration-[3px]`}
        >
          {price.old}
        </span>
      )}
      <span className={num}>{price.now}</span>
      <span className="text-xl text-muted">{price.suffix}</span>
    </p>
  )
}

// Reusable pricing tier card. `highlighted` renders the reserved-red treatment
// from the Figma Bundle tier (red border, red BEST VALUE tag, faint red wash).
export function TierCard({
  name,
  tagline,
  setup,
  monthly,
  features,
  cta,
  highlighted = false,
}: {
  name: string
  tagline: string
  setup: Price
  monthly: Price
  features: string[]
  cta: { label: string; href: string }
  highlighted?: boolean
}) {
  return (
    <div
      className={`relative flex flex-col justify-between gap-8 border bg-white p-6 ${
        highlighted ? 'border-accent-red' : 'border-hairline'
      }`}
    >
      {highlighted && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-accent-red opacity-[0.03]"
          />
          <span className="absolute right-6 top-6 z-10 text-sm font-medium tracking-wide text-accent-red">
            BEST VALUE
          </span>
        </>
      )}

      <div className="relative flex flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-wide text-muted">{name}</p>
        <p className="text-muted">{tagline}</p>

        <div className="flex flex-col">
          <PriceLine price={setup} lead />
          <PriceLine price={monthly} />
        </div>

        <div className="h-px w-full bg-hairline" />

        <ul className="flex flex-col gap-2.5">
          {features.map((f) => (
            <li key={f} className="flex gap-2.5">
              <Check className="mt-0.5 shrink-0 text-text" />
              <span className="text-muted">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={cta.href}
        className={`relative flex w-full items-center justify-center gap-2 px-6 py-3 text-base font-medium outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
          highlighted
            ? 'bg-text text-bg focus-visible:ring-text/40'
            : 'border border-hairline bg-white text-text focus-visible:ring-text/30'
        }`}
      >
        {cta.label}
        <Arrow />
      </Link>
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

function Labeled({ label, text }: { label: string; text: string }) {
  return (
    <>
      <strong className="font-semibold">{label}</strong>
      {text}
    </>
  )
}

function LegalBlockView({ block }: { block: LegalBlock }) {
  switch (block.k) {
    case 'p':
      return (
        <p>{block.label ? <Labeled label={block.label} text={block.text} /> : block.text}</p>
      )
    case 'sub':
      return <p className="font-semibold text-text">{block.text}</p>
    case 'ul':
      return (
        <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-muted">
          {block.items.map((item, i) => (
            <li key={i}>
              {typeof item === 'string' ? item : <Labeled label={item.label} text={item.text} />}
            </li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th
                    key={h}
                    className="border border-hairline bg-black/[0.03] px-3 py-2 text-left font-semibold text-text"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-hairline px-3 py-2 align-top text-muted">
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
    <>
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <Kicker>{content.kicker}</Kicker>
          <h1>{content.title}</h1>
          <p className="text-muted">
            {content.org}
            <br />
            {content.updated}
          </p>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="mx-auto w-full max-w-2xl px-6">
          <div className="flex flex-col gap-12">
            {content.sections.map((section, i) => (
              <div key={i} className={i > 0 ? 'border-t border-hairline pt-12' : ''}>
                <h2 className="mb-5 font-display text-2xl">{section.heading}</h2>
                <div className="flex flex-col gap-4 text-base leading-relaxed text-text">
                  {section.blocks.map((block, j) => (
                    <LegalBlockView key={j} block={block} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
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
  const left = onDark ? 'from-[#101010] to-[#7d7d7d]' : 'from-[#f0f0f0] to-[#cecece]'
  const right = onDark ? 'from-[#7d7d7d] to-[#101010]' : 'from-[#cecece] to-[#f0f0f0]'
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

// Pill CTA. black/red are the ringed body CTAs; light is the frame's header CTA
// (single #e8e8e8 pill, no ring). All reuse this one component.
export function PillCta({
  label = 'Get free audit',
  href = '/start',
  tone = 'black',
  className = '',
}: {
  label?: string
  href?: string
  tone?: 'black' | 'red' | 'light'
  className?: string
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
  const ring = tone === 'red' ? 'border-[#512a2a]' : 'border-[#cecece]'
  const grad = tone === 'red' ? 'from-[#f91626] to-[#a80813]' : 'from-[#4a4a4a] to-black'
  return (
    <Link href={href} className={`inline-block rounded-[999px] border-[6px] ${ring} p-[6px] outline-none focus-visible:ring-2 focus-visible:ring-[#202020]/40 ${className}`}>
      <span className={`flex items-center justify-center gap-[10px] rounded-[999px] bg-gradient-to-b ${grad} px-[48px] py-[12px] drop-shadow-[-1px_-1px_2px_rgba(0,0,0,0.15),1px_1px_2px_rgba(0,0,0,0.15)] sm:px-[80px]`}>
        <span className="text-[16px] font-bold tracking-[0.16px] text-[#fefefe]">{label}</span>
        <ArrowRight className="h-[24px] w-[24px] text-[#fefefe]" />
      </span>
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
