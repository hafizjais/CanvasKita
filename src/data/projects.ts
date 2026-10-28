/**
 * Portfolio projects shown as cards in the "Selected work" section and listed
 * in the footer. Each card links straight to the live website.
 *
 * Describe only what is visible on the live site: no results, traffic
 * figures, budgets or client quotes.
 */

export type Project = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  category: string;
  industry: string;
  /** Client work, or a site for one of your own businesses. Shown on the card. */
  type: "client" | "own";
  language?: string;
  /** One or two sentences shown on the card. */
  summary: string;
  images: {
    /** 1440×900 homepage screenshot. */
    desktop: string;
    /** 780×1688 mobile screenshot. */
    mobile: string;
  };
};

const imagesFor = (slug: string) => ({
  desktop: `/work/${slug}/desktop.webp`,
  mobile: `/work/${slug}/mobile.webp`,
});

export const projects: Project[] = [
  {
    slug: "magna-ibn",
    name: "MAGNA IBN",
    domain: "magnaibn.com.my",
    url: "https://magnaibn.com.my",
    category: "Corporate Services",
    industry: "Halal consultancy & corporate services",
    summary:
      "A corporate website for a Malaysian Halal consultancy, presenting its training, consultation and Halal trade services to business clients.",
    type: "client",
    images: imagesFor("magna-ibn"),
  },
  {
    slug: "balqismj-property",
    name: "BalqisMJ Property",
    domain: "balqismjproperty.com",
    url: "https://balqismjproperty.com",
    category: "Property & Real Estate",
    industry: "Property agent, Johor Bahru",
    summary:
      "A property website for a Johor Bahru agent that brings subsale, rental, new-project, shop-lot and land listings into one searchable site.",
    type: "client",
    images: imagesFor("balqismj-property"),
  },
  {
    slug: "haven-space-property",
    name: "Haven Space Property",
    domain: "haven-space-property.vercel.app",
    url: "https://haven-space-property.vercel.app/",
    category: "Property & Rental",
    industry: "Co-living room rentals, Johor Bahru",
    summary:
      "A room-rental catalogue for co-living houses near UTM Skudai and Kangkar Pulai, so students and professionals can find an available room and enquire quickly.",
    type: "client",
    images: imagesFor("haven-space-property"),
  },
  {
    slug: "financial-hafiz",
    name: "Financial Hafiz",
    domain: "financialhafiz.vercel.app",
    url: "https://financialhafiz.vercel.app/",
    category: "Financial Services",
    industry: "Debt-consolidation enquiries, lead generation",
    language: "Bahasa Malaysia",
    summary:
      "A Bahasa Malaysia landing page that helps visitors understand debt consolidation and start an informed WhatsApp conversation.",
    type: "own",
    images: imagesFor("financial-hafiz"),
  },
  {
    slug: "bakawali-spa",
    name: "Bakawali Spa",
    domain: "bakawalispa.vercel.app",
    url: "https://bakawalispa.vercel.app/en",
    category: "Spa & Wellness",
    industry: "Malay spa, Taman Universiti, Skudai",
    language: "English & Bahasa Malaysia",
    summary:
      "A bilingual website for a Malay spa, listing every treatment and package with its price and sending visitors to online booking.",
    type: "client",
    images: imagesFor("bakawali-spa"),
  },
];

export const projectTypeLabel = { client: "Client project", own: "Own project" } as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
