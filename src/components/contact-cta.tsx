import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { getWhatsAppUrl } from "@/lib/contact";
import { track } from "@/lib/analytics";

type Props = {
  location: string;
  label?: string;
  /** Pre-filled WhatsApp message; defaults to the site-wide greeting. */
  message?: string;
  variant?: Parameters<typeof buttonClasses>[0];
  size?: Parameters<typeof buttonClasses>[1];
  className?: string;
  /** What to render without a WhatsApp number: a link to the form, or nothing. */
  fallback?: "form" | "none";
};

/**
 * Primary contact button. Opens WhatsApp when a number is configured and
 * falls back to the enquiry form when it isn't, so it never leads nowhere.
 */
export function ContactCta({
  location,
  label = "Start a WhatsApp Conversation",
  message,
  variant = "accent",
  size = "lg",
  className = "",
  fallback = "form",
}: Props) {
  const whatsappUrl = getWhatsAppUrl(message);

  if (!whatsappUrl) {
    if (fallback === "none") return null;
    return (
      <Link
        href="/#enquiry"
        className={buttonClasses(variant, size, className)}
        {...track("cta_click", { location, label: "Send a Project Enquiry" })}
      >
        Send a Project Enquiry
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses(variant, size, className)}
      {...track("whatsapp_click", { location })}
    >
      <MessageCircle aria-hidden="true" className="size-[1.1rem]" />
      {label}
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  );
}
