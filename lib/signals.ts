import "server-only";
import { resolveMx } from "node:dns/promises";
import { isLikelyUnclaimed } from "./scoring";
import type { PageSpeedOpportunity, PageSpeedMetric } from "./report-images-core";

// ─────────────────────────────────────────────────────────────────────────────
// Website-signal engine. Given a business (website + the Places data we already
// have), gathers concrete, detectable signals that map to Found/Capture sales
// pitches. Most come from ONE website fetch (parse HTML + headers once) plus a
// light RDAP domain-age lookup and a DNS MX lookup. NO paid APIs.
//
// Runs at AUDIT time only (deliberate, per-prospect) — never at search/add.
// Every signal degrades independently: a dead site / DNS timeout returns
// null/unknown for that signal and NEVER throws, so it can't kill the audit.
// ─────────────────────────────────────────────────────────────────────────────

/** present = is the capability there; gap = is its absence a pitchable gap. */
export type Flag = { present: boolean | null; gap: boolean | null };

/** Tri-state result for a HOMEPAGE-SCOPED-ONLY detection (this audit fetches
 *  exactly ONE page, the homepage — see fetchWebsiteSignals below, no
 *  subpage/footer-page crawl exists anywhere in this pipeline).
 *  present: true  -> found on the homepage.
 *  present: false -> the homepage fetch succeeded and this was NOT found on
 *    it. This does NOT mean "absent from the whole site" — a real privacy
 *    page / about page / social link / schema block that lives only on a
 *    subpage (or is injected by client-side JS not present in the raw
 *    server response) is invisible to this check. Any report copy built on
 *    this field MUST phrase a false as "not found on the homepage," never
 *    "you don't have this."
 *  present: null  -> the homepage fetch itself failed — unverified, same
 *    trigger as the existing UNKNOWN_FLAG convention below, not a claim
 *    either way. */
export type HomepageFlag = { present: boolean | null; scope: "homepage" };

export type WebsiteSignals = {
  /** Did the homepage fetch succeed? When false, every flag below is unknown. */
  fetched: boolean;
  finalUrl: string | null;
  https: Flag; // FOUND — no SSL is a trust/SEO gap
  mobileResponsive: Flag; // FOUND
  cms: { value: string | null; gap: boolean }; // informational (DIY-builder angle); never a gap
  analytics: Flag; // FOUND — flying blind without GA/GTM
  adPixels: { value: string[]; present: boolean; gap: boolean }; // pitch-changer (already spend on ads); not a gap
  booking: Flag; // CAPTURE
  chat: Flag; // CAPTURE
  clickToCall: Flag; // CAPTURE
  contactForm: Flag; // CAPTURE
  copyrightYear: number | null;
  staleSite: Flag; // FOUND — old copyright year = neglected site
  // ── Additive trust checks (all HomepageFlag — see its doc comment) ────────
  schemaMarkup: HomepageFlag; // FOUND — JSON-LD LocalBusiness structured data
  socialLinks: HomepageFlag; // FOUND — outbound link to a real social profile
  privacyPage: HomepageFlag; // FOUND — trust signal
  aboutPage: HomepageFlag; // FOUND — trust signal
};

export type ProspectSignals = {
  gatheredAt: string;
  website: WebsiteSignals | null; // null when the prospect has no website at all
  performance: {
    pageSpeedMobile: number | null; // FOUND (from PageSpeed, passed in)
    gap: boolean | null;
    /** Additive — itemized real PageSpeed opportunities (title/savingsKb/
     *  savingsMs/severity), passed in alongside the scalar score. null when
     *  PageSpeed never ran at all (no website, fetch failure/timeout) — a
     *  real run that found nothing is an empty array, not null. */
    pageSpeedOpportunities: PageSpeedOpportunity[] | null;
    /** Additive — the 5 core PageSpeed metrics' REAL values (LCP/Speed Index/
     *  FCP/TBT/CLS), unconditional on pass/fail — a fast site's real (good)
     *  values, not just its failing ones (see report-images-core.ts's
     *  extractPsiMetrics doc comment). null when PageSpeed never ran at all;
     *  a real run always has all 5 entries (core, unconditional Lighthouse
     *  audits) unless one is genuinely absent from the response, in which
     *  case that entry alone is omitted, never fabricated. */
    pageSpeedMetrics: PageSpeedMetric[] | null;
  };
  domain: {
    registrableDomain: string | null;
    registeredAt: string | null;
    ageMonths: number | null; // FOUND — established vs new business
    hasMx: boolean | null; // FOUND/deliverability — has real email setup
    mxGap: boolean | null;
  };
  places: {
    rating: number | null;
    reviewCount: number | null;
    likelyUnclaimed: Flag; // FOUND — GBP-claimed heuristic (reuses score()'s logic)
    /** Places searchText doesn't return per-review timestamps, so last-review
     *  recency isn't obtainable without an extra (paid/again) call — skipped. */
    reviewRecency: null;
    /** Additive — the audited business's own real, authoritative formatted
     *  address, ALREADY fetched (Places) and stored on prospects.address at
     *  creation time. No new call: passed straight through from the prospect
     *  row. null when the prospect has no address on file. */
    address: string | null;
  };
};

export type SignalInput = {
  website: string | null;
  rating: number | null;
  reviewCount: number | null;
  /** Mobile PageSpeed (0-100), already computed by the audit — passed in so the
   *  engine doesn't re-call PageSpeed. */
  pageSpeedMobile?: number | null;
  /** Additive — same PageSpeed fetch's itemized opportunities, passed in
   *  alongside the scalar for the same reason (no re-fetch). */
  pageSpeedOpportunities?: PageSpeedOpportunity[] | null;
  /** Additive — same PageSpeed fetch's 5 core metric values, passed in
   *  alongside the scalar for the same reason (no re-fetch). */
  pageSpeedMetrics?: PageSpeedMetric[] | null;
  /** Additive — the prospect's own Places-sourced formatted address, already
   *  stored on prospects.address — passed in so this engine doesn't need its
   *  own Places call. */
  address?: string | null;
};

const flag = (present: boolean): Flag => ({ present, gap: !present });
const UNKNOWN_FLAG: Flag = { present: null, gap: null };
const homepageFlag = (present: boolean): HomepageFlag => ({ present, scope: "homepage" });
const UNKNOWN_HOMEPAGE_FLAG: HomepageFlag = { present: null, scope: "homepage" };

function unknownWebsite(): WebsiteSignals {
  return {
    fetched: false,
    finalUrl: null,
    https: { ...UNKNOWN_FLAG },
    mobileResponsive: { ...UNKNOWN_FLAG },
    cms: { value: null, gap: false },
    analytics: { ...UNKNOWN_FLAG },
    adPixels: { value: [], present: false, gap: false },
    booking: { ...UNKNOWN_FLAG },
    chat: { ...UNKNOWN_FLAG },
    clickToCall: { ...UNKNOWN_FLAG },
    contactForm: { ...UNKNOWN_FLAG },
    copyrightYear: null,
    staleSite: { ...UNKNOWN_FLAG },
    schemaMarkup: { ...UNKNOWN_HOMEPAGE_FLAG },
    socialLinks: { ...UNKNOWN_HOMEPAGE_FLAG },
    privacyPage: { ...UNKNOWN_HOMEPAGE_FLAG },
    aboutPage: { ...UNKNOWN_HOMEPAGE_FLAG },
  };
}

function detectCms(html: string, headers: Headers): string | null {
  const hay = (html + " " + (headers.get("server") ?? "") + " " + (headers.get("x-powered-by") ?? "")).toLowerCase();
  // Order matters — most specific / common first.
  const checks: [string, RegExp][] = [
    ["WordPress", /wp-content|wp-includes|wp-json|wordpress/],
    ["Wix", /wix\.com|wixstatic|_wix|wix-/],
    ["Squarespace", /squarespace|sqsp\.net/],
    ["Shopify", /cdn\.shopify|shopify/],
    ["Webflow", /webflow/],
    ["Weebly", /weebly/],
    ["Duda", /dudaone|dudamobile|\bduda\b/],
    ["GoDaddy", /godaddy|secureserver|websitebuilder/],
    ["HubSpot", /hubspot|hs-scripts|hsforms/],
    ["Joomla", /joomla/],
    ["Drupal", /drupal/],
  ];
  for (const [name, re] of checks) if (re.test(hay)) return name;
  return null;
}

function detectAdPixels(html: string): string[] {
  const out: string[] = [];
  if (/connect\.facebook\.net\/[^"']*fbevents\.js|fbq\s*\(/i.test(html)) out.push("meta");
  if (/googleadservices\.com|gtag\/js\?id=aw-|\baw-\d{6,}/i.test(html)) out.push("google_ads");
  if (/analytics\.tiktok\.com|ttq\.(load|page|track)/i.test(html)) out.push("tiktok");
  return out;
}

function extractCopyrightYear(html: string): number | null {
  const re = /(?:©|&copy;|&#169;|copyright)[^0-9]{0,18}(20\d{2})(?:\s*[-–—]\s*(20\d{2}))?/gi;
  const years: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    years.push(Number(m[1]));
    if (m[2]) years.push(Number(m[2]));
  }
  return years.length ? Math.max(...years) : null;
}

// ── Additive homepage-scoped trust checks (schema markup, social links,
// privacy page, about page) — same raw `html` string, same regex-on-raw-text
// approach as clickToCall/contactForm above, no new fetch. ─────────────────

const SOCIAL_LINK_RE = /href=["'][^"']*(facebook\.com|instagram\.com|linkedin\.com|(?:x|twitter)\.com|yelp\.com|youtube\.com)/i;
const PRIVACY_PAGE_RE = /privacy[-\s]?policy|\/privacy\b/i;
const ABOUT_PAGE_RE = /\babout(-us)?\b|\/about\b/i;

// Schema.org's LocalBusiness has dozens of named subtypes (Dentist, Store,
// LegalService, RealEstateAgent, ProfessionalService, ...); rather than
// maintain an exhaustive list, this combines a modest known-name set with a
// substring check for "business" (catches HomeAndConstructionBusiness,
// AutomotiveBusiness, MedicalBusiness, etc. without enumerating every one) —
// same shape-over-allowlist preference used for the PageSpeed opportunity
// filter (details.type === "opportunity", not a hardcoded audit-key list).
const KNOWN_LOCAL_BUSINESS_TYPES = new Set([
  "localbusiness", "restaurant", "store", "dentist", "attorney", "legalservice",
  "veterinarycare", "realestateagent", "professionalservice", "generalcontractor",
  "electrician", "plumber", "roofingcontractor", "physician", "beautysalon",
  "gymorfitnesscenter", "autorepair", "financialservice",
]);

function isLocalBusinessType(type: unknown): boolean {
  const types = Array.isArray(type) ? type : [type];
  return types.some((t) => {
    if (typeof t !== "string") return false;
    const lower = t.toLowerCase();
    return KNOWN_LOCAL_BUSINESS_TYPES.has(lower) || lower.includes("business");
  });
}

/** Extracts every <script type="application/ld+json"> block and looks for a
 *  LocalBusiness (or known subtype) node — directly, or nested in a
 *  "@graph" array (the common shape SEO plugins like Yoast emit). Malformed
 *  JSON-LD is skipped, never thrown — one broken block must not sink every
 *  other real signal on the page. */
function hasLocalBusinessSchema(html: string): boolean {
  const scripts = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? [];
  for (const block of scripts) {
    const jsonText = block.replace(/^<script[^>]*>/i, "").replace(/<\/script>\s*$/i, "").trim();
    if (!jsonText) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      continue;
    }
    const nodes = Array.isArray(parsed) ? parsed : [parsed];
    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      const obj = node as Record<string, unknown>;
      if (isLocalBusinessType(obj["@type"])) return true;
      const graph = obj["@graph"];
      if (Array.isArray(graph)) {
        for (const g of graph) {
          if (g && typeof g === "object" && isLocalBusinessType((g as Record<string, unknown>)["@type"])) return true;
        }
      }
    }
  }
  return false;
}

async function fetchWebsiteSignals(website: string): Promise<WebsiteSignals> {
  try {
    const res = await fetch(website, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; ElvenloreAudit/1.0)" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    const finalUrl = res.url || website;
    const html = (await res.text()).slice(0, 400_000);
    const has = (re: RegExp) => re.test(html);

    const https = finalUrl.startsWith("https://");
    const responsive = has(/<meta[^>]+name=["']viewport["'][^>]*device-width/i) || has(/<meta[^>]+name=["']viewport["']/i);
    const analytics = has(/googletagmanager\.com\/gtm\.js|gtag\/js\?id=g-|google-analytics\.com\/(analytics|ga)\.js|googleanalyticsobject|["']ua-\d{4,}/i);
    const booking = has(/calendly|acuityscheduling|squareup\.com\/appointments|setmore|simplybook|schedulicity|vagaro|mindbodyonline|booksy|janeapp|gettimely|book\s*(now|online|an?\s*appointment)|schedule\s*(an?\s*)?appointment/i);
    const chat = has(/intercom|drift\.com|tawk\.to|crisp\.chat|tidio|livechatinc|zopim|zdassets|olark|podium|hubspot[^"']*conversations|customerchat|connect\.facebook\.net\/[^"']*sdk\/xfbml/i);
    const clickToCall = has(/href=["']tel:/i);
    const contactForm = has(/<form/i) && (has(/type=["']email["']/i) || has(/<textarea/i) || has(/wpcf7|jotform|typeform|gravityforms?|hbspt|formspree|google\.com\/forms|wufoo|forms\.gle/i));
    const copyrightYear = extractCopyrightYear(html);
    const stale = copyrightYear != null ? copyrightYear <= new Date().getFullYear() - 2 : null;
    const pixels = detectAdPixels(html);
    const schemaMarkup = hasLocalBusinessSchema(html);
    const socialLinks = has(SOCIAL_LINK_RE);
    const privacyPage = has(PRIVACY_PAGE_RE);
    const aboutPage = has(ABOUT_PAGE_RE);

    return {
      fetched: true,
      finalUrl,
      https: flag(https),
      mobileResponsive: flag(responsive),
      cms: { value: detectCms(html, res.headers), gap: false },
      analytics: flag(analytics),
      adPixels: { value: pixels, present: pixels.length > 0, gap: false },
      booking: flag(booking),
      chat: flag(chat),
      clickToCall: flag(clickToCall),
      contactForm: flag(contactForm),
      copyrightYear,
      staleSite: stale == null ? { ...UNKNOWN_FLAG } : { present: stale, gap: stale },
      schemaMarkup: homepageFlag(schemaMarkup),
      socialLinks: homepageFlag(socialLinks),
      privacyPage: homepageFlag(privacyPage),
      aboutPage: homepageFlag(aboutPage),
    };
  } catch {
    return unknownWebsite();
  }
}

function safeHostname(website: string): string | null {
  try {
    return new URL(website.startsWith("http") ? website : `https://${website}`).hostname;
  } catch {
    return null;
  }
}

// Registrable domain from a hostname, with a small set of common two-level TLDs.
// Heuristic — if it's wrong, the RDAP/MX lookups just degrade to null.
function registrableDomain(hostname: string | null): string | null {
  if (!hostname) return null;
  const parts = hostname.replace(/^www\./i, "").toLowerCase().split(".").filter(Boolean);
  if (parts.length < 2) return null;
  const twoLevel = new Set(["co.uk", "org.uk", "com.au", "net.au", "co.nz", "co.za", "com.br", "co.in", "com.mx", "co.jp"]);
  const lastTwo = parts.slice(-2).join(".");
  if (twoLevel.has(lastTwo) && parts.length >= 3) return parts.slice(-3).join(".");
  return lastTwo;
}

async function domainAge(domain: string): Promise<{ registeredAt: string; ageMonths: number } | null> {
  try {
    // RDAP — free, no key. rdap.org redirects to the authoritative registry.
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { accept: "application/rdap+json" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { events?: { eventAction?: string; eventDate?: string }[] };
    const reg = json.events?.find((e) => e.eventAction === "registration")?.eventDate;
    if (!reg) return null;
    const t = new Date(reg).getTime();
    if (Number.isNaN(t)) return null;
    const ageMonths = Math.max(0, Math.round((Date.now() - t) / (1000 * 60 * 60 * 24 * 30.44)));
    return { registeredAt: new Date(t).toISOString(), ageMonths };
  } catch {
    return null;
  }
}

async function hasMxRecords(domain: string): Promise<boolean | null> {
  try {
    const mx = await Promise.race([
      resolveMx(domain),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("mx-timeout")), 4000)),
    ]);
    return mx.length > 0;
  } catch (e) {
    // ENODATA/ENOTFOUND = resolved but no MX → honestly "no mail setup".
    const code = (e as { code?: string }).code;
    if (code === "ENODATA" || code === "ENOTFOUND") return false;
    return null; // timeout / other → unknown
  }
}

/**
 * Gather the full structured signal set for a prospect. Network work runs in
 * parallel; every piece degrades to null on failure. Safe to call from the
 * audit — it never throws.
 */
export async function gatherSignals(input: SignalInput): Promise<ProspectSignals> {
  const { website, rating, reviewCount, pageSpeedMobile = null, pageSpeedOpportunities = null, pageSpeedMetrics = null, address = null } = input;

  const unclaimed = isLikelyUnclaimed(rating, reviewCount);
  const places: ProspectSignals["places"] = {
    rating: rating ?? null,
    reviewCount: reviewCount ?? null,
    likelyUnclaimed: { present: unclaimed, gap: unclaimed },
    reviewRecency: null,
    address: address ?? null,
  };

  const performance: ProspectSignals["performance"] = {
    pageSpeedMobile: pageSpeedMobile ?? null,
    gap: pageSpeedMobile == null ? null : pageSpeedMobile < 50,
    pageSpeedOpportunities: pageSpeedOpportunities ?? null,
    pageSpeedMetrics: pageSpeedMetrics ?? null,
  };

  const domain: ProspectSignals["domain"] = {
    registrableDomain: null,
    registeredAt: null,
    ageMonths: null,
    hasMx: null,
    mxGap: null,
  };

  let websiteSig: WebsiteSignals | null = null;

  if (website) {
    const dom = registrableDomain(safeHostname(website));
    domain.registrableDomain = dom;
    // Site fetch + domain lookups run together; none can throw out.
    const [site, age, mx] = await Promise.all([
      fetchWebsiteSignals(website),
      dom ? domainAge(dom) : Promise.resolve(null),
      dom ? hasMxRecords(dom) : Promise.resolve(null),
    ]);
    websiteSig = site;
    domain.registeredAt = age?.registeredAt ?? null;
    domain.ageMonths = age?.ageMonths ?? null;
    domain.hasMx = mx;
    domain.mxGap = mx == null ? null : !mx;
  }

  return { gatheredAt: new Date().toISOString(), website: websiteSig, performance, domain, places };
}
