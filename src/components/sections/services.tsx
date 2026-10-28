import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { DomainHighlight } from "@/components/domain-highlight";
import { buttonClasses } from "@/components/ui/button";
import { pricing } from "@/config/pricing";
import { services } from "@/data/content";
import { packageOrder, servicePackages } from "@/data/packages";
import { track } from "@/lib/analytics";
import { formatMYR, toSen } from "@/lib/quote/money";

/** Five website types compared in one compact list. Prices come from src/config/pricing.ts. */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-card py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="services-title" className="text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
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
              {...track("cta_click", { location: "services", label: "Get an Estimate" })}
            >
              Get an Estimate
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <DomainHighlight variant="banner" />

        <div className="mt-10 border-t border-ink">
          <div
            aria-hidden="true"
            className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1.45fr)_11rem_14rem] gap-8 border-b border-ink/15 py-3 text-xs font-semibold tracking-[0.1em] text-muted uppercase lg:grid"
          >
            <span>Website type</span>
            <span>Includes</span>
            <span>Starting price</span>
            <span />
          </div>

          <ul>
            {packageOrder.map((id) => {
              const pkg = servicePackages[id];
              const { name, basePrice } = pricing.packages[id];
              return (
                <li
                  key={id}
                  aria-labelledby={`package-${id}`}
                  className="grid gap-5 border-b border-ink/12 py-7 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.45fr)_11rem_14rem] lg:items-start lg:gap-8"
                >
                  <div className="sm:col-span-2 lg:col-span-1">
                    <h3 id={`package-${id}`} className="text-[1.4rem] leading-tight font-semibold">
                      {name}
                    </h3>
                    <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted">{pkg.summary}</p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <ul className="grid gap-x-6 gap-y-1.5 text-[0.93rem] sm:grid-cols-2" aria-label={`${name} includes`}>
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex gap-2">
                          <Check aria-hidden="true" className="mt-[0.3rem] size-3.5 shrink-0 text-accent" />
                          <span className="text-graphite">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {pkg.note && <p className="mt-2.5 text-xs leading-relaxed text-muted">{pkg.note}</p>}
                  </div>

                  <div>
                    <p className="flex items-baseline gap-2 lg:block">
                      <span className="text-sm text-muted lg:block">From</span>
                      <span className="font-display text-[1.6rem] leading-none font-semibold tracking-tight">
                        {formatMYR(toSen(basePrice))}
                      </span>
                    </p>
                    <DomainHighlight variant="badge" />
                  </div>

                  <div className="sm:justify-self-end lg:justify-self-stretch">
                    <Link
                      href={`/get-quote?package=${id}`}
                      className={buttonClasses("secondary", "md", "w-full whitespace-nowrap sm:w-auto lg:w-full")}
                      {...track("cta_click", { location: `package_${id}`, label: "Customise This Plan" })}
                    >
                      Customise This Plan
                      <span className="sr-only">: {name}</span>
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm text-muted">
            Prices in MYR. Hosting, third-party subscriptions and payment processing fees are not included. Need
            something custom?{" "}
            <a href="#enquiry" className="font-medium text-ink underline decoration-accent underline-offset-4">
              Contact me directly
            </a>{" "}
            for a quotation.
          </p>
        </div>

        <div className="mt-16 grid gap-8 border-t border-ink/12 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-semibold">Also available</h3>
            <p className="mt-2 max-w-sm text-muted">Ongoing support and technical improvements for your website. Quoted after a short chat about what you need.</p>
            <a
              href="#enquiry"
              className="group mt-5 inline-flex items-center gap-2 font-semibold text-accent"
              {...track("cta_click", { location: "services", label: "Ask about maintenance or SEO" })}
            >
              <span className="link-underline">Ask about these services</span>
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
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
