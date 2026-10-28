import Link from "next/link";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { BrandPanel } from "@/components/brand-panel";
import { buttonClasses } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-page grid items-center gap-12 pt-10 pb-16 sm:pt-14 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-24">
        <div className="lg:col-span-6 xl:col-span-5">
          <h1
            id="hero-title"
            className="animate-rise text-[2.6rem] leading-[1.02] font-semibold [animation-delay:60ms] sm:text-[3.4rem] xl:text-[4rem]"
          >
            Websites that make your business look the part.
          </h1>
          <p className="mt-6 max-w-[34rem] animate-rise text-lg leading-relaxed text-muted [animation-delay:120ms]">
            From business websites to lead-generation landing pages, I help businesses build a stronger online
            presence with thoughtful design, clear messaging and practical technology.
          </p>
          <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:180ms] xs:flex-row xs:flex-wrap">
            <Link
              href="/get-quote"
              className={buttonClasses("accent", "lg")}
              {...track("cta_click", { location: "hero", label: "Get an Estimate" })}
            >
              Get an Estimate
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <a
              href="#work"
              className={buttonClasses("secondary", "lg")}
              {...track("cta_click", { location: "hero", label: "View Projects" })}
            >
              View Projects
              <ArrowDownRight aria-hidden="true" className="size-4" />
            </a>
          </div>
          <p className="mt-8 max-w-[30rem] animate-rise border-t border-ink/10 pt-5 text-sm leading-relaxed text-muted [animation-delay:240ms]">
            For SMEs, consultants, property and financial-services businesses, and anyone ready for a professional
            website.
          </p>
        </div>

        <div className="lg:col-span-6 xl:col-span-7">
          <BrandPanel />
        </div>
      </div>
    </section>
  );
}
