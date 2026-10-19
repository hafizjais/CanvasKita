const industries = [
  "Corporate Services",
  "Property & Real Estate",
  "Financial Services",
  "Business Websites",
  "Lead Generation",
];

export function Industries() {
  return (
    <section aria-label="Industries in the portfolio" className="border-y border-ink/10 bg-paper-deep/60">
      <div className="container-page flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-10">
        <p className="shrink-0 text-sm font-medium text-muted">Work across</p>
        <ul className="flex flex-wrap gap-x-2 gap-y-2 md:gap-x-0">
          {industries.map((industry, index) => (
            <li key={industry} className="flex items-center font-display text-[1.02rem] font-medium text-ink md:text-lg">
              {index > 0 && (
                <span aria-hidden="true" className="mx-3 text-accent md:mx-5">
                  /
                </span>
              )}
              {industry}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
