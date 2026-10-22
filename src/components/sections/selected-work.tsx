import { ArrowUpRight } from "lucide-react";
import { ContactCta } from "@/components/contact-cta";
import { BrowserFrame } from "@/components/ui/device-frames";
import { buttonClasses } from "@/components/ui/button";
import { projects, type Project } from "@/data/projects";
import { track } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/contact";

/** One portfolio project: a real screenshot, the essentials, and a link to the live site. */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const headingId = `project-${project.slug}`;
  const liveLink = {
    href: project.url,
    target: "_blank",
    rel: "noopener noreferrer",
    ...track("project_click", { project: project.slug, target: "live_site" }),
  };

  return (
    <article
      aria-labelledby={headingId}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/12 bg-card shadow-[0_1px_2px_rgba(22,21,19,0.04)] transition-[border-color,box-shadow,transform] duration-300 hover:border-ink/25 hover:shadow-[0_28px_50px_-32px_rgba(22,21,19,0.5)] motion-safe:hover:-translate-y-1"
    >
      {/* The preview opens the site too; the button below is the accessible link. */}
      <a {...liveLink} tabIndex={-1} aria-hidden="true" className="block bg-paper-deep/70 p-4 sm:p-6">
        <BrowserFrame
          src={project.images.desktop}
          alt=""
          domain={project.domain}
          sizes="(min-width: 1248px) 540px, (min-width: 768px) 44vw, 88vw"
          className="transition-transform duration-500 motion-safe:group-hover:scale-[1.015]"
        />
      </a>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] font-semibold tracking-[0.12em] text-muted uppercase">
          <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
          <span>{project.category}</span>
        </p>
        <h3 id={headingId} className="mt-3 text-[1.6rem] leading-tight font-semibold sm:text-[1.75rem]">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {project.industry}
          {project.language ? ` · ${project.language}` : ""}
        </p>
        <p className="mt-4 leading-relaxed text-graphite">{project.summary}</p>

        <div className="mt-auto pt-7">
          <a {...liveLink} className={buttonClasses("primary", "md")}>
            View Live Website
            <ArrowUpRight aria-hidden="true" className="size-4" />
            <span className="sr-only">: {project.name} (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function SelectedWork() {
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

        <ul className="mt-14 grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:gap-8">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <ProjectCard project={project} index={index} />
            </li>
          ))}
        </ul>

        {/* CTA after portfolio */}
        <div className="mt-16 flex flex-col gap-6 rounded-2xl border border-ink/12 bg-card p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
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
