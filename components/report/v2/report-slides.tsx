import { TOTAL_SLIDES, type ReportV2Data } from "./report-v2-types";
import CoverSlide from "./cover-slide";
import VerdictSlide from "./verdict-slide";
import ContentsSlide from "./contents-slide";
import CompetitorsSlide from "./competitors-slide";
import SearchDemandSlide from "./search-demand-slide";
import KeywordClusterSlide from "./keyword-cluster-slide";
import GeoMapSlide from "./geo-map-slide";
import ReputationSlide from "./reputation-slide";
import YourSiteSlide from "./your-site-slide";
import SitePerformanceSlide from "./site-performance-slide";
import LeakSlide from "./leak-slide";
import TrustSignalsSlide from "./trust-signals-slide";
import NapSlide from "./nap-slide";
import WhatWeFoundSlide from "./what-we-found-slide";
import FixListSlide from "./fix-list-slide";
import DeliverablesSlide from "./deliverables-slide";
import DashboardSlide from "./dashboard-slide";
import OfferSlide from "./offer-slide";
import HonestCloseSlide from "./honest-close-slide";

export function ReportSlides({ data }: { data: ReportV2Data }) {
  return (
    <>
      <CoverSlide
        bizName={data.biz}
        preparedDate={data.preparedDate}
        leakHeadlineFormatted={data.leakHeadlineFormatted}
        headline={data.opener.headline}
        body={data.opener.body}
        auditScore={data.auditScore}
        pillarMax={data.pillarMax}
        pageIndex={1}
        pageTotal={TOTAL_SLIDES}
      />
      <VerdictSlide
        auditScore={data.auditScore}
        signals={data.signals}
        searchVisibility={data.sv}
        observation={data.observations?.verdict}
        pageIndex={2}
        pageTotal={TOTAL_SLIDES}
      />
      <ContentsSlide bizName={data.biz} pageIndex={3} pageTotal={TOTAL_SLIDES} />
      <CompetitorsSlide
        bizName={data.biz}
        competitors={data.competitors}
        versionCurrent={data.competitorsVersionCurrent}
        observation={data.observations?.competitors}
        pageIndex={4}
        pageTotal={TOTAL_SLIDES}
      />
      <SearchDemandSlide bizName={data.biz} sv={data.sv} country={data.country} observation={data.observations?.search_demand} pageIndex={5} pageTotal={TOTAL_SLIDES} />
      <KeywordClusterSlide keywords={data.sv?.keywords ?? null} country={data.country} observation={data.observations?.keyword_cluster} pageIndex={6} pageTotal={TOTAL_SLIDES} />
      <GeoMapSlide bizName={data.biz} grid={data.grid} pageIndex={7} pageTotal={TOTAL_SLIDES} />
      <ReputationSlide
        bizName={data.biz}
        signals={data.signals}
        competitors={data.competitors}
        competitorsVersionCurrent={data.competitorsVersionCurrent}
        observation={data.observations?.reputation}
        pageIndex={8}
        pageTotal={TOTAL_SLIDES}
      />
      <YourSiteSlide bizName={data.biz} signals={data.signals} reportImages={data.reportImages} observation={data.observations?.your_site} pageIndex={9} pageTotal={TOTAL_SLIDES} />
      <SitePerformanceSlide
        bizName={data.biz}
        website={data.signals?.website?.finalUrl ?? null}
        opportunities={data.signals?.performance.pageSpeedOpportunities ?? null}
        pageIndex={10}
        pageTotal={TOTAL_SLIDES}
      />
      <LeakSlide
        bizName={data.biz}
        estimate={data.estimate}
        country={data.country}
        sv={data.sv}
        auditScore={data.auditScore}
        signals={data.signals}
        pageIndex={11}
        pageTotal={TOTAL_SLIDES}
      />
      <TrustSignalsSlide signals={data.signals} auditScore={data.auditScore} observation={data.observations?.trust_signals} pageIndex={12} pageTotal={TOTAL_SLIDES} />
      <NapSlide bizName={data.biz} citations={data.citations} pageIndex={13} pageTotal={TOTAL_SLIDES} />
      <WhatWeFoundSlide
        signals={data.signals}
        auditScore={data.auditScore}
        grid={data.grid}
        citations={data.citations}
        reportImagesIssues={data.psiIssues}
        observation={data.observations?.what_we_found}
        pageIndex={14}
        pageTotal={TOTAL_SLIDES}
      />
      <FixListSlide bizName={data.biz} signals={data.signals} auditScore={data.auditScore} issues={data.psiIssues} pageIndex={15} pageTotal={TOTAL_SLIDES} />
      <DeliverablesSlide category={data.category} bizName={data.biz} pageIndex={16} pageTotal={TOTAL_SLIDES} />
      <DashboardSlide bizName={data.biz} pageIndex={17} pageTotal={TOTAL_SLIDES} />
      <OfferSlide bizName={data.biz} monthlyLeak={data.estimate.headline} country={data.country} pageIndex={18} pageTotal={TOTAL_SLIDES} />
      <HonestCloseSlide bizName={data.biz} preparedDate={data.preparedDate} pageIndex={19} pageTotal={TOTAL_SLIDES} />
    </>
  );
}
