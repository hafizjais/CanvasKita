/**
 * Pricing configuration for the website packages and the quotation estimator.
 *
 * Every figure the site shows or calculates comes from this file. Amounts are
 * whole Malaysian ringgit (RM). The calculator converts them to sen internally
 * so totals are always exact.
 *
 * Imports in src/lib/quote use explicit ".ts" extensions so the unit tests can
 * run directly with Node (npm test).
 */

export type PackageId = "landing" | "portfolio" | "business" | "ecommerce" | "booking";

export type AddOnId =
  | "copywriting"
  | "secondLanguage"
  | "blogCms"
  | "enhancedSeo"
  | "googleAnalytics"
  | "metaPixel"
  | "newsletterCrm"
  | "paymentGateway"
  | "maintenance";

export type PackagePricing = {
  name: string;
  /** Starting price in RM. */
  basePrice: number;
  /** Standard content pages included in the base price. */
  includedPages: number;
  /** Most pages the estimator accepts for this package; larger sites need a manual quote. */
  maxPages: number;
  /** Initial product listings included (e-commerce only). */
  includedProducts: number;
  /** Indicative delivery time in weeks, from receipt of content. */
  timelineWeeks: [min: number, max: number] | null;
  /** Add-ons already part of this package, so they are never charged twice. */
  includedAddOns: AddOnId[];
};

export type AddOnPricing = {
  label: string;
  description: string;
  /**
   * fixed:   a one-time amount in RM
   * percent: a one-time percentage of the base package price
   * monthly: a recurring monthly amount in RM, never added to the project total
   */
  kind: "fixed" | "percent" | "monthly";
  amount: number;
  /** "from" pricing: the final amount is confirmed after review. */
  isStartingPrice?: boolean;
  /** For page-limited services: the most pages covered by the price. */
  coversPages?: number;
  /** Packages where the add-on can be selected. */
  availableFor: PackageId[];
};

const pricedPackages: PackageId[] = ["landing", "portfolio", "business", "ecommerce", "booking"];

export const pricing = {
  currency: "MYR",

  /**
   * Included with every package, and highlighted on the Services section, in
   * the estimator and on the printed estimate. Edit the wording freely.
   * `terms` is shown on the printed estimate; add the registration period and
   * renewal terms here once you've decided them.
   */
  customDomain: {
    label: "Custom domain included",
    description: "Every website comes with its own custom domain, such as yourbusiness.com.",
    terms: null as string | null,
  },

  /** Each standard content page beyond a package's included pages. */
  extraPagePrice: 30,

  /** E-commerce: product listings beyond those included, sold in blocks. */
  extraProducts: { blockSize: 10, price: 24, max: 200 },

  /** Optional faster delivery: a percentage of the one-time project subtotal. */
  expedited: {
    percent: 25,
    availableFor: ["landing", "portfolio", "business"] as PackageId[],
  },

  packages: {
    landing: {
      name: "Landing Page",
      basePrice: 280,
      includedPages: 1,
      maxPages: 1,
      includedProducts: 0,
      timelineWeeks: [1, 2],
      includedAddOns: [],
    },
    portfolio: {
      name: "Portfolio Website",
      basePrice: 350,
      includedPages: 5,
      maxPages: 30,
      includedProducts: 0,
      timelineWeeks: [2, 3],
      includedAddOns: [],
    },
    business: {
      name: "Business Website",
      basePrice: 680,
      includedPages: 5,
      maxPages: 30,
      includedProducts: 0,
      timelineWeeks: [3, 4],
      includedAddOns: [],
    },
    ecommerce: {
      name: "E-commerce Website",
      basePrice: 790,
      // Store pages (shop, product, cart, checkout) come with the platform;
      // this counts the standard content pages such as Home, About and Contact.
      includedPages: 5,
      maxPages: 30,
      includedProducts: 10,
      timelineWeeks: [4, 6],
      includedAddOns: ["paymentGateway"],
    },
    booking: {
      name: "Booking & Reservation Website",
      basePrice: 490,
      includedPages: 5,
      maxPages: 30,
      includedProducts: 0,
      timelineWeeks: [3, 5],
      includedAddOns: [],
    },
  } satisfies Record<PackageId, PackagePricing>,

  addOns: {
    copywriting: {
      label: "Copywriting",
      description: "Website copy written for up to five pages.",
      kind: "fixed",
      amount: 90,
      coversPages: 5,
      availableFor: pricedPackages,
    },
    secondLanguage: {
      label: "Second language support",
      description: "A second language version of the site. Translation is not included unless agreed.",
      kind: "percent",
      amount: 30,
      availableFor: pricedPackages,
    },
    blogCms: {
      label: "Blog / CMS setup",
      description: "A blog or editable content area you can update yourself.",
      kind: "fixed",
      amount: 70,
      availableFor: pricedPackages,
    },
    enhancedSeo: {
      label: "Enhanced on-page SEO",
      description: "Keyword-informed titles, descriptions, headings and structure for up to five pages.",
      kind: "fixed",
      amount: 80,
      coversPages: 5,
      availableFor: pricedPackages,
    },
    googleAnalytics: {
      label: "Google Analytics setup",
      description: "GA4 property, site tag and key events.",
      kind: "fixed",
      amount: 30,
      availableFor: pricedPackages,
    },
    metaPixel: {
      label: "Meta Pixel setup",
      description: "Pixel installed with standard events for Facebook and Instagram ads.",
      kind: "fixed",
      amount: 36,
      availableFor: pricedPackages,
    },
    newsletterCrm: {
      label: "Newsletter or CRM integration",
      description: "Connect forms to a mailing list or CRM. Final price depends on the platform.",
      kind: "fixed",
      amount: 60,
      isStartingPrice: true,
      availableFor: pricedPackages,
    },
    paymentGateway: {
      label: "Payment gateway setup",
      description: "One supported payment gateway, where the site's platform allows it.",
      kind: "fixed",
      amount: 80,
      availableFor: ["landing", "business", "booking"],
    },
    maintenance: {
      label: "Monthly maintenance plan",
      description: "Ongoing updates and checks within an agreed monthly scope.",
      kind: "monthly",
      amount: 30,
      availableFor: pricedPackages,
    },
  } satisfies Record<AddOnId, AddOnPricing>,

  /** Shown on the printed estimate. */
  estimate: {
    referencePrefix: "HMJ",
    validityDays: 14,
    // Set to null to say "confirmed in the formal quotation" instead.
    revisionRounds: 2 as number | null,
    postLaunchSupport: "14-day post-launch support for bugs in the agreed scope" as string | null,
  },

  exclusions: [
    "Web hosting fees",
    "Third-party software, platform, plugin or theme subscriptions (for example e-commerce platform plans)",
    "Payment gateway transaction and processing fees",
    "Translation services, unless explicitly agreed",
    "Copywriting, unless selected as an add-on",
    "Stock photography and other licensed assets",
    "Taxes, if applicable",
  ],

  assumptions: [
    "Prices are in Malaysian ringgit (MYR).",
    "A custom domain is included with every package. Its registration period and renewal terms are confirmed in the formal quotation.",
    "You provide content, images and feedback within the agreed schedule.",
    "Timelines are indicative and start once content has been received.",
    "Scope follows the package inclusions and selected options listed in this estimate.",
  ],
};

/** Packages from cheapest to most expensive. */
export const packageIds = (Object.keys(pricing.packages) as PackageId[]).sort(
  (a, b) => pricing.packages[a].basePrice - pricing.packages[b].basePrice,
);
export const addOnIds = Object.keys(pricing.addOns) as AddOnId[];
