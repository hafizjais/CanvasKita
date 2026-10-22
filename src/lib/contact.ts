import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Returns a wa.me link, or null when no valid number is configured. */
export function getWhatsAppUrl(message: string = siteConfig.contact.whatsappMessage) {
  return buildWhatsAppUrl(siteConfig.contact.whatsappNumber, message);
}

export function getContactEmail() {
  const email = siteConfig.contact.email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

export function getSocialLinks() {
  const labels: Record<keyof typeof siteConfig.social, string> = {
    linkedin: "LinkedIn",
    instagram: "Instagram",
    facebook: "Facebook",
    threads: "Threads",
  };
  return (Object.keys(labels) as (keyof typeof labels)[])
    .filter((key) => siteConfig.social[key].startsWith("https://"))
    .map((key) => ({ label: labels[key], href: siteConfig.social[key] }));
}
