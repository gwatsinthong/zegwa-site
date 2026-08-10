"use client";

import { createContext, useContext } from "react";

// Print-exclusion mechanism for the close slide's download affordance:
// default value is false (hidden). Only v2/page.tsx (the interactive
// deck) wraps its tree in ShowDownloadButtonProvider, setting it to true —
// print/page.tsx never does, so DownloadPdfButton (which reads this via
// useShowDownloadButton) renders nothing there. No prop has to be threaded
// through ReportSlides/HonestCloseSlide's signatures, and there's no flag
// print has to remember to explicitly turn off: absence of the provider
// IS the off state.
const ShowDownloadButtonContext = createContext(false);

export function ShowDownloadButtonProvider({ children }: { children: React.ReactNode }) {
  return <ShowDownloadButtonContext.Provider value={true}>{children}</ShowDownloadButtonContext.Provider>;
}

export function useShowDownloadButton(): boolean {
  return useContext(ShowDownloadButtonContext);
}
