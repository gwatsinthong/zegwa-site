// Pixel-perfect port of the prototype's Dashboard <section> (Audit
// Deck.dc.html, slide 17, the labor-visibility bridge slide). Static
// marketing content — the only per-lead wiring is substituting the real
// business name into the one sentence that names Atlas directly ("Atlas
// gets a live portal...").
//
// The portal screenshot is a fixed marketing asset (same for every audit,
// not per-lead) — served from /public, mirroring the prototype's plain
// <img src="uploads/{GUID}.png">. The prototype's own portal subdomain
// ("portal.atlasheating.com") isn't a real stored field anywhere in this
// product, so it's kept as a generic placeholder rather than an invented
// per-lead URL.

const FEATURES = ["Search and visit trends", "New reviews as they land", "A dated work log of everything done", "Monthly reports", "Requests, anytime"];

export type DashboardSlideProps = {
  bizName: string;
  pageIndex: number;
  pageTotal: number;
};

export default function DashboardSlide({ bizName, pageIndex, pageTotal }: DashboardSlideProps) {
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
        Your portal
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 40px", position: "relative" }}>
        Every month, you see exactly what we did.
      </h2>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 72, minHeight: 0, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: 29, fontWeight: 700, color: "#111111", margin: 0, lineHeight: 1.4 }}>Most agencies send an invoice and go quiet.</p>
            <p style={{ fontSize: 27, fontWeight: 500, color: "#3A3A3A", margin: 0, lineHeight: 1.5 }}>
              {bizName} gets a live portal: every search, visit, and review, plus a dated log of the actual work, month after month.
            </p>
            <p style={{ fontSize: 27, fontWeight: 500, color: "#3A3A3A", margin: 0, lineHeight: 1.5 }}>No wondering what you&apos;re paying for. It&apos;s all there, in writing.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 28, borderTop: "1px solid rgba(17,17,17,0.08)" }}>
            {FEATURES.map((feature) => (
              <div key={feature} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: "50%", background: "#EFEAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={3}>
                    <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ fontSize: 26, color: "#2E2E2E", fontWeight: 600 }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, minHeight: 0 }}>
          <div style={{ width: "100%", borderRadius: 16, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(17,17,17,0.06), 0 24px 48px -14px rgba(17,17,17,0.22)", overflow: "hidden", border: "1px solid rgba(17,17,17,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid rgba(17,17,17,0.06)" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E3E3E3" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E3E3E3" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E3E3E3" }} />
              <span style={{ marginLeft: 10, fontSize: 13, color: "#ABABAB", fontWeight: 500 }}>yourportal.example.com</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/report-assets/v2/summit-air-portal-dashboard.png" alt="Summit Air portal dashboard screenshot" style={{ display: "block", width: "100%", height: "auto" }} />
          </div>
          <div style={{ fontSize: 21, color: "#6B6B6B", textAlign: "center", maxWidth: "46ch" }}>{bizName}&apos;s own portal. Real numbers, updated as they happen.</div>
        </div>
      </div>

      {/* STATIC PLACEHOLDER, same treatment as the earlier slides' Observation
          boxes — this is generic sales copy per the prototype. */}
      <div className="obs" style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24, position: "relative" }}>
        <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#7C5CFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.8}>
            <rect x="6" y="3" width="12" height="18" rx="1.5" />
            <line x1="9" y1="8" x2="15" y2="8" strokeLinecap="round" />
            <line x1="9" y1="12" x2="15" y2="12" strokeLinecap="round" />
            <line x1="9" y1="16" x2="12" y2="16" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <span style={{ fontSize: 26, fontWeight: 700, color: "#7C5CFA" }}>The work log is the difference.</span>
          <span style={{ fontSize: 26, color: "#4A4A4A" }}> You always know the labor is real.</span>
        </div>
      </div>
    </section>
  );
}
