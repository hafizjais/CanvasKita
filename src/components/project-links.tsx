import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { track } from "@/lib/analytics";

export function ProjectLinks({ project, tone = "dark" }: { project: Project; tone?: "dark" | "light" }) {
  const primary = tone === "dark" ? "text-ink" : "text-on-dark";
  const secondary = tone === "dark" ? "text-muted hover:text-ink" : "text-on-dark-muted hover:text-on-dark";

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.95rem] font-semibold">
      <Link
        href={`/work/${project.slug}`}
        className={`group inline-flex items-center gap-2 ${primary}`}
        {...track("project_click", { project: project.slug, target: "case_study" })}
      >
        <span className="link-underline">View case study</span>
        <span className="sr-only">: {project.name}</span>
        <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 ${secondary}`}
        {...track("project_click", { project: project.slug, target: "live_site" })}
      >
        Visit {project.domain}
        <ArrowUpRight aria-hidden="true" className="size-4" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}
