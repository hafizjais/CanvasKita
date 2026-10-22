/**
 * Website package catalogue: the wording in the Services comparison and the estimator.
 * Prices and limits come from src/config/pricing.ts, never from here.
 */

import { packageIds, type PackageId } from "@/config/pricing";

export type ServicePackage = {
  id: PackageId;
  summary: string;
  features: string[];
  /** Small print shown under the features. */
  note?: string;
};

export const servicePackages: Record<PackageId, ServicePackage> = {
  landing: {
    id: "landing",
    summary: "One focused page that explains a single offer and makes it easy to get in touch.",
    features: [
      "One responsive landing page",
      "Up to seven content sections",
      "WhatsApp call to action and enquiry form",
      "Basic on-page SEO",
    ],
  },
  portfolio: {
    id: "portfolio",
    summary: "A personal or studio site that introduces you and presents your best work.",
    features: ["Up to five pages", "About page and project showcase", "Social and contact links", "Responsive design"],
  },
  business: {
    id: "business",
    summary: "A professional company website that explains what you do and turns visitors into enquiries.",
    features: [
      "Up to five pages",
      "Services, About and Contact pages",
      "WhatsApp integration and contact form",
      "Basic on-page SEO",
    ],
  },
  ecommerce: {
    id: "ecommerce",
    summary: "A starter online store on an established commerce platform, ready to take orders.",
    features: [
      "Starter online store",
      "Up to ten initial product listings",
      "Platform cart and checkout",
      "One payment gateway and basic shipping setup",
    ],
    note: "Payment and shipping setup depend on what the chosen platform supports.",
  },
  booking: {
    id: "booking",
    summary: "A website where customers can check availability and book or reserve online.",
    features: [
      "Up to five pages",
      "One standard booking or reservation integration",
      "Availability selection",
      "Basic confirmation workflow",
    ],
    note: "Complex scheduling and additional payment integrations are quoted separately.",
  },
  custom: {
    id: "custom",
    summary:
      "Portals, dashboards, internal tools and integrations built around how your business actually works.",
    features: ["Bespoke requirements", "Discovery and technical scope review", "Detailed written quotation"],
    note: "The starting price is a guide only. Every custom project is quoted after a scope review.",
  },
};

/** Display order in the Services comparison: cheapest first (see packageIds in pricing.ts). */
export const packageOrder: PackageId[] = packageIds;
