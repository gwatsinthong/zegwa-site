import type { CitationResult } from "@/lib/citations-core";

// Pixel-perfect port of the prototype's NAP Consistency <section> (Audit
// Deck.dc.html, slide 13, data-om-slide-id 6a334eac). Google is the source
// of truth (never independently "compared" — it IS the baseline citations-
// core.ts checks OSM against), so its card shows "Your listing" rather than
// the prototype's fabricated "Matches"/"Consistent" claim for that column.
// OSM renders its REAL match/partial/mismatch/not_listed status — an honest
// not_listed state (business absent from OSM) renders the real absence,
// never a fabricated match.

const STATUS_LABEL: Record<string, string> = {
  match: "Consistent",
  partial: "Partial",
  mismatch: "Mismatch",
  not_listed: "Not listed",
};
const STATUS_BIG: Record<string, string> = {
  match: "Matches",
  partial: "Partially matches",
  mismatch: "Doesn't match",
  not_listed: "Not listed",
};
const STATUS_COLOR: Record<string, { fg: string; bg: string }> = {
  match: { fg: "#1F7A47", bg: "#E3F4E9" },
  partial: { fg: "#C1691E", bg: "#FBEBDA" },
  mismatch: { fg: "#A8362B", bg: "#FBEAE8" },
  not_listed: { fg: "#A8362B", bg: "#FBEAE8" },
};

export type NapSlideProps = {
  bizName: string;
  citations: CitationResult | null;
  pageIndex: number;
  pageTotal: number;
};

export default function NapSlide({ bizName, citations, pageIndex, pageTotal }: NapSlideProps) {
  const google = citations?.rows.find((r) => r.source === "google") ?? null;
  const osm = citations?.rows.find((r) => r.source === "osm") ?? null;
  const bothMatch = google != null && osm?.status === "match";

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
        The listings
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 12px", position: "relative" }}>
        Is {bizName}&apos;s info consistent where it&apos;s listed?
      </h2>
      <p style={{ fontSize: 24, color: "#6B6B6B", margin: "0 0 40px", position: "relative" }}>
        We checked {bizName}&apos;s name, address, and phone across Google and OpenStreetMap, the two sources we verify directly.
      </p>

      {citations ? (
        <>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 56px 1fr", alignItems: "stretch", gap: 0, position: "relative" }}>
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "32px 44px", display: "flex", flexDirection: "column", gap: 22, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ flexShrink: 0, width: 64, height: 64, borderRadius: "50%", background: "#FAFAFA", boxShadow: "0 1px 2px rgba(17,17,17,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </span>
                <div>
                  <div className="eyebrow" style={{ color: "#9C9C9C", marginBottom: 6 }}>
                    Google Business Profile
                  </div>
                  <div className="disp" style={{ fontSize: 40, fontWeight: 700, color: "#111111", marginBottom: 10 }}>
                    Your listing
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 16, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", color: "#6E6E7E", background: "#F1F1F3", padding: "5px 12px", borderRadius: 6 }}>
                    Source of truth
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, borderTop: "1px solid #EDEDED", paddingTop: 20, flex: 1, justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 20, color: "#9C9C9C", textTransform: "uppercase", letterSpacing: "0.06em" }}>Name</span>
                  <span style={{ fontSize: 28, color: "#111111", fontWeight: 600 }}>{citations.source.name}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 20, color: "#9C9C9C", textTransform: "uppercase", letterSpacing: "0.06em" }}>Address</span>
                  <span style={{ fontSize: 28, color: "#111111", fontWeight: 600 }}>{citations.source.address ?? "Not on file"}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 20, color: "#9C9C9C", textTransform: "uppercase", letterSpacing: "0.06em" }}>Phone</span>
                  <span style={{ fontSize: 28, color: "#111111", fontWeight: 600 }}>{citations.source.phone ?? "Not on file"}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 96, paddingTop: 168 }}>
              {(["name", "address", "phone"] as const).map((f) => {
                const st = osm?.fields?.[f];
                const symbol = osm?.presence === "absent" ? "?" : st === "exact" ? "=" : st === "partial" ? "≈" : st === "mismatch" ? "≠" : "=";
                return (
                  <span key={f} style={{ fontSize: 26, fontWeight: 700, color: "#6B6B6B" }}>
                    {symbol}
                  </span>
                );
              })}
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "32px 44px", display: "flex", flexDirection: "column", gap: 22, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ flexShrink: 0, width: 64, height: 64, borderRadius: "50%", background: "#FAFAFA", boxShadow: "0 1px 2px rgba(17,17,17,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={1.8}>
                    <path d="M9 20l-6-3V5l6 3 6-3 6 3v12l-6-3-6 3z" strokeLinejoin="round" />
                    <line x1="9" y1="5" x2="9" y2="17" />
                    <line x1="15" y1="8" x2="15" y2="20" />
                  </svg>
                </span>
                <div>
                  <div className="eyebrow" style={{ color: "#9C9C9C", marginBottom: 6 }}>
                    OpenStreetMap
                  </div>
                  <div className="disp" style={{ fontSize: 40, fontWeight: 700, color: "#111111", marginBottom: 10 }}>
                    {osm ? STATUS_BIG[osm.status] ?? osm.status : "Not checked"}
                  </div>
                  {osm && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 16,
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                        textTransform: "uppercase",
                        color: STATUS_COLOR[osm.status]?.fg ?? "#6E6E7E",
                        background: STATUS_COLOR[osm.status]?.bg ?? "#F1F1F3",
                        padding: "5px 12px",
                        borderRadius: 6,
                      }}
                    >
                      {STATUS_LABEL[osm.status] ?? osm.status}
                    </span>
                  )}
                </div>
              </div>
              {osm?.presence === "absent" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, borderTop: "1px solid #EDEDED", paddingTop: 20, flex: 1, justifyContent: "center" }}>
                  <p style={{ fontSize: 24, color: "#6B6B6B", lineHeight: 1.5, margin: 0 }}>
                    We couldn&apos;t find {bizName} listed on OpenStreetMap. An empty or missing listing is lost visibility there.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, borderTop: "1px solid #EDEDED", paddingTop: 20, flex: 1, justifyContent: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 20, color: "#9C9C9C", textTransform: "uppercase", letterSpacing: "0.06em" }}>Name</span>
                    <span style={{ fontSize: 28, color: "#111111", fontWeight: 600 }}>{osm?.shown.name ?? "—"}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 20, color: "#9C9C9C", textTransform: "uppercase", letterSpacing: "0.06em" }}>Address</span>
                    <span style={{ fontSize: 28, color: "#111111", fontWeight: 600 }}>{osm?.shown.address ?? "—"}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 20, color: "#9C9C9C", textTransform: "uppercase", letterSpacing: "0.06em" }}>Phone</span>
                    <span style={{ fontSize: 28, color: "#111111", fontWeight: 600 }}>{osm?.shown.phone ?? "—"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STATIC-STRUCTURE, REAL-VALUE observation: the lede sentence is
              generated from the real match state (never fabricated — bothMatch
              is computed above from the real OSM status), the trailing scope
              disclaimer is generic boilerplate kept verbatim for every lead. */}
          <div className="obs" style={{ background: "#F4F1FD", border: "none", borderRadius: 16, padding: "24px 32px", display: "flex", alignItems: "center", gap: 20, marginTop: 24, position: "relative" }}>
            <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#7C5CFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.8}>
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <span style={{ fontSize: 24, fontWeight: 700, color: "#7C5CFA" }}>
                {bothMatch
                  ? "Name, address, and phone line up on both sources we checked."
                  : osm?.presence === "absent"
                    ? `${bizName} isn't listed on OpenStreetMap.`
                    : "Some details don't line up between the sources we checked."}
              </span>
              <span style={{ fontSize: 24, color: "#4A4A4A" }}> A wider citations sweep is a natural next step, not something we&apos;re claiming here.</span>
            </div>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9C9C9C", fontSize: 28, fontWeight: 600 }}>
          Listing-consistency data isn&apos;t available for this lead yet.
        </div>
      )}
    </section>
  );
}
