// ─────────────────────────────────────────────────────────────────────────────
// Deterministic, research-grounded revenue-leak ESTIMATE (rewrite of stage 1 —
// still NOT wired into the audit/operator page/report; that's a later stage).
//
// The prospect report's central pitch is "you're losing $X/mo", so the number
// must be DEFENSIBLE: a transparent RANGE built from CITABLE, per-vertical value
// units — not one guessed "leads × job value × 25%" formula.
//
// TWO value-models, chosen per vertical:
//   MODEL A — TRADE-CALL (HVAC, Plumbing, Electrical, Roofing):
//       $/mo leak = (missed CALLS/mo from gaps) × (expected value per booked call)
//     The per-call value already bakes in the book/close rate. Roofing rides this
//     path but with lead-based, high-ticket/low-volume economics.
//   MODEL B — NEW-CUSTOMER (Dental, Med Spa, Weight-loss/GLP-1, generic):
//       $/mo leak = (lost LEADS/mo from gaps) × (value per new customer)
//
//   missed units/mo = baselineVolume × combinedLoss(gaps)     [both bounds]
//   low  = baselineVolume.low  × combinedLoss × valuePerUnit.low
//   high = baselineVolume.high × combinedLoss × valuePerUnit.high
//
// Pure + deterministic. All magic numbers are NAMED TUNABLE CONSTANTS below, each
// with its research basis + a confidence flag. Graceful with missing data: no
// gaps → ~zero leak; unknown/missing category → the generic vertical.
// ─────────────────────────────────────────────────────────────────────────────

export type EstimateSeverity = "high" | "medium" | "low";

/** A prospect gap as the audit stores it (area + severity). `severity` optional
 *  → treated as medium. */
export type EstimateGap = { area: string; severity?: EstimateSeverity | null };

export type RevenueEstimateInput = {
  /** Google Places category string, e.g. "HVAC contractor", "Dentist". */
  category?: string | null;
  /** The audit's gaps (audit.gaps) — the LLM's free text. Accepted for
   *  backward-compat with existing callers, but INTENTIONALLY IGNORED by the
   *  dollar figure (see resolveContributors' doc comment for why): LLM
   *  sampling isn't deterministic, so it must never move the leak number.
   *  Kept as a field only so callers don't need to change; it does nothing. */
  gaps?: EstimateGap[] | null;
  /** Canonical fired-gap keys (scoreFactors.firedGaps, deterministic — from
   *  scoreProspect in scoring.ts) — the ONLY source that populates the
   *  dollar model's contributors. Each maps 1:1 via FIRED_GAP_MAP. */
  firedGaps?: string[] | null;
  /** ISO country short-code from 2a's detectCountry ("IN", "US", …). "IN" prices
   *  the leak with the conservative India economics profile (INDIA_ECONOMICS)
   *  instead of the US vertical table; anything else / missing → US model
   *  (unchanged). The GAP LOGIC is identical either way — only the per-customer
   *  value + volume change. */
  country?: string | null;
  /** The business's name, e.g. "Oakland Air Duct Cleaning & AC Repair" — used
   *  ONLY as a fallback vertical signal when the Places category is too vague
   *  to classify (e.g. literally "Services"). See resolveVertical below. */
  businessName?: string | null;
};

export type ValueModel = "trade-call" | "new-customer";
export type ResearchConfidence = "strong" | "approximated" | "generic";

// ── Loss types: the pitchable gaps that actually cost captured calls/leads ────
export type GapType =
  | "no_website"
  | "weak_gbp"
  | "weak_reviews"
  | "no_booking"
  | "no_contact_form"
  | "no_click_to_call"
  | "slow_site"
  | "stale_site";

// ── TUNABLE: per-gap call/lead-loss factors ───────────────────────────────────
// The fraction of would-be captured calls/leads LOST when this gap is present at
// HIGH severity. Severity scales it (SEVERITY_SCALE). Gaps combine multiplicatively
// (retention product), so they never exceed 100% loss. Reduces the vertical's
// baseline call/lead VOLUME.
//
// DELIBERATELY CONSERVATIVE for a PROSPECT-FACING report: a gap costs SOME leads,
// not most. Even a business with no website still gets found via GBP, referrals,
// and word-of-mouth — so no_website loses ~20% of leads, not the majority. A
// believable, defensible number closes better than an inflated one.
export const GAP_LOSS: Record<GapType, number> = {
  no_website: 0.2, // no site → some discovery/trust lost (still found via GBP/referrals)
  weak_gbp: 0.12, // unclaimed/neglected Google Business Profile → some local (Maps) discovery lost
  weak_reviews: 0.07, // low rating / too few reviews → trust-driven drop-off
  no_booking: 0.1, // no self-serve booking → after-hours / impatient leads bounce
  no_contact_form: 0.06, // no web capture path for non-callers
  no_click_to_call: 0.05, // mobile callers can't tap-to-call → some give up
  slow_site: 0.07, // slow / not mobile-friendly → some bounce before contact
  stale_site: 0.03, // visibly neglected site → minor trust erosion
};

// ── TUNABLE: severity scaling of the per-gap loss ─────────────────────────────
export const SEVERITY_SCALE: Record<EstimateSeverity, number> = {
  high: 1.0,
  medium: 0.6,
  low: 0.3,
};

// Dollar figures round to this granularity (headline numbers, "nearest $50").
const ROUND_TO = 50;

// ── TUNABLE: range composition ────────────────────────────────────────────────
// We do NOT stack every optimistic input at once (max volume × max value × max
// loss) — that produces fantasy ceilings. Instead we compute ONE conservative
// CENTRAL scenario (mid volume × mid value × actual gap loss), then put a modest
// ±band around it. This keeps high ≈ 2×–3× low by construction — a believable
// agency-grade estimate, not a min-max explosion.
const BAND_LOW = 0.7; // low  = 0.70 × central
const BAND_HIGH = 1.5; // high = 1.50 × central  (→ high/low ≈ 2.14×)

export type VerticalKey =
  | "hvac"
  | "plumbing"
  | "electrical"
  | "roofing"
  | "dental"
  | "med_spa"
  | "weight_loss"
  | "auto_repair"
  | "landscaping"
  | "cleaning"
  | "chiropractic"
  | "veterinary"
  | "law_firm"
  | "accounting"
  | "gym"
  | "real_estate"
  | "generic";

type VerticalDef = {
  label: string;
  model: ValueModel;
  confidence: ResearchConfidence;
  /** The unit of value for this vertical (shown on the report). */
  valueUnit: string;
  /** Expected value of ONE captured unit (USD), low–high. For trade-call this is
   *  the expected value per booked CALL (book/close rate already baked in); for
   *  new-customer it's the value per new customer. */
  valuePerUnit: { low: number; high: number };
  /** Typical monthly inbound unit volume (calls or leads) for a local shop. */
  baselineVolume: { low: number; high: number };
  /** Plain-English CITABLE line for the report's "how we estimated this". */
  citableNote: string;
};

// ── TUNABLE: research-grounded vertical table ─────────────────────────────────
// Every value carries its research basis + a confidence flag. STRONG = sourced
// research; APPROXIMATED = extrapolated from an adjacent trade; GENERIC = catch-all.
export const VERTICALS: Record<VerticalKey, VerticalDef> = {
  // ── TRADE-CALL model ───────────────────────────────────────────────────────
  hvac: {
    label: "HVAC",
    model: "trade-call",
    confidence: "strong", // industry book-rate + per-call value research
    valueUnit: "missed call",
    valuePerUnit: { low: 200, high: 600 }, // ~$290 avg expected value/call at 65-75% book rate
    baselineVolume: { low: 40, high: 100 }, // inbound calls/mo for a local shop (conservative)
    citableNote:
      "Industry book rate for service calls is 65 to 75%. A missed call is worth roughly $290 in expected revenue (range $200 to $600).",
  },
  plumbing: {
    label: "Plumbing",
    model: "trade-call",
    confidence: "approximated", // extrapolated from HVAC trade data, repair-skewed
    valueUnit: "missed call",
    valuePerUnit: { low: 150, high: 500 }, // repair-skewed, slightly lower ticket than HVAC
    baselineVolume: { low: 40, high: 100 },
    citableNote:
      "Approximated from adjacent HVAC trade data (repair-skewed, slightly lower ticket): expected value per missed call $150 to $500 at a 65 to 75% book rate.",
  },
  electrical: {
    label: "Electrical",
    model: "trade-call",
    confidence: "approximated", // extrapolated from HVAC trade data
    valueUnit: "missed call",
    valuePerUnit: { low: 150, high: 500 },
    baselineVolume: { low: 40, high: 100 },
    citableNote:
      "Approximated from adjacent trade data: expected value per missed call $150 to $500 at a 65 to 75% book rate.",
  },
  roofing: {
    label: "Roofing",
    model: "trade-call",
    confidence: "strong", // high-ticket/low-volume; per-LEAD expected value
    valueUnit: "missed lead",
    // High-ticket, low-volume: value per LEAD ≈ job value ($8k–$18k) × close rate (~27–40%).
    valuePerUnit: { low: 2500, high: 6000 },
    baselineVolume: { low: 8, high: 24 }, // roofing leads/mo (low volume, conservative)
    citableNote:
      "40% of roofing leads go to the first contractor to respond. Average replacement runs $8,000 to $18,000 at a ~27% close rate, so each lost lead is worth roughly $2,500 to $6,000.",
  },
  // ── NEW-CUSTOMER model ─────────────────────────────────────────────────────
  dental: {
    label: "Dental",
    model: "new-customer",
    confidence: "strong",
    valueUnit: "new patient",
    valuePerUnit: { low: 500, high: 1000 }, // first-year value (conservative; LTV higher)
    baselineVolume: { low: 12, high: 30 }, // new patients/mo (conservative)
    citableNote:
      "An average new dental patient is worth $500 to $1,000 in the first year ($2,000 to $7,500 over their lifetime).",
  },
  med_spa: {
    label: "Med Spa",
    model: "new-customer",
    confidence: "strong",
    valueUnit: "new client",
    valuePerUnit: { low: 1500, high: 3000 }, // annual client value (avg visit ~$504)
    baselineVolume: { low: 10, high: 28 }, // new clients/mo (conservative)
    citableNote:
      "An average med spa client is worth $1,500 to $3,000/yr (avg visit ~$504), while acquiring one costs $247 to $1,435.",
  },
  weight_loss: {
    label: "Weight-loss / GLP-1 clinic",
    model: "new-customer",
    confidence: "strong",
    valueUnit: "new member",
    valuePerUnit: { low: 3000, high: 7000 }, // program value: $299–$799/mo × 6–18mo
    // New members/mo — deliberately LOW: members are high-value + slow to acquire,
    // so even a small monthly count implies a large dollar leak. Keeps the ceiling
    // believable (a clinic realistically adds a handful of members/mo, not dozens).
    baselineVolume: { low: 5, high: 13 },
    citableNote:
      "A GLP-1 member is worth $3,000 to $7,000 over their program (memberships run $299 to $799/mo for 6 to 18 months).",
  },
  auto_repair: {
    label: "Auto Repair",
    model: "trade-call",
    confidence: "strong",
    valueUnit: "missed call",
    valuePerUnit: { low: 150, high: 450 },
    baselineVolume: { low: 100, high: 350 },
    citableNote:
      "Average repair ticket runs ~$420 (~$231 gross profit). Local shops service 150 to 450 vehicles a month, so a missed call is worth roughly $150 to $450.",
  },
  landscaping: {
    label: "Landscaping",
    model: "new-customer",
    confidence: "strong",
    valueUnit: "new client",
    valuePerUnit: { low: 1000, high: 4000 },
    baselineVolume: { low: 15, high: 40 },
    citableNote:
      "A recurring residential lawn-care client is worth $900 to $4,000 a year ($100 to $400/mo); commercial contracts run higher.",
  },
  cleaning: {
    label: "Cleaning",
    model: "new-customer",
    confidence: "strong",
    valueUnit: "new client",
    valuePerUnit: { low: 2000, high: 4000 },
    baselineVolume: { low: 15, high: 40 },
    citableNote:
      "A recurring residential cleaning client is worth roughly $2,000 to $4,000 a year; commercial contracts run $8,000 to $40,000.",
  },
  chiropractic: {
    label: "Chiropractic",
    model: "new-customer",
    confidence: "strong",
    valueUnit: "new patient",
    valuePerUnit: { low: 800, high: 2000 },
    baselineVolume: { low: 15, high: 40 },
    citableNote:
      "A new chiropractic patient's initial care plan is worth roughly $800 to $2,000 (acquisition runs $150 to $400 at a 20 to 45% lead-to-patient rate).",
  },
  veterinary: {
    label: "Veterinary",
    model: "new-customer",
    confidence: "strong",
    valueUnit: "new client",
    valuePerUnit: { low: 500, high: 1000 },
    baselineVolume: { low: 20, high: 50 },
    citableNote:
      "A new veterinary client is worth ~$500 to $1,000 in the first year (~$622/yr average, ~$5,000 over the bonded relationship).",
  },
  law_firm: {
    label: "Law Firm",
    model: "trade-call",
    confidence: "strong",
    valueUnit: "missed lead",
    valuePerUnit: { low: 2500, high: 6000 },
    baselineVolume: { low: 8, high: 30 },
    citableNote:
      "A personal-injury case averages ~$15,000 in fees at a 7 to 14% lead-to-case rate, so each lost lead is worth roughly $2,500 to $6,000 (family and criminal practice areas run lower).",
  },
  accounting: {
    label: "Accounting",
    model: "new-customer",
    confidence: "strong",
    valueUnit: "new client",
    valuePerUnit: { low: 1000, high: 5000 },
    baselineVolume: { low: 15, high: 40 },
    citableNote:
      "A new small-business accounting client is worth roughly $1,000 to $5,000 a year (bookkeeping retainers run $300 to $2,500/mo).",
  },
  gym: {
    label: "Gym",
    model: "new-customer",
    confidence: "strong",
    valueUnit: "new member",
    valuePerUnit: { low: 500, high: 1200 },
    baselineVolume: { low: 20, high: 60 },
    citableNote:
      "A new gym member is worth roughly $500 to $1,200 over their membership (lifetime value $517 to $1,890; acquisition $60 to $300).",
  },
  real_estate: {
    label: "Real Estate",
    model: "trade-call",
    confidence: "approximated",
    valueUnit: "missed lead",
    valuePerUnit: { low: 150, high: 600 },
    baselineVolume: { low: 30, high: 50 },
    citableNote:
      "An average commission runs ~$8,000, but online real-estate leads convert at just 1 to 5% (portal leads under 1.2%), so each lost lead is worth roughly $150 to $600.",
  },
  generic: {
    label: "Local business",
    model: "new-customer",
    confidence: "generic",
    valueUnit: "new customer",
    valuePerUnit: { low: 150, high: 800 }, // conservative catch-all
    baselineVolume: { low: 12, high: 40 },
    citableNote:
      "Using a conservative generic estimate (no industry-specific data matched): $150 to $800 per new customer.",
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// ██ INDIA ECONOMICS — TUNE THESE ██
// ─────────────────────────────────────────────────────────────────────────────
// ONE general economics profile for ALL India-detected businesses (no vertical
// tuning — the India plan is "one general offer, all verticals"). These are REAL
// RUPEE values, NOT a USD→INR conversion of the US table (that would be wrong and
// far too high). Conservative by design: a new customer for a typical Indian
// local business (salon, laundry, clinic, studio, small retail) is worth a few
// hundred to low-thousands of rupees per acquisition; repeat value is higher, but
// we deliberately lead with the LOW end — same philosophy as the US model.
//
// To re-tune the ENTIRE India leak, edit the two bands below. Nothing else needs
// to change — the gap logic (which gaps fire, from firedGaps) is shared with the
// US path; only the per-customer value + monthly volume differ here.
export const INDIA_ECONOMICS: VerticalDef = {
  label: "Local business (India)",
  model: "new-customer",
  confidence: "generic",
  valueUnit: "new customer",
  // TUNE: value of ONE new customer to a typical Indian local business, in RUPEES.
  valuePerUnit: { low: 1000, high: 3000 }, // ₹1,000–₹3,000 per customer (conservative)
  // TUNE: typical monthly new-customer / web-lead volume for a local shop.
  baselineVolume: { low: 15, high: 45 },
  citableNote:
    "Using conservative Indian local-business estimates: ₹1,000 to ₹3,000 per customer (we lead with the low end: these are estimates, not guarantees).",
};

// Country short-codes (2a detectCountry output) that use INDIA_ECONOMICS. Add more
// here if the India profile should cover additional markets later.
const INDIA_COUNTRIES = new Set(["IN"]);

/** True when this prospect should be priced with the India economics profile. */
function usesIndiaEconomics(country: string | null | undefined): boolean {
  return !!country && INDIA_COUNTRIES.has(country.trim().toUpperCase());
}
// ═════════════════════════════════════════════════════════════════════════════

// ── TUNABLE: Google Places category → vertical mapping (+ name fallback) ──────
// Order matters: specific trades before the generic fallback; weight-loss before
// med-spa (a "medical weight-loss spa" is weight_loss), electrical checked so it
// doesn't collide with other trades.
//
// Two pattern sets per vertical:
//   category — tested against the Places category string FIRST. Places'
//     category vocabulary is controlled (not free text), so this can match
//     loosely (bare word roots) without much false-positive risk.
//   name — tested against the business NAME only when the category matched
//     NOTHING (see resolveVertical below) — a business's real trade usually
//     still shows in its name even when Places filed it under something vague
//     like "Services". A name is free text, so these patterns are
//     deliberately NARROWER (whole-word/whole-phrase) than the category
//     patterns: a false match here is worse than the honest generic fallback,
//     since it would apply the wrong vertical's economics AND build a wrong
//     search-visibility/AI-visibility seed.
type VerticalPattern = { key: Exclude<VerticalKey, "generic">; category: RegExp; name: RegExp };

const VERTICAL_PATTERNS: VerticalPattern[] = [
  {
    key: "hvac",
    // Added (production bug: "Air duct cleaning service" / "Air duct cleaning
    // & AC repair" categories didn't match): air duct, duct clean, heat pump.
    category: /hvac|heating|cooling|air.?condition|furnace|\bac\b|ac repair|climate control|air duct|duct clean|heat pump/,
    name: /\bhvac\b|air\s?duct|\bfurnace\b|air condition|\bac repair\b|heating (?:and|&) air|heat pump|duct clean/,
  },
  {
    key: "roofing",
    // "roof" alone already covers every realistic Places roofing category
    // (Roofing contractor, Roof repair service, Roofing supply store) — left
    // unwidened; a bare "roof" name mention is unambiguous enough to reuse.
    category: /roof/,
    name: /\broofing\b|\broofer\b|\broof repair\b/,
  },
  {
    key: "plumbing",
    // Added: drain clean(ing), septic, sewer — real adjacent Places categories
    // (Drainage service, Septic system service, Sewage disposal service).
    category: /plumb|drain clean|septic|sewer|sewage/,
    name: /\bplumbing\b|\bplumber\b|drain clean|septic|sewer|sewage/,
  },
  {
    key: "electrical",
    // Already broad enough: every realistic Places category (Electrician,
    // Electrical installation service, Electrical repair shop) contains
    // "electric" — no widening needed here.
    category: /electric|electrician/,
    name: /\belectrician\b|\belectrical\b/,
  },
  {
    key: "dental",
    // Added: denture, oral surg(eon/ery) — real adjacent Places categories
    // (Denture care center, Oral surgeon). Bare "dent" is NEVER used on the
    // name path (false-matches "resident", "confident", "trident", etc).
    category: /dent|orthodon|endodon|periodon|denture|oral surg/,
    name: /\bdental\b|\bdentist\b|orthodon|endodon|periodon|denture|oral surg/,
  },
  {
    key: "weight_loss",
    category: /weight.?loss|glp|semaglutide|tirzepatide|ozempic|wegovy|mounjaro|weight management/,
    name: /weight\s?loss|\bglp.?1\b|semaglutide|tirzepatide|ozempic|wegovy|mounjaro/,
  },
  {
    key: "med_spa",
    // Added: skin care, laser hair (removal), facial spa — real adjacent
    // Places categories. Bare "spa" is fine on the category side (Places'
    // controlled vocabulary), but deliberately excluded from the name path —
    // a plain "spa" in a business name is too often a regular day/nail spa,
    // not a medical-aesthetics business with med_spa's economics.
    category: /med.?spa|medical spa|medspa|aesthetic|dermatolog|botox|\bspa\b|skin care|laser hair|facial spa/,
    name: /med.?spa|medical spa|medspa|\baesthetics?\b|dermatolog|\bbotox\b/,
  },
  {
    key: "auto_repair",
    category: /auto repair|mechanic|car repair|brake|transmission|oil change|muffler|auto body|tire shop|smog/,
    name: /\bauto repair\b|\bmechanic\b|\bbrake repair\b|\btransmission repair\b|auto body/,
  },
  {
    key: "landscaping",
    // Added lawn|mow (user-confirmed, no collision: \blaw\b doesn't match
    // "lawn", and landscaping sits earlier in the array than law_firm anyway)
    // so "lawn mowing service" resolves here instead of falling to generic.
    category: /landscap|lawn|mow|lawn care|lawn service|lawn maintenance|yard|tree service|irrigation|hardscap/,
    name: /\blandscaping\b|\blandscaper\b|\blawn care\b|\blawn service\b|tree service/,
  },
  {
    key: "cleaning",
    category: /cleaning|maid|janitor|housekeep|carpet clean|pressure wash|window clean/,
    name: /\bcleaning\b|\bmaid service\b|\bjanitorial\b|house cleaning|carpet cleaning/,
  },
  {
    key: "chiropractic",
    category: /chiropract|spinal|spine/,
    name: /\bchiropractor\b|\bchiropractic\b/,
  },
  {
    key: "veterinary",
    category: /veterinar|animal hospital|animal clinic|\bvet\b|pet clinic|pet hospital/,
    name: /\bveterinary\b|\bveterinarian\b|animal hospital|animal clinic|pet clinic/,
  },
  {
    key: "law_firm",
    // \blaw\b (not bare "law", as originally given) so "lawn"/"lawn mowing"/
    // "lawn care" categories don't false-match — "lawn" has no word boundary
    // after "law". Confirmed via user this turn; deliberate deviation from
    // the exact regex text, flagged and approved.
    category: /\blaw\b|legal|attorney|lawyer|counsel|solicitor/,
    name: /\blaw firm\b|\battorney\b|\blawyer\b|law offices?|\blegal\b/,
  },
  {
    key: "accounting",
    // Dropped bare "account" (user-confirmed: false-matched "Unaccountable
    // Ventures" and similar) in favor of the specific accounting/accountant
    // terms already used on the name path.
    category: /accounting|accountant|bookkeep|\bcpa\b|tax prep|tax service|payroll|auditor/,
    name: /\baccounting\b|\baccountant\b|\bcpa\b|bookkeeping|tax preparation/,
  },
  {
    key: "gym",
    // \bgym\b (user-confirmed: bare "gym" false-matched "Gymnasium equipment
    // supplier" and "Gymnastics school").
    category: /\bgym\b|fitness|health club|crossfit|pilates|yoga studio|personal train/,
    name: /\bgym\b|\bfitness\b|health club|crossfit|personal training/,
  },
  {
    key: "real_estate",
    category: /real estate|realtor|realty|property management|home sales/,
    name: /\breal estate\b|\brealtor\b|\brealty\b/,
  },
];

/**
 * Resolve a Places category (and, as a fallback, the business name) to a
 * vertical. Category is tried first (existing behavior, plus the widened
 * matching above). If the category yields no confident match — most often
 * because Places filed the business under something vague/generic like
 * "Services", which tokenizes to nothing and can't be widened into matching —
 * the business name is tried against the SAME vertical keyword sets (their
 * narrower `name` patterns). Only if both fail does this return "generic".
 * Never a loose/partial match on the name path: a false vertical match would
 * apply the wrong economics and build a wrong seed, which is worse than the
 * honest generic fallback.
 */
export function resolveVertical(category: string | null | undefined, businessName?: string | null): VerticalKey {
  const c = (category ?? "").trim().toLowerCase();
  if (c) {
    for (const p of VERTICAL_PATTERNS) if (p.category.test(c)) return p.key;
  }
  const n = (businessName ?? "").trim().toLowerCase();
  if (n) {
    for (const p of VERTICAL_PATTERNS) if (p.name.test(n)) return p.key;
  }
  // "General Contractor", "Services", and anything else with no specific
  // trade keyword in either the category or the name.
  return "generic";
}

// Human labels for gaps sourced from canonical fired-gap keys (no area string).
const GAP_LABELS: Record<GapType, string> = {
  no_website: "No website",
  weak_gbp: "Weak or unclaimed Google Business Profile",
  weak_reviews: "Low rating / too few reviews",
  no_booking: "No online booking",
  no_contact_form: "No contact form",
  no_click_to_call: "No click-to-call",
  slow_site: "Slow or non-mobile site",
  stale_site: "Neglected / stale site",
};

// Canonical fired-gap key (scoreFactors.firedGaps) → loss type + default severity.
// new_domain / no_analytics are intentionally omitted: they inform the pursue
// score but aren't direct call/lead-loss drivers. "no_chat" (scoring.ts's
// internal pursue-score/CAPTURE-routing signal) is ALSO intentionally
// omitted now: FAQ chat widget was cut from the Found deliverables list, so
// a chat gap has no dollar loss and no fix to report — scoring.ts is
// operator-only pursue-score plumbing and is left as-is (out of scope
// here), so that key simply resolves to no match below and is silently
// ignored, same as any other unrecognized key.
const FIRED_GAP_MAP: Record<string, { type: GapType; severity: EstimateSeverity }> = {
  no_website: { type: "no_website", severity: "high" },
  likely_unclaimed: { type: "weak_gbp", severity: "medium" },
  weak_reviews: { type: "weak_reviews", severity: "medium" },
  no_booking: { type: "no_booking", severity: "high" },
  no_click_to_call: { type: "no_click_to_call", severity: "medium" },
  no_contact_form: { type: "no_contact_form", severity: "medium" },
  slow_pagespeed: { type: "slow_site", severity: "medium" },
  not_mobile_responsive: { type: "slow_site", severity: "medium" },
  stale_site: { type: "stale_site", severity: "low" },
};

/** Keyword-match a free-text gap `area` (LLM-written) to a loss type. Ordered so
 *  "slow website" → slow_site, not no_website. Returns null if it maps to nothing
 *  that costs calls/leads (e.g. an ads-related note). Exported for the report's
 *  corroboration guard (page.tsx), which uses this SAME classification to check
 *  an LLM finding against the real signal for its type before rendering it —
 *  never a second, divergently-tuned keyword matcher. No longer used to feed
 *  the dollar model (see resolveContributors above). */
export function resolveGapTypeFromArea(area: string): GapType | null {
  const a = area.toLowerCase();
  if (/\bno (online )?(website|web presence|site)\b|without a (website|site)|missing (a )?website|not? online presence|no online presence/.test(a)) return "no_website";
  if (/book|appointment|schedul/.test(a)) return "no_booking";
  if (/google business|\bgbp\b|business profile|unclaimed|maps? (pack|listing)|local (listing|search|visibility)/.test(a)) return "weak_gbp";
  if (/review|rating|reputation/.test(a)) return "weak_reviews";
  if (/contact form|web[ -]?form|form (lead|submission|response)/.test(a)) return "no_contact_form";
  if (/click.?to.?call|tap.?to.?call|missed call|unanswered call|phone call|call handling/.test(a)) return "no_click_to_call";
  if (/slow|speed|page ?load|loading|mobile|responsive|not optimized/.test(a)) return "slow_site";
  if (/stale|outdated|neglected|old (site|website)/.test(a)) return "stale_site";
  return null;
}

type Contributor = { area: string; gapType: GapType; severity: EstimateSeverity; lossFactor: number };

/**
 * Resolve the deterministic contributor set — keyed by gap TYPE so each type is
 * counted exactly ONCE (no double-loss, no doubled dollars).
 *
 * DETERMINISM FIX (production bug: the same business, same stored signals,
 * produced a $4,000 -> $5,400 -> $6,200 leak across three audit runs, because
 * `input.gaps` — the LLM's freshly re-generated free text — used to ALSO feed
 * this set via resolveGapTypeFromArea's keyword match. LLM sampling varies
 * run to run even on identical input, and because gap types combine
 * MULTIPLICATIVELY into combinedLoss (see estimateRevenueLeak below), that
 * variance swung the headline dollar figure. It also let the LLM invent a
 * gap (e.g. "no Google Business Profile detected") that contradicted the
 * deterministic signal for the SAME business, and have that contradiction
 * flow straight into the dollar model.
 *
 * `input.gaps` is intentionally UNUSED here now. ONLY `firedGaps`
 * (deterministic scorer keys from scoring.ts, e.g. "no_website") populate
 * contributors — for the SAME stored signals, scoreProspect always produces
 * the same firedGaps, so this function is now byte-deterministic. The LLM's
 * free text still renders as narrative findings in the report (see
 * page.tsx's corroboration guard, which drops any LLM finding that
 * contradicts a real signal), but it can never move the dollar figure.
 */
function resolveContributors(input: RevenueEstimateInput): Contributor[] {
  const byType = new Map<GapType, Contributor>();
  for (const key of input.firedGaps ?? []) {
    const m = FIRED_GAP_MAP[key];
    if (m) byType.set(m.type, { area: GAP_LABELS[m.type], gapType: m.type, severity: m.severity, lossFactor: GAP_LOSS[m.type] * SEVERITY_SCALE[m.severity] });
  }
  return [...byType.values()];
}

const roundTo = (n: number, step = ROUND_TO) => Math.round(n / step) * step;
const r3 = (n: number) => Math.round(n * 1000) / 1000;
const r1 = (n: number) => Math.round(n * 10) / 10;

export type GapContribution = {
  area: string;
  gapType: GapType;
  severity: EstimateSeverity;
  /** This gap's standalone loss factor (GAP_LOSS × severity). */
  lossFactor: number;
  /** Dollar contribution to the leak (proportional share of the band). */
  low: number;
  high: number;
  midpoint: number;
};

export type RevenueEstimate = {
  low: number;
  high: number;
  midpoint: number;
  /** The single CONSERVATIVE figure to LEAD with on the report ("you're losing at
   *  least $X/mo"). Sits between low and midpoint — deliberately understated so a
   *  skeptical owner can't dismiss it. The full range stays available as backup. */
  headline: number;
  vertical: string;
  verticalKey: VerticalKey;
  model: ValueModel;
  researchConfidence: ResearchConfidence;
  assumptions: {
    /** "missed call" | "new patient" | "new client" | "new member" | … */
    valueUnit: string;
    valuePerUnit: { low: number; high: number };
    baselineVolume: { low: number; high: number };
    /** Combined call/lead-loss fraction from the gaps (0–1). */
    combinedLossFactor: number;
    /** Estimated units (calls/leads) lost per month (baseline × combined loss). */
    estimatedLostUnits: { low: number; high: number };
    /** The plain-English citable line for this vertical. */
    citableNote: string;
    /** Which loss types drove the estimate. */
    gapsUsed: GapType[];
  };
  breakdown: GapContribution[];
};

/**
 * Estimate a prospect's monthly recoverable-revenue leak as a defensible RANGE,
 * using the value-model + citable constants for its vertical. Pure + deterministic.
 */
export function estimateRevenueLeak(input: RevenueEstimateInput): RevenueEstimate {
  // India-detected businesses use ONE conservative rupee profile (no vertical
  // tuning); everyone else uses the US vertical table (byte-identical to before —
  // a missing/unknown country falls through here). Only the value/volume profile
  // (`v`) changes; the gap logic below is shared.
  const india = usesIndiaEconomics(input.country);
  const verticalKey: VerticalKey = india ? "generic" : resolveVertical(input.category, input.businessName);
  const v = india ? INDIA_ECONOMICS : VERTICALS[verticalKey];

  const contributors = resolveContributors(input);

  // Gaps combine multiplicatively: retention = Π(1 − lossᵢ); combined loss caps <100%.
  const retention = contributors.reduce((r, c) => r * (1 - c.lossFactor), 1);
  const combinedLoss = 1 - retention;

  // ONE conservative central scenario, then a modest ±band — NOT max×max×max.
  //   central $/mo = (mid volume × combinedLoss) missed units × mid value per unit
  const midVolume = (v.baselineVolume.low + v.baselineVolume.high) / 2;
  const midValue = (v.valuePerUnit.low + v.valuePerUnit.high) / 2;
  const central = midVolume * combinedLoss * midValue;

  let low = 0;
  let high = 0;
  let midpoint = 0;
  let headline = 0;
  if (central > 0) {
    low = Math.max(ROUND_TO, roundTo(BAND_LOW * central)); // never $0 when there's a leak
    midpoint = roundTo(central);
    high = Math.max(roundTo(BAND_HIGH * central), low + ROUND_TO); // always a real band above low
    midpoint = Math.min(high, Math.max(low, midpoint)); // clamp within [low, high]
    // Lead with a conservative figure: halfway between low and the central midpoint.
    headline = Math.min(midpoint, Math.max(low, roundTo((low + midpoint) / 2)));
  }

  // Per-gap breakdown: attribute the band proportionally to each gap's loss share
  // (so parts sum to the whole, unlike the capped multiplicative combined loss).
  const totalLoss = contributors.reduce((s, c) => s + c.lossFactor, 0);
  const breakdown: GapContribution[] = contributors.map((c) => {
    const share = totalLoss > 0 ? c.lossFactor / totalLoss : 0;
    return {
      area: c.area,
      gapType: c.gapType,
      severity: c.severity,
      lossFactor: r3(c.lossFactor),
      low: roundTo(low * share),
      high: roundTo(high * share),
      midpoint: roundTo(midpoint * share),
    };
  });

  return {
    low,
    high,
    midpoint,
    headline,
    vertical: v.label,
    verticalKey,
    model: v.model,
    researchConfidence: v.confidence,
    assumptions: {
      valueUnit: v.valueUnit,
      valuePerUnit: v.valuePerUnit,
      baselineVolume: v.baselineVolume,
      combinedLossFactor: r3(combinedLoss),
      estimatedLostUnits: {
        low: r1(v.baselineVolume.low * combinedLoss),
        high: r1(v.baselineVolume.high * combinedLoss),
      },
      citableNote: v.citableNote,
      gapsUsed: contributors.map((c) => c.gapType),
    },
    breakdown,
  };
}
