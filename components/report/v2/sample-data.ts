import { computeAuditScore } from "@/lib/audit-score";
import { estimateRevenueLeak } from "@/lib/revenue-estimate";
import { detectCountry } from "@/lib/currency";
import { compareNap } from "@/lib/nap";
import type { ProspectSignals } from "@/lib/signals";
import type { CompetitorResult } from "@/lib/competitors-core";
import type { SearchVisibilityResult, KeywordRow, TrendPoint } from "@/lib/search-visibility-core";
import type { SearchVisibilityGridResult, GridPointResult } from "@/lib/search-visibility-grid-core";
import type { CitationResult, CitationRow } from "@/lib/citations-core";
import type { PsiIssue } from "@/lib/report-images-core";
import type { ReportV2Data } from "./report-v2-types";

// Full sample data for the /sample-audit demo (Summit Air, fictional HVAC
// business, Columbus OH). No real business, email, or figures anywhere in
// this file. Every field is filled so all 19 slides show real content
// instead of a "not yet measured" fallback, per this prompt's requirement.
// Found-only: every gap driving the leak/offer is a presence gap (booking,
// reviews, citations, local search, site speed), never a missed-call /
// call-tracking / response-side framing, so the offer stays Found-only
// ($1,500 setup, $500/mo) with no Capture or Bundle pricing.
//
// The leak dollar figure and audit score are COMPUTED by the ported real
// functions (computeAuditScore, estimateRevenueLeak) from the signals
// authored below, never hardcoded, so they stay internally consistent with
// the story: a genuinely weak, presence-gap-heavy business.
//
// Two fields are deliberately left at their honest "not available" state
// rather than filled with invented content, both reported in the port
// summary:
//   - reportImages (site screenshot): no real screenshot of a fictional
//     site exists, and reusing a REAL zegwa portfolio screenshot here would
//     misrepresent it as Summit Air's own (bad) site. your-site-slide's
//     small phone-mockup thumbnail shows "Screenshot not captured"; the
//     rest of that slide (the flag list) is driven by real `signals` below.
//   - reputation-slide has no individual-review-quote UI at all (its own
//     copy states "a per-star breakdown and individual review text aren't
//     part of this audit"), so no review quotes are authored; there is
//     nothing in the real deck to show them.

const SAMPLE_SIGNALS: ProspectSignals = {
  gatheredAt: "2026-01-15T00:00:00.000Z",
  website: {
    fetched: true,
    finalUrl: "https://www.summitair-demo.example.com",
    https: { present: true, gap: false },
    mobileResponsive: { present: true, gap: false },
    cms: { value: "WordPress", gap: false },
    analytics: { present: true, gap: false },
    adPixels: { value: [], present: false, gap: false },
    booking: { present: false, gap: true },
    chat: { present: false, gap: true },
    clickToCall: { present: false, gap: true },
    contactForm: { present: false, gap: true },
    copyrightYear: 2023,
    staleSite: { present: false, gap: false },
    schemaMarkup: { present: false, scope: "homepage" },
    socialLinks: { present: true, scope: "homepage" },
    privacyPage: { present: true, scope: "homepage" },
    aboutPage: { present: true, scope: "homepage" },
  },
  performance: {
    pageSpeedMobile: 41,
    gap: true,
    pageSpeedOpportunities: [
      { title: "Reduce unused JavaScript", savingsKb: 640, savingsMs: 1100, severity: "high" },
      { title: "Serve images in next-gen formats", savingsKb: 310, savingsMs: 420, severity: "medium" },
      { title: "Eliminate render-blocking resources", savingsKb: 90, savingsMs: 380, severity: "medium" },
    ],
    pageSpeedMetrics: [
      { key: "lcp", label: "Largest Contentful Paint", numericValue: 4200, displayValue: "4.2 s" },
      { key: "speedIndex", label: "Speed Index", numericValue: 5300, displayValue: "5.3 s" },
      { key: "fcp", label: "First Contentful Paint", numericValue: 2100, displayValue: "2.1 s" },
      { key: "tbt", label: "Total Blocking Time", numericValue: 610, displayValue: "610 ms" },
      { key: "cls", label: "Cumulative Layout Shift", numericValue: 0.18, displayValue: "0.18" },
    ],
  },
  domain: {
    registrableDomain: "summitair-demo.example.com",
    registeredAt: "2016-03-01T00:00:00.000Z",
    ageMonths: 118,
    hasMx: true,
    mxGap: false,
  },
  places: {
    rating: 4.1,
    reviewCount: 32,
    likelyUnclaimed: { present: false, gap: false },
    reviewRecency: null,
    address: "1900 Industrial Pkwy, Columbus, OH 43215",
  },
};

const country = detectCountry({ country: "US", address: SAMPLE_SIGNALS.places.address });

// ── Competitors ───────────────────────────────────────────────────────────
// Three named local HVAC rivals, each with meaningfully more reviews than
// Summit Air's 32, explaining why Summit Air trails on reputation.
const COMPETITORS: CompetitorResult["competitors"] = [
  { placeId: "sample-competitor-1", name: "Buckeye Comfort Systems", category: "HVAC contractor", rating: 4.7, reviewCount: 210, hasWebsite: true, distanceMiles: 1.8 },
  { placeId: "sample-competitor-2", name: "Columbus Heating & Cooling Pros", category: "HVAC contractor", rating: 4.5, reviewCount: 140, hasWebsite: true, distanceMiles: 3.2 },
  { placeId: "sample-competitor-3", name: "Reliable Air Columbus", category: "HVAC contractor", rating: 4.3, reviewCount: 95, hasWebsite: true, distanceMiles: 4.6 },
];

const competitors: CompetitorResult = {
  checkedAt: "2026-01-15T00:00:00.000Z",
  version: 6,
  status: "ok",
  self: { rating: SAMPLE_SIGNALS.places.rating, reviewCount: SAMPLE_SIGNALS.places.reviewCount },
  competitors: COMPETITORS,
  standing: {
    total: COMPETITORS.length + 1,
    reviewRank: 4,
    leadsReviews: false,
    leadsRating: false,
    topByReviews: COMPETITORS[0]!,
    reviewGapToTop: COMPETITORS[0]!.reviewCount! - (SAMPLE_SIGNALS.places.reviewCount ?? 0),
  },
};

// ── Search visibility (single point) ─────────────────────────────────────
const KEYWORDS: KeywordRow[] = [
  { term: "hvac columbus oh", volume: 720, cpc: 8.5, monthlyClickValue: 6120 },
  { term: "air conditioning repair near me", volume: 590, cpc: 9.2, monthlyClickValue: 5428 },
  { term: "ac repair columbus oh", volume: 480, cpc: 8.1, monthlyClickValue: 3888 },
  { term: "furnace repair columbus oh", volume: 310, cpc: 7.4, monthlyClickValue: 2294 },
  { term: "emergency hvac columbus", volume: 260, cpc: 10.3, monthlyClickValue: 2678 },
  { term: "hvac contractor columbus", volume: 170, cpc: 6.9, monthlyClickValue: 1173 },
];

const TREND: TrendPoint[] = [
  { period: "2025-02", volume: 640 },
  { period: "2025-03", volume: 660 },
  { period: "2025-04", volume: 590 },
  { period: "2025-05", volume: 610 },
  { period: "2025-06", volume: 820 },
  { period: "2025-07", volume: 980 },
  { period: "2025-08", volume: 940 },
  { period: "2025-09", volume: 700 },
  { period: "2025-10", volume: 560 },
  { period: "2025-11", volume: 430 },
  { period: "2025-12", volume: 420 },
  { period: "2026-01", volume: 590 },
];

const sv: SearchVisibilityResult = {
  checkedAt: "2026-01-15T00:00:00.000Z",
  version: 1,
  status: "ok",
  seed: "hvac columbus oh",
  locId: "2840",
  volume: 720,
  cpc: 8.5,
  monthlyClickValue: 6120,
  difficulty: 42,
  localPackDominated: true,
  topResults: [
    { title: "Buckeye Comfort Systems", domain: "buckeyecomfort-demo.example.com", position: 1, type: "local_pack", clicks: null, domainAuthority: 38 },
    { title: "Columbus Heating & Cooling Pros", domain: "columbusheatcool-demo.example.com", position: 2, type: "local_pack", clicks: null, domainAuthority: 34 },
    { title: "Reliable Air Columbus", domain: "reliableair-demo.example.com", position: 3, type: "local_pack", clicks: null, domainAuthority: 29 },
    { title: "Buckeye Comfort Systems", domain: "buckeyecomfort-demo.example.com", position: 1, type: "organic", clicks: 45, domainAuthority: 38 },
  ],
  leadPosition: null,
  leadAppears: false,
  topOrganicClicks: 45,
  topOrganicDomainAuthority: 38,
  leadDomainAuthority: 14,
  trend: TREND,
  seasonality: { peakPeriods: ["Jun", "Jul", "Aug"], peakVolume: 980, troughVolume: 420, ratio: 2.33 },
  keywords: KEYWORDS,
};

// ── Search visibility grid (3x3, row-major) ──────────────────────────────
// Barely visible even at the business's own location (weak rank at center),
// invisible everywhere else in the surrounding area, consistent with the
// low visibility pillar and the "not appearing in the map pack" leak step.
const GRID_POINTS: GridPointResult[] = [
  { lat: 39.9312, lng: -83.0288, rank: null, appeared: false },
  { lat: 39.9312, lng: -82.9988, rank: null, appeared: false },
  { lat: 39.9312, lng: -82.9688, rank: null, appeared: false },
  { lat: 39.9612, lng: -83.0288, rank: null, appeared: false },
  { lat: 39.9612, lng: -82.9988, rank: 8, appeared: true },
  { lat: 39.9612, lng: -82.9688, rank: null, appeared: false },
  { lat: 39.9912, lng: -83.0288, rank: null, appeared: false },
  { lat: 39.9912, lng: -82.9988, rank: null, appeared: false },
  { lat: 39.9912, lng: -82.9688, rank: null, appeared: false },
];

const grid: SearchVisibilityGridResult = {
  checkedAt: "2026-01-15T00:00:00.000Z",
  version: 1,
  status: "ok",
  seed: "hvac columbus oh",
  centerLat: 39.9612,
  centerLng: -82.9988,
  points: GRID_POINTS,
};

// Fed the REAL sv/grid built above, not null, so the visibility pillar
// reflects them instead of falling back to "not measured".
const auditScore = computeAuditScore({
  signals: SAMPLE_SIGNALS,
  searchVisibility: sv,
  searchVisibilityGrid: grid,
});

// Found-only gaps drive the leak: no booking path, no click-to-call, slow
// mobile site. No response-side (missed-call) driver is included.
const estimate = estimateRevenueLeak({
  category: "HVAC",
  businessName: "Summit Air",
  firedGaps: ["no_booking", "no_click_to_call", "slow_pagespeed", "no_contact_form"],
  country,
});

const PILLAR_BREAKDOWN_KEYS = {
  reputation: ["rating", "review_count"],
  visibility: ["map_pack_position", "grid_strength"],
  conversion: ["contact_form", "click_to_call", "booking_or_enquiry"],
  health: ["https", "mobile_responsive", "page_speed"],
} as const;

function pillarMaxFrom(breakdown: typeof auditScore.breakdown, keys: readonly string[]): number {
  return breakdown.filter((b) => keys.includes(b.key)).reduce((sum, b) => sum + b.maxPoints, 0);
}

// ── Citations (Google baseline vs OpenStreetMap) ─────────────────────────
// Google is the source of truth (SourceNap); OSM is checked against it with
// the SAME compareNap the real pipeline uses, not a hand-picked result, so
// the field-level statuses are genuinely derived, not guessed.
const CITATION_SOURCE = { name: "Summit Air", address: "1900 Industrial Pkwy, Columbus, OH 43215", phone: "(614) 555-0148" };
const OSM_DIRECTORY_NAP = { name: "Summit Air Heating and Cooling", address: "1900 Industrial Pkwy, Columbus, OH 43215", phone: null };
const osmComparison = compareNap(CITATION_SOURCE, OSM_DIRECTORY_NAP);

const CITATION_ROWS: CitationRow[] = [
  {
    source: "google",
    label: "Google Business Profile",
    presence: "present",
    status: "baseline",
    shown: { name: CITATION_SOURCE.name, address: CITATION_SOURCE.address, phone: CITATION_SOURCE.phone },
  },
  {
    source: "osm",
    label: "OpenStreetMap",
    presence: "present",
    status: osmComparison.overall,
    shown: { name: OSM_DIRECTORY_NAP.name, address: OSM_DIRECTORY_NAP.address, phone: OSM_DIRECTORY_NAP.phone },
    fields: { name: osmComparison.name, address: osmComparison.address, phone: osmComparison.phone },
  },
];

const citations: CitationResult = {
  checkedAt: "2026-01-15T00:00:00.000Z",
  source: CITATION_SOURCE,
  rows: CITATION_ROWS,
};

// ── PageSpeed issues (fed to the findings/fix-list slides) ───────────────
const PSI_ISSUES: PsiIssue[] = [
  { title: "Largest Contentful Paint", value: "4.2 s" },
  { title: "Total Blocking Time", value: "610 ms" },
  { title: "Unused JavaScript", value: "640 KB potential savings" },
];

export const SAMPLE_REPORT_DATA: ReportV2Data = {
  biz: "Summit Air",
  category: "HVAC",
  country,
  preparedDate: "Jan 2026",
  estimate,
  leakHeadlineFormatted: estimate.headline > 0 ? `$${estimate.headline.toLocaleString("en-US")}` : null,
  auditScore,
  pillarMax: {
    reputation: pillarMaxFrom(auditScore.breakdown, PILLAR_BREAKDOWN_KEYS.reputation),
    visibility: pillarMaxFrom(auditScore.breakdown, PILLAR_BREAKDOWN_KEYS.visibility),
    conversion: pillarMaxFrom(auditScore.breakdown, PILLAR_BREAKDOWN_KEYS.conversion),
    health: pillarMaxFrom(auditScore.breakdown, PILLAR_BREAKDOWN_KEYS.health),
  },
  signals: SAMPLE_SIGNALS,
  opener: {
    headline: "Summit Air is findable, but not first.",
    body: "No booking path, no click-to-call, and a slow mobile site are costing Summit Air real search demand to competitors who show up first and convert better.",
  },
  competitors,
  competitorsVersionCurrent: true,
  sv,
  grid,
  reportImages: null,
  citations,
  psiIssues: PSI_ISSUES,
  observations: undefined,
};
