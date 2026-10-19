import { ArrowRight } from "lucide-react";
import { services } from "@/data/content";
import { track } from "@/lib/analytics";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-card py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Services</p>
            <h2 id="services-title" className="mt-5 text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
              What I can help with.
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-muted">
              Clear, practical services described in plain terms. Every project starts with a conversation and a written
              scope, so you know exactly what you&rsquo;re getting.
            </p>
            <a
              href="#enquiry"
              className="group mt-8 inline-flex items-center gap-2 font-semibold text-accent"
              {...track("cta_click", { location: "services", label: "Ask which service fits" })}
            >
              <span className="link-underline">Not sure which you need? Ask me.</span>
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <ol className="border-t border-ink/12 lg:col-span-8">
          {services.map((service, index) => (
            <li key={service.title} className="grid gap-4 border-b border-ink/12 py-8 sm:grid-cols-[4rem_1fr] sm:py-10">
              <span className="font-display text-sm font-semibold text-accent" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-2xl leading-tight font-semibold sm:text-[1.7rem]">{service.title}</h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-graphite">{service.description}</p>
                <div className="mt-5 grid gap-4 text-sm md:grid-cols-[1fr_1.4fr]">
                  <p className="text-muted">
                    <span className="block text-xs font-semibold tracking-[0.1em] text-ink uppercase">Suited to</span>
                    {service.suitedTo}
                  </p>
                  <ul className="flex flex-wrap gap-2" aria-label={`${service.title} typically includes`}>
                    {service.includes.map((item) => (
                      <li key={item} className="rounded-full border border-ink/15 px-3 py-1 text-[0.82rem] text-graphite">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
