import type { ProjectStage } from "@/data/project-process";

/** One of the seven original stages, shown inside its expanded phase. */
export function StageDetail({ stage, number }: { stage: ProjectStage; number: number }) {
  return (
    <article
      aria-labelledby={`stage-${stage.id}`}
      className={stage.highlight ? "rounded-2xl border border-accent/30 bg-accent-soft/60 p-5 sm:p-6" : ""}
    >
      <p className="text-sm font-semibold text-accent">Step {String(number).padStart(2, "0")}</p>
      <h4 id={`stage-${stage.id}`} className="mt-1 text-[1.3rem] font-semibold sm:text-[1.45rem]">
        {stage.title}
      </h4>

      {stage.label && (
        <p className="mt-3 inline-block rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
          {stage.label}
        </p>
      )}

      <p className="mt-3 leading-relaxed text-graphite">{stage.description}</p>
      {stage.note && <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{stage.note}</p>}

      {stage.list && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-ink">{stage.list.heading}</p>
          <ul className="mt-2 space-y-1.5 text-[0.95rem] leading-relaxed text-graphite">
            {stage.list.items.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <dl className="mt-5 grid gap-3 border-t border-ink/10 pt-4 text-[0.95rem] sm:grid-cols-2 sm:gap-6">
        {stage.clientAction && (
          <div>
            <dt className="text-sm font-semibold text-ink">Your part</dt>
            <dd className="mt-1 leading-relaxed text-graphite">{stage.clientAction}</dd>
          </div>
        )}
        <div className={stage.clientAction ? "" : "sm:col-span-2"}>
          <dt className="text-sm font-semibold text-ink">Outcome</dt>
          <dd className="mt-1 leading-relaxed text-graphite">{stage.outcome}</dd>
        </div>
      </dl>
    </article>
  );
}
