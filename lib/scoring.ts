import type { ProspectSignals, WebsiteSignals, Flag } from "./signals";

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic, code-based prospect scoring (stage 1 of 3 — NOT wired into the
// audit/search/UI yet). Pure function over the structured ProspectSignals the
// engine already produces.
//
// Philosophy (a): OPPORTUNITY drives the NUMBER; offer-fit is only the LABEL.
//   pursueScore = weighted sum of sellable GAPS (capped 0-100). HIGH = pursue.
//   recommendedOffer = whichever gap-type (presence → FOUND, conversion →
//   CAPTURE) dominates; it does NOT change the number.
//
// This fixes the current inversion where a no-website business (a STRONG Found
// lead) was scored ~28 ("overall online presence") instead of high.
// ─────────────────────────────────────────────────────────────────────────────

export type Offer = "FOUND" | "CAPTURE";

export type ScoreFactors = {
  presencePoints: number;
  conversionPoints: number;
  /** Which gaps fired (for explainability/debugging). */
  firedGaps: string[];
  /** The offer tally — presence (FOUND) vs conversion (CAPTURE) weight. */
  offerSplit: { found: number; capture: number };
  /** Viability multiplier actually applied (1 = none). */
  viabilityMultiplier: number;
  /** Score before cap + viability. */
  rawScore: number;
  noWebsite: boolean;
};

export type ProspectScore = {
  pursueScore: number; // 0-100, HIGH = pursue
  recommendedOffer: Offer;
  factors: ScoreFactors;
};

// ── Tunable weights — all in one place so they're easy to adjust later ────────
// PRESENCE gaps → FOUND. Higher = bigger, more sellable visibility gap.
export const PRESENCE_WEIGHTS = {
  noWebsite: 40, // no site at all: still a real Found gap, but no-website leads are the least reachable for outreach, so they no longer auto-dominate the worklist. A reachable bad/old site now scores at or above it.
  likelyUnclaimed: 22, // neglected/unclaimed GBP heuristic (large-moderate)
  slowPageSpeed: 16, // mobile PageSpeed < 50 (moderate-large)
  notMobileResponsive: 16, // moderate-large
  noAnalytics: 6, // small (flying blind)
  weakReviews: 10, // rating < 4.0 OR very few reviews (small-moderate)
  staleSite: 12, // moderate
  newDomain: 6, // very young domain (small)
} as const;

// CONVERSION gaps → CAPTURE. Things you'd add TO an existing site.
export const CONVERSION_WEIGHTS = {
  noBooking: 25, // large
  noChat: 12, // moderate
  noClickToCall: 10, // moderate
  noContactForm: 12, // moderate
} as const;

export const NEW_DOMAIN_MAX_MONTHS = 12; // domain younger than this → "new business"
export const WEAK_REVIEWS_MIN_RATING = 4.0;
export const WEAK_REVIEWS_MIN_COUNT = 15;

// Viability dampener — deliberately weak/near-off ("every lead is a possible oil
// field"). ONLY applies when there's no signal of a real business at all (no
// website AND no rating AND no/zero reviews). Set low; tune later.
export const VIABILITY_DAMPENER = 0.1; // knock 10% off in the no-signal case

const isGap = (f?: { gap: boolean | null } | null): boolean => f?.gap === true;

/**
 * GBP-claimed heuristic from the listing fields Places returns (NO API call): a
 * business with little/no review history AND no/weak rating reads as an
 * unclaimed or neglected Google Business Profile — a prime Found target. Lives
 * here (pure module) so the search lite-scorer, the signal engine, and the
 * places heuristic all share ONE definition.
 */
export function isLikelyUnclaimed(rating: number | null, reviewCount: number | null): boolean {
  const barelyReviewed = reviewCount == null || reviewCount <= 3;
  const noOrWeakRating = rating == null || rating < 3.5;
  return barelyReviewed && noOrWeakRating;
}

/**
 * Score a prospect from its gathered signals. Pure + deterministic. Gracefully
 * handles null/unknown signals (a failed site fetch yields unknown flags, which
 * simply don't fire — never throws, never wildly mis-scores).
 */
export function scoreProspect(signals: ProspectSignals): ProspectScore {
  const fired: string[] = [];
  let presence = 0;
  let conversion = 0;

  const w = signals.website; // WebsiteSignals | null
  const places = signals.places;

  // ── PRESENCE (FOUND) ───────────────────────────────────────────────────────
  if (w === null) {
    // No website at all = the maximal presence gap.
    presence += PRESENCE_WEIGHTS.noWebsite;
    fired.push("no_website");
  } else {
    if (isGap(w.mobileResponsive)) {
      presence += PRESENCE_WEIGHTS.notMobileResponsive;
      fired.push("not_mobile_responsive");
    }
    if (isGap(w.analytics)) {
      presence += PRESENCE_WEIGHTS.noAnalytics;
      fired.push("no_analytics");
    }
    if (isGap(w.staleSite)) {
      presence += PRESENCE_WEIGHTS.staleSite;
      fired.push("stale_site");
    }
  }
  // PageSpeed gap (null/absent when there's no site → won't fire).
  if (signals.performance?.gap === true) {
    presence += PRESENCE_WEIGHTS.slowPageSpeed;
    fired.push("slow_pagespeed");
  }
  // Reputation / GBP — independent of the site (Places data).
  if (isGap(places?.likelyUnclaimed)) {
    presence += PRESENCE_WEIGHTS.likelyUnclaimed;
    fired.push("likely_unclaimed");
  }
  const lowRating = places?.rating != null && places.rating < WEAK_REVIEWS_MIN_RATING;
  const fewReviews = places?.reviewCount != null && places.reviewCount < WEAK_REVIEWS_MIN_COUNT;
  if (lowRating || fewReviews) {
    presence += PRESENCE_WEIGHTS.weakReviews;
    fired.push("weak_reviews");
  }
  // Domain age — established vs new business.
  if (signals.domain?.ageMonths != null && signals.domain.ageMonths < NEW_DOMAIN_MAX_MONTHS) {
    presence += PRESENCE_WEIGHTS.newDomain;
    fired.push("new_domain");
  }

  // ── CONVERSION (CAPTURE) — only when there's a site to add them TO ──────────
  if (w !== null) {
    if (isGap(w.booking)) {
      conversion += CONVERSION_WEIGHTS.noBooking;
      fired.push("no_booking");
    }
    if (isGap(w.chat)) {
      conversion += CONVERSION_WEIGHTS.noChat;
      fired.push("no_chat");
    }
    if (isGap(w.clickToCall)) {
      conversion += CONVERSION_WEIGHTS.noClickToCall;
      fired.push("no_click_to_call");
    }
    if (isGap(w.contactForm)) {
      conversion += CONVERSION_WEIGHTS.noContactForm;
      fired.push("no_contact_form");
    }
  }

  const rawScore = presence + conversion;

  // ── Viability (near-off): only when NOTHING says "real business" ───────────
  const noBusinessSignal =
    w === null && places?.rating == null && (places?.reviewCount == null || places.reviewCount === 0);
  const viabilityMultiplier = noBusinessSignal ? 1 - VIABILITY_DAMPENER : 1;

  const pursueScore = Math.max(0, Math.min(100, Math.round(rawScore * viabilityMultiplier)));

  // ── OFFER (the LABEL — does NOT change the number) ─────────────────────────
  // No website ⇒ can't be a Capture lead (nothing to add booking/chat to) ⇒
  // strongly FOUND, regardless of any conversion tally (there is none).
  const recommendedOffer: Offer = w === null ? "FOUND" : presence >= conversion ? "FOUND" : "CAPTURE";

  return {
    pursueScore,
    recommendedOffer,
    factors: {
      presencePoints: presence,
      conversionPoints: conversion,
      firedGaps: fired,
      offerSplit: { found: presence, capture: conversion },
      viabilityMultiplier,
      rawScore,
      noWebsite: w === null,
    },
  };
}

// All site-fetch-derived flags unknown — used by the lite scorer, which only has
// Places data (no homepage fetch). Unknown flags never fire as gaps.
const UNKNOWN_FLAG: Flag = { present: null, gap: null };
function placesOnlyWebsite(): WebsiteSignals {
  return {
    fetched: false,
    finalUrl: null,
    https: UNKNOWN_FLAG,
    mobileResponsive: UNKNOWN_FLAG,
    cms: { value: null, gap: false },
    analytics: UNKNOWN_FLAG,
    adPixels: { value: [], present: false, gap: false },
    booking: UNKNOWN_FLAG,
    chat: UNKNOWN_FLAG,
    clickToCall: UNKNOWN_FLAG,
    contactForm: UNKNOWN_FLAG,
    copyrightYear: null,
    staleSite: UNKNOWN_FLAG,
    schemaMarkup: { present: null, scope: "homepage" },
    socialLinks: { present: null, scope: "homepage" },
    privacyPage: { present: null, scope: "homepage" },
    aboutPage: { present: null, scope: "homepage" },
  };
}

/**
 * Lite scorer — the SAME scoreProspect core + weights, run on Places-only data
 * (website presence, rating, reviewCount). For search + the worklist pre-audit
 * estimate, where there's been no site fetch. Pure + instant (no I/O). Only the
 * Places-derivable gaps can fire (no website, likely-unclaimed, weak reviews);
 * site/conversion gaps stay unknown until a real audit fetches the site.
 */
export function scoreProspectLite(input: {
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
}): ProspectScore {
  const hasWebsite = !!(input.website && input.website.trim());
  const unclaimed = isLikelyUnclaimed(input.rating, input.reviewCount);
  const signals: ProspectSignals = {
    gatheredAt: "",
    website: hasWebsite ? placesOnlyWebsite() : null,
    performance: { pageSpeedMobile: null, gap: null, pageSpeedOpportunities: null, pageSpeedMetrics: null },
    domain: { registrableDomain: null, registeredAt: null, ageMonths: null, hasMx: null, mxGap: null },
    places: {
      rating: input.rating ?? null,
      reviewCount: input.reviewCount ?? null,
      likelyUnclaimed: { present: unclaimed, gap: unclaimed },
      reviewRecency: null,
      address: null,
    },
  };
  return scoreProspect(signals);
}
