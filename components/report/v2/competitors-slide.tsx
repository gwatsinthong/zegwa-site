import { competitorDistanceLabel } from "@/lib/report-sections";
import type { CompetitorResult } from "@/lib/competitors-core";
import { buildCompetitorRows } from "./competitor-rows";
import { OBSERVATION_STATIC_FALLBACKS } from "@/lib/observation-static-fallbacks";

// Pixel-perfect port of the prototype's Competitors <section> (Audit
// Deck.dc.html, slide 4, data-om-slide-id 5572bd32). The ranked field merges
// the prospect's own row into the real competitors array (same merge+sort
// the production report's "How you stack up nearby" section already uses —
// see app/report/[token]/page.tsx's compRows and competitor-rows.ts, shared
// with the Reputation slide's "Vs nearby" strip), sorted by review count
// descending so the prospect's real rank position falls out naturally
// instead of being pinned.

export type CompetitorsSlideProps = {
  bizName: string;
  competitors: CompetitorResult | null;
  /** Whether the stored competitors row is on the current filtering-logic
   *  version — a stale pre-fix row could list a non-rival as a "competitor",
   *  same guard the production report applies before trusting it. */
  versionCurrent: boolean;
  observation?: string;
  pageIndex: number;
  pageTotal: number;
};

export default function CompetitorsSlide({ bizName, competitors, versionCurrent, observation, pageIndex, pageTotal }: CompetitorsSlideProps) {
  const hasRivals = (competitors?.competitors.length ?? 0) > 0;
  const ok = !!competitors && versionCurrent && hasRivals;
  const rows = ok ? buildCompetitorRows(competitors!, bizName) : [];
  const maxReviewCount = rows.reduce((max, r) => Math.max(max, r.reviewCount ?? 0), 0);
  const gapToTop = competitors?.standing?.reviewGapToTop ?? null;
  const leadsReviews = competitors?.standing?.leadsReviews ?? false;

  return (
    <section
      className="slide"
      style={{
        padding: "80px 96px",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        background: "linear-gradient(120deg, #F7F6FB 0%, #F2F0FA 40%, #F6F3F6 75%, #F5F3F0 100%)",
      }}
    >
      <div style={{ position: "absolute", right: "-8%", top: "-25%", width: "65%", height: "150%", background: "radial-gradient(circle, rgba(124,92,250,0.10), transparent 68%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 40, bottom: 40, fontSize: 24, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", color: "#7C5CFA" }}>
        {String(pageIndex).padStart(2, "0")}
        <span style={{ color: "#C7BEF5" }}> / {pageTotal}</span>
      </div>
      <div className="eyebrow" style={{ marginBottom: 20, color: "#7C5CFA", fontWeight: 700, position: "relative" }}>
        The competition
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 40px", position: "relative" }}>
        How {bizName} stacks up nearby.
      </h2>

      <div
        style={{
          flex: 1,
          position: "relative",
          background: "#FFFFFF",
          borderRadius: 24,
          padding: "40px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 24px 48px -12px rgba(17,17,17,0.14)",
        }}
      >
        {ok ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "50px 1fr 110px 220px 280px",
                gap: "0 22px",
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#ABABAB",
                paddingBottom: 18,
                borderBottom: "1px solid rgba(17,17,17,0.14)",
              }}
            >
              <span>#</span>
              <span>Business</span>
              <span style={{ textAlign: "right" }}>Rating</span>
              <span style={{ textAlign: "right" }}>Reviews</span>
              <span style={{ textAlign: "right" }}>Dist.</span>
            </div>
            {rows.map((row, i) => {
              const rank = i + 1;
              const barWidth = maxReviewCount > 0 ? ((row.reviewCount ?? 0) / maxReviewCount) * 100 : 0;
              if (row.isYou) {
                return (
                  <div
                    key={row.name + i}
                    style={{
                      position: "relative",
                      display: "grid",
                      gridTemplateColumns: "50px 1fr 110px 220px 280px",
                      gap: "0 22px",
                      alignItems: "center",
                      padding: "26px 64px",
                      margin: "4px -64px",
                      background: "#F4F1FD",
                    }}
                  >
                    <div style={{ position: "absolute", left: 0, top: 6, bottom: 6, width: 4, borderRadius: "0 2px 2px 0", background: "#7C5CFA" }} />
                    <span className="tab" style={{ fontSize: 26, fontWeight: 700, color: "#6B6B6B" }}>
                      {rank}
                    </span>
                    <span style={{ fontSize: 28, fontWeight: 700, color: "#111111", display: "flex", alignItems: "center", gap: 12 }}>
                      {row.name}{" "}
                      <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 5, color: "#7C5CFA", background: "#E7E1FB" }}>
                        You
                      </span>
                    </span>
                    <span className="tab" style={{ fontSize: 26, textAlign: "right", color: "#2E2E2E" }}>
                      {row.rating != null ? row.rating.toFixed(1) : "—"}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <span className="tab" style={{ fontSize: 26, fontWeight: 700, color: "#111111" }}>
                        {row.reviewCount ?? "—"}
                      </span>
                      <div style={{ width: "100%", height: 6, background: "#E7E1FB", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${barWidth}%`, background: "#7C5CFA", borderRadius: 3 }} />
                      </div>
                    </div>
                    <span className="tab" style={{ fontSize: 26, fontWeight: 700, textAlign: "right", color: "#7C5CFA" }}>
                      {!leadsReviews && gapToTop != null ? `+${gapToTop} vs #1` : ""}
                    </span>
                  </div>
                );
              }
              return (
                <div
                  key={row.name + i}
                  style={{ display: "grid", gridTemplateColumns: "50px 1fr 110px 220px 280px", gap: "0 22px", alignItems: "center", padding: "26px 0", borderBottom: "1px solid rgba(17,17,17,0.06)" }}
                >
                  <span className="tab" style={{ fontSize: 26, fontWeight: 700, color: "#6B6B6B" }}>
                    {rank}
                  </span>
                  <span style={{ fontSize: 28, fontWeight: 600, color: "#111111" }}>{row.name}</span>
                  <span className="tab" style={{ fontSize: 26, textAlign: "right", color: "#2E2E2E" }}>
                    {row.rating != null ? row.rating.toFixed(1) : "—"}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span className="tab" style={{ fontSize: 26, fontWeight: 700, color: "#111111" }}>
                      {row.reviewCount ?? "—"}
                    </span>
                    <div style={{ width: "100%", height: 6, background: "#EFEFEF", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${barWidth}%`, background: "rgba(17,17,17,0.55)", borderRadius: 3 }} />
                    </div>
                  </div>
                  <span className="tab" style={{ fontSize: 26, textAlign: "right", color: "#ABABAB" }}>
                    {row.distanceMiles != null ? competitorDistanceLabel(row.distanceMiles) : ""}
                  </span>
                </div>
              );
            })}
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", color: "#9C9C9C", fontSize: 28, fontWeight: 600 }}>
            No competitor data available yet.
          </div>
        )}
      </div>

      {ok ? (
        <div className="obs" style={{ maxWidth: "78ch", position: "relative" }}>
          <div className="obs-label" style={{ color: "#7C5CFA", fontWeight: 700 }}>
            Observation
          </div>
          {observation ?? OBSERVATION_STATIC_FALLBACKS.competitors}
        </div>
      ) : null}
    </section>
  );
}
