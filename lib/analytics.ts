import { CONSENT_COOKIE } from './consent'

// GA4 with Consent Mode v2. Measurement ID comes from NEXT_PUBLIC_GA_ID; if
// unset, app/layout.tsx renders no gtag script at all (no network requests,
// no console errors). The <Script> tags themselves live in app/layout.tsx,
// not here: next/script's beforeInteractive strategy is only recognised by
// Next.js when authored directly in the root layout file, not in a nested
// component.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID

// Runs via the beforeInteractive strategy, which injects it ahead of any
// other script (including the gtag.js library tag) -- this ordering is
// load-bearing for Consent Mode: default consent must exist before gtag.js
// first evaluates it. Also reads any already-stored consent cookie so a
// returning visitor's choice (and any Do Not Track signal) is applied as the
// DEFAULT, before GA4 initialises, rather than granted-then-revoked after
// the fact. Plain JS string (not a TS import) because inline <script>
// content can't import modules; the cookie name must match
// lib/consent.ts's CONSENT_COOKIE.
export const CONSENT_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){ window.dataLayer.push(arguments); }
window.gtag = gtag;
var match = document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);
var choice = match ? decodeURIComponent(match[1]) : null;
var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1';
var granted = choice === 'accepted' && !dnt;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: granted ? 'granted' : 'denied'
});
`
