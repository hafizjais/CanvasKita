/**
 * Central site configuration.
 *
 * Everything a visitor can use to contact you lives here. Values left as an
 * empty string are treated as "not configured": the related buttons and links
 * are hidden, and visitors are routed to the enquiry form instead. Nothing is
 * ever rendered as a broken link.
 */

export const siteConfig = {
  name: "Hafiz MJ Digital",
  ownerName: "Hafiz Jais",
  shortName: "Hafiz",
  tagline: "Your Business Deserves a Better Website.",
  description:
    "Hafiz MJ Digital designs and builds fast, mobile-friendly business websites and lead-generation landing pages for SMEs, consultants and service businesses in Malaysia.",
  positioning:
    "Hafiz MJ Digital helps businesses establish a professional online presence through thoughtfully designed, fast, mobile-friendly websites built around their business goals.",
  areaServed: "Malaysia",
  locale: "en_MY",

  contact: {
    email: "studiopeacecraft@gmail.com",
    whatsappNumber: "601163063150",
    whatsappMessage:
      "Hi Hafiz, I found your website and I'd like to discuss a website project for my business.",
  },

  // TODO: add full profile URLs to show them in the footer. Leave "" to hide.
  social: {
    linkedin: "",
    instagram: "",
    facebook: "",
    threads: "",
  },

  // Shown on the privacy page.
  privacyLastUpdated: "19 October 2026",
} as const;

/**
 * Production URL, e.g. "https://hafizmjdigital.com" (no trailing slash).
 * Set NEXT_PUBLIC_SITE_URL in your hosting environment. Until it is set, the
 * site asks search engines not to index it.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

export const isIndexable =
  Boolean(siteUrl) &&
  (process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true);

export const metadataBase = new URL(siteUrl || "http://localhost:3000");

/** Options shown in the enquiry form. Edit freely. */
export const enquiryOptions = {
  websiteTypes: [
    "New business website",
    "Landing page",
    "Website redesign",
    "Maintenance & updates",
    "SEO & performance improvements",
    "Not sure yet",
  ],
  budgets: [
    "Under RM2,000",
    "RM2,000 – RM5,000",
    "RM5,000 – RM10,000",
    "Above RM10,000",
    "Not sure yet",
  ],
  timelines: [
    "As soon as possible",
    "Within 1 month",
    "1 – 3 months",
    "Flexible",
  ],
} as const;
