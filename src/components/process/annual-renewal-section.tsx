import { CalendarClock, Globe, Server, Wrench, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { renewal, renewalAssistanceLine } from "@/config/renewal";
import { getWhatsAppUrl } from "@/lib/contact";
import { track } from "@/lib/analytics";

const icons: Record<string, LucideIcon> = { domain: Globe, hosting: Server, maintenance: Wrench };

export function AnnualRenewalSection() {
  const assistance = renewalAssistanceLine();
  const whatsappUrl = getWhatsAppUrl(renewal.cta.whatsappMessage);

  return (
    <div
      aria-labelledby="renewal-title"
      role="group"
      className="mt-20 rounded-2xl bg-charcoal p-7 text-on-dark sm:p-10 lg:p-12 on-dark"
    >
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <CalendarClock aria-hidden="true" className="size-6 text-accent-bright" />
          <h3 id="renewal-title" className="text-[1.8rem] leading-tight font-semibold sm:text-4xl">
            {renewal.title}
          </h3>
        </div>
        <p className="mt-4 leading-relaxed text-on-dark-muted">{renewal.description}</p>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {renewal.items.map((item) => {
          const Icon = icons[item.id];
          return (
            <li key={item.id} className="rounded-xl border border-line-dark p-5">
              <Icon aria-hidden="true" className="size-5 text-accent-bright" />
              <p className="mt-3 font-display text-lg font-semibold">{item.title}</p>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-on-dark-muted">{item.body}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 max-w-2xl space-y-3 text-[0.95rem] leading-relaxed text-on-dark-muted">
        {assistance && (
          <p>
            <span className="font-semibold text-on-dark">{assistance}</span> {renewal.assistance.disclaimer}
          </p>
        )}
        <p>{renewal.note}</p>
      </div>

      <div className="mt-8">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("ghost-light", "md", "h-auto min-h-11 py-2.5 text-center")}
            {...track("whatsapp_click", { location: "renewal" })}
          >
            {renewal.cta.label}
            <span className="sr-only">(opens WhatsApp in a new tab)</span>
          </a>
        ) : (
          <Link
            href="/#enquiry"
            className={buttonClasses("ghost-light", "md", "h-auto min-h-11 py-2.5 text-center")}
            {...track("cta_click", { location: "renewal", label: renewal.cta.label })}
          >
            {renewal.cta.label}
          </Link>
        )}
      </div>
    </div>
  );
}
