import { ContactCta } from "@/components/contact-cta";
import { ProjectLinks } from "@/components/project-links";
import { BrowserFrame, PhoneFrame } from "@/components/ui/device-frames";
import { buttonClasses } from "@/components/ui/button";
import { getProject, relationshipLabel, type Project } from "@/data/projects";
import { track } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/contact";

function ProjectMeta({
  project,
  index,
  headingId,
  tone = "dark",
  featureCount = 3,
}: {
  project: Project;
  index: number;
  headingId: string;
  tone?: "dark" | "light";
  featureCount?: number;
}) {
  const muted = tone === "dark" ? "text-muted" : "text-on-dark-muted";
  const rule = tone === "dark" ? "border-ink/12" : "border-on-dark/15";
  const badge = relationshipLabel[project.relationship];

  return (
    <div>
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] font-semibold uppercase tracking-[0.12em] ${muted}`}>
        <span className={tone === "dark" ? "text-accent" : "text-accent-bright"}>{String(index).padStart(2, "0")}</span>
        <span>{project.category}</span>
        {badge && (
          <span className={`rounded-full border px-2 py-0.5 text-[0.68rem] tracking-[0.08em] ${rule}`}>{badge}</span>
        )}
      </div>
      <h3 id={headingId} className="mt-3 text-[1.85rem] leading-tight font-semibold sm:text-[2.1rem]">{project.name}</h3>
      <p className={`mt-1 text-sm ${muted}`}>
        {project.industry}
        {project.language ? ` · ${project.language}` : ""}
      </p>
      <p className={`mt-5 leading-relaxed ${tone === "dark" ? "text-graphite" : "text-on-dark/85"}`}>{project.summary}</p>
      <ul className={`mt-6 border-t text-[0.93rem] ${rule}`}>
        {project.features.slice(0, featureCount).map((feature) => (
          <li key={feature} className={`border-b py-2.5 ${rule} ${muted}`}>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <ProjectLinks project={project} tone={tone} />
      </div>
    </div>
  );
}

export function SelectedWork() {
  const magna = getProject("magna-ibn")!;
  const balqis = getProject("balqismj-property")!;
  const haven = getProject("haven-space-property")!;
  const financial = getProject("financial-hafiz")!;
  const hasWhatsApp = Boolean(getWhatsAppUrl());

  return (
    <section id="work" aria-labelledby="work-title" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">Selected work</p>
            <h2 id="work-title" className="mt-5 text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
              Selected work. Real businesses.
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-muted lg:col-span-5 lg:justify-self-end">
            A closer look at websites built for different industries, business needs and customer journeys.
          </p>
        </div>

        {/* 01: wide, screenshot leads */}
        <article aria-labelledby="project-magna" className="mt-16 grid gap-10 border-t border-ink/12 pt-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <BrowserFrame
              src={magna.images.desktop}
              alt={`Homepage of the ${magna.name} website`}
              domain={magna.domain}
              sizes="(min-width: 1280px) 800px, (min-width: 1024px) 64vw, 92vw"
            />
          </div>
          <div className="lg:col-span-4 lg:pt-2">
            <ProjectMeta project={magna} index={1} headingId="project-magna" />
          </div>
        </article>

        {/* 02: reversed, desktop with phone overlap */}
        <article aria-labelledby="project-balqis" className="mt-20 grid gap-10 border-t border-ink/12 pt-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:order-2 lg:col-span-8">
            <div className="relative pr-[18%] pb-8 sm:pb-12">
              <BrowserFrame
                src={balqis.images.desktop}
                alt={`Homepage of the ${balqis.name} website with listing search`}
                domain={balqis.domain}
                sizes="(min-width: 1280px) 660px, (min-width: 1024px) 54vw, 76vw"
              />
              <PhoneFrame
                src={balqis.images.mobile}
                alt={`${balqis.name} homepage on a phone`}
                sizes="(min-width: 1024px) 170px, 26vw"
                className="absolute right-0 bottom-0 w-[25%] max-w-[190px]"
              />
            </div>
          </div>
          <div className="lg:order-1 lg:col-span-4 lg:pt-2">
            <ProjectMeta project={balqis} index={2} headingId="project-balqis" featureCount={4} />
          </div>
        </article>

        {/* 03 + 04: two contrasting panels */}
        <div className="mt-20 grid gap-6 lg:grid-cols-2">
          <article aria-labelledby="project-haven" className="flex flex-col rounded-2xl bg-paper-deep p-5 sm:p-8">
            <div className="grid grid-cols-[1fr_28%] items-end gap-4">
              <BrowserFrame
                src={haven.images.desktop}
                alt={`Homepage of the ${haven.name} room-rental website`}
                domain={haven.domain}
                sizes="(min-width: 1024px) 400px, 64vw"
              />
              <PhoneFrame
                src={haven.images.mobile}
                alt={`${haven.name} room search on a phone`}
                sizes="(min-width: 1024px) 150px, 26vw"
              />
            </div>
            <div className="mt-8">
              <ProjectMeta project={haven} index={3} headingId="project-haven" />
            </div>
          </article>

          <article
            aria-labelledby="project-financial"
            className="on-dark flex flex-col rounded-2xl bg-charcoal p-5 text-on-dark sm:p-8"
          >
            <div className="grid grid-cols-[34%_1fr] items-center gap-5 sm:gap-8">
              <PhoneFrame
                src={financial.images.mobile}
                alt={`${financial.name} landing page on a phone`}
                sizes="(min-width: 1024px) 190px, 34vw"
                className="border-on-dark/20"
              />
              <div className="text-sm leading-relaxed text-on-dark-muted">
                <p lang="ms" className="font-display text-xl leading-snug font-medium text-on-dark sm:text-2xl">
                  Banyak Komitmen Setiap Bulan? Jom Semak Pilihan Anda.
                </p>
                <p className="mt-3">
                  The page&rsquo;s headline, roughly: &ldquo;Lots of monthly commitments? Let&rsquo;s check your
                  options.&rdquo; It explains before it asks, and every call to action leads to WhatsApp.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <ProjectMeta project={financial} index={4} headingId="project-financial" tone="light" />
            </div>
          </article>
        </div>

        {/* CTA after portfolio */}
        <div className="mt-20 flex flex-col gap-6 rounded-2xl border border-ink/12 bg-card p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold sm:text-3xl">Have a project in mind?</h3>
            <p className="mt-2 max-w-xl text-muted">
              Tell me about your business and what your website needs to do. I&rsquo;ll suggest a sensible approach and
              send a clear quotation.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 xs:flex-row">
            <ContactCta location="after_portfolio" label="WhatsApp Me" size="md" fallback="none" />
            <a
              href="#enquiry"
              className={buttonClasses(hasWhatsApp ? "secondary" : "primary", "md")}
              {...track("cta_click", { location: "after_portfolio", label: "Request a Quotation" })}
            >
              Request a Quotation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
