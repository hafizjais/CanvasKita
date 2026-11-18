/**
 * Central site configuration.
 *
 * Everything a visitor can use to contact you lives here. Values left as an
 * empty string are treated as "not configured": the related buttons and links
 * are hidden, and visitors are routed to the enquiry form instead. Nothing is
 * ever rendered as a broken link.
 */

import { packageIds, pricing } from "@/config/pricing";
import { services } from "@/data/content";

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
    email: "hafizdigitalweb@gmail.com",
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
  // Sent as <lastmod> in the sitemap. Update when the homepage or quote page content changes.
  contentLastUpdated: "2026-11-18",

  // How AI systems may use the site's content (robots.txt Content-Signal).
  // search: show in search results; ai-input: use in AI answers that cite the
  // site; ai-train: use to train AI models.
  contentSignal: "search=yes, ai-input=yes, ai-train=no",
} as const;

/**
 * Production URL without a trailing slash. Uses NEXT_PUBLIC_SITE_URL when set
 * (e.g. "https://hafizmjdigital.com"); otherwise, on Vercel, the project's
 * production domain, which Vercel provides automatically. Off Vercel and
 * without the variable, the site asks search engines not to index it.
 */
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || vercelProductionUrl).replace(/\/$/, "");

export const isIndexable =
  Boolean(siteUrl) &&
  (process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true);

export const metadataBase = new URL(siteUrl || "http://localhost:3000");

/** The budget choice that lets a visitor type their own amount. */
export const BUDGET_OTHER = "Other (enter your own amount)";

/** Options shown in the enquiry form. */
export const enquiryOptions = {
  // The five website packages (cheapest first), the services for existing
  // websites, and a catch-all. Names come from pricing.ts and content.ts, so
  // the dropdown always matches the Services section.
  websiteTypes: [
    ...packageIds.map((id) => pricing.packages[id].name),
    ...services.map((service) => service.title),
    "Not sure yet",
  ],
  budgets: [
    "Under RM500",
    "RM500 – RM1,000",
    "RM1,000 – RM2,500",
    "Above RM2,500",
    "Not sure yet",
    BUDGET_OTHER,
  ],
  timelines: [
    "As soon as possible",
    "Within 1 month",
    "1 – 3 months",
    "Flexible",
  ],
} as const;
