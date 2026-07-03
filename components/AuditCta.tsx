import Link from 'next/link'
import { Arrow } from './icons'

// The Found page places a "Get free audit" button (not the form) at each CTA.
// It links to /start, where the AuditForm lives.
// variant "black" is the default. "red" is used only inside the money-band
// section, where red is a reserved treatment.
export default function AuditCta({
  variant = 'black',
  caption = 'Your audit in 24 hours. No strings.',
  onDark = false,
  className = '',
}: {
  variant?: 'black' | 'red'
  caption?: string | null
  onDark?: boolean
  className?: string
}) {
  const button =
    variant === 'red'
      ? 'bg-accent-red text-white focus-visible:ring-white/50'
      : onDark
        ? 'bg-white text-text focus-visible:ring-white/50'
        : 'bg-text text-bg focus-visible:ring-text/40'

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <Link
        href="/start"
        className={`inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-medium outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 ${
          onDark ? 'focus-visible:ring-offset-[#202020]' : 'focus-visible:ring-offset-bg'
        } ${button}`}
      >
        Get free audit
        <Arrow />
      </Link>
      {caption && (
        <p className={`text-center text-sm ${onDark ? 'text-[#9d9a9a]' : 'text-muted'}`}>
          {caption}
        </p>
      )}
    </div>
  )
}
