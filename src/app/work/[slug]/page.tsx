import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ContactCta } from "@/components/contact-cta";
import { BrowserFrame, PhoneFrame } from "@/components/ui/device-frames";
import { buttonClasses } from "@/components/ui/button";
import { getProject, projects, relationshipLabel } from "@/data/projects";
import { track } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/contact";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `${project.name}: ${project.category} Website`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description: project.summary,
      url: `/work/${project.slug}`,
      images: [{ url: project.images.og, width: 1200, height: 630, alt: `${project.name} website homepage` }],
    },
    twitter: { card: "summary_large_image", title, description: project.summary, images: [project.images.og] },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const badge = relationshipLabel[project.relationship];
  const hasWhatsApp = Boolean(getWhatsAppUrl());

  const facts = [
    { label: "Industry", value: project.industry },
    { label: "Category", value: project.category },
    ...(badge ? [{ label: "Type", value: badge }] : []),
    ...(project.language ? [{ label: "Language", value: project.language }] : []),
    ...(project.platform ? [{ label: "Platform", value: project.platform }] : []),
    ...(project.contribution.length > 0 ? [{ label: "My role", value: project.contribution.join(", ") }] : []),
  ];

  return (
    <article>
      <header className="container-page pt-10 pb-12 sm:pt-14">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All work
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow">
              Case study {String(index + 1).padStart(2, "0")} · {project.category}
            </p>
            <h1 className="mt-5 text-[2.6rem] leading-[1.02] font-semibold sm:text-6xl">{project.name}</h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-graphite">{project.summary}</p>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "lg", "mt-8")}
              {...track("project_click", { project: project.slug, target: "live_site" })}
            >
              Visit {project.domain}
              <ArrowUpRight aria-hidden="true" className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <dl className="self-end border-t border-ink/12 lg:col-span-4">
            {facts.map((fact) => (
              <div key={fact.label} className="flex justify-between gap-6 border-b border-ink/12 py-3 text-sm">
                <dt className="text-muted">{fact.label}</dt>
                <dd className="text-right font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="container-page">
        <div className="relative pb-10 sm:pr-[16%] sm:pb-16">
          <BrowserFrame
            src={project.images.desktop}
            alt={`${project.name} homepage on a desktop screen`}
            domain={project.domain}
            sizes="(min-width: 1248px) 1000px, 84vw"
            priority
          />
          <PhoneFrame
            src={project.images.mobile}
            alt={`${project.name} homepage on a phone`}
            sizes="(min-width: 640px) 200px, 40vw"
            className="mx-auto mt-8 w-[52%] max-w-[230px] sm:absolute sm:right-0 sm:bottom-0 sm:mt-0 sm:w-[21%]"
          />
        </div>
      </div>

      <div className="container-page grid gap-14 py-16 sm:py-20 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7">
          <section aria-labelledby="overview">
            <h2 id="overview" className="text-2xl font-semibold sm:text-3xl">
              Overview
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-graphite">{project.overview}</p>
          </section>

          {project.objective && (
            <section aria-labelledby="objective">
              <h2 id="objective" className="text-2xl font-semibold sm:text-3xl">
                The website&rsquo;s job
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-graphite">{project.objective}</p>
            </section>
          )}

          <section aria-labelledby="decisions">
            <h2 id="decisions" className="text-2xl font-semibold sm:text-3xl">
              Design notes
            </h2>
            <ul className="mt-5 space-y-5">
              {project.designNotes.map((note) => (
                <li key={note} className="border-l-2 border-accent pl-5 text-lg leading-relaxed text-graphite">
                  {note}
                </li>
              ))}
            </ul>
          </section>

          {project.contribution.length > 0 && (
            <section aria-labelledby="role">
              <h2 id="role" className="text-2xl font-semibold sm:text-3xl">
                My contribution
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.contribution.map((item) => (
                  <li key={item} className="rounded-full border border-ink/15 px-3 py-1 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside aria-labelledby="features" className="lg:col-span-4 lg:col-start-9">
          <div className="rounded-2xl bg-paper-deep/70 p-6 sm:p-8">
            <h2 id="features" className="text-xl font-semibold">
              Selected features
            </h2>
            <ul className="mt-5 divide-y divide-ink/10">
              {project.features.map((feature) => (
                <li key={feature} className="py-3 leading-relaxed text-graphite">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section aria-labelledby="walkthrough" className="bg-paper-deep/60 py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 id="walkthrough" className="text-2xl font-semibold sm:text-3xl">
                A longer look at the homepage
              </h2>
              <p className="mt-2 text-muted">Captured from the live site. Scroll inside the frame to see more.</p>
            </div>
          </div>
          <div
            tabIndex={0}
            role="region"
            aria-label={`Scrollable screenshot of the ${project.name} homepage`}
            className="mt-8 max-h-[80vh] overflow-y-auto rounded-[10px] border border-ink/15 bg-card shadow-[0_24px_48px_-28px_rgba(22,21,19,0.45)]"
          >
            <Image
              src={project.images.long.src}
              alt={`Full-length capture of the ${project.name} homepage, from the header down through its main sections`}
              width={project.images.long.width}
              height={project.images.long.height}
              sizes="(min-width: 1248px) 1170px, 92vw"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section aria-label="Next steps" className="container-page grid gap-6 py-16 sm:py-20 md:grid-cols-2">
        <div className="on-dark rounded-2xl bg-charcoal p-8 text-on-dark sm:p-10">
          <h2 className="text-2xl font-semibold sm:text-3xl">Need a website like this?</h2>
          <p className="mt-3 max-w-md text-on-dark-muted">
            Tell me about your business and I&rsquo;ll suggest an approach that fits what your customers need.
          </p>
          <div className="mt-7 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <ContactCta location={`case_study_${project.slug}`} label="WhatsApp Me" size="md" fallback="none" />
            <Link href="/#enquiry" className={buttonClasses(hasWhatsApp ? "ghost-light" : "accent", "md")}>
              Send an Enquiry
            </Link>
          </div>
        </div>

        <Link
          href={`/work/${next.slug}`}
          className="group flex flex-col justify-between rounded-2xl border border-ink/12 bg-card p-8 transition-colors hover:border-ink sm:p-10"
          {...track("project_click", { project: next.slug, target: "case_study" })}
        >
          <span className="text-sm font-semibold tracking-[0.1em] text-muted uppercase">Next project</span>
          <span className="mt-6 flex items-end justify-between gap-6">
            <span>
              <span className="block font-display text-3xl font-semibold">{next.name}</span>
              <span className="mt-1 block text-muted">{next.category}</span>
            </span>
            <ArrowRight aria-hidden="true" className="size-6 shrink-0 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </section>
    </article>
  );
}
