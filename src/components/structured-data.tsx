import { packageIds, pricing } from "@/config/pricing";
import { siteConfig, siteUrl } from "@/config/site";
import { faqs, services } from "@/data/content";
import { getContactEmail, getSocialLinks, getWhatsAppUrl } from "@/lib/contact";

/**
 * Describes the business for search engines and AI agents. Only facts that are
 * configured are included: no ratings, reviews or invented details.
 */
export function StructuredData() {
  const email = getContactEmail();
  const phone = getWhatsAppUrl() ? `+${siteConfig.contact.whatsappNumber.replace(/\D/g, "")}` : undefined;
  // Filled from siteConfig.social; add profile URLs there to link the business to them.
  const sameAs = getSocialLinks().map((link) => link.href);
  const id = (fragment: string) => (siteUrl ? `${siteUrl}/#${fragment}` : `#${fragment}`);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        // Organization identifies the business; ProfessionalService (a LocalBusiness) says what it does.
        "@type": ["Organization", "ProfessionalService"],
        "@id": id("organization"),
        name: siteConfig.name,
        description: siteConfig.description,
        slogan: siteConfig.tagline,
        ...(siteUrl && {
          url: siteUrl,
          logo: `${siteUrl}/icon.svg`,
          image: `${siteUrl}/opengraph-image`,
        }),
        ...(email && { email }),
        ...(phone && { telephone: phone }),
        ...((email || phone) && {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            areaServed: "MY",
            availableLanguage: ["en", "ms"],
            ...(email && { email }),
            ...(phone && { telephone: phone }),
          },
        }),
        ...(sameAs.length > 0 && { sameAs }),
        areaServed: { "@type": "Country", name: siteConfig.areaServed },
        founder: { "@type": "Person", name: siteConfig.ownerName },
        knowsAbout: ["Web design", "Website development", "Landing pages", "Technical SEO"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Website packages and services",
          itemListElement: [
            ...packageIds.map((packageId) => {
              const pkg = pricing.packages[packageId];
              return {
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: pkg.name },
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "MYR",
                  minPrice: pkg.basePrice,
                },
              };
            }),
            ...services.map((service) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: service.title, description: service.description },
            })),
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": id("website"),
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "en-MY",
        ...(siteUrl && { url: siteUrl }),
        publisher: { "@id": id("organization") },
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
