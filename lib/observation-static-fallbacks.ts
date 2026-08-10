import type { ObservationSlideKey } from "./observation-facts";

// Honest-generic Observation-box copy for each of the 8 v2 slides in scope
// for LLM observation generation. Single source of truth shared by BOTH
// prospect-audit.ts (the fallback generateObservation() stores when
// generation is skipped/guard-rejected/times out) and each slide component
// (the `?? STATIC_FALLBACK` a reader falls back to).
//
// PRODUCTION INCIDENT (live review on a real prospect, Oren's HVAC
// Services): the first cut of these fallbacks was the prototype's literal
// Atlas mock copy — real numbers, a real competitor name, a real city, all
// belonging to a DIFFERENT business — verbatim on a prospect who has none
// of that data. That is a fabrication, not a fallback. Every string below
// is deliberately generic and safe to show on ANY business's report with
// thin or no data: no specific number, no specific business/competitor
// name, no borrowed fact from the prototype's mock content. This is what
// guarantees the "old audit with no observations field" safety requirement
// stays honest, not just byte-identical to some prior text.
export const OBSERVATION_STATIC_FALLBACKS: Record<ObservationSlideKey, string> = {
  verdict: "The score and pillar breakdown above reflect what this audit could measure for this business.",
  competitors: "The comparison above reflects the nearby, same-category businesses this audit could find.",
  search_demand: "Search demand for this market has not been measured for this business yet.",
  keyword_cluster: "No keyword demand has been measured for this business yet.",
  reputation: "The rating and review numbers above reflect what's on file for this business today.",
  your_site: "The site details above reflect what this audit could directly measure for this business.",
  trust_signals: "The trust signals above reflect what this audit could directly verify for this business.",
  what_we_found: "The gaps and strengths above reflect what this audit could verify for this business.",
};
