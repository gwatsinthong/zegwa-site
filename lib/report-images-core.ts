// Pure logic for the report's VISUAL PROOF section — no I/O, unit-tested. Extracts
// the site screenshot + score + failing items ALREADY present in the PageSpeed
// response, builds the licensed Static Maps URL, and orchestrates the visual-proof
// payload from injected upload/fetch deps. Never fabricates imagery: a missing
// website / screenshot / location is an honest FINDING, not stock art.

// ── PageSpeed extraction (the screenshot is already in the PSI response) ──────
type PsiResponse = {
  lighthouseResult?: {
    categories?: { performance?: { score?: number } };
    fullPageScreenshot?: { screenshot?: { data?: string } };
    audits?: Record<
      string,
      {
        title?: string;
        score?: number | null;
        displayValue?: string;
        numericValue?: number;
        details?: { type?: string; data?: string; overallSavingsMs?: number; overallSavingsBytes?: number };
      }
    >;
  };
};

/** The site screenshot data URI already in the PSI response (no second fetch —
 *  `screenshot=true` on the PageSpeed request already returns both fields).
 *  Prefer the "final-screenshot" audit — a single VIEWPORT-height capture (the
 *  hero / above-the-fold view, what a mobile visitor actually sees first), not
 *  the full-page scroll composite. Falls back to the full-page screenshot only
 *  when final-screenshot is absent (rare — it's a core Lighthouse audit).
 *  Report-rework batch 1: was full-page-first; now hero-only-first. */
export function extractPsiScreenshot(psi: PsiResponse | null | undefined): string | null {
  const lr = psi?.lighthouseResult;
  const finalShot = lr?.audits?.["final-screenshot"]?.details?.data;
  if (typeof finalShot === "string" && finalShot.startsWith("data:")) return finalShot;
  const full = lr?.fullPageScreenshot?.screenshot?.data;
  if (typeof full === "string" && full.startsWith("data:")) return full;
  return null;
}

export function extractPsiScore(psi: PsiResponse | null | undefined): number | null {
  const s = psi?.lighthouseResult?.categories?.performance?.score;
  return typeof s === "number" ? Math.round(s * 100) : null;
}

export type PsiIssue = { title: string; value: string };

// The performance audits worth surfacing (opportunities + core metrics), in order.
const PSI_ISSUE_KEYS = [
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
  "speed-index",
  "first-contentful-paint",
  "render-blocking-resources",
  "unused-javascript",
  "uses-optimized-images",
  "uses-responsive-images",
  "unminified-javascript",
];

/** Top failing PageSpeed items (score < 0.9, has a title + displayValue). */
export function extractPsiIssues(psi: PsiResponse | null | undefined, limit = 4): PsiIssue[] {
  const audits = psi?.lighthouseResult?.audits;
  if (!audits) return [];
  const out: PsiIssue[] = [];
  for (const key of PSI_ISSUE_KEYS) {
    const a = audits[key];
    if (!a) continue;
    if (typeof a.score === "number" && a.score < 0.9 && a.title && a.displayValue) {
      out.push({ title: a.title, value: a.displayValue });
      if (out.length >= limit) break;
    }
  }
  return out;
}

// ── PageSpeed core METRICS (additive, separate feature from PsiIssue above —
// does NOT read/modify PSI_ISSUE_KEYS/extractPsiIssues, no collision). The 5
// core Lighthouse performance metrics ALWAYS carry a real numericValue +
// displayValue, pass or fail (a fast site's LCP is still a real number, just
// a good one) — extractPsiIssues's score < 0.9 filter exists specifically to
// separate "failing, worth flagging as a finding" from "passing, still a
// real measured value" (see report-images-core.test.ts's own fixture: a
// passing 0.95-score cumulative-layout-shift audit still has displayValue
// "0.01"). This extractor reads the SAME 5 keys unconditionally, so slide 9's
// metric cards show the real value regardless of pass/fail — never "Not
// measured" just because the site is fast.
export type PsiMetricKey = "lcp" | "speedIndex" | "fcp" | "tbt" | "cls";

export type PageSpeedMetric = { key: PsiMetricKey; label: string; numericValue: number | null; displayValue: string | null };

const PSI_METRIC_AUDIT_KEYS: Record<PsiMetricKey, string> = {
  lcp: "largest-contentful-paint",
  speedIndex: "speed-index",
  fcp: "first-contentful-paint",
  tbt: "total-blocking-time",
  cls: "cumulative-layout-shift",
};

/** Real values for the 5 core PageSpeed metrics, straight from the SAME
 *  response extractPsiScore/extractPsiIssues/extractPsiOpportunities already
 *  read (no second fetch) — unconditional on score, unlike extractPsiIssues.
 *  A metric genuinely absent from the response (audit key missing, or no
 *  title/displayValue) is simply OMITTED from the returned array — never a
 *  fabricated entry. Empty array when there are no audits at all (PSI ran
 *  but returned nothing usable); the caller (pageSpeedFull) is what turns
 *  "PSI never ran" into null for storage. */
export function extractPsiMetrics(psi: PsiResponse | null | undefined): PageSpeedMetric[] {
  const audits = psi?.lighthouseResult?.audits;
  if (!audits) return [];
  const out: PageSpeedMetric[] = [];
  for (const key of Object.keys(PSI_METRIC_AUDIT_KEYS) as PsiMetricKey[]) {
    const a = audits[PSI_METRIC_AUDIT_KEYS[key]];
    if (!a || !a.title || !a.displayValue) continue;
    out.push({
      key,
      label: a.title,
      numericValue: typeof a.numericValue === "number" ? a.numericValue : null,
      displayValue: a.displayValue,
    });
  }
  return out;
}

/** Pre-extracted PageSpeed data passed into the visual-proof builder. */
export type PsiExtract = { screenshot: string | null; score: number | null; issues: PsiIssue[] } | null;

// ── PageSpeed OPPORTUNITIES (additive, separate feature from PsiIssue above —
// does not collide with or modify PSI_ISSUE_KEYS/extractPsiIssues). Itemized,
// real, per-audit savings for the report's PageSpeed section: which specific
// things are slow, by how much, and how severe. Shape-based extraction
// (details.type === "opportunity"), not a hardcoded key list, so it covers
// whatever opportunity audits PSI returns without needing to keep a key
// allowlist in sync with Lighthouse's own audit set. ──────────────────────────
export type PageSpeedOpportunity = {
  title: string;
  savingsKb: number | null;
  savingsMs: number | null;
  severity: "high" | "medium" | "low";
};

// TUNABLE: fixed, uniform severity thresholds — same convention as
// revenue-estimate.ts's GAP_LOSS/BAND_LOW/BAND_HIGH. A technical performance
// signal, not a vertical-economics one, so there's deliberately no per-
// vertical tuning here.
const OPPORTUNITY_SEVERITY_HIGH_MS = 1000;
const OPPORTUNITY_SEVERITY_HIGH_KB = 500;
const OPPORTUNITY_SEVERITY_MEDIUM_MS = 300;
const OPPORTUNITY_SEVERITY_MEDIUM_KB = 100;

function opportunitySeverity(savingsMs: number, savingsKb: number): "high" | "medium" | "low" {
  if (savingsMs >= OPPORTUNITY_SEVERITY_HIGH_MS || savingsKb >= OPPORTUNITY_SEVERITY_HIGH_KB) return "high";
  if (savingsMs >= OPPORTUNITY_SEVERITY_MEDIUM_MS || savingsKb >= OPPORTUNITY_SEVERITY_MEDIUM_KB) return "medium";
  return "low";
}

const PSI_OPPORTUNITY_CAP = 5;

/** Real, itemized PageSpeed opportunities from the SAME response
 *  extractPsiScore/extractPsiScreenshot already read (no second fetch). An
 *  audit entry counts as an opportunity iff `details.type === "opportunity"`
 *  AND it carries real positive savings (overallSavingsMs > 0 OR
 *  overallSavingsBytes > 0) — never a fabricated row for an audit that's
 *  already optimal. Capped to the top 5 by ms savings (tiebreak: byte
 *  savings) so the report slide stays short. A fast site with nothing to fix
 *  returns [] — an honest empty, not null (null is reserved for "PSI never
 *  ran" at the caller level, see PageSpeedFull). */
export function extractPsiOpportunities(psi: PsiResponse | null | undefined): PageSpeedOpportunity[] {
  const audits = psi?.lighthouseResult?.audits;
  if (!audits) return [];
  const candidates: { title: string; savingsMs: number; savingsBytes: number }[] = [];
  for (const key of Object.keys(audits)) {
    const a = audits[key];
    if (!a || a.details?.type !== "opportunity" || !a.title) continue;
    const savingsMs = typeof a.details.overallSavingsMs === "number" ? a.details.overallSavingsMs : 0;
    const savingsBytes = typeof a.details.overallSavingsBytes === "number" ? a.details.overallSavingsBytes : 0;
    if (savingsMs <= 0 && savingsBytes <= 0) continue;
    candidates.push({ title: a.title, savingsMs, savingsBytes });
  }
  candidates.sort((x, y) => y.savingsMs - x.savingsMs || y.savingsBytes - x.savingsBytes);
  return candidates.slice(0, PSI_OPPORTUNITY_CAP).map((c) => {
    const savingsKb = c.savingsBytes > 0 ? Math.round(c.savingsBytes / 1024) : 0;
    return {
      title: c.title,
      savingsMs: c.savingsMs > 0 ? c.savingsMs : null,
      savingsKb: savingsKb > 0 ? savingsKb : null,
      severity: opportunitySeverity(c.savingsMs, savingsKb),
    };
  });
}

export type PageSpeedOpportunitiesSummary = { totalSavingsKb: number; totalSavingsMs: number };

/** Sums the KB/ms savings across the STORED opportunities only (post-filter,
 *  post-cap) — never re-derives from the raw PSI response, so the report's
 *  summary band always matches exactly what the itemized list below it shows. */
export function sumPsiOpportunitySavings(opportunities: PageSpeedOpportunity[] | null): PageSpeedOpportunitiesSummary {
  if (!opportunities || opportunities.length === 0) return { totalSavingsKb: 0, totalSavingsMs: 0 };
  return opportunities.reduce(
    (acc, o) => ({
      totalSavingsKb: acc.totalSavingsKb + (o.savingsKb ?? 0),
      totalSavingsMs: acc.totalSavingsMs + (o.savingsMs ?? 0),
    }),
    { totalSavingsKb: 0, totalSavingsMs: 0 },
  );
}

// ── Static Maps (licensed image endpoint — NOT a screenshot of the Maps page) ─
export type StaticMapOpts = { zoom?: number; width?: number; height?: number; scale?: number };

/** Build the Google Static Maps URL for a lat/lng with a marker. Server fetches
 *  this (key stays server-side) and stores the PNG — never hotlinked (would leak
 *  the key into the public report HTML). */
export function buildStaticMapUrl(lat: number, lng: number, key: string, opts: StaticMapOpts = {}): string {
  const { zoom = 15, width = 640, height = 360, scale = 2 } = opts;
  const center = `${lat},${lng}`;
  const params = new URLSearchParams({
    center,
    zoom: String(zoom),
    size: `${width}x${height}`,
    scale: String(scale),
    markers: `color:red|${center}`,
    key,
  });
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

/** Decode a `data:<type>;base64,<data>` URI into its parts (for upload). */
export function parseDataUri(dataUri: string): { contentType: string; base64: string } | null {
  const m = /^data:([^;]+);base64,([\s\S]+)$/.exec(dataUri);
  if (!m) return null;
  return { contentType: m[1]!, base64: m[2]! };
}

// ── Visual-proof payload + orchestration ──────────────────────────────────────
export type ReportImages = {
  capturedAt: string;
  website: string | null;
  screenshot: { status: "ok" | "no_website" | "no_screenshot" | "error"; url: string | null };
  map: { status: "ok" | "no_location" | "error"; url: string | null };
  pagespeed: { status: "ok" | "no_website" | "no_data"; score: number | null; issues: PsiIssue[] };
};

export type VisualProofInput = {
  website: string | null;
  lat: number | null;
  lng: number | null;
  psi: PsiExtract;
};

export type VisualProofDeps = {
  now: () => string;
  /** Upload the site-screenshot data URI → its public URL (or null on failure). */
  uploadScreenshot: (dataUri: string) => Promise<string | null>;
  /** Fetch + store the Static Map for lat/lng → its public URL (or null). */
  uploadMap: (lat: number, lng: number) => Promise<string | null>;
};

/** Assemble the visual-proof payload. Never throws — each sub-block degrades to an
 *  honest status ("no_website" / "no_screenshot" / "no_location" / "error"). */
export async function buildVisualProof(input: VisualProofInput, deps: VisualProofDeps): Promise<ReportImages> {
  const { website, lat, lng, psi } = input;

  // Screenshot.
  let screenshot: ReportImages["screenshot"];
  if (!website) {
    screenshot = { status: "no_website", url: null };
  } else if (!psi?.screenshot) {
    screenshot = { status: "no_screenshot", url: null };
  } else {
    try {
      const url = await deps.uploadScreenshot(psi.screenshot);
      screenshot = url ? { status: "ok", url } : { status: "error", url: null };
    } catch {
      screenshot = { status: "error", url: null };
    }
  }

  // Map (licensed Static Maps image).
  let map: ReportImages["map"];
  if (lat == null || lng == null) {
    map = { status: "no_location", url: null };
  } else {
    try {
      const url = await deps.uploadMap(lat, lng);
      map = url ? { status: "ok", url } : { status: "error", url: null };
    } catch {
      map = { status: "error", url: null };
    }
  }

  // PageSpeed (no new fetch — reuse the extracted data).
  let pagespeed: ReportImages["pagespeed"];
  if (!website) {
    pagespeed = { status: "no_website", score: null, issues: [] };
  } else if (psi?.score != null) {
    pagespeed = { status: "ok", score: psi.score, issues: psi.issues };
  } else {
    pagespeed = { status: "no_data", score: null, issues: [] };
  }

  return { capturedAt: deps.now(), website, screenshot, map, pagespeed };
}

/** Fresh cache → skip re-capture/re-upload (Static Maps is paid). */
export function isImagesFresh(cached: { capturedAt?: string } | null | undefined, ttlDays: number, nowMs: number): boolean {
  if (!cached?.capturedAt) return false;
  const t = Date.parse(cached.capturedAt);
  if (Number.isNaN(t)) return false;
  return nowMs - t < ttlDays * 86_400_000;
}

/** Cache gate: return a fresh cached payload WITHOUT running the live build. */
export async function resolveImagesCached(
  cached: ReportImages | null | undefined,
  ttlDays: number,
  nowMs: number,
  run: () => Promise<ReportImages>,
): Promise<ReportImages> {
  // Only reuse a cache that actually captured something (don't pin a failed run).
  if (isImagesFresh(cached, ttlDays, nowMs) && (cached!.screenshot.status === "ok" || cached!.map.status === "ok")) {
    return cached!;
  }
  return run();
}
