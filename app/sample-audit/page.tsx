import type { Metadata } from "next";
import { DeckScroll, DeckSharedStyles } from "@/components/report/v2/deck-shell";
import { ReportSlides } from "@/components/report/v2/report-slides";
import { ShowDownloadButtonProvider } from "@/components/report/v2/download-visibility-context";
import { SAMPLE_REPORT_DATA } from "@/components/report/v2/sample-data";

// Mechanical port of elvenlore's /report/[token]/v2 route (see
// apps/web/src/app/report/[token]/v2/page.tsx) as a static sample — no
// token, no Supabase fetch, no auth. Kept out of search: noindex, not in
// the sitemap, not linked from nav/footer yet (same posture the old
// app/_sample-report page had, which this replaces with the REAL deck
// instead of a hand-authored fictional page).
export const metadata: Metadata = {
  title: "Sample audit report",
  description: "A sample of the free audit. The business shown is fictional. Your report uses your real numbers.",
  robots: { index: false, follow: false },
};

export default function SampleAuditPage() {
  return (
    <>
      <DeckSharedStyles />
      <ShowDownloadButtonProvider>
        <DeckScroll>
          <ReportSlides data={SAMPLE_REPORT_DATA} />
        </DeckScroll>
      </ShowDownloadButtonProvider>
    </>
  );
}
