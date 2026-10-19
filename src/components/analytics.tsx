"use client";

import Script from "next/script";
import { useEffect } from "react";
import { analyticsDomain, analyticsScriptSrc, trackEvent } from "@/lib/analytics";

export function Analytics() {
  useEffect(() => {
    if (!analyticsDomain) return;

    function onClick(event: MouseEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!target?.dataset.track) return;
      let props: Record<string, string> | undefined;
      try {
        props = JSON.parse(target.dataset.trackProps ?? "{}");
      } catch {
        props = undefined;
      }
      trackEvent(target.dataset.track, props);
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!analyticsDomain) return null;

  return (
    <>
      <Script defer data-domain={analyticsDomain} src={analyticsScriptSrc} strategy="afterInteractive" />
      <Script id="plausible-queue" strategy="afterInteractive">
        {`window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
      </Script>
    </>
  );
}
