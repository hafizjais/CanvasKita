import Link from "next/link";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { WebsiteBlueprint } from "@/components/hero/website-blueprint";
import { buttonClasses } from "@/components/ui/button";
import { packageIds, pricing } from "@/config/pricing";
import { projects } from "@/data/projects";
import { track } from "@/lib/analytics";
import { formatMYR, toSen } from "@/lib/quote/money";

const lowestPrice = Math.min(...packageIds.map((id) => pricing.packages[id].basePrice));

const facts = [
  { label: "Websites live", value: String(projects.length) },
  { label: "Plans from", value: formatMYR(toSen(lowestPrice)) },
  { label: "Domain", value: "Included" },
  { label: "Standard build", value: "1–2 weeks" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-ink text-on-dark">
      {/* The environment: a faint drafting grid and a warm glow behind the drawing. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(var(--color-on-dark)_1px,transparent_1px),linear-gradient(90deg,var(--color-on-dark)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_70%_45%,#000_30%,transparent_75%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[-20%] bottom-[-10%] -z-10 size-[36rem] rounded-full bg-accent-bright/8 blur-[120px] lg:bg-accent-bright/12 lg:top-1/4 lg:right-[-10%] lg:bottom-auto lg:size-[42rem]"
      />

      <div className="container-page grid items-center gap-10 pt-12 pb-14 sm:pt-16 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:gap-6 lg:py-16">
        <div className="lg:col-span-6 xl:col-span-5">
          <h1
            id="hero-title"
            className="text-[2.7rem] leading-[1.02] font-semibold sm:text-[3.6rem] xl:text-[4.25rem]"
          >
            Websites that make your business look the part.
          </h1>
          {/* The headline and intro render immediately (no fade) so the page looks complete fast on phones. */}
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-on-dark-muted">
            From business websites to lead-generation landing pages, I help businesses build a stronger online
            presence with thoughtful design, clear messaging and practical technology.
          </p>
          <div className="mt-9 flex flex-col gap-3 motion-safe:animate-rise motion-safe:[animation-delay:60ms] xs:flex-row xs:flex-wrap">
            <Link
              href="/get-quote"
              className={buttonClasses("glow", "lg")}
              {...track("cta_click", { location: "hero", label: "Get a Quote" })}
            >
              Get a Quote
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <a
              href="#work"
              className={buttonClasses("ghost-light", "lg")}
              {...track("cta_click", { location: "hero", label: "View Projects" })}
            >
              View Projects
              <ArrowDownRight aria-hidden="true" className="size-4" />
            </a>
          </div>

          <dl className="mt-12 grid max-w-[34rem] grid-cols-2 gap-x-6 gap-y-5 border-t border-on-dark/12 pt-6 motion-safe:animate-rise motion-safe:[animation-delay:120ms] sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse gap-1">
                <dt className="text-sm text-on-dark-muted">{fact.label}</dt>
                <dd className="font-display text-xl font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto w-full max-w-[34rem] lg:col-span-6 lg:max-w-none xl:col-span-7 xl:pl-6">
          <WebsiteBlueprint />
        </div>
      </div>
    </section>
  );
}
