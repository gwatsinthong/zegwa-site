import ZMark from './ZMark'

// Wordmark: the real Zegwa Z mark next to the Zegwa name.
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <ZMark className="h-7 w-auto text-text" />
      <span className="font-display text-xl leading-none tracking-tight">
        Zegwa
      </span>
    </span>
  )
}
