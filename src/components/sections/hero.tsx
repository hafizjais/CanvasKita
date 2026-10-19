import { ArrowDownRight } from "lucide-react";
import { ContactCta } from "@/components/contact-cta";
import { BrowserFrame, PhoneFrame } from "@/components/ui/device-frames";
import { buttonClasses } from "@/components/ui/button";
import { getProject } from "@/data/projects";
import { track } from "@/lib/analytics";

export function Hero() {
  const desktop = getProject("balqismj-property")!;
  const mobile = getProject("financial-hafiz")!;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-page grid items-center gap-12 pt-10 pb-16 sm:pt-14 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-24">
        <div className="lg:col-span-6 xl:col-span-5">
          <p className="eyebrow animate-rise">Web design &amp; development · Malaysia</p>
          <h1
            id="hero-title"
            className="mt-6 animate-rise text-[2.6rem] leading-[1.02] font-semibold [animation-delay:60ms] sm:text-[3.4rem] xl:text-[4rem]"
          >
            Websites that make your business look the part.
          </h1>
          <p className="mt-6 max-w-[34rem] animate-rise text-lg leading-relaxed text-muted [animation-delay:120ms]">
            From business websites to lead-generation landing pages, I help businesses build a stronger online
            presence with thoughtful design, clear messaging and practical technology.
          </p>
          <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:180ms] xs:flex-row xs:flex-wrap">
            <ContactCta location="hero" label="Let's Talk About Your Project" />
            <a
              href="#work"
              className={buttonClasses("secondary", "lg")}
              {...track("cta_click", { location: "hero", label: "Explore My Work" })}
            >
              Explore My Work
              <ArrowDownRight aria-hidden="true" className="size-4" />
            </a>
          </div>
          <p className="mt-8 max-w-[30rem] animate-rise border-t border-ink/10 pt-5 text-sm leading-relaxed text-muted [animation-delay:240ms]">
            For SMEs, consultants, property and financial-services businesses, and anyone whose website no longer
            does them justice.
          </p>
        </div>

        <div className="relative lg:col-span-6 xl:col-span-7">
          <div className="relative pb-10 pl-0 sm:pb-14 sm:pl-16 lg:pl-10 xl:pl-14">
            <BrowserFrame
              src={desktop.images.desktop}
              alt={`Homepage of ${desktop.name}, a property website in Johor Bahru`}
              domain={desktop.domain}
              sizes="(min-width: 1280px) 640px, (min-width: 1024px) 48vw, 92vw"
              priority
            />
            <PhoneFrame
              src={mobile.images.mobile}
              alt={`${mobile.name} landing page on a phone`}
              sizes="(min-width: 1024px) 170px, 30vw"
              priority
              className="absolute bottom-0 left-auto right-3 w-[30%] max-w-[180px] sm:left-0 sm:right-auto sm:w-[24%] lg:-left-2"
            />
          </div>
          <p className="mt-3 text-right text-xs text-muted sm:text-left sm:pl-[calc(24%+2rem)]">
            Real projects: {desktop.domain} &amp; {mobile.domain}
          </p>
        </div>
      </div>
    </section>
  );
}
