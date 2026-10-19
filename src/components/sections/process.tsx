import { processSteps } from "@/data/content";

export function Process() {
  return (
    <section aria-labelledby="process-title" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 id="process-title" className="mt-5 text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
            A simple, transparent process.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            You&rsquo;ll know what happens at each stage, what I need from you, and what comes next.
          </p>
        </div>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <span aria-hidden="true" className="absolute top-[1.35rem] right-0 left-0 hidden h-px bg-ink/15 lg:block" />
          {processSteps.map((step, index) => (
            <li key={step.title} className="relative">
              <span className="relative flex size-11 items-center justify-center rounded-full border border-ink/20 bg-paper font-display text-sm font-semibold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-[1.4rem] font-semibold">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
