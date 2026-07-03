// Wordmark: a sharp black Z tile next to the Zegwa name.
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center bg-text font-display text-sm leading-none text-bg"
      >
        Z
      </span>
      <span className="font-display text-xl leading-none tracking-tight">
        Zegwa
      </span>
    </span>
  )
}
