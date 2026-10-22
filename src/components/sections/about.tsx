import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { credentials } from "@/data/content";
import { track } from "@/lib/analytics";
import photo from "../../../public/about/hafiz.jpg";

const principles = [
  { title: "Business first", body: "Who your customers are and what they need to know comes before colours and layouts." },
  { title: "Phone-first", body: "Many visitors arrive on a phone, so every page is designed to work well there first." },
  { title: "Honest scope", body: "Clear quotations, realistic timelines and no promises I can't back up." },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-ink/10 bg-paper-deep/50 py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-[26rem] lg:mx-0">
            <Image
              src={photo}
              alt="Portrait of Hafiz, founder of Hafiz MJ Digital, wearing a batik shirt"
              sizes="(min-width: 1024px) 416px, 90vw"
              placeholder="blur"
              className="aspect-[4/5] w-full rounded-2xl object-cover object-top"
            />
            <p className="absolute -bottom-4 left-5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper">
              Hafiz · Founder
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pt-4">
          <p className="eyebrow">About</p>
          <h2 id="about-title" className="mt-5 text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
            Hello, I&rsquo;m Hafiz.
          </h2>
          <div className="mt-6 max-w-2xl space-y-5 text-lg leading-relaxed text-graphite">
            <p>
              I&rsquo;m the person behind Hafiz MJ Digital. I work with businesses to create professional websites that
              communicate their value clearly and make it easier for potential customers to take action.
            </p>
            <p>
              I start with the business, not the design: who your customers are, what they need to see before they get
              in touch, and what you want them to do next. The structure, copy and technology follow from those
              answers.
            </p>
            <p>
              I also run{" "}
              <a
                href="https://financialhafiz.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink underline decoration-accent decoration-1 underline-offset-4 hover:decoration-2"
                {...track("project_click", { project: "financial-hafiz", target: "live_site" })}
              >
                Financial Hafiz<span className="sr-only"> (opens in a new tab)</span>
              </a>
              , my own financial-services landing page, so I see websites from a business owner&rsquo;s side too. A page
              has to earn the enquiry, not just look good.
            </p>
          </div>

          <dl className="mt-10 grid gap-6 border-t border-ink/12 pt-8 sm:grid-cols-3">
            {principles.map((principle) => (
              <div key={principle.title}>
                <dt className="font-display font-semibold">{principle.title}</dt>
                <dd className="mt-2 text-[0.95rem] leading-relaxed text-muted">{principle.body}</dd>
              </div>
            ))}
          </dl>

          {credentials.length > 0 && (
            <div className="mt-10">
              <h3 className="text-sm font-semibold tracking-[0.1em] text-muted uppercase">Credentials</h3>
              <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                {credentials.map((credential) => (
                  <li key={credential.title} className="flex flex-wrap justify-between gap-2 py-3">
                    <span className="font-medium">{credential.title}</span>
                    <span className="text-muted">
                      {credential.issuer}
                      {credential.year ? `, ${credential.year}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href="#contact"
            className="group mt-10 inline-flex items-center gap-2 font-semibold text-accent"
            {...track("cta_click", { location: "about", label: "Tell me about your business" })}
          >
            <span className="link-underline">Tell me about your business</span>
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
