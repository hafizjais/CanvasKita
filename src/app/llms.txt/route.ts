import { packageIds, pricing } from "@/config/pricing";
import { metadataBase, siteConfig } from "@/config/site";
import { faqs, services } from "@/data/content";
import { getContactEmail, getWhatsAppUrl } from "@/lib/contact";

// llms.txt (https://llmstxt.org): a Markdown summary of the site for AI tools,
// generated from the same data as the pages so it never drifts out of date.
// It reads no request data, so it is prerendered at build time.

const url = (path: string) => new URL(path, metadataBase).toString();
const rm = (amount: number) => `RM${amount.toLocaleString("en-MY")}`;

export function GET() {
  const email = getContactEmail();
  const whatsapp = getWhatsAppUrl();

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${siteConfig.positioning} Run by ${siteConfig.ownerName}, serving clients across ${siteConfig.areaServed}.`,
    "",
    "## Key pages",
    "",
    `- [Home](${url("/")}): services, website packages, selected projects, process, FAQs and contact.`,
    `- [Get a quote](${url("/get-quote")}): estimate the price of a website by package, pages and add-ons, then send the request.`,
    `- [Privacy policy](${url("/privacy")}): how enquiry details are handled.`,
    "",
    "## Website packages (starting prices)",
    "",
    ...packageIds.map((id) => {
      const pkg: { name: string; basePrice: number; timelineWeeks: readonly [number, number] | null } =
        pricing.packages[id];
      const timeline = pkg.timelineWeeks
        ? `, typically ${pkg.timelineWeeks[0]}–${pkg.timelineWeeks[1]} weeks from receipt of content`
        : "";
      return `- ${pkg.name}: from ${rm(pkg.basePrice)}${timeline}.`;
    }),
    "",
    "## Services for existing websites",
    "",
    ...services.map((service) => `- ${service.title}: ${service.description}`),
    "",
    "## Contact",
    "",
    `- Enquiry form: ${url("/#contact")}`,
    ...(email ? [`- Email: ${email}`] : []),
    ...(whatsapp ? [`- WhatsApp: ${whatsapp.split("?")[0]}`] : []),
    "",
    "## FAQs",
    "",
    ...faqs.flatMap((faq) => [`### ${faq.question}`, "", faq.answer, ""]),
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
