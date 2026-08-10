import { resolveVertical, type VerticalKey } from "./revenue-estimate";

// Real, live per-niche demo sites + real captured full-page screenshots,
// sourced from zegwa-site (gwatsinthong/zegwa-site)'s /work gallery
// (app/work/page.tsx's SAMPLES + components/WorkGrid.tsx). Screenshot files
// copied 1:1 (byte-identical, no re-encode) from that repo's
// public/work/{slug}.webp into this repo's public/report-assets/v2/demos/
// {slug}.webp — see scripts/capture-work-thumbs.ts there for capture
// provenance: a real Playwright full-page screenshot of each live demo
// subdomain, captured only after the site's own "this is a demo" gate is
// confirmed dismissed.
//
// 15 of the 16 real VerticalKey values have a demo. "chiropractic" does
// NOT — confirmed by zegwa-site's own app/chiropractic/page.tsx comment:
// "chiropractic has no real sample site to show ... inventing one would be
// a fake demo." "generic" (the catch-all, non-trade-specific bucket) has
// no demo by design. Both fall back to FALLBACK_DEMOS below — never a
// fabricated or mismatched niche demo.
export type NicheDemo = {
  /** Matches the screenshot filename (public/report-assets/v2/demos/{slug}.webp)
   *  and the live demo subdomain (https://{slug}.zegwastudio.com). */
  slug: string;
  url: string;
  label: string;
};

export const NICHE_DEMOS: Partial<Record<VerticalKey, NicheDemo>> = {
  hvac: { slug: "hvac", url: "https://hvac.zegwastudio.com", label: "HVAC" },
  plumbing: { slug: "plumbing", url: "https://plumbing.zegwastudio.com", label: "Plumbing" },
  roofing: { slug: "roofing", url: "https://roofing.zegwastudio.com", label: "Roofing" },
  electrical: { slug: "electrical", url: "https://electrical.zegwastudio.com", label: "Electrical" },
  med_spa: { slug: "med-spa", url: "https://med-spa.zegwastudio.com", label: "Med Spa" },
  dental: { slug: "dental", url: "https://dental.zegwastudio.com", label: "Dental" },
  auto_repair: { slug: "auto", url: "https://auto.zegwastudio.com", label: "Auto Repair" },
  law_firm: { slug: "injury-law", url: "https://injury-law.zegwastudio.com", label: "Law Firm" },
  weight_loss: { slug: "weight-loss", url: "https://weight-loss.zegwastudio.com", label: "Weight Loss" },
  gym: { slug: "gym", url: "https://gym.zegwastudio.com", label: "Gym" },
  real_estate: { slug: "real-estate", url: "https://real-estate.zegwastudio.com", label: "Real Estate" },
  veterinary: { slug: "vet", url: "https://vet.zegwastudio.com", label: "Veterinary" },
  cleaning: { slug: "cleaning", url: "https://cleaning.zegwastudio.com", label: "Cleaning" },
  accounting: { slug: "accounting", url: "https://accounting.zegwastudio.com", label: "Accounting" },
  landscaping: { slug: "landscaping", url: "https://landscaping.zegwastudio.com", label: "Landscaping" },
};

/** Shown when the prospect's own niche has no demo (chiropractic, generic,
 *  or any future vertical without one) — three representative, REAL samples
 *  presented as "the kind of work we do" in general, never claimed as a
 *  match to this prospect's specific trade. Non-clickable in that state
 *  (see deliverables-slide.tsx) — no niche-specific link is shown when
 *  nothing actually matched. */
export const FALLBACK_DEMOS: NicheDemo[] = [NICHE_DEMOS.dental!, NICHE_DEMOS.hvac!, NICHE_DEMOS.med_spa!];

/** Resolve a prospect's real category/business name to its matching demo, or
 *  null when its vertical has no demo. Reuses the EXISTING vertical
 *  taxonomy the rest of the audit already relies on (resolveVertical, in
 *  revenue-estimate.ts) — never a second, divergent category classifier
 *  that could disagree with what the rest of the report already decided
 *  this prospect's trade is. */
export function resolveNicheDemo(category: string | null | undefined, businessName?: string | null): NicheDemo | null {
  const vertical = resolveVertical(category, businessName);
  return NICHE_DEMOS[vertical] ?? null;
}
