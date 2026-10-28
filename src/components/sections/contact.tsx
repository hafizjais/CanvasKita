import { ArrowDown, Mail } from "lucide-react";
import { ContactCta } from "@/components/contact-cta";
import { EnquiryForm } from "@/components/enquiry-form";
import { buttonClasses } from "@/components/ui/button";
import { getContactEmail, getWhatsAppUrl } from "@/lib/contact";
import { track } from "@/lib/analytics";

const nextSteps = [
  "I read your message and reply personally.",
  "We talk through your goals, requirements and any questions.",
  "You receive a written quotation with the scope and deliverables.",
];

export function Contact() {
  const hasWhatsApp = Boolean(getWhatsAppUrl());
  const email = getContactEmail();

  return (
    <section id="contact" aria-labelledby="contact-title" className="on-dark bg-charcoal text-on-dark">
      <div className="container-page grid gap-14 py-20 sm:py-28 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 id="contact-title" className="text-[2.4rem] leading-[1.03] font-semibold sm:text-[3.4rem]">
            Let&rsquo;s build something your business can be proud of.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-on-dark-muted">
            Tell me a little about your business and what you need. We&rsquo;ll discuss the right approach for your
            project.
          </p>

          <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <ContactCta location="final_cta" fallback="none" />
            <a
              href="#enquiry"
              className={buttonClasses(hasWhatsApp ? "ghost-light" : "accent", "lg")}
              {...track("cta_click", { location: "final_cta", label: "Send a Project Enquiry" })}
            >
              Send a Project Enquiry
              <ArrowDown aria-hidden="true" className="size-4 lg:hidden" />
            </a>
          </div>

          {email && (
            <p className="mt-6 flex items-center gap-2 text-on-dark-muted">
              <Mail aria-hidden="true" className="size-4" />
              <a href={`mailto:${email}`} className="link-underline text-on-dark">
                {email}
              </a>
            </p>
          )}

          <div className="mt-12 border-t border-line-dark pt-8">
            <h3 className="text-sm font-semibold tracking-[0.1em] text-on-dark-muted uppercase">What happens next</h3>
            <ol className="mt-5 space-y-4">
              {nextSteps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span aria-hidden="true" className="w-6 shrink-0 pt-0.5 font-display text-sm font-semibold text-accent-bright">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed text-on-dark/90">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div id="enquiry" className="lg:col-span-7 lg:pl-6">
          <h3 className="sr-only">Project enquiry form</h3>
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
