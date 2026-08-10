import type { CompetitorResult } from "@/lib/competitors-core";

// Shared, plain (NOT "use client") merge+sort logic for the two slides that
// render the ranked competitor field — Competitors (slide 4) and Reputation
// (slide 8, "Vs nearby"). Extracted so both read the EXACT same ranked rows
// from the same stored competitors data, rather than two independently
// re-derived (and possibly drifting) rankings.
//
// FIXED-FRAME CAP (production overflow, live review on a data-heavy
// prospect — Detroit Dental): the v2 deck's slides render inside a
// hard-fixed 1920x1080 canvas (deck-shell.tsx) with no scroll/auto-grow —
// content past the frame is silently clipped. Capped here, at the single
// shared source both slides read, so slide 4 and slide 8 can never show a
// DIFFERENT capped set from each other. Honest top-N: rivals are already
// ranked by review count upstream (competitors-core.ts's rankByProminence,
// most-reviewed first) — capping to the top 5 of that same real ordering
// is "top 5 by reviews," never a cherry-picked hide. The prospect's own row
// is ALWAYS included regardless of the cap, even if it would rank below a
// 6th rival — this is the prospect's own report, their row can't be the
// one that gets cut.
export const COMPETITOR_ROWS_CAP = 5;

export type CompetitorRow = { name: string; rating: number | null; reviewCount: number | null; distanceMiles: number | null; isYou: boolean };

/** Merges the prospect's own row into the top COMPETITOR_ROWS_CAP rivals
 *  (by review count, nulls last — same ordering competitors-core.ts's
 *  rankByProminence already ranked them by) and sorts the combined set by
 *  review count descending for display — same merge+sort the production
 *  report's "How you stack up nearby" section uses, now capped so the
 *  result never exceeds COMPETITOR_ROWS_CAP + 1 (self) rows. */
export function buildCompetitorRows(competitors: CompetitorResult, bizName: string): CompetitorRow[] {
  const topRivals = [...competitors.competitors]
    .sort((a, b) => (b.reviewCount ?? -1) - (a.reviewCount ?? -1))
    .slice(0, COMPETITOR_ROWS_CAP);
  const rows: CompetitorRow[] = [
    { name: bizName, rating: competitors.self.rating, reviewCount: competitors.self.reviewCount, distanceMiles: null, isYou: true },
    ...topRivals.map((c) => ({ name: c.name, rating: c.rating, reviewCount: c.reviewCount, distanceMiles: c.distanceMiles, isYou: false })),
  ];
  return rows.sort((a, b) => (b.reviewCount ?? -1) - (a.reviewCount ?? -1));
}
