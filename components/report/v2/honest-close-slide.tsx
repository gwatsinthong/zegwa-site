// Pixel-perfect port of the prototype's Honest Close <section> (Audit
// Deck.dc.html, slide 19, data-om-slide-id 6a43a8eb) — the second dark
// slide and the final slide of the 19-slide deck. Fully static content
// except the header line, which substitutes the real business name and
// prepared date (same header pattern as the Cover slide).
//
// PORT NOTE (zegwa-site sample-audit port): the original elvenlore slide
// renders <DownloadPdfButton /> here — self-contained, reads its own token
// from the URL and calls elvenlore's /api/report/[token]/pdf route (see
// download-pdf-button.tsx in elvenlore, deliberately NOT copied into this
// repo — this static sample page has no token and no PDF route to call).
// Omitted rather than ported as a no-op stub.

export type HonestCloseSlideProps = {
  bizName: string;
  preparedDate: string | null;
  pageIndex: number;
  pageTotal: number;
};

export default function HonestCloseSlide({ bizName, preparedDate, pageIndex, pageTotal }: HonestCloseSlideProps) {
  return (
    <section
      className="slide"
      style={{ padding: "80px 96px", display: "flex", position: "relative", flexDirection: "column", width: "100%", height: "100%", boxSizing: "border-box", background: "#0B0B0C" }}
    >
      <div style={{ position: "absolute", left: "-10%", bottom: "-25%", width: "55%", height: "65%", background: "radial-gradient(circle, rgba(124,92,250,0.14), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 40, bottom: 40, fontSize: 24, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", color: "#B7A4F9" }}>
        {String(pageIndex).padStart(2, "0")}
        <span style={{ color: "#5A5A66" }}> / {pageTotal}</span>
      </div>

      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8A8A8A" }}>Marketing audit</div>
          <div style={{ fontSize: 20, color: "#6B6B6B" }}>
            Prepared for {bizName}
            {preparedDate && (
              <>
                <span style={{ margin: "0 6px" }}>&middot;</span>
                {preparedDate}
              </>
            )}
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.12em", color: "#8A8A8A" }}>ZEGWA</div>
      </div>

      <div style={{ position: "relative", flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", minHeight: 0 }}>
        <div>
          <h2 className="disp" style={{ fontSize: 100, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 32px", lineHeight: 1.05, color: "#FFFFFF" }}>
            We&apos;re new<span style={{ color: "#7C5CFA" }}>.</span>
          </h2>
          <p style={{ fontSize: 32, color: "#ABABAB", lineHeight: 1.6, margin: 0, maxWidth: "42ch" }}>
            No long client list yet. What we have is the exact analysis we did for {bizName}, the number we put on the table, and everything in writing every month to hold us to it. That&apos;s the deal.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div className="eyebrow" style={{ color: "#B7A4F9", fontWeight: 700, fontSize: 26 }}>
            The next step
          </div>
          <div
            style={{
              padding: "26px 30px",
              borderRadius: 16,
              background: "linear-gradient(165deg, #1A1A1A 0%, #0C0C0C 100%)",
              border: "1px solid rgba(124,92,250,0.4)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 40px -14px rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <span style={{ flexShrink: 0, width: 52, height: 52, borderRadius: "50%", background: "rgba(124,92,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B7A4F9" strokeWidth={2}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 6.5l9 6.5 9-6.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span style={{ flex: 1, fontSize: 34, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.4 }}>Reply to the email that sent this.</span>
            <span style={{ fontSize: 30, color: "#B7A4F9" }}>&rarr;</span>
          </div>
          <div style={{ fontSize: 23, color: "#7A7A7A", lineHeight: 1.5 }}>
            Prefer to talk it through first? A 20 minute call works too <span style={{ color: "#ABABAB", textDecoration: "underline", textUnderlineOffset: 3 }}>on Cal</span>.
          </div>
        </div>
      </div>

      <div style={{ position: "relative", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 20, color: "#6B6B6B" }}>by Zegwa Studio</div>
      </div>
    </section>
  );
}
