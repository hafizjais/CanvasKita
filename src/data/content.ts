/**
 * Homepage copy that is likely to change: services, benefits, process, FAQs,
 * credentials and testimonials. Edit the text here rather than in components.
 */

export type Service = {
  title: string;
  description: string;
  suitedTo: string;
  includes: string[];
};

export const services: Service[] = [
  {
    title: "Business Website Design & Development",
    description:
      "A professional multi-page website that explains what you do, who you help and how to get in touch.",
    suitedTo: "Companies, consultants and service providers",
    includes: ["Site structure & page planning", "Custom design", "Responsive build", "Contact & WhatsApp integration"],
  },
  {
    title: "Landing Page Development",
    description:
      "A focused page built around one offer or campaign, designed to explain it clearly and encourage enquiries.",
    suitedTo: "Campaigns, lead generation and single services",
    includes: ["Offer-led copy structure", "Clear calls to action", "Enquiry or WhatsApp flow", "Fast loading on mobile"],
  },
  {
    title: "Website Redesign",
    description:
      "Improve how an existing website looks, reads and works, especially on phones, without losing what already works.",
    suitedTo: "Businesses with an outdated or hard-to-use site",
    includes: ["Review of the current site", "Clearer navigation", "Refreshed design", "Mobile improvements"],
  },
  {
    title: "Website Maintenance & Updates",
    description:
      "Practical ongoing support: content changes, small improvements and checks, within a scope we agree in advance.",
    suitedTo: "Sites that need regular changes",
    includes: ["Content & image updates", "Small feature changes", "Routine checks", "Agreed scope & response"],
  },
  {
    title: "Basic SEO & Performance Optimisation",
    description:
      "Technical foundations that help search engines understand your site and help pages load quickly. Rankings are never guaranteed.",
    suitedTo: "New sites and slow or poorly structured sites",
    includes: ["Page titles & metadata", "Heading structure", "Image optimisation", "Speed improvements"],
  },
];

export const benefits = [
  {
    title: "You speak to the person building your site",
    body: "No account managers or hand-offs. Questions, feedback and decisions go straight to me.",
  },
  {
    title: "Designed around your business",
    body: "Structure, copy and design follow your customers and goals, not a one-size-fits-all template.",
  },
  {
    title: "Clear scope and deliverables",
    body: "Before work starts you know what is included, what is not, and what you will receive.",
  },
  {
    title: "Works on every screen",
    body: "Pages are designed for phones first, then tablets and desktops, and checked on each.",
  },
  {
    title: "Built to be used",
    body: "Usability, loading speed and clear calls to action get as much attention as the visuals.",
  },
  {
    title: "Support through handover",
    body: "Help during the agreed project and a proper handover, so you know how your site works.",
  },
];

export const processSteps = [
  {
    title: "Discover",
    body: "We talk through your business, your customers, your requirements and what the website needs to achieve.",
  },
  {
    title: "Plan & Design",
    body: "I set out the site structure, content priorities and visual direction for you to review before building.",
  },
  {
    title: "Build & Refine",
    body: "I develop the website, check how it works, and make the revisions we agreed on.",
  },
  {
    title: "Launch & Handover",
    body: "The site goes live, essential functions are checked, and you receive the agreed handover.",
  },
];

export const faqs = [
  {
    question: "What types of websites do you build?",
    answer:
      "Business and company websites, landing pages for a specific offer or campaign, and redesigns of existing websites. My portfolio covers corporate services, property and financial services, and the same approach works for most service businesses.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "It depends on the number of pages, the content, and any features or integrations you need. After a short conversation about your requirements you will receive a written quotation with the scope and deliverables, before any work begins.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "It depends on the scope and on how quickly content and feedback are ready. A focused landing page is usually quicker than a multi-page site with listings or custom features. Your quotation includes an estimated schedule.",
  },
  {
    question: "Do you provide domain and hosting setup?",
    answer:
      "I can advise on a suitable domain and hosting and help set them up, or work with what you already have. We confirm the arrangement in your quotation.",
  },
  {
    question: "Can you redesign an existing website?",
    answer:
      "Yes. I start by reviewing what works on your current site and what doesn't, then propose changes to structure, design and mobile experience. Some sites can be improved; others are better rebuilt, and I'll explain which applies to yours.",
  },
  {
    question: "Will the website work on mobile devices?",
    answer:
      "Yes. Every site is designed to be responsive and is checked on phone, tablet and desktop screen sizes before launch.",
  },
  {
    question: "Can I update the website after launch?",
    answer:
      "Yes. Depending on how the site is built, you can either edit content yourself or ask me to make changes. We agree which approach suits you during planning.",
  },
  {
    question: "Do you provide maintenance and support?",
    answer:
      "Ongoing maintenance and updates are available as a separate arrangement, with the scope agreed in advance.",
  },
  {
    question: "How do I start a project?",
    answer:
      "Send a message on WhatsApp or fill in the enquiry form with a short description of your business and what you need. I'll reply to arrange a conversation about your requirements.",
  },
];

/**
 * Qualifications shown in the About section. Only add items you can support
 * with a certificate. The block is hidden while this list is empty.
 * Example: { title: "Certificate name", issuer: "Issuing body", year: "2026" }
 */
export const credentials: { title: string; issuer: string; year?: string }[] = [];

/**
 * Genuine client testimonials only, used with the client's permission.
 * The section is hidden while this list is empty.
 * Example: { quote: "…", name: "Client name", role: "Role, Company" }
 */
export const testimonials: { quote: string; name: string; role?: string }[] = [];
