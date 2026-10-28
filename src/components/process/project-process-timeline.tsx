import Link from "next/link";
import { ContactCta } from "@/components/contact-cta";
import { ProcessStep } from "@/components/process/process-step";
import { buttonClasses } from "@/components/ui/button";
import { processCta, processIntro, projectStages } from "@/data/project-process";
import { getWhatsAppUrl } from "@/lib/contact";
import { track } from "@/lib/analytics";

export function ProjectProcessTimeline() {
  const hasWhatsApp = Boolean(getWhatsAppUrl());

  return (
    <div>
      <div className="max-w-2xl">
        <h2 id="process-title" className="text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
          {processIntro.title}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">{processIntro.body}</p>
      </div>

      <ol className="mt-14 max-w-3xl">
        {projectStages.map((stage, index) => (
          <ProcessStep key={stage.id} stage={stage} number={index + 1} />
        ))}
      </ol>

      <div className="mt-14 flex flex-col gap-6 rounded-2xl border border-ink/12 bg-card p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
        <h3 className="text-2xl font-semibold sm:text-3xl">{processCta.title}</h3>
        <div className="flex shrink-0 flex-col gap-3 xs:flex-row">
          {hasWhatsApp ? (
            <ContactCta
              location="process"
              label={processCta.primary}
              message={processCta.whatsappMessage}
              size="md"
              variant="primary"
            />
          ) : (
            <Link
              href="/#enquiry"
              className={buttonClasses("primary", "md")}
              {...track("cta_click", { location: "process", label: processCta.primary })}
            >
              {processCta.primary}
            </Link>
          )}
          <Link
            href="/get-quote"
            className={buttonClasses("secondary", "md")}
            {...track("cta_click", { location: "process", label: processCta.secondary })}
          >
            {processCta.secondary}
          </Link>
        </div>
      </div>
    </div>
  );
}
