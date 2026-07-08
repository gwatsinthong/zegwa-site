import { HELV, SOFT_DROP_SHADOW } from './sections'

// Home hero illustration (stage 1: static, no motion yet). Not a Figma frame --
// built from scratch per spec: the business sits at the center as a glossy orb,
// with search-platform result cards floating in an orbit around it on a soft
// glow field. All content below is sample/mockup data (a fake "Smile Dental
// Clinic" search result), not real customer content.
//
// Swap points (Gwatsin to supply):
//   - public/hero/orb.png            -- replaces the CSS sphere placeholder below
//   - public/hero/logos/<id>.svg     -- one official brand SVG per platform (see
//                                        PLATFORMS below for each `logo` path)
//   - each card's thumbnail / mini-map placeholder (labeled inline per card)

type CardType = 'search' | 'listing' | 'ai'

type Platform = {
  id: string
  name: string
  type: CardType
  logo: string
  monogram: string
  tint: string
  pos: { left: string; top: string }
}

const BUSINESS = 'Smile Dental Clinic'
const RATING = '4.8'
const REVIEWS = '(512)'
const QUERY = 'best dentist near me'
const STATUS = 'Closes 8 PM'
const AI_ANSWER = `${BUSINESS} is one of the top-rated dental clinics nearby, known for same-day appointments and friendly service.`

// Desktop orbit positions are percentages of the illustration box, anchored at
// each card's own center (the wrapper applies -translate-x/y-1/2).
const PLATFORMS: Platform[] = [
  {
    id: 'google-search',
    name: 'Google Search',
    type: 'search',
    logo: '/hero/logos/google-search.svg',
    monogram: 'G',
    tint: 'bg-[#4285f4]',
    pos: { left: '15%', top: '9%' },
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    type: 'ai',
    logo: '/hero/logos/chatgpt.svg',
    monogram: 'C',
    tint: 'bg-[#10a37f]',
    pos: { left: '85%', top: '9%' },
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    type: 'listing',
    logo: '/hero/logos/google-maps.svg',
    monogram: 'M',
    tint: 'bg-[#34a853]',
    pos: { left: '5%', top: '50%' },
  },
  {
    id: 'google-business-profile',
    name: 'Google Business Profile',
    type: 'listing',
    logo: '/hero/logos/google-business-profile.svg',
    monogram: 'B',
    tint: 'bg-[#4285f4]',
    pos: { left: '95%', top: '50%' },
  },
  {
    id: 'yelp',
    name: 'Yelp',
    type: 'listing',
    logo: '/hero/logos/yelp.svg',
    monogram: 'Y',
    tint: 'bg-[#d32323]',
    pos: { left: '17%', top: '91%' },
  },
  {
    id: 'gemini',
    name: 'Gemini',
    type: 'ai',
    logo: '/hero/logos/gemini.svg',
    monogram: 'G',
    tint: 'bg-gradient-to-br from-[#4285f4] to-[#9b72cb]',
    pos: { left: '50%', top: '91%' },
  },
  {
    id: 'apple-maps',
    name: 'Apple Maps',
    type: 'listing',
    logo: '/hero/logos/apple-maps.svg',
    monogram: 'A',
    tint: 'bg-[#202020]',
    pos: { left: '83%', top: '91%' },
  },
]

// The 3 archetypes (search / listing / AI answer), shown stacked on mobile.
const MOBILE_IDS = ['google-search', 'google-business-profile', 'chatgpt']

function Stars({ filled }: { filled: number }) {
  return (
    <span className="inline-flex gap-[1px]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-[9px] w-[9px]"
          fill={i < filled ? '#f5b400' : 'none'}
          stroke="#f5b400"
          strokeWidth={i < filled ? 0 : 1.5}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  )
}

function PlatformCard({ platform, className = '' }: { platform: Platform; className?: string }) {
  return (
    <div
      style={{ fontFamily: HELV }}
      className={`rounded-[12px] bg-[#fefefe] p-[12px] ${SOFT_DROP_SHADOW} ${className}`}
    >
      <div className="flex items-center gap-[6px]">
        {/* Swap: {platform.name} logo -> public{platform.logo} (official brand SVG) */}
        <span
          aria-hidden="true"
          className={`flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold text-white ${platform.tint}`}
        >
          {platform.monogram}
        </span>
        <p className="flex-1 truncate text-[13px] font-bold leading-none text-[#202020]">{platform.name}</p>
        <span aria-hidden="true" className="text-[13px] leading-none text-[#9d9a9a]">
          ⋮
        </span>
      </div>

      <div className="mt-[10px]">
        {platform.type === 'search' && (
          <>
            <div className="truncate rounded-[999px] border border-[#e0e0e0] px-[8px] py-[4px] text-[10px] text-[#5c5c5c]">
              {QUERY}
            </div>
            <div className="mt-[8px] flex items-center gap-[8px]">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold leading-[1.3] text-[#1a0dab]">{BUSINESS}</p>
                <p className="mt-[2px] flex items-center gap-[3px] text-[10px] leading-none text-[#5c5c5c]">
                  {RATING} <Stars filled={5} /> {REVIEWS}
                </p>
              </div>
              {/* Swap: search-result thumbnail for "{BUSINESS}" */}
              <div className="h-[32px] w-[32px] shrink-0 rounded-[6px] bg-gradient-to-br from-[#efeeeb] to-[#e2e1de]" />
            </div>
          </>
        )}

        {platform.type === 'listing' && (
          <div className="flex items-center gap-[8px]">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold leading-[1.3] text-[#202020]">{BUSINESS}</p>
              <p className="mt-[2px] flex items-center gap-[3px] text-[10px] leading-none text-[#5c5c5c]">
                {RATING} <Stars filled={4} /> {REVIEWS}
              </p>
              <p className="mt-[2px] text-[10px] leading-none text-[#5c5c5c]">
                <span className="font-bold text-[#188038]">Open</span> · {STATUS}
              </p>
            </div>
            {/* Swap: mini-map/thumbnail for {platform.name} listing */}
            <div className="h-[36px] w-[36px] shrink-0 rounded-[6px] bg-gradient-to-br from-[#efeeeb] to-[#e2e1de]" />
          </div>
        )}

        {platform.type === 'ai' && (
          <div className="flex items-center gap-[8px]">
            <p className="min-w-0 flex-1 text-[10px] leading-[1.4] text-[#5c5c5c]">{AI_ANSWER}</p>
            {/* Swap: AI-answer thumbnail for {platform.name} */}
            <div className="h-[28px] w-[28px] shrink-0 rounded-[6px] bg-gradient-to-br from-[#efeeeb] to-[#e2e1de]" />
          </div>
        )}
      </div>
    </div>
  )
}

// Concentric faint rings + a soft purple/white radial glow + a few blurred
// particle dots, centered on the orb. Pure CSS, no assets.
// `scale` shrinks every ring/glow/particle together (proportionally to the
// container it's placed in) so nothing gets clipped by the container edges --
// the mobile fallback uses a much shorter box than the desktop orbit, so its
// glow needs to shrink to match rather than reuse the desktop-sized rings.
function GlowField({ scale = 1 }: { scale?: number }) {
  const px = (n: number) => `${Math.round(n * scale)}px`
  const particles = [
    { left: '22%', top: '18%' },
    { left: '76%', top: '22%' },
    { left: '30%', top: '78%' },
    { left: '68%', top: '74%' },
    { left: '50%', top: '12%' },
    { left: '10%', top: '48%' },
  ]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: px(760),
          height: px(420),
          background:
            'radial-gradient(ellipse at center, rgba(147,112,219,0.16) 0%, rgba(147,112,219,0.06) 40%, rgba(147,112,219,0) 70%)',
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: px(340),
          height: px(220),
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cecece]/50"
        style={{ width: px(420), height: px(220) }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cecece]/30"
        style={{ width: px(620), height: px(340) }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cecece]/15"
        style={{ width: px(800), height: px(440) }}
      />
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/60 blur-[1.5px]"
          style={{ left: p.left, top: p.top, width: px(6), height: px(6) }}
        />
      ))}
    </div>
  )
}

// Swap: replaces this whole sphere with public/hero/orb.png (transparent bg)
// once supplied. Sized via the `size` prop so mobile can render a smaller one.
function Orb({ size = 180 }: { size?: number }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_20px_45px_rgba(0,0,0,0.28)]"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 35% 28%, #4a4a4a 0%, #1a1a1a 55%, #000 100%)',
      }}
    >
      <span
        style={{ fontFamily: HELV }}
        className="px-[16px] text-center text-[12px] font-bold uppercase leading-[1.3] tracking-[0.08em] text-white"
      >
        Your Business
      </span>
    </div>
  )
}

export default function SearchOrbit() {
  const mobileCards = MOBILE_IDS.map((id) => PLATFORMS.find((p) => p.id === id)!)

  return (
    <div className="w-full">
      {/* Desktop orbit (>=768px): 7 cards positioned around the center orb. */}
      <div className="relative hidden h-[640px] w-full md:block">
        <GlowField />
        <Orb />
        {PLATFORMS.map((p) => (
          <div
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: p.pos.left, top: p.pos.top }}
          >
            <PlatformCard platform={p} className="w-[176px]" />
          </div>
        ))}
      </div>

      {/* Mobile fallback (<768px): the orbit doesn't fit at this width, so
          degrade to a smaller centered orb with 3 representative cards (one
          of each type: search, listing, AI answer) stacked below it. */}
      <div className="flex flex-col items-center gap-[24px] md:hidden">
        <div className="relative h-[220px] w-full">
          <GlowField scale={0.4} />
          <Orb size={120} />
        </div>
        <div className="flex w-full max-w-[320px] flex-col gap-[12px]">
          {mobileCards.map((p) => (
            <PlatformCard key={p.id} platform={p} className="w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
