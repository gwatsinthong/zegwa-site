import type { RevenueEstimate } from "@/lib/revenue-estimate";
import type { SearchVisibilityResult } from "@/lib/search-visibility-core";
import type { AuditScoreResult } from "@/lib/audit-score";
import { formatMoney } from "@/lib/currency";
import { tabularNumber } from "./deck-format";
import { conversionCard } from "@/lib/verdict-pillars";

// Pixel-perfect port of the prototype's "The Leak" <section> (Audit
// Deck.dc.html, slide 11, data-om-slide-id 7f8ca8dc) — the keystone slide.
// Reuses estimateRevenueLeak (the SAME call Cover uses) for the dollar
// figures, and conversionCard (verdict-pillars.ts) for step 3's headline so
// the "no booking/form/call" claim can never disagree with the Verdict
// slide's own conversion pillar.

export type LeakSlideProps = {
  bizName: string;
  estimate: RevenueEstimate;
  country: string | null;
  sv: SearchVisibilityResult | null;
  auditScore: AuditScoreResult | null;
  signals: Parameters<typeof conversionCard>[0];
  pageIndex: number;
  pageTotal: number;
};

export default function LeakSlide({ bizName, estimate, country, sv, auditScore, signals, pageIndex, pageTotal }: LeakSlideProps) {
  const hasLeak = estimate.headline > 0;

  let step1Headline: string;
  if (sv?.volume != null && sv.volume > 0) {
    step1Headline = `Local searches for ${estimate.vertical.toLowerCase()}.`;
  } else {
    step1Headline = `Demand for ${estimate.vertical.toLowerCase()} hasn't been measured yet.`;
  }

  let step2Headline: string;
  let step2Caption: string;
  if (sv?.leadAppears && sv.leadPosition === 1) {
    step2Headline = `${bizName} ranks #1 and gets the visits.`;
    step2Caption = "The traffic already arrives.";
  } else if (sv?.leadAppears && sv.leadPosition != null) {
    step2Headline = `${bizName} ranks #${sv.leadPosition} and gets some of the visits.`;
    step2Caption = "Some of that traffic arrives, some goes elsewhere.";
  } else if (sv) {
    step2Headline = `${bizName}'s map-pack rank isn't strong enough to capture that traffic.`;
    step2Caption = "Much of that demand goes to a competitor instead.";
  } else {
    step2Headline = `${bizName}'s map-pack rank hasn't been measured yet.`;
    step2Caption = "Whether that traffic arrives is unmeasured.";
  }

  const step3Headline = auditScore ? conversionCard(signals, auditScore.breakdown).headline : "Conversion signals haven't been measured yet.";

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
        The leak
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 40px", position: "relative" }}>
        What the gaps cost {bizName}.
      </h2>

      <div style={{ flex: 1, display: "flex", gap: 56, alignItems: "stretch", position: "relative" }}>
        <div style={{ flex: "0 0 46%", position: "relative", borderRadius: 20, overflow: "hidden", background: "linear-gradient(165deg, #1A1A1A 0%, #0C0C0C 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 40px -8px rgba(17,17,17,0.28), 0 8px 16px -4px rgba(17,17,17,0.22)", padding: "56px 56px", display: "flex", flexDirection: "column" }}>
          <div className="eyebrow" style={{ color: "#8A8A8A", marginBottom: 18 }}>
            Estimated monthly leak
          </div>
          {hasLeak ? (
            <>
              <div className="disp tab" style={{ fontSize: 128, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, color: "#C1483B" }}>
                {tabularNumber(formatMoney(estimate.headline, country))}
              </div>
              <div style={{ fontSize: 26, color: "#ABABAB", marginTop: 16, lineHeight: 1.4 }}>a month in leads likely walking out the door</div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "36px 0" }} />
              <div className="eyebrow" style={{ color: "#8A8A8A", marginBottom: 12 }}>
                Estimate range
              </div>
              <div className="disp tab" style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF" }}>
                {tabularNumber(formatMoney(estimate.low, country))} to {tabularNumber(formatMoney(estimate.high, country))}
                <span style={{ fontSize: 24, fontWeight: 600, color: "#6B6B6B" }}>/mo</span>
              </div>
            </>
          ) : (
            <>
              <div className="disp" style={{ fontSize: 48, fontWeight: 700, color: "#6B6B6B" }}>Not yet estimated</div>
              <div style={{ fontSize: 26, color: "#ABABAB", marginTop: 16, lineHeight: 1.4 }}>Not enough measured gaps to price a leak yet.</div>
            </>
          )}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 24, padding: "24px 0", borderBottom: "1px solid #E4E4E4" }}>
            <span style={{ width: 48, height: 48, borderRadius: "50%", background: "#EFEAFB", color: "#7C5CFA", fontFamily: "'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
              1
            </span>
            <div>
              <div style={{ fontSize: 27, fontWeight: 600, color: "#111111", marginBottom: 4 }}>{step1Headline}</div>
              <div style={{ fontSize: 24, color: "#ABABAB" }}>Typical demand for this trade, every month.</div>
            </div>
          </div>
          <div style={{ textAlign: "center", color: "#7C5CFA", fontSize: 26, padding: "6px 0" }}>↓</div>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 24, padding: "24px 0", borderBottom: "1px solid #E4E4E4" }}>
            <span style={{ width: 48, height: 48, borderRadius: "50%", background: "#EFEAFB", color: "#7C5CFA", fontFamily: "'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
              2
            </span>
            <div>
              <div style={{ fontSize: 27, fontWeight: 600, color: "#111111", marginBottom: 4 }}>{step2Headline}</div>
              <div style={{ fontSize: 24, color: "#ABABAB" }}>{step2Caption}</div>
            </div>
          </div>
          <div style={{ textAlign: "center", color: "#7C5CFA", fontSize: 26, padding: "6px 0" }}>↓</div>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 24, padding: "24px 0" }}>
            <span style={{ width: 48, height: 48, borderRadius: "50%", background: "#EFEAFB", color: "#7C5CFA", fontFamily: "'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
              3
            </span>
            <div>
              <div style={{ fontSize: 27, fontWeight: 600, color: "#111111", marginBottom: 4 }}>{step3Headline}</div>
              <div style={{ fontSize: 24, color: "#ABABAB" }}>Visits don&apos;t convert to leads.</div>
            </div>
          </div>
          <div style={{ background: "#FBEAE8", borderRadius: 14, padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, marginTop: 28 }}>
            <span style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", background: "#A8362B", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.2}>
                <path d="M12 4l9 16H3z" strokeLinejoin="round" />
                <line x1="12" y1="10" x2="12" y2="14" strokeLinecap="round" />
                <circle cx="12" cy="17" r="0.9" fill="#FFFFFF" stroke="none" />
              </svg>
            </span>
            <div style={{ fontSize: 25, fontWeight: 700, color: "#111111", lineHeight: 1.4 }}>The leak is the gap between demand captured and leads captured.</div>
          </div>
        </div>
      </div>

      {/* STATIC PLACEHOLDER, same treatment as the earlier slides' Observation
          boxes — this disclosure is boilerplate about how the ESTIMATE
          methodology works in general (not an Atlas-specific claim), so it's
          kept verbatim for every lead. */}
      <div className="obs" style={{ display: "flex", alignItems: "flex-start", gap: 20, position: "relative" }}>
        <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#EFEAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={1.8}>
            <rect x="5" y="7" width="14" height="12" rx="1.5" />
            <path d="M9 7V5.5a3 3 0 016 0V7" strokeLinecap="round" />
            <path d="M9.5 12l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <div className="obs-label" style={{ color: "#7C5CFA", fontWeight: 700 }}>
            The estimate
          </div>
          This is an estimate, not a guarantee. It&apos;s a snapshot of what today&apos;s gaps likely cost, based on the gaps we found and typical booking rates for this trade. We don&apos;t re-bill this number monthly.
        </div>
      </div>
    </section>
  );
}
