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
  // Fixed px offset from the illustration's center, matching the ring
  // geometry's own coordinate system (see GlowField) -- each card sits near
  // the outermost ring (rx~290, ry~190), tuned per card so its own (taller or
  // shorter) content still clears the orb, rather than out near the
  // container edges.
  pos: { dx: number; dy: number }
  // Per-card depth cue (desktop orbit only): a slight individual rotation and
  // scale so the arrangement reads as organic/layered rather than a rigid
  // grid -- "nearer" cards run larger (~1.05), "farther" ones smaller (~0.92).
  // Varied per card on purpose, not a uniform value.
  tilt: number
  cardScale: number
}

const BUSINESS = 'Smile Dental Clinic'
const RATING = '4.8'
const REVIEWS = '(512)'
const QUERY = 'best dentist near me'
const STATUS = 'Closes 8 PM'
const AI_ANSWER = `${BUSINESS} is one of the top-rated dental clinics nearby, known for same-day appointments and friendly service.`

// Desktop orbit positions: each card sits at a fixed px offset from the
// illustration's center, on the outermost ring's ellipse path.
const PLATFORMS: Platform[] = [
  {
    id: 'google-search',
    name: 'Google Search',
    type: 'search',
    logo: '/hero/logos/google-search.svg',
    monogram: 'G',
    tint: 'bg-[#4285f4]',
    pos: { dx: -150, dy: -165 },
    tilt: -5,
    cardScale: 1.05,
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    type: 'ai',
    logo: '/hero/logos/chatgpt.svg',
    monogram: 'C',
    tint: 'bg-[#10a37f]',
    pos: { dx: 150, dy: -172 },
    tilt: 4,
    cardScale: 0.95,
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    type: 'listing',
    logo: '/hero/logos/google-maps.svg',
    monogram: 'M',
    tint: 'bg-[#34a853]',
    pos: { dx: -290, dy: -22 },
    tilt: 6,
    cardScale: 0.92,
  },
  {
    id: 'google-business-profile',
    name: 'Google Business Profile',
    type: 'listing',
    logo: '/hero/logos/google-business-profile.svg',
    monogram: 'B',
    tint: 'bg-[#4285f4]',
    pos: { dx: 290, dy: -22 },
    tilt: -4,
    cardScale: 1,
  },
  {
    id: 'yelp',
    name: 'Yelp',
    type: 'listing',
    logo: '/hero/logos/yelp.svg',
    monogram: 'Y',
    tint: 'bg-[#d32323]',
    pos: { dx: -150, dy: 168 },
    tilt: -3,
    cardScale: 0.95,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    type: 'ai',
    logo: '/hero/logos/gemini.svg',
    monogram: 'G',
    tint: 'bg-gradient-to-br from-[#4285f4] to-[#9b72cb]',
    pos: { dx: 0, dy: 198 },
    tilt: 3,
    cardScale: 1.05,
  },
  {
    id: 'apple-maps',
    name: 'Apple Maps',
    type: 'listing',
    logo: '/hero/logos/apple-maps.svg',
    monogram: 'A',
    tint: 'bg-[#202020]',
    pos: { dx: 150, dy: 168 },
    tilt: 5,
    cardScale: 0.92,
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
      <div className="flex items-center gap-[8px] border-b border-[#f0f0f0] pb-[9px]">
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

      <div className="mt-[9px]">
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

// Concentric TRUE ellipses (rounded-[50%] -- Tailwind's rounded-full is a
// fixed 9999px radius, which on a non-square box clamps into a flat-sided
// "stadium" shape, not an ellipse) hugging the orb, plus a focused violet
// bloom right behind it and a handful of small glowing dots sitting on the
// ring paths themselves. Pure CSS, no assets. `scale` shrinks every ring/
// glow/dot together (proportionally to the container it's placed in) so
// nothing gets clipped by the container edges -- the mobile fallback uses a
// much shorter box than the desktop orbit, so its glow needs to shrink to
// match rather than reuse the desktop-sized rings.
function GlowField({ scale = 1 }: { scale?: number }) {
  const px = (n: number) => `${Math.round(n * scale)}px`
  // Innermost hugs the orb (180px); each ring after that grows by the same
  // step, brightest nearest the orb and fading outward. The outermost ring
  // (rx=290, ry=190) is roughly where the cards themselves sit.
  const rings = [
    { w: 240, h: 150, alpha: 0.55 },
    { w: 320, h: 210, alpha: 0.42 },
    { w: 400, h: 270, alpha: 0.3 },
    { w: 480, h: 330, alpha: 0.2 },
    { w: 580, h: 380, alpha: 0.13 },
  ]
  // A few soft ambient dust motes, kept close to the tightened cluster.
  const particles = [
    { dx: -70, dy: -230 },
    { dx: 230, dy: 210 },
    { dx: -250, dy: 200 },
  ]
  // Brighter glow points sitting ON the ring paths themselves (fixed px
  // offset from center so they land exactly on a ring's ellipse regardless
  // of container width; `scale` shrinks them together with the rings).
  const ringGlows = [
    { dx: 84, dy: -54 }, // ring 1
    { dx: 28, dy: -104 }, // ring 2
    { dx: -151, dy: 36 }, // ring 2
    { dx: -35, dy: -131 }, // ring 3
    { dx: 156, dy: 86 }, // ring 3
    { dx: 231, dy: -55 }, // ring 4
    { dx: -85, dy: 151 }, // ring 4
    { dx: -272, dy: -65 }, // ring 5
  ]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Focused violet bloom, concentrated right behind the orb (not spread
          across the whole box). */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{
          width: px(480),
          height: px(280),
          background:
            'radial-gradient(ellipse at center, rgba(147,112,219,0.28) 0%, rgba(147,112,219,0.12) 45%, rgba(147,112,219,0) 72%)',
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{
          width: px(200),
          height: px(130),
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
        }}
      />

      {rings.map((r, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
          style={{ width: px(r.w), height: px(r.h), border: `1px solid rgba(147,112,219,${r.alpha})` }}
        />
      ))}

      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-[1.5px]"
          style={{ width: px(6), height: px(6), marginLeft: px(p.dx), marginTop: px(p.dy) }}
        />
      ))}
      {ringGlows.map((g, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: px(7),
            height: px(7),
            marginLeft: px(g.dx),
            marginTop: px(g.dy),
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '0 0 6px 2px rgba(147,112,219,0.55)',
          }}
        />
      ))}
    </div>
  )
}

// Swap: replaces this whole sphere with public/hero/orb.png (transparent bg)
// once supplied. Sized via the `size` prop so mobile can render a smaller one.
// Still a CSS placeholder, but reads as a sphere: a violet rim light around
// the edge, a soft cast shadow grounding it on the glow field, a top gloss
// highlight, and a small red "live" status dot near the bottom.
function Orb({ size = 180 }: { size?: number }) {
  const dot = Math.max(10, Math.round(size * 0.09))
  return (
    <div
      className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ width: size, height: size }}
    >
      {/* Cast shadow: grounds the orb above the glow field. */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full blur-[8px]"
        style={{
          top: size * 0.86,
          width: size * 0.82,
          height: size * 0.22,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 72%)',
        }}
      />

      {/* Sphere, with a violet rim light + inset glow around the edge. */}
      <div
        className="relative flex h-full w-full items-center justify-center rounded-full"
        style={{
          background: 'radial-gradient(circle at 32% 26%, #55525a 0%, #2a2830 42%, #111014 72%, #000 100%)',
          boxShadow:
            '0 18px 36px rgba(0,0,0,0.32), 0 0 0 1px rgba(155,114,203,0.28), 0 0 26px 3px rgba(147,112,219,0.4), inset 0 0 18px rgba(147,112,219,0.25), inset 2px 2px 10px rgba(255,255,255,0.12)',
        }}
      >
        {/* Top gloss highlight. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[18%] top-[12%] h-[34%] w-[46%] rounded-full blur-[6px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 75%)',
          }}
        />

        <span
          style={{ fontFamily: HELV }}
          className="relative z-10 px-[16px] text-center text-[12px] font-bold uppercase leading-[1.3] tracking-[0.08em] text-white"
        >
          Your Business
        </span>

        {/* Small red status dot, bottom-center. */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#f91626]"
          style={{
            width: dot,
            height: dot,
            bottom: size * 0.08,
            boxShadow: '0 0 6px rgba(249,22,38,0.7), 0 0 0 2px rgba(0,0,0,0.4)',
          }}
        />
      </div>
    </div>
  )
}

export default function SearchOrbit() {
  const mobileCards = MOBILE_IDS.map((id) => PLATFORMS.find((p) => p.id === id)!)

  return (
    <div className="w-full">
      {/* Desktop orbit (>=768px): 7 cards clustered close around the center
          orb, each positioned by a fixed px offset (see PLATFORMS) rather
          than a percentage of the container, so they sit ON the outermost
          ring instead of out near the container edges. */}
      <div className="relative hidden h-[600px] w-full md:block">
        <GlowField />
        <Orb />
        {PLATFORMS.map((p) => (
          <div
            key={p.id}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(calc(-50% + ${p.pos.dx}px), calc(-50% + ${p.pos.dy}px)) rotate(${p.tilt}deg) scale(${p.cardScale})`,
            }}
          >
            <PlatformCard platform={p} className="w-[172px]" />
          </div>
        ))}
      </div>

      {/* Mobile fallback (<768px): the orbit doesn't fit at this width, so
          degrade to a smaller centered orb with 3 representative cards (one
          of each type: search, listing, AI answer) stacked below it. */}
      <div className="flex flex-col items-center gap-[24px] md:hidden">
        <div className="relative h-[220px] w-full">
          <GlowField scale={0.6} />
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
