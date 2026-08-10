import type { ProspectSignals } from "@/lib/signals";
import type { CompetitorResult } from "@/lib/competitors-core";
import { buildCompetitorRows } from "./competitor-rows";
import { OBSERVATION_STATIC_FALLBACKS } from "@/lib/observation-static-fallbacks";

// Pixel-perfect port of the prototype's Reputation <section> (Audit
// Deck.dc.html, slide 8, data-om-slide-id fafb508d). No review-velocity
// card — confirmed absent from the final prototype (velocity was cut, not
// producible on a cold audit), so none is wired here either.
//
// "Vs nearby" reuses the EXACT same ranked rows as the Competitors slide
// (competitor-rows.ts's buildCompetitorRows) — the same stored competitors
// data, never a second/independent ranking.

/** Same rating breakpoints audit-score.ts's ratingPoints() scores on
 *  (4.5/4.0/3.5) — descriptive labels instead of point values, so this
 *  can't quietly disagree with the audit score's own definition of a good
 *  rating. Never the prototype's hardcoded "Excellent" for every lead. */
function ratingTier(rating: number): string {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Good";
  if (rating >= 3.5) return "Fair";
  return "Needs work";
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#7C5CFA" : "#E7E1FB"}>
      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7z" />
    </svg>
  );
}

export type ReputationSlideProps = {
  bizName: string;
  signals: ProspectSignals | null | undefined;
  competitors: CompetitorResult | null;
  competitorsVersionCurrent: boolean;
  observation?: string;
  pageIndex: number;
  pageTotal: number;
};

export default function ReputationSlide({ bizName, signals, competitors, competitorsVersionCurrent, observation, pageIndex, pageTotal }: ReputationSlideProps) {
  const rating = signals?.places.rating ?? null;
  const reviewCount = signals?.places.reviewCount ?? null;

  const hasRivals = (competitors?.competitors.length ?? 0) > 0;
  const compOk = !!competitors && competitorsVersionCurrent && hasRivals;
  const rows = compOk ? buildCompetitorRows(competitors!, bizName) : [];
  const maxReviewCount = rows.reduce((max, r) => Math.max(max, r.reviewCount ?? 0), 0);

  let standingClause: string;
  if (rating == null && reviewCount == null) {
    standingClause = `${bizName}'s Google rating and review count haven't been measured yet.`;
  } else {
    const leadsReviews = competitors?.standing?.leadsReviews ?? false;
    const gapToTop = competitors?.standing?.reviewGapToTop ?? null;
    const topName = competitors?.standing?.topByReviews?.name ?? null;
    if (compOk && leadsReviews) {
      standingClause = `${reviewCount ?? 0} reviews at a ${rating != null ? rating.toFixed(1) : "—"} average is one of ${bizName}'s strongest signals, ahead of every nearby competitor found.`;
    } else if (compOk && gapToTop != null && topName) {
      standingClause = `${reviewCount ?? 0} reviews at a ${rating != null ? rating.toFixed(1) : "—"} average is a real strength for ${bizName}, though ${topName} leads by ${gapToTop.toLocaleString()} reviews.`;
    } else {
      standingClause = `${reviewCount ?? 0} reviews at a ${rating != null ? rating.toFixed(1) : "—"} average is a real signal for ${bizName}.`;
    }
  }

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
        The reputation
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 40px", position: "relative" }}>
        Reputation, {bizName}&apos;s real strength.
      </h2>

      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 64, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, gap: 20 }}>
          <div style={{ background: "#111111", borderRadius: 18, padding: "48px 52px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 24px 48px rgba(17,17,17,0.14)" }}>
            <div className="eyebrow" style={{ marginBottom: 20, color: "#7A7A7A" }}>
              Google rating · review count
            </div>
            {rating != null ? (
              <>
                <div className="disp tab" style={{ fontSize: 148, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1, color: "#FFFFFF", whiteSpace: "nowrap" }}>
                  {rating.toFixed(1)} <span style={{ fontSize: "0.45em", fontWeight: 600, color: "#6B6B6B" }}>· {reviewCount ?? 0}</span>
                  <span style={{ fontSize: "0.24em", fontWeight: 500, color: "#6B6B6B", marginLeft: 8 }}>reviews</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} filled={i < Math.round(rating)} />
                    ))}
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>{ratingTier(rating)}</span>
                </div>
              </>
            ) : (
              <div className="disp" style={{ fontSize: 44, fontWeight: 700, color: "#6B6B6B" }}>
                Not measured
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 27, color: "#4A4A4A", lineHeight: 1.55 }}>
            {standingClause} We report the aggregate rating and count only; a per-star breakdown and individual review text aren&apos;t part of this audit.
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14, color: "#7C5CFA", fontWeight: 700 }}>
              Vs nearby
            </div>
            {compOk ? (
              <>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {rows.map((row, i) => {
                    const barWidth = maxReviewCount > 0 ? ((row.reviewCount ?? 0) / maxReviewCount) * 100 : 0;
                    return (
                      <div
                        key={row.name + i}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "230px 50px 1fr 70px",
                          alignItems: "center",
                          gap: 16,
                          padding: "14px 16px",
                          minHeight: 56,
                          borderRadius: row.isYou ? 10 : undefined,
                          background: row.isYou ? "#F4F1FD" : undefined,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 24,
                            fontWeight: row.isYou ? 700 : 400,
                            color: row.isYou ? "#111111" : "#4A4A4A",
                            lineHeight: 1.25,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.name}
                          {row.isYou && (
                            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", color: "#7C5CFA", background: "#E7E1FB", padding: "3px 9px", borderRadius: 5, marginLeft: 4 }}>
                              You
                            </span>
                          )}
                        </span>
                        <span className="tab" style={{ fontSize: 24, fontWeight: row.isYou ? 700 : 600, color: row.isYou ? "#111111" : "#4A4A4A" }}>
                          {row.rating != null ? row.rating.toFixed(1) : "—"}
                        </span>
                        <div style={{ position: "relative", height: 8, background: row.isYou ? "#E7E1FB" : "rgba(17,17,17,0.08)", borderRadius: 999 }}>
                          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${barWidth}%`, background: row.isYou ? "#7C5CFA" : "#C7C7C7", borderRadius: 999 }} />
                        </div>
                        <span className="tab" style={{ fontSize: 24, fontWeight: 700, textAlign: "right", color: row.isYou ? "#111111" : "#6B6B6B" }}>
                          {row.reviewCount ?? "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: 18, color: "#ABABAB", marginTop: 10 }}>Bar length = review count.</div>
              </>
            ) : (
              <div style={{ fontSize: 22, color: "#9C9C9C", fontWeight: 500 }}>No competitor data available yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="obs" style={{ display: "flex", alignItems: "flex-start", gap: 20, position: "relative" }}>
        <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", border: "1.5px solid #7C5CFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={1.8}>
            <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7z" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <div className="obs-label" style={{ color: "#7C5CFA", fontWeight: 700 }}>
            Observation
          </div>
          {observation ?? OBSERVATION_STATIC_FALLBACKS.reputation}
        </div>
      </div>
    </section>
  );
}
