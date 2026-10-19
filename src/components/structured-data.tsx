import { siteConfig, siteUrl } from "@/config/site";
import { getContactEmail, getWhatsAppUrl } from "@/lib/contact";
import { faqs } from "@/data/content";

/**
 * Describes the business for search engines. Only facts that are configured
 * are included: no ratings, reviews or invented details.
 */
export function StructuredData() {
  const email = getContactEmail();
  const phone = getWhatsAppUrl() ? `+${siteConfig.contact.whatsappNumber.replace(/\D/g, "")}` : undefined;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        name: siteConfig.name,
        description: siteConfig.description,
        ...(siteUrl && { url: siteUrl, image: `${siteUrl}/opengraph-image` }),
        ...(email && { email }),
        ...(phone && { telephone: phone }),
        areaServed: { "@type": "Country", name: siteConfig.areaServed },
        founder: { "@type": "Person", name: siteConfig.ownerName },
        knowsAbout: ["Web design", "Website development", "Landing pages", "Technical SEO"],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
