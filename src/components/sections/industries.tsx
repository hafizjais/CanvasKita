const industries = [
  "Corporate Services",
  "Property & Real Estate",
  "Financial Services",
  "Business Websites",
  "Lead Generation",
];

export function Industries() {
  return (
    <section aria-label="Industries in the portfolio" className="on-dark border-t border-on-dark/10 bg-ink text-on-dark">
      <div className="container-page flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-10">
        <p className="shrink-0 text-sm font-medium text-on-dark-muted">Work across</p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-0">
          {industries.map((industry, index) => (
            <li key={industry} className="flex items-center font-display text-[0.98rem] font-medium text-on-dark md:text-lg">
              {index > 0 && (
                <span aria-hidden="true" className="mx-3 hidden text-accent-bright sm:inline md:mx-5">
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
