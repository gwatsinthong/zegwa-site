import ZMark from './ZMark'

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
