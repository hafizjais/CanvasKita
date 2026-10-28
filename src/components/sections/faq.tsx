import { Plus } from "lucide-react";
import { faqs } from "@/data/content";

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="border-t border-ink/10 py-20 sm:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="faq-title" className="text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
            Questions, answered.
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-muted">
            Can&rsquo;t find what you&rsquo;re looking for?{" "}
            <a href="#enquiry" className="font-medium text-ink underline decoration-accent underline-offset-4">
              Ask me directly
            </a>
            .
          </p>
        </div>

        <div className="border-t border-ink/12 lg:col-span-8">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-ink/12">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 font-display text-lg font-medium sm:text-xl">
                {faq.question}
                <Plus
                  aria-hidden="true"
                  className="size-5 shrink-0 text-accent transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-graphite">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
