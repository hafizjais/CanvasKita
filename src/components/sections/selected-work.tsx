import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ContactCta } from "@/components/contact-cta";
import { ScrollRow } from "@/components/scroll-row";
import { BrowserFrame } from "@/components/ui/device-frames";
import { buttonClasses } from "@/components/ui/button";
import { projects, type Project } from "@/data/projects";
import { track } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/contact";

const liveLinkProps = (project: Project) => ({
  href: project.url,
  target: "_blank",
  rel: "noopener noreferrer",
  ...track("project_click", { project: project.slug, target: "live_site" }),
});

function LiveButton({ project }: { project: Project }) {
  return (
    <a {...liveLinkProps(project)} className={buttonClasses("primary", "md")}>
      View Live Website
      <ArrowUpRight aria-hidden="true" className="size-4" />
      <span className="sr-only">: {project.name} (opens in a new tab)</span>
    </a>
  );
}

const cardSurface =
  "group overflow-hidden rounded-2xl border border-ink/12 bg-card shadow-[0_1px_2px_rgba(18,20,24,0.04)] transition-[border-color,box-shadow,transform] duration-300 hover:border-ink/25 hover:shadow-[0_28px_50px_-32px_rgba(18,20,24,0.5)] motion-safe:hover:-translate-y-1";

/** One project: a real screenshot of the site, the name, and a link to the live website. */
function ProjectCard({ project }: { project: Project }) {
  const headingId = `project-${project.slug}`;
  return (
    <article aria-labelledby={headingId} className={`${cardSurface} flex h-full flex-col`}>
      {/* The preview opens the site too; the button is the accessible link. */}
      <a {...liveLinkProps(project)} tabIndex={-1} aria-hidden="true" className="block bg-paper-deep/70 p-4 sm:p-5">
        <BrowserFrame
          src={project.images.desktop}
          alt=""
          domain={project.domain}
          sizes="(min-width: 640px) 384px, 85vw"
          className="transition-transform duration-500 motion-safe:group-hover:scale-[1.015]"
        />
      </a>
      <div className="flex flex-1 flex-col p-6">
        <h3 id={headingId} className="text-[1.6rem] leading-tight font-semibold sm:text-[1.7rem]">
          {project.name}
        </h3>
        <div className="mt-auto pt-5">
          <LiveButton project={project} />
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
            <h2 id="work-title" className="text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
              Selected work. Real businesses.
            </h2>
          </div>
        </div>

        <div className="mt-12">
          <ScrollRow label="Portfolio projects">
            {projects.map((project) => (
              <li key={project.slug} className="w-[min(85vw,24rem)] shrink-0 snap-start">
                <ProjectCard project={project} />
              </li>
            ))}
          </ScrollRow>
        </div>

        {/* CTA after portfolio */}
        <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-ink/12 bg-card p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold sm:text-3xl">Have a project in mind?</h3>
            <p className="mt-2 max-w-xl text-muted">
              See an itemised estimate for your website in a few minutes, or message me to talk it through.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 xs:flex-row">
            <Link
              href="/get-quote"
              className={buttonClasses("primary", "md")}
              {...track("cta_click", { location: "after_portfolio", label: "Get a Quote" })}
            >
              Get a Quote
            </Link>
            {hasWhatsApp && (
              <ContactCta location="after_portfolio" label="WhatsApp Me" size="md" variant="secondary" fallback="none" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
