import type { ProspectSignals } from "@/lib/signals";
import type { ReportImages } from "@/lib/report-images-core";
import { psiMetricDisplayValue } from "@/lib/psi-metrics";
import { OBSERVATION_STATIC_FALLBACKS } from "@/lib/observation-static-fallbacks";

// Pixel-perfect port of the prototype's "Your Site" <section> (Audit
// Deck.dc.html, slide 9, data-om-slide-id e0316f24). The phone frame is
// hand-built inline CSS (matching the prototype 1:1), NOT a port of
// iosframe.jsx — confirmed unused in this deck.
//
// PageSpeed individual metrics (LCP/Speed Index/FCP/TBT/CLS) read from
// signals.performance.pageSpeedMetrics — the 5 core Lighthouse metrics'
// REAL values, unconditional on pass/fail (see psi-metrics.ts's
// psiMetricDisplayValue doc comment). A fast site shows its real (good)
// numbers here, not "Not measured" — that only renders when a metric is
// genuinely absent from the PSI response (PSI never ran, or that one audit
// key was missing), never fabricated.

function MetricCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: 128, boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 10px 24px -6px rgba(17,17,17,0.10)" }}>
      <div className="eyebrow" style={{ color: "#9C9C9C", fontSize: 17 }}>
        {label}
      </div>
      {value != null ? (
        <div className="disp tab" style={{ fontSize: 30, fontWeight: 700, color: "#111111" }}>
          {value}
        </div>
      ) : (
        <div style={{ fontSize: 16, fontWeight: 600, color: "#ABABAB" }}>Not measured</div>
      )}
    </div>
  );
}

type FlagState = "yes" | "no" | "unmeasured";

function flagStateOf(present: boolean | null | undefined): FlagState {
  if (present == null) return "unmeasured";
  return present ? "yes" : "no";
}

export type YourSiteSlideProps = {
  bizName: string;
  signals: ProspectSignals | null | undefined;
  reportImages: ReportImages | null;
  observation?: string;
  pageIndex: number;
  pageTotal: number;
};

export default function YourSiteSlide({ bizName, signals, reportImages, observation, pageIndex, pageTotal }: YourSiteSlideProps) {
  const website = signals?.website ?? null;
  const pageSpeedScore = signals?.performance.pageSpeedMobile ?? null;
  const metrics = signals?.performance.pageSpeedMetrics ?? null;

  const httpsState = flagStateOf(website?.https.present);
  const contactFormState = flagStateOf(website?.contactForm.present);
  const clickToCallState = flagStateOf(website?.clickToCall.present);

  const screenshotUrl = reportImages?.screenshot.status === "ok" ? reportImages.screenshot.url : null;

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
        The website
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 40px", position: "relative" }}>
        {bizName}&apos;s site, as a customer first sees it.
      </h2>

      <div style={{ display: "flex", gap: 64, alignItems: "center", flex: 1, minHeight: 0, position: "relative" }}>
        <div style={{ width: 280, flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* height trimmed 540 -> 460: this phone frame is a fixed-size
              decorative mock (not data), the single largest fixed-height
              element on this slide and this slide's main overflow driver
              (1119 measured, +39 over 1080). */}
          <div style={{ width: 260, height: 460, borderRadius: 44, background: "linear-gradient(165deg, #1A1A1A 0%, #0C0C0C 100%)", padding: 10, boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 30px 60px -12px rgba(17,17,17,0.28), 0 10px 20px -6px rgba(17,17,17,0.2)" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 34, background: "#FAFAFA", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
              <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 72, height: 20, borderRadius: 12, background: "#0C0C0C", zIndex: 20 }} />
              <div className="tab" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 4px", fontSize: 13, fontWeight: 600, color: "#111111" }}>
                <span>9:41</span>
                <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={{ width: 14, height: 9, border: "1px solid #111111", borderRadius: 2, position: "relative" }}>
                    <span style={{ position: "absolute", inset: 1.5, background: "#111111", width: "60%" }} />
                  </span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 14px 0", padding: "8px 14px", background: "#EFEFEF", borderRadius: 10 }}>
                <svg width="11" height="13" viewBox="0 0 11 13" style={{ flexShrink: 0 }}>
                  <path d="M2 5.5V4a3.5 3.5 0 017 0v1.5" fill="none" stroke="#6B6B6B" strokeWidth={1.1} />
                  <rect x="0.5" y="5.5" width="10" height="7" rx="1.5" fill="none" stroke="#6B6B6B" strokeWidth={1.1} />
                </svg>
                <span style={{ fontSize: 13, color: "#6B6B6B", fontWeight: 500 }}>{website?.finalUrl ?? "site"}</span>
              </div>
              <div style={{ flex: 1, margin: "12px 14px 14px", borderRadius: 14, background: "#F1F0F5", overflow: "hidden", position: "relative" }}>
                {screenshotUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={screenshotUrl} alt={`${bizName}'s mobile site`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20, fontSize: 14, color: "#9C9C9C", fontWeight: 500 }}>
                    Screenshot not captured
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 22 }}>
              <span className="disp tab" style={{ fontSize: 64, fontWeight: 700, color: "#7C5CFA" }}>
                {pageSpeedScore != null ? (
                  <>
                    {pageSpeedScore}
                    <span style={{ fontSize: "0.4em", color: "#ABABAB" }}>/100</span>
                  </>
                ) : (
                  <span style={{ fontSize: "0.55em", color: "#ABABAB" }}>Not measured</span>
                )}
              </span>
              <span className="eyebrow" style={{ color: "#6B6B6B", fontWeight: 700 }}>
                PageSpeed · mobile
              </span>
            </div>
            {pageSpeedScore != null && (
              <div style={{ position: "relative", height: 10, background: "#EDEDED", borderRadius: 5, marginBottom: 28 }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pageSpeedScore}%`, background: "#7C5CFA", borderRadius: 5 }} />
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
              <MetricCard label="LCP" value={psiMetricDisplayValue(metrics, "lcp")} />
              <MetricCard label="Speed Index" value={psiMetricDisplayValue(metrics, "speedIndex")} />
              <MetricCard label="FCP" value={psiMetricDisplayValue(metrics, "fcp")} />
              <MetricCard label="TBT" value={psiMetricDisplayValue(metrics, "tbt")} />
              <MetricCard label="CLS" value={psiMetricDisplayValue(metrics, "cls")} />
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 20, color: "#9C9C9C" }}>
              What a visitor hits
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: httpsState === "no" ? "#A8362B" : httpsState === "yes" ? "#2E9E5B" : "#C7C7C7", flexShrink: 0 }} />
                <span style={{ fontSize: 28, color: "#111111", fontWeight: 600 }}>
                  {httpsState === "no" ? "No HTTPS" : httpsState === "yes" ? "HTTPS enabled" : "HTTPS not measured"}
                </span>
                {httpsState === "no" && (
                  <span style={{ color: "#FFFFFF", background: "#A8362B", padding: "5px 14px", borderRadius: 6, fontWeight: 700, fontSize: 20 }}>No HTTPS</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: contactFormState === "unmeasured" ? "#C7C7C7" : "#111111", flexShrink: 0 }} />
                <span style={{ fontSize: 28, color: "#111111", fontWeight: 600 }}>
                  {contactFormState === "yes" ? "Has a contact form" : contactFormState === "no" ? "No contact form" : "Contact form not measured"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: clickToCallState === "unmeasured" ? "#C7C7C7" : "#111111", flexShrink: 0 }} />
                <span style={{ fontSize: 28, color: "#111111", fontWeight: 600 }}>
                  {clickToCallState === "yes" ? "Click-to-call available" : clickToCallState === "no" ? "No way to call from the site" : "Click-to-call not measured"}
                </span>
              </div>
            </div>
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
          {observation ?? OBSERVATION_STATIC_FALLBACKS.your_site}
        </div>
      </div>
    </section>
  );
}
