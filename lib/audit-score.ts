import type { ProspectSignals, Flag } from "./signals";
import type { SearchVisibilityResult } from "./search-visibility-core";
import type { SearchVisibilityGridResult } from "./search-visibility-grid-core";

// Deterministic 0-100 audit score — the report's top-line verdict number.
// Pure function, zero I/O, zero LLM involvement: computed ONLY from the SAME
// deterministic signals the rest of the audit already gathers and stores
// (ProspectSignals, SearchVisibilityResult, SearchVisibilityGridResult) —
// never audit.gaps, audit.summary, or any other LLM-authored field. Same
// discipline as the leak-determinism fix (see revenue-estimate.ts's
// resolveContributors doc comment): same signals in, byte-identical score
// out, every run, forever. No Date.now(), no Math.random(), no network.
//
// HONEST CEILING: there is no artificial cap and no "always show room to
// improve" rigging. A genuinely strong lead can and should score 90-100 —
// see audit-score.test.ts's strong-lead fixture. A weak lead scores low
// because its real signals are weak, not because of a floor.
//
// RUBRIC (locked, four pillars, 100 points max):
//   REPUTATION      (25): rating (12) + reviewCount (13)
//   LOCAL VISIBILITY(30): map-pack position (15) + grid strength (15)
//   WEBSITE CONVERSION(30): contact form (10) + click-to-call (10) + booking/enquiry path (10)
//   SITE HEALTH     (15): HTTPS (6) + mobile-responsive (5) + PageSpeed >= 50 (4)

export type SubComponent = {
  key: string;
  label: string;
  points: number;
  maxPoints: number;
  /** false = the underlying signal was never gathered for this lead (older
   *  audit, failed fetch, lookup never ran) — points is a defensible
   *  fallback/zero, NOT a claim that we measured and found nothing. true =
   *  we have a real answer, including a real, honest 0 (e.g. rating < 3.5). */
  measured: boolean;
  /** Present only for a sub-component whose points came from a fallback
   *  rule rather than a direct signal read (currently: grid strength when
   *  no grid ran) — explains WHY the number is what it is. */
  note?: string;
};

export type AuditScorePillars = {
  reputation: number;
  visibility: number;
  conversion: number;
  health: number;
};

export type AuditScoreResult = {
  total: number;
  pillars: AuditScorePillars;
  breakdown: SubComponent[];
};

export type AuditScoreInput = {
  /** Same ProspectSignals the checklist/site-health/prescriptions already
   *  read (audit.signals). */
  signals: ProspectSignals | null | undefined;
  /** Same single-point lookup the "What people are searching for" section
   *  reads (audit.searchVisibility). */
  searchVisibility: SearchVisibilityResult | null | undefined;
  /** Same 9-point lookup the map-pack grid section reads
   *  (audit.searchVisibilityGrid). */
  searchVisibilityGrid: SearchVisibilityGridResult | null | undefined;
};

/** A Flag-based website check is "measured" only when the site was actually
 *  fetched (website !== null) AND the flag itself resolved to a real
 *  boolean (present !== null) — an unknown flag (fetch partially failed) is
 *  never treated as a real 0. */
function flagMeasured(website: ProspectSignals["website"], flag: Flag | undefined): boolean {
  return website !== null && !!flag && flag.present != null;
}

function ratingPoints(rating: number): number {
  if (rating >= 4.5) return 12;
  if (rating >= 4.0) return 8;
  if (rating >= 3.5) return 4;
  return 0;
}

function reviewCountPoints(reviewCount: number): number {
  if (reviewCount >= 100) return 13;
  if (reviewCount >= 50) return 9;
  if (reviewCount >= 15) return 5;
  return 0;
}

function mapPackPoints(leadAppears: boolean, leadPosition: number | null): number {
  if (!leadAppears || leadPosition == null) return 0;
  if (leadPosition === 1) return 15;
  if (leadPosition <= 3) return 10;
  return 5;
}

const GRID_MAX_POINTS = 15;
const GRID_SIZE = 9;

export function computeAuditScore(input: AuditScoreInput): AuditScoreResult {
  const signals = input.signals ?? null;
  const website = signals?.website ?? null;
  const places = signals?.places ?? null;
  const performance = signals?.performance ?? null;
  const sv = input.searchVisibility ?? null;
  const grid = input.searchVisibilityGrid ?? null;

  const breakdown: SubComponent[] = [];

  // ── REPUTATION (25) ─────────────────────────────────────────────────────
  const ratingMeasured = places?.rating != null;
  const ratingPts = ratingMeasured ? ratingPoints(places!.rating!) : 0;
  breakdown.push({ key: "rating", label: "Google rating", points: ratingPts, maxPoints: 12, measured: ratingMeasured });

  const reviewCountMeasured = places?.reviewCount != null;
  const reviewCountPts = reviewCountMeasured ? reviewCountPoints(places!.reviewCount!) : 0;
  breakdown.push({ key: "review_count", label: "Review count", points: reviewCountPts, maxPoints: 13, measured: reviewCountMeasured });

  const reputation = ratingPts + reviewCountPts;

  // ── LOCAL VISIBILITY (30) ───────────────────────────────────────────────
  const mapPackMeasured = !!sv && sv.status === "ok";
  const mapPackPts = mapPackMeasured ? mapPackPoints(sv!.leadAppears, sv!.leadPosition) : 0;
  breakdown.push({ key: "map_pack_position", label: "Map-pack position", points: mapPackPts, maxPoints: 15, measured: mapPackMeasured });

  const gridMeasured = !!grid && grid.status === "ok" && grid.points.length > 0;
  let gridPts: number;
  let gridNote: string | undefined;
  if (gridMeasured) {
    const strongZones = grid!.points.filter((p) => p.appeared && p.rank != null && p.rank <= 2).length;
    gridPts = Math.round((strongZones / GRID_SIZE) * GRID_MAX_POINTS);
  } else {
    // Grid never ran for this lead — award the SAME points map-pack position
    // already earned (the mapPack-proportional share, capped at the mapPack
    // points: since both sub-scores share the same 15-point max, that share
    // is exactly mapPackPts) rather than 0 (which would double-penalize a
    // single missing lookup) or a free/full 15 (which would fabricate grid
    // evidence we don't have). A lead with no map-pack presence either still
    // gets 0 here, never a free grid score.
    gridPts = Math.min(mapPackPts, mapPackPts);
    gridNote = "grid did not run for this lead — mirrored from map-pack position (capped at its points), not an independent measurement";
  }
  breakdown.push({ key: "grid_strength", label: "Rank strength across the area", points: gridPts, maxPoints: 15, measured: gridMeasured, ...(gridNote ? { note: gridNote } : {}) });

  const visibility = mapPackPts + gridPts;

  // ── WEBSITE CONVERSION (30) ─────────────────────────────────────────────
  const contactFormMeasured = flagMeasured(website, website?.contactForm);
  const contactFormPts = contactFormMeasured && website!.contactForm.present === true ? 10 : 0;
  breakdown.push({ key: "contact_form", label: "Contact form", points: contactFormPts, maxPoints: 10, measured: contactFormMeasured });

  const clickToCallMeasured = flagMeasured(website, website?.clickToCall);
  const clickToCallPts = clickToCallMeasured && website!.clickToCall.present === true ? 10 : 0;
  breakdown.push({ key: "click_to_call", label: "Click-to-call", points: clickToCallPts, maxPoints: 10, measured: clickToCallMeasured });

  // "hasBooking OR clear enquiry path": booking is the direct signal;
  // "clear enquiry path" has no field of its own, so it maps to the one
  // other existing way-to-reach-the-business signal not already used above
  // — the chat widget flag (signals.website.chat) — never a new/invented
  // field. Measured when EITHER flag resolved to a real boolean.
  const bookingMeasured = flagMeasured(website, website?.booking);
  const chatMeasured = flagMeasured(website, website?.chat);
  const enquiryMeasured = bookingMeasured || chatMeasured;
  const hasBookingOrEnquiry = (bookingMeasured && website!.booking.present === true) || (chatMeasured && website!.chat.present === true);
  const enquiryPts = enquiryMeasured && hasBookingOrEnquiry ? 10 : 0;
  breakdown.push({ key: "booking_or_enquiry", label: "Booking or a clear enquiry path", points: enquiryPts, maxPoints: 10, measured: enquiryMeasured });

  const conversion = contactFormPts + clickToCallPts + enquiryPts;

  // ── SITE HEALTH (15) ────────────────────────────────────────────────────
  const httpsMeasured = flagMeasured(website, website?.https);
  const httpsPts = httpsMeasured && website!.https.present === true ? 6 : 0;
  breakdown.push({ key: "https", label: "HTTPS", points: httpsPts, maxPoints: 6, measured: httpsMeasured });

  const mobileMeasured = flagMeasured(website, website?.mobileResponsive);
  const mobilePts = mobileMeasured && website!.mobileResponsive.present === true ? 5 : 0;
  breakdown.push({ key: "mobile_responsive", label: "Mobile-responsive", points: mobilePts, maxPoints: 5, measured: mobileMeasured });

  const pageSpeedMeasured = performance?.pageSpeedMobile != null;
  const pageSpeedPts = pageSpeedMeasured && performance!.pageSpeedMobile! >= 50 ? 4 : 0;
  breakdown.push({ key: "page_speed", label: "PageSpeed >= 50", points: pageSpeedPts, maxPoints: 4, measured: pageSpeedMeasured });

  const health = httpsPts + mobilePts + pageSpeedPts;

  const total = reputation + visibility + conversion + health;

  return {
    total,
    pillars: { reputation, visibility, conversion, health },
    breakdown,
  };
}
