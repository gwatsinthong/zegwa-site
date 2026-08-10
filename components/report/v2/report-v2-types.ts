import type { RevenueEstimate } from "@/lib/revenue-estimate";
import type { AuditScoreResult } from "@/lib/audit-score";
import type { ProspectSignals } from "@/lib/signals";
import type { CompetitorResult } from "@/lib/competitors-core";
import type { SearchVisibilityResult } from "@/lib/search-visibility-core";
import type { SearchVisibilityGridResult } from "@/lib/search-visibility-grid-core";
import type { ReportImages } from "@/lib/report-images-core";
import type { CitationResult } from "@/lib/citations-core";
import type { PsiIssue } from "@/lib/report-images-core";

// Mechanical port from elvenlore's report-v2-data.ts (apps/web/src/app/report/[token]/v2/report-v2-data.ts).
// That file's loadReportV2Data(p) is a DB-row deriver (reads a Supabase
// ProspectRow) — deliberately NOT ported here, since this sample page has no
// database at all. This file exists only to give report-slides.tsx (also
// ported verbatim) the same TOTAL_SLIDES/ReportV2Data names it originally
// imported from that file, so the ported slide composer compiles unchanged.
// ReportV2Data below is a hand-typed mirror of loadReportV2Data's real
// return shape (source: report-v2-data.ts:131-151 at time of port), not a
// re-derived ReturnType<> (there's no function here to derive it from).
export const TOTAL_SLIDES = 19;

export type ReportV2Observations = Partial<
  Record<
    | "verdict"
    | "competitors"
    | "search_demand"
    | "keyword_cluster"
    | "reputation"
    | "your_site"
    | "trust_signals"
    | "what_we_found",
    string
  >
>;

export type ReportV2Data = {
  biz: string;
  category: string | null | undefined;
  country: string | null;
  preparedDate: string | null;
  estimate: RevenueEstimate;
  leakHeadlineFormatted: string | null;
  auditScore: AuditScoreResult;
  pillarMax: Record<"reputation" | "visibility" | "conversion" | "health", number>;
  signals: ProspectSignals | null | undefined;
  opener: { headline: string; body: string };
  competitors: CompetitorResult | null;
  competitorsVersionCurrent: boolean;
  sv: SearchVisibilityResult | null;
  grid: SearchVisibilityGridResult | null;
  reportImages: ReportImages | null;
  citations: CitationResult | null;
  psiIssues: PsiIssue[] | null;
  observations: ReportV2Observations | undefined;
};
