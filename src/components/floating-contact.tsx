"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, PenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { getWhatsAppUrl } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";

/**
 * A small, persistent contact shortcut. It appears once the visitor scrolls
 * past the first screen and hides while the contact section is visible.
 */
export function FloatingContact() {
  const [pastHero, setPastHero] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const whatsappUrl = getWhatsAppUrl();
  // The estimator has its own WhatsApp and enquiry actions, and a floating
  // button there could cover its Back/Next controls on phones.
  const hidden = usePathname().startsWith("/get-quote");

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contact = document.getElementById("contact");
    const observer = contact
      ? new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { threshold: 0.05 })
      : null;
    if (contact) observer?.observe(contact);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const visible = pastHero && !contactVisible && !hidden;
  const common = `fixed right-4 bottom-4 z-30 print:hidden inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-paper shadow-[0_12px_30px_-10px_rgba(22,21,19,0.6)] transition-[opacity,transform,background-color] duration-300 hover:bg-accent sm:right-6 sm:bottom-6 ${
    visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
  }`;

  if (whatsappUrl) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={common}
        tabIndex={visible ? undefined : -1}
        aria-hidden={!visible}
        onClick={() => trackEvent("whatsapp_click", { location: "floating" })}
      >
        <MessageCircle aria-hidden="true" className="size-4" />
        WhatsApp
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link
      href="/#enquiry"
      className={common}
      tabIndex={visible ? undefined : -1}
      aria-hidden={!visible}
      onClick={() => trackEvent("cta_click", { location: "floating", label: "Enquire" })}
    >
      <PenLine aria-hidden="true" className="size-4" />
      Enquire
    </Link>
  );
}
