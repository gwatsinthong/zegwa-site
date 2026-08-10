import type { SubComponent } from "@/lib/audit-score";
import type { ProspectSignals } from "@/lib/signals";
import type { SearchVisibilityResult } from "@/lib/search-visibility-core";

// Pure, plain (NOT "use client") helpers for the Verdict slide's 2x2 pillar
// grid — cover-slide.tsx's Server Component calls these directly, so per the
// Step 1 RSC-boundary lesson (production incident, digest 1402459869) none
// of this can live in a "use client" file.
//
// The prototype hardcodes one headline value per pillar ("#1 in map pack",
// "No booking or form", "No HTTPS") for Atlas's specific real result. Real
// leads land in every state, so each headline below is DERIVED from the
// same real signals/breakdown computeAuditScore already reads — never a
// copy of the mock text. Chip state (strong/mid/weak) reuses the identical
// >=75%/>=45% bucketing the Cover pillars use, extended with an explicit
// "unmeasured" state (never silently rendered as "weak" — an unmeasured
// signal is not the same claim as a real, honest zero).

export type ChipState = "strong" | "mid" | "weak" | "unmeasured";

export function bucketFraction(points: number, max: number): "strong" | "mid" | "weak" {
  if (max <= 0) return "weak";
  const frac = points / max;
  if (frac >= 0.75) return "strong";
  if (frac >= 0.45) return "mid";
  return "weak";
}

function chipStateFor(points: number, max: number, measured: boolean): ChipState {
  if (!measured) return "unmeasured";
  return bucketFraction(points, max);
}

export type PillarCard = {
  eyebrow: string;
  headline: string;
  chipState: ChipState;
  points: number;
  max: number;
  subMath: string;
};

/** The Verdict slide's own headline — deliberately a DISTINCT framing from
 *  the Cover slide's pickVisceralOpener wound-hook, not a re-statement of
 *  it (recon finding: both slides used to render the identical opener
 *  string back to back). Cover leads with the single most striking real
 *  finding as a prose sentence; Verdict leads with the score-anchored
 *  standing — the real total plus whichever of these SAME four already-
 *  computed pillar cards is weakest — so the two slides complement rather
 *  than echo, and nothing here is invented beyond what the cards already
 *  say. */
export function verdictHeadline(total: number | null, cards: PillarCard[] | null): string {
  if (total == null || !cards || cards.length === 0) return "Not yet scored.";
  const measured = cards.filter((c) => c.chipState !== "unmeasured");
  if (measured.length === 0) return `${total}/100 — most of this audit couldn't be measured yet.`;
  const weakest = measured.reduce((worst, c) => (c.points / Math.max(c.max, 1) < worst.points / Math.max(worst.max, 1) ? c : worst));
  if (weakest.chipState === "strong") return `${total}/100 — every measured pillar is holding up.`;
  return `${total}/100 — the biggest gap is ${weakest.eyebrow.toLowerCase()}: ${weakest.headline}.`;
}

function findSub(breakdown: SubComponent[], key: string): SubComponent {
  const sub = breakdown.find((b) => b.key === key);
  if (!sub) throw new Error(`audit-score breakdown missing expected key "${key}"`);
  return sub;
}

export function reputationCard(signals: ProspectSignals | null | undefined, breakdown: SubComponent[]): PillarCard {
  const rating = findSub(breakdown, "rating");
  const reviewCount = findSub(breakdown, "review_count");
  const points = rating.points + reviewCount.points;
  const max = rating.maxPoints + reviewCount.maxPoints;
  const measured = rating.measured || reviewCount.measured;
  const realRating = signals?.places.rating ?? null;
  const realReviewCount = signals?.places.reviewCount ?? null;
  const headline =
    realRating != null
      ? `${realRating.toFixed(1)} · ${realReviewCount ?? 0} review${realReviewCount === 1 ? "" : "s"}`
      : "Rating not available";
  return {
    eyebrow: "Reputation",
    headline,
    chipState: chipStateFor(points, max, measured),
    points,
    max,
    subMath: `Rating ${rating.points}/${rating.maxPoints} · Reviews ${reviewCount.points}/${reviewCount.maxPoints}`,
  };
}

export function visibilityCard(
  searchVisibility: SearchVisibilityResult | null | undefined,
  breakdown: SubComponent[],
): PillarCard {
  const mapPack = findSub(breakdown, "map_pack_position");
  const grid = findSub(breakdown, "grid_strength");
  const points = mapPack.points + grid.points;
  const max = mapPack.maxPoints + grid.maxPoints;
  const measured = mapPack.measured;
  let headline: string;
  if (!measured) {
    headline = "Not yet measured";
  } else if (searchVisibility?.leadAppears && searchVisibility.leadPosition === 1) {
    headline = "#1 in map pack";
  } else if (searchVisibility?.leadAppears && searchVisibility.leadPosition != null) {
    headline = `#${searchVisibility.leadPosition} in map pack`;
  } else {
    headline = "Not appearing in map pack";
  }
  return {
    eyebrow: "Local visibility",
    headline,
    chipState: chipStateFor(points, max, measured),
    points,
    max,
    subMath: `Map-pack ${mapPack.points}/${mapPack.maxPoints} · Grid ${grid.points}/${grid.maxPoints}`,
  };
}

export function conversionCard(signals: ProspectSignals | null | undefined, breakdown: SubComponent[]): PillarCard {
  const form = findSub(breakdown, "contact_form");
  const call = findSub(breakdown, "click_to_call");
  const book = findSub(breakdown, "booking_or_enquiry");
  const points = form.points + call.points + book.points;
  const max = form.maxPoints + call.maxPoints + book.maxPoints;
  const measured = form.measured || call.measured || book.measured;
  const website = signals?.website ?? null;
  const missing: string[] = [];
  if (measured) {
    if (!(website?.contactForm.present === true)) missing.push("form");
    if (!(website?.clickToCall.present === true)) missing.push("click-to-call");
    if (!(website?.booking.present === true || website?.chat.present === true)) missing.push("booking");
  }
  let headline: string;
  if (!measured) headline = "Not yet measured";
  else if (missing.length === 0) headline = "Form, click-to-call & booking ready";
  else if (missing.length === 3) headline = "No booking or form";
  else headline = `Missing ${missing.join(", ")}`;
  return {
    eyebrow: "Website conversion",
    headline,
    chipState: chipStateFor(points, max, measured),
    points,
    max,
    subMath: `Form ${form.points}/${form.maxPoints} · Call ${call.points}/${call.maxPoints} · Book ${book.points}/${book.maxPoints}`,
  };
}

export function healthCard(signals: ProspectSignals | null | undefined, breakdown: SubComponent[]): PillarCard {
  const https = findSub(breakdown, "https");
  const mobile = findSub(breakdown, "mobile_responsive");
  const speed = findSub(breakdown, "page_speed");
  const points = https.points + mobile.points + speed.points;
  const max = https.maxPoints + mobile.maxPoints + speed.maxPoints;
  const measured = https.measured || mobile.measured || speed.measured;
  const website = signals?.website ?? null;
  const pageSpeed = signals?.performance.pageSpeedMobile ?? null;
  let headline: string;
  if (!measured) headline = "Not yet measured";
  else if (!(website?.https.present === true)) headline = "No HTTPS";
  else if (!(website?.mobileResponsive.present === true)) headline = "Not mobile-friendly";
  else if (pageSpeed != null && pageSpeed < 50) headline = "Slow on mobile";
  else headline = "Healthy site foundation";
  return {
    eyebrow: "Site health",
    headline,
    chipState: chipStateFor(points, max, measured),
    points,
    max,
    subMath: `HTTPS ${https.points}/${https.maxPoints} · Mobile ${mobile.points}/${mobile.maxPoints} · PageSpeed ${speed.points}/${speed.maxPoints}`,
  };
}
