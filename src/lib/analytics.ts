/**
 * Privacy-friendly analytics (Plausible-compatible). Nothing is sent unless
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set and the script has loaded.
 *
 * Events in use:
 * - whatsapp_click        { location }
 * - project_click         { project, target: "case_study" | "live_site" }
 * - cta_click             { location, label }
 * - enquiry_start         first interaction with the enquiry form
 * - enquiry_submitted     successful submission
 */

type Props = Record<string, string>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export const analyticsDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "";
export const analyticsScriptSrc =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.js";

export function trackEvent(event: string, props?: Props) {
  if (typeof window === "undefined" || !window.plausible) return;
  window.plausible(event, props ? { props } : undefined);
}

/**
 * Builds data attributes that the global click listener turns into events,
 * so server-rendered links can be tracked without becoming client components.
 */
export function track(event: string, props: Props = {}) {
  return {
    "data-track": event,
    "data-track-props": JSON.stringify(props),
  };
}
