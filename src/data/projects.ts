/**
 * Portfolio projects. The homepage, case-study pages, footer and sitemap all
 * read from this list, so adding a project here adds it everywhere.
 *
 * Content rules used here:
 * - Descriptions and features describe what is visible on the live site.
 * - No results, traffic figures, budgets, timelines or client quotes.
 * - `contribution` is left empty until you confirm your exact role. Sections
 *   that depend on it are hidden while it is empty.
 */

export type ProjectRelationship = "client" | "own" | "unconfirmed";

export type Project = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  category: string;
  industry: string;
  /** Who the website is for. "unconfirmed" shows no label. */
  relationship: ProjectRelationship;
  language?: string;
  /** One sentence for cards and metadata. */
  summary: string;
  overview: string;
  objective?: string;
  features: string[];
  /** Observations about the design and content, shown as "Design notes". */
  designNotes: string[];
  /** TODO: confirm what you were responsible for, e.g. "Design", "Development". */
  contribution: string[];
  platform?: string;
  images: {
    desktop: string;
    mobile: string;
    long: { src: string; width: number; height: number };
    og: string;
  };
};

const imagesFor = (slug: string, longHeight: number) => ({
  desktop: `/work/${slug}/desktop.webp`,
  mobile: `/work/${slug}/mobile.webp`,
  long: { src: `/work/${slug}/desktop-full.webp`, width: 1200, height: longHeight },
  og: `/work/${slug}/og.jpg`,
});

export const projects: Project[] = [
  {
    slug: "magna-ibn",
    name: "MAGNA IBN",
    domain: "magnaibn.com.my",
    url: "https://magnaibn.com.my",
    category: "Corporate Services",
    industry: "Halal consultancy & corporate services",
    relationship: "unconfirmed", // TODO: set to "client" once confirmed
    summary:
      "A corporate website for a Malaysian Halal consultancy, presenting its training, consultation and Halal trade services to business clients.",
    overview:
      "MAGNA IBN SDN. BHD. provides Halal consultation, training and coaching, alongside Halal product trading and import and export support. Its customers are businesses (manufacturers, F&B operators and service providers) that need to understand and maintain Halal compliance, so the website has to explain a specialist offer and establish credibility before the first conversation.",
    objective:
      "Present a broad B2B service range in one place and give prospective clients the background they need to trust the company.",
    features: [
      "Multi-page structure covering the company, services, target market, certificates, training, news, gallery, FAQs and contact",
      "Dedicated section for Halal industry training programmes",
      "Industries-served overview, from food & beverage to pharmaceuticals and logistics",
      "Language selector for visitors who prefer to read in another language",
    ],
    designNotes: [
      "Credentials and affiliations are introduced early, which matters to business buyers in a compliance-driven industry.",
      "Services are grouped by what the client needs (training, consultation, trade, R&D) rather than by internal departments.",
    ],
    contribution: [],
    platform: "WordPress (Elementor)",
    images: imagesFor("magna-ibn", 1250),
  },
  {
    slug: "balqismj-property",
    name: "BalqisMJ Property",
    domain: "balqismjproperty.com",
    url: "https://balqismjproperty.com",
    category: "Property & Real Estate",
    industry: "Property agent, Johor Bahru",
    relationship: "unconfirmed", // TODO: set to "client" once confirmed
    summary:
      "A property website for a Johor Bahru agent that brings subsale, rental, new-project, shop-lot and land listings into one searchable site.",
    overview:
      "BalqisMJ Property is the online home of Nurul Balqis, a property agent serving Johor Bahru and the wider Iskandar Malaysia region. Buyers and tenants can browse listings by property type, search by location, and contact the agent directly from almost any point on the site.",
    objective:
      "Give buyers and tenants a single place to search across property types, and make contacting the agent effortless.",
    features: [
      "Category-led navigation for subsale, rental, new projects, shop lots and land",
      "Homepage search with location keywords and popular-area shortcuts",
      "Featured listings showing price, built-up size, bedrooms and bathrooms",
      "Several direct contact routes: WhatsApp, Telegram channels, phone and email",
      "Property calculator page and agency registration details",
    ],
    designNotes: [
      "Search sits in the first screen, so visitors who already know the area or property type they want can start straight away.",
      "Contact options repeat throughout the page, so a visitor who finds a suitable listing never has to scroll back to get in touch.",
    ],
    contribution: [],
    images: imagesFor("balqismj-property", 2000),
  },
  {
    slug: "haven-space-property",
    name: "Haven Space Property",
    domain: "haven-space-property.vercel.app",
    url: "https://haven-space-property.vercel.app/",
    category: "Property & Rental",
    industry: "Co-living room rentals, Johor Bahru",
    relationship: "unconfirmed", // TODO: "client" or "own"
    summary:
      "A room-rental catalogue for co-living houses near UTM Skudai and Kangkar Pulai, so students and professionals can find an available room and enquire quickly.",
    overview:
      "Haven Space Property rents fully furnished rooms across several co-living houses in the Skudai and Kangkar Pulai area. The website works as a live catalogue: visitors browse available rooms, compare houses and their facilities, then enquire about a specific room on WhatsApp.",
    objective:
      "Reduce back-and-forth messages by letting prospective tenants see availability, prices and facilities before they enquire.",
    features: [
      "Room search from the homepage",
      "Available-room cards with monthly rent, house, room type and bed size",
      "House-by-house overview with room counts, current availability and facilities",
      "A WhatsApp button on every room, next to 'View details'",
    ],
    designNotes: [
      "Available rooms appear straight after the search, answering a prospective tenant's first question: is anything free?",
      "A warm, calm palette and photographs of the actual rooms suit a decision about where to live.",
    ],
    contribution: [],
    images: imagesFor("haven-space-property", 2000),
  },
  {
    slug: "financial-hafiz",
    name: "Financial Hafiz",
    domain: "financialhafiz.vercel.app",
    url: "https://financialhafiz.vercel.app/",
    category: "Financial Services",
    industry: "Debt-consolidation enquiries, lead generation",
    relationship: "own",
    language: "Bahasa Malaysia",
    summary:
      "A Bahasa Malaysia landing page for my own financial-services work, designed to help visitors understand debt consolidation and start an informed WhatsApp conversation.",
    overview:
      "Financial Hafiz is my own lead-generation page for debt-consolidation discussions. Financial topics call for care: the page explains the concept in plain language, is upfront that any financing depends on eligibility and lender approval, and gives visitors low-pressure ways to begin a conversation.",
    objective:
      "Turn visitors with heavy monthly commitments into informed WhatsApp enquiries, without overpromising outcomes.",
    features: [
      "Situation checklist: the options a visitor ticks are added to their WhatsApp message",
      "'Debt Snapshot' estimator that calculates in the browser and only shares a summary if the visitor chooses to",
      "Before-and-after explainer showing how consolidation works",
      "Four-step process, FAQ, disclaimers and a privacy notice beside the calls to action",
    ],
    designNotes: [
      "Every call to action leads to WhatsApp, the channel this audience already uses, and arrives with useful context pre-filled.",
      "Disclaimers sit beside the claims they qualify instead of being hidden in the footer, which builds trust in a sensitive category.",
    ],
    contribution: [],
    images: imagesFor("financial-hafiz", 2000),
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const relationshipLabel: Record<ProjectRelationship, string | null> = {
  client: "Client project",
  own: "Own project",
  unconfirmed: null,
};
