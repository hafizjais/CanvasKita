import { benefits } from "@/data/content";

export function WhyWorkWithMe() {
  return (
    <section aria-labelledby="why-title" className="on-dark bg-ink py-20 text-on-dark sm:py-28">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="why-title" className="text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
              One person, accountable from first call to launch.
            </h2>
          </div>
          <p className="max-w-lg text-lg leading-relaxed text-on-dark-muted lg:col-span-6 lg:col-start-7 lg:self-end">
            Working with an independent studio means fewer layers between your ideas and the finished website, with
            the care and process of a professional engagement.
          </p>
        </div>

        <ul className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <li key={benefit.title} className="border-t border-line-dark pt-6 pb-10">
              <span aria-hidden="true" className="font-display text-sm font-semibold text-accent-bright">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl leading-snug font-semibold">{benefit.title}</h3>
              <p className="mt-3 leading-relaxed text-on-dark-muted">{benefit.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
