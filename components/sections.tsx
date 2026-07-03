import Link from 'next/link'
import ZMark from './ZMark'
import { Arrow, Check } from './icons'

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
