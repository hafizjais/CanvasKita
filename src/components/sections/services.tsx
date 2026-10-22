import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PackageVisual } from "@/components/packages/package-visual";
import { buttonClasses } from "@/components/ui/button";
import { pricing, type PackageId } from "@/config/pricing";
import { services } from "@/data/content";
import { servicePackages } from "@/data/packages";
import { track } from "@/lib/analytics";
import { formatMYR, toSen } from "@/lib/quote/money";

function StartingPrice({ id, tone = "light" }: { id: PackageId; tone?: "light" | "dark" }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className={`text-sm ${tone === "dark" ? "text-on-dark-muted" : "text-muted"}`}>From</span>
      <span className="font-display text-[1.9rem] leading-none font-semibold tracking-tight">
        {formatMYR(toSen(pricing.packages[id].basePrice))}
      </span>
    </p>
  );
}

function Features({ id, columns = 1, tone = "light" }: { id: PackageId; columns?: 1 | 2; tone?: "light" | "dark" }) {
  const { features, note } = servicePackages[id];
  return (
    <>
      <ul className={`mt-5 grid gap-x-6 gap-y-2.5 text-[0.95rem] ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {features.map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <Check
              aria-hidden="true"
              className={`mt-1 size-4 shrink-0 ${tone === "dark" ? "text-accent-bright" : "text-accent"}`}
            />
            <span className={tone === "dark" ? "text-on-dark/90" : "text-graphite"}>{feature}</span>
          </li>
        ))}
      </ul>
      {note && <p className={`mt-4 text-xs leading-relaxed ${tone === "dark" ? "text-on-dark-muted" : "text-muted"}`}>{note}</p>}
    </>
  );
}

function CustomiseLink({ id, variant = "secondary" }: { id: PackageId; variant?: "primary" | "secondary" | "light" }) {
  const label = id === "custom" ? "Request a Custom Quotation" : "Customise This Plan";
  return (
    <Link
      href={`/get-quote?package=${id}`}
      className={buttonClasses(variant, "md")}
      {...track("cta_click", { location: `package_${id}`, label })}
    >
      {label}
      <span className="sr-only">: {pricing.packages[id].name}</span>
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  );
}

function PackageCard({ id, featured = false }: { id: PackageId; featured?: boolean }) {
  const pkg = servicePackages[id];
  return (
    <article
      aria-labelledby={`package-${id}`}
      className="flex h-full flex-col rounded-2xl border border-ink/12 bg-paper p-5 sm:p-7"
    >
      <PackageVisual
        visual={pkg.visual}
        sizes={featured ? "(min-width: 1024px) 640px, 92vw" : "(min-width: 1024px) 380px, (min-width: 640px) 46vw, 92vw"}
      />
      <div className="mt-6 flex flex-1 flex-col">
        <div className={featured ? "flex flex-wrap items-end justify-between gap-4" : ""}>
          <h3 id={`package-${id}`} className="text-[1.6rem] leading-tight font-semibold">
            {pricing.packages[id].name}
          </h3>
          <div className={featured ? "" : "mt-3"}>
            <StartingPrice id={id} />
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-graphite">{pkg.summary}</p>
        <Features id={id} columns={featured ? 2 : 1} />
        <div className="mt-auto pt-7">
          <CustomiseLink id={id} variant={featured ? "primary" : "secondary"} />
        </div>
      </div>
    </article>
  );
}

export function Services() {
  const custom = servicePackages.custom;

  return (
    <section id="services" aria-labelledby="services-title" className="bg-card py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">Services &amp; packages</p>
            <h2 id="services-title" className="mt-5 text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
              Website packages, clearly priced.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Every package starts from a published price. Choose the type of website you need, adjust the scope, and
              see an itemised estimate before you get in touch.
            </p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <Link
              href="/get-quote"
              className={buttonClasses("primary", "lg")}
              {...track("cta_click", { location: "services", label: "Build Your Website Plan" })}
            >
              Build Your Website Plan
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          <div className="md:col-span-2 lg:col-span-7">
            <PackageCard id="business" featured />
          </div>
          <div className="lg:col-span-5">
            <PackageCard id="landing" />
          </div>
          {(["portfolio", "ecommerce", "booking"] as const).map((id) => (
            <div key={id} className="lg:col-span-4">
              <PackageCard id={id} />
            </div>
          ))}

          <article
            aria-labelledby="package-custom"
            className="on-dark grid gap-8 rounded-2xl bg-charcoal p-6 text-on-dark sm:p-9 md:col-span-2 lg:col-span-12 lg:grid-cols-12 lg:items-center"
          >
            <div className="lg:col-span-6">
              <p className="text-sm font-semibold tracking-[0.12em] text-on-dark-muted uppercase">Bespoke</p>
              <h3 id="package-custom" className="mt-3 text-[1.9rem] leading-tight font-semibold sm:text-[2.2rem]">
                {pricing.packages.custom.name}
              </h3>
              <p className="mt-3 max-w-lg leading-relaxed text-on-dark-muted">{custom.summary}</p>
              <div className="mt-6">
                <StartingPrice id="custom" tone="dark" />
              </div>
              <Features id="custom" tone="dark" />
              <div className="mt-7">
                <CustomiseLink id="custom" variant="light" />
              </div>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <PackageVisual visual={custom.visual} sizes="(min-width: 1024px) 460px, 92vw" tone="dark" />
            </div>
          </article>
        </div>

        <div className="mt-16 grid gap-8 border-t border-ink/12 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-semibold">Also available</h3>
            <p className="mt-2 max-w-sm text-muted">
              For existing websites. Quoted after a short review of what you have now.
            </p>
            <a
              href="#enquiry"
              className="group mt-5 inline-flex items-center gap-2 font-semibold text-accent"
              {...track("cta_click", { location: "services", label: "Ask about an existing website" })}
            >
              <span className="link-underline">Ask about your website</span>
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <ul className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {services.map((service) => (
              <li key={service.title}>
                <h4 className="font-display text-lg leading-snug font-semibold">{service.title}</h4>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{service.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
