import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ContactCta } from "@/components/contact-cta";
import { BrowserFrame, PhoneFrame } from "@/components/ui/device-frames";
import { buttonClasses } from "@/components/ui/button";
import { getProject, projects, projectTypeLabel, type Project } from "@/data/projects";
import { track } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/contact";

const FEATURED = "magna-ibn";

const liveLinkProps = (project: Project) => ({
  href: project.url,
  target: "_blank",
  rel: "noopener noreferrer",
  ...track("project_click", { project: project.slug, target: "live_site" }),
});

function ProjectMeta({ project, headingId, large = false }: { project: Project; headingId: string; large?: boolean }) {
  return (
    <>
      <span
        className={`inline-block w-fit self-start rounded-full px-2.5 py-0.5 text-[0.66rem] font-semibold tracking-[0.08em] uppercase ${
          project.type === "own" ? "border border-ink/20 text-graphite" : "bg-ink text-paper"
        }`}
      >
        {projectTypeLabel[project.type]}
      </span>
      <p className="mt-3 text-[0.78rem] font-semibold tracking-[0.12em] text-muted uppercase">{project.category}</p>
      <h3
        id={headingId}
        className={`mt-3 leading-tight font-semibold ${large ? "text-[2rem] sm:text-[2.4rem]" : "text-[1.6rem] sm:text-[1.7rem]"}`}
      >
        {project.name}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {project.industry}
        {project.language ? ` · ${project.language}` : ""}
      </p>
      <p className={`mt-4 leading-relaxed text-graphite ${large ? "text-lg" : ""}`}>{project.summary}</p>
    </>
  );
}

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
  "group overflow-hidden rounded-2xl border border-ink/12 bg-card shadow-[0_1px_2px_rgba(22,21,19,0.04)] transition-[border-color,box-shadow,transform] duration-300 hover:border-ink/25 hover:shadow-[0_28px_50px_-32px_rgba(22,21,19,0.5)] motion-safe:hover:-translate-y-1";

/** The lead project: a large desktop screenshot with its mobile view, beside the details. */
function FeaturedProject({ project }: { project: Project }) {
  const headingId = `project-${project.slug}`;
  return (
    <article aria-labelledby={headingId} className={`${cardSurface} grid lg:grid-cols-12`}>
      {/* The preview opens the site too; the button is the accessible link. */}
      <a
        {...liveLinkProps(project)}
        tabIndex={-1}
        aria-hidden="true"
        className="block bg-paper-deep/70 p-4 sm:p-8 lg:col-span-8"
      >
        <div className="relative pr-[14%] pb-6 sm:pb-8">
          <BrowserFrame
            src={project.images.desktop}
            alt=""
            domain={project.domain}
            sizes="(min-width: 1248px) 660px, (min-width: 1024px) 56vw, 80vw"
            className="transition-transform duration-500 motion-safe:group-hover:scale-[1.01]"
          />
          <PhoneFrame
            src={project.images.mobile}
            alt=""
            sizes="(min-width: 1024px) 150px, 22vw"
            className="absolute right-0 bottom-0 w-[21%] max-w-[160px]"
          />
        </div>
      </a>
      <div className="flex flex-col p-6 sm:p-8 lg:col-span-4 lg:justify-center">
        <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-accent uppercase">Featured project</p>
        <ProjectMeta project={project} headingId={headingId} large />
        <div className="mt-7">
          <LiveButton project={project} />
        </div>
      </div>
    </article>
  );
}

/** A standard project card. `wideOnTablet` lays it out side by side when it spans two columns. */
function ProjectCard({ project, wideOnTablet = false }: { project: Project; wideOnTablet?: boolean }) {
  const headingId = `project-${project.slug}`;
  return (
    <article
      aria-labelledby={headingId}
      className={`${cardSurface} flex h-full flex-col ${wideOnTablet ? "sm:max-lg:grid sm:max-lg:grid-cols-2 sm:max-lg:items-center" : ""}`}
    >
      <a
        {...liveLinkProps(project)}
        tabIndex={-1}
        aria-hidden="true"
        className="block self-stretch bg-paper-deep/70 p-4 sm:p-5 sm:max-lg:content-center"
      >
        <BrowserFrame
          src={project.images.desktop}
          alt=""
          domain={project.domain}
          sizes="(min-width: 1248px) 360px, (min-width: 1024px) 30vw, (min-width: 640px) 44vw, 88vw"
          className="transition-transform duration-500 motion-safe:group-hover:scale-[1.015]"
        />
      </a>
      <div className="flex flex-1 flex-col p-6">
        <ProjectMeta project={project} headingId={headingId} />
        <div className="mt-auto pt-6">
          <LiveButton project={project} />
        </div>
      </div>
    </article>
  );
}

export function SelectedWork() {
  const featured = getProject(FEATURED)!;
  const others = projects.filter((project) => project.slug !== FEATURED);
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
            Three client websites and one of my own, across corporate services, property and financial services.
          </p>
        </div>

        <div className="mt-14">
          <FeaturedProject project={featured} />
        </div>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((project, index) => {
            const last = index === others.length - 1 && others.length % 2 === 1;
            return (
              <li key={project.slug} className={last ? "sm:max-lg:col-span-2" : ""}>
                <ProjectCard project={project} wideOnTablet={last} />
              </li>
            );
          })}
        </ul>

        {/* CTA after portfolio */}
        <div className="mt-16 flex flex-col gap-6 rounded-2xl border border-ink/12 bg-card p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
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
              {...track("cta_click", { location: "after_portfolio", label: "Get an Estimate" })}
            >
              Get an Estimate
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
