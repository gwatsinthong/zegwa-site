import type { ProspectSignals, HomepageFlag } from "@/lib/signals";
import type { AuditScoreResult } from "@/lib/audit-score";
import { healthCard } from "@/lib/verdict-pillars";
import { OBSERVATION_STATIC_FALLBACKS } from "@/lib/observation-static-fallbacks";

// Pixel-perfect port of the prototype's Trust Signals <section> (Audit
// Deck.dc.html, slide 12, data-om-slide-id 0647485a). Site-health rollup
// reuses healthCard (verdict-pillars.ts) so its headline/chip/sub-math can
// never disagree with the Verdict slide's own Site health pillar.
//
// HOMEPAGE-SCOPED WORDING (deliberate, matches signals.ts's HomepageFlag
// doc comment exactly): present:true -> "Found"; present:false -> "Not on
// homepage" (NOT "missing"/"absent from site" — this pipeline checks
// exactly one page, so a false only means "not found ON THE HOMEPAGE",
// never a sitewide claim); present:null -> "Couldn't check" (the homepage
// fetch itself failed — unverified, not a claim either way).
//
// GBP activity shows rating + review count only. No "claimed/unclaimed"
// verdict language anywhere — there's no authoritative source for that.

function homepageFlagLabel(flag: HomepageFlag): string {
  if (flag.present === true) return "Found";
  if (flag.present === false) return "Not on homepage";
  return "Couldn't check";
}

// Same chip-state labels the Verdict slide's 4-pillar grid uses (strong ->
// "Strong", mid -> "Needs work", weak -> "Missing") — the prototype's own
// Site Health Rollup card shows "Needs work" as BOTH the big state word and
// the chip, not healthCard's granular finding headline ("No HTTPS"), so
// this maps the shared chipState to that same state vocabulary instead.
const HEALTH_STATE_LABEL: Record<"strong" | "mid" | "weak" | "unmeasured", string> = {
  strong: "Strong",
  mid: "Needs work",
  weak: "Missing",
  unmeasured: "Not measured",
};
const HEALTH_CHIP_CLASS: Record<"strong" | "mid" | "weak" | "unmeasured", string | null> = {
  strong: "chip chip-strong",
  mid: "chip chip-mid",
  weak: "chip chip-weak",
  unmeasured: null,
};

function formatDomainAge(ageMonths: number): string {
  if (ageMonths >= 12) {
    const years = Math.floor(ageMonths / 12);
    return `${years} yr${years === 1 ? "" : "s"}`;
  }
  return `${ageMonths} mo`;
}

function GoldStar({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#F0A93D" : "#EFEFEF"}>
      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7z" />
    </svg>
  );
}

// Ported 1:1 from the prototype's slide-12 icon-badges (Audit
// Deck.dc.html, data-om-slide-id 0647485a) — same paths, viewBoxes, and
// stroke-widths as the handoff. Each icon-badge in the v2 build had been
// left as an empty circle (never wired), which the recon flagged as
// missing icons, not a font/asset gap.
const TRUST_ICON = {
  https: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  domainAge: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16" strokeLinecap="round" />
    </svg>
  ),
  address: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={2}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 105 9.5C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  ),
  healthRollup: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 13l3-3" strokeLinecap="round" />
      <path d="M9 4h6" strokeLinecap="round" />
    </svg>
  ),
  schema: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={2}>
      <path d="M4 10l8-6 8 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9v10h14V9" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10" y="13" width="4" height="6" />
    </svg>
  ),
  social: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={2}>
      <path d="M10 14a4 4 0 005.7 0l2-2a4 4 0 00-5.7-5.7l-1 1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 10a4 4 0 00-5.7 0l-2 2a4 4 0 005.7 5.7l1-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  privacy: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2E9E5B" strokeWidth={2}>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
    </svg>
  ),
  about: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={2}>
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="11" x2="12" y2="16" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="#7C5CFA" stroke="none" />
    </svg>
  ),
  googleProfile: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C1691E" strokeWidth={2}>
      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7z" />
    </svg>
  ),
} as const;

// Same real tri-state colors the shared .chip-strong/.chip-mid/.chip-weak
// classes already use elsewhere in this deck — the HTTPS/health icons
// recolor to match the SAME real signal already driving the card's own
// label and chip a few lines below, never an invented state.
const STATE_COLOR = { strong: "#1F7A47", mid: "#C1691E", weak: "#A8362B", unmeasured: "#8A8A8A" } as const;

function HomepageCheckCard({ title, flag, icon, iconBg }: { title: string; flag: HomepageFlag; icon: React.ReactNode; iconBg: string }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
        <span style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111111", marginBottom: 3 }}>{title}</div>
          <div style={{ fontSize: 17, color: "#ABABAB", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>Homepage check</div>
        </div>
      </div>
      <div className="disp" style={{ fontSize: 30, fontWeight: 700, color: "#111111", lineHeight: 1.1, marginTop: "auto" }}>
        {homepageFlagLabel(flag)}
      </div>
    </div>
  );
}

export type TrustSignalsSlideProps = {
  signals: ProspectSignals | null | undefined;
  auditScore: AuditScoreResult | null;
  observation?: string;
  pageIndex: number;
  pageTotal: number;
};

export default function TrustSignalsSlide({ signals, auditScore, observation, pageIndex, pageTotal }: TrustSignalsSlideProps) {
  const website = signals?.website ?? null;
  const httpsPresent = website?.https.present ?? null;
  const ageMonths = signals?.domain.ageMonths ?? null;
  const address = signals?.places.address ?? null;
  const rating = signals?.places.rating ?? null;
  const reviewCount = signals?.places.reviewCount ?? null;
  const health = auditScore ? healthCard(signals, auditScore.breakdown) : null;

  return (
    <section
      className="slide"
      style={{ padding: "80px 96px", display: "flex", position: "relative", flexDirection: "column", width: "100%", height: "100%", boxSizing: "border-box", background: "linear-gradient(120deg, #F7F6FB 0%, #F2F0FA 40%, #F6F3F6 75%, #F5F3F0 100%)" }}
    >
      <div style={{ position: "absolute", right: "-8%", top: "-25%", width: "65%", height: "150%", background: "radial-gradient(circle, rgba(124,92,250,0.10), transparent 68%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 40, bottom: 40, fontSize: 24, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", color: "#7C5CFA" }}>
        {String(pageIndex).padStart(2, "0")}
        <span style={{ color: "#C7BEF5" }}> / {pageTotal}</span>
      </div>
      <div className="eyebrow" style={{ marginBottom: 20, color: "#7C5CFA", fontWeight: 700, position: "relative" }}>
        The trust
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 40px", position: "relative" }}>
        Trust signals, checked directly.
      </h2>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, width: "100%" }}>
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
              <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: httpsPresent === false ? "#FBEAE8" : "#EFEFEF", display: "flex", alignItems: "center", justifyContent: "center", color: httpsPresent == null ? STATE_COLOR.unmeasured : httpsPresent ? STATE_COLOR.strong : STATE_COLOR.weak }}>
                {TRUST_ICON.https}
              </span>
              <div className="eyebrow" style={{ color: "#9C9C9C" }}>
                HTTPS
              </div>
            </div>
            <div className="disp" style={{ fontSize: 34, fontWeight: 700, color: "#111111", lineHeight: 1.1 }}>
              {httpsPresent == null ? "Not measured" : httpsPresent ? "Enabled" : "Not enabled"}
            </div>
            {httpsPresent === false && (
              <div>
                <span className="chip chip-weak">No HTTPS</span>
              </div>
            )}
            <div style={{ fontSize: 22, color: "#6B6B6B", lineHeight: 1.4, borderTop: "1px solid #EDEDED", paddingTop: 12, marginTop: "auto" }}>
              {httpsPresent == null ? "Couldn't verify HTTPS for this site." : httpsPresent ? "Encrypted connection, no browser warning." : "Browsers show a Not Secure warning."}
            </div>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
              <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "#EFEFEF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {TRUST_ICON.domainAge}
              </span>
              <div className="eyebrow" style={{ color: "#9C9C9C" }}>
                Domain age
              </div>
            </div>
            <div className="disp" style={{ fontSize: 34, fontWeight: 700, color: ageMonths == null ? "#ABABAB" : "#111111", lineHeight: 1.1 }}>
              {ageMonths != null ? formatDomainAge(ageMonths) : "Not measured"}
            </div>
            <div style={{ fontSize: 22, color: "#6B6B6B", lineHeight: 1.4, borderTop: "1px solid #EDEDED", paddingTop: 12, marginTop: "auto" }}>
              {ageMonths != null ? "From the domain registry." : "Registry returned no result."}
            </div>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
              <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "#EFEAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {TRUST_ICON.address}
              </span>
              <div className="eyebrow" style={{ color: "#9C9C9C" }}>
                Business address
              </div>
            </div>
            <div className="disp" style={{ fontSize: 26, fontWeight: 700, color: "#111111", lineHeight: 1.25 }}>
              {address ?? "Not on file"}
            </div>
            <div style={{ fontSize: 22, color: "#6B6B6B", lineHeight: 1.4, borderTop: "1px solid #EDEDED", paddingTop: 12, marginTop: "auto" }}>
              {address ? "On file with Google." : "No address on file with Google."}
            </div>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
              <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "#FBEEDA", display: "flex", alignItems: "center", justifyContent: "center", color: health ? STATE_COLOR[health.chipState] : STATE_COLOR.unmeasured }}>
                {TRUST_ICON.healthRollup}
              </span>
              <div className="eyebrow" style={{ color: "#9C9C9C" }}>
                Site health rollup
              </div>
            </div>
            <div className="disp" style={{ fontSize: 34, fontWeight: 700, color: "#111111", lineHeight: 1.1 }}>
              {health ? HEALTH_STATE_LABEL[health.chipState] : "Not measured"}
            </div>
            {health && (
              <div>
                {HEALTH_CHIP_CLASS[health.chipState] ? (
                  <span className={HEALTH_CHIP_CLASS[health.chipState]!}>{HEALTH_STATE_LABEL[health.chipState]}</span>
                ) : (
                  <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 5, color: "#8A8A8A", background: "#F0F0F0" }}>
                    {HEALTH_STATE_LABEL[health.chipState]}
                  </span>
                )}
              </div>
            )}
            <div style={{ fontSize: 22, color: "#6B6B6B", lineHeight: 1.4, borderTop: "1px solid #EDEDED", paddingTop: 12, marginTop: "auto" }}>
              {health ? health.subMath : "Site health hasn't been scored yet."}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20, width: "100%", flex: 1 }}>
          <HomepageCheckCard title="LocalBusiness schema" flag={website?.schemaMarkup ?? { present: null, scope: "homepage" }} icon={TRUST_ICON.schema} iconBg="#EFEAFB" />
          <HomepageCheckCard title="Social links" flag={website?.socialLinks ?? { present: null, scope: "homepage" }} icon={TRUST_ICON.social} iconBg="#EFEAFB" />
          <HomepageCheckCard title="Privacy page" flag={website?.privacyPage ?? { present: null, scope: "homepage" }} icon={TRUST_ICON.privacy} iconBg="#E5F3EB" />
          <HomepageCheckCard title="About page" flag={website?.aboutPage ?? { present: null, scope: "homepage" }} icon={TRUST_ICON.about} iconBg="#EFEAFB" />
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
              <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "#FBEEDA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {TRUST_ICON.googleProfile}
              </span>
              <div className="eyebrow" style={{ color: "#9C9C9C" }}>
                Google profile
              </div>
            </div>
            <div style={{ marginTop: "auto" }}>
              {rating != null ? (
                <>
                  <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <GoldStar key={i} filled={i < Math.round(rating)} />
                    ))}
                  </div>
                  <div className="disp" style={{ fontSize: 26, fontWeight: 700, color: "#111111", lineHeight: 1.1 }}>
                    {rating.toFixed(1)} rating
                  </div>
                </>
              ) : (
                <div className="disp" style={{ fontSize: 26, fontWeight: 700, color: "#ABABAB", lineHeight: 1.1 }}>
                  Not measured
                </div>
              )}
            </div>
            <div style={{ fontSize: 22, color: "#6B6B6B", lineHeight: 1.4, borderTop: "1px solid #EDEDED", paddingTop: 12 }}>
              {reviewCount != null ? `${reviewCount.toLocaleString()} reviews` : "No review count on file."}
            </div>
          </div>
        </div>

        <div className="obs" style={{ marginTop: 4, border: "none", borderLeft: "4px solid #7C5CFA", borderRadius: 12, background: "#FFFFFF", padding: "24px 32px", display: "flex", alignItems: "flex-start", gap: 20, boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 10px 24px -6px rgba(17,17,17,0.10)" }}>
          <span style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", background: "#EFEAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <div className="obs-label" style={{ color: "#7C5CFA", fontWeight: 700 }}>
              Observation
            </div>
            {observation ?? OBSERVATION_STATIC_FALLBACKS.trust_signals}
          </div>
        </div>
      </div>
    </section>
  );
}
