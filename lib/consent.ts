// Shared cookie-consent helpers. The stored choice cookie itself is
// essential/functional (it records a preference, not analytics data) and is
// exempt from consent, per app/cookies/page.tsx's "Cookie consent" row.
// 12-month expiry, matching that row's published duration.
//
// The name and 'accepted' / 'declined' values here are duplicated as a plain
// string inside components/Analytics.tsx's inline bootstrap script (inline
// <script> tags can't import TS modules) -- keep the two in sync if either
// changes.

export const CONSENT_COOKIE = 'zegwa_cookie_consent'
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365 // 12 months

export type ConsentChoice = 'accepted' | 'declined'

export function readConsentCookie(): ConsentChoice | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`))
  const value = match ? decodeURIComponent(match[1]) : null
  return value === 'accepted' || value === 'declined' ? value : null
}

export function writeConsentCookie(choice: ConsentChoice) {
  if (typeof document === 'undefined') return
  document.cookie = `${CONSENT_COOKIE}=${choice}; max-age=${CONSENT_MAX_AGE}; path=/; SameSite=Lax`
}

// Cookie Policy ("Do Not Track"): "We honor it by not setting analytics
// cookies when it is detected." Checked at both first render and on every
// consent decision, so a DNT signal overrides even an explicit Accept.
export function doNotTrackEnabled(): boolean {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as Navigator & { msDoNotTrack?: string }
  const win = window as Window & { doNotTrack?: string }
  return nav.doNotTrack === '1' || win.doNotTrack === '1' || nav.msDoNotTrack === '1'
}

// Pushes a Consent Mode v2 update. analytics_storage is the only signal this
// site ever grants -- the three ad_* signals stay denied permanently (no
// advertising runs on this site). No-ops cleanly if gtag was never
// initialised (e.g. NEXT_PUBLIC_GA_ID unset).
export function applyConsent(choice: ConsentChoice) {
  if (typeof window === 'undefined') return
  const win = window as Window & { gtag?: (...args: unknown[]) => void }
  if (typeof win.gtag !== 'function') return
  const granted = choice === 'accepted' && !doNotTrackEnabled()
  win.gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' })
}
