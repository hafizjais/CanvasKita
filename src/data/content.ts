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

/** Extra services listed under the packages as "Also available". */
export const services: Service[] = [
  {
    title: "Maintenance & Updates",
    description:
      "Content changes, small improvements and routine checks, within a scope agreed in advance.",
    suitedTo: "Sites that need regular changes",
    includes: ["Content & image updates", "Small feature changes", "Routine checks", "Agreed scope & response"],
  },
  {
    title: "SEO & Performance",
    description:
      "Technical foundations that help search engines understand your site and pages load quickly. Rankings are never guaranteed.",
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
      "Business and company websites, landing pages for a specific offer or campaign, and online stores and booking websites. My portfolio covers corporate services, property and financial services, and the same approach works for most service businesses.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "It depends on the number of pages, the content, and any features or integrations you need. After a short conversation about your requirements you will receive a written quotation with the scope and deliverables, before any work begins.",
  },
  {
    question: "How long does it take to build my website?",
    answer:
      "Most standard websites take around 1–2 weeks once the project is confirmed and the required materials are ready. More complex websites may require additional time. Your estimated timeline will be stated in the quotation.",
  },
  {
    question: "How does payment work?",
    answer:
      "Typically, a 50% deposit is required to begin the project, with the remaining 50% payable after approval and before the website goes live. The written quotation confirms the payment terms for your project.",
  },
  {
    question: "What do you need from me before starting?",
    answer:
      "I may need your logo, business information, website content, images, contact details and any relevant product or service information. I'll confirm the requirements before development begins.",
  },
  {
    question: "How many revisions are included?",
    answer:
      "Two revision rounds are included in the standard scope unless your quotation specifies otherwise. Additional pages, features or requests outside the agreed requirements may be quoted separately.",
  },
  {
    question: "What is the 14-day hypercare period?",
    answer:
      "It is a 14-day support period after launch for reporting bugs related to the agreed website functionality. It does not automatically include new features or ongoing maintenance.",
  },
  {
    question: "Are domain and hosting included in the website price?",
    answer:
      "A custom domain is included with every website. Hosting arrangements depend on your project and will be outlined in your quotation. Any annual renewals and third-party charges will be explained separately.",
  },
  {
    question: "What happens after the first year?",
    answer:
      "Your domain and hosting may need to be renewed annually. I'll explain the relevant renewal dates and charges for your setup. Optional website maintenance can be arranged separately.",
  },
  {
    question: "Will the website work on mobile devices?",
    answer:
      "Yes. Every site is designed to be responsive and is checked on phone, tablet and desktop screen sizes before launch.",
  },
  {
    question: "Can I request changes after handover?",
    answer:
      "Yes. You can request additional updates or discuss an ongoing maintenance arrangement. New features and changes outside the original scope may incur additional charges.",
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
