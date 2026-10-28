import {
  ClipboardCheck,
  HandCoins,
  LifeBuoy,
  MessagesSquare,
  PackageCheck,
  PenTool,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import type { ProcessIcon, ProjectStage } from "@/data/project-process";

const icons: Record<ProcessIcon, LucideIcon> = {
  message: MessagesSquare,
  deposit: HandCoins,
  build: PenTool,
  review: ClipboardCheck,
  launch: Rocket,
  support: LifeBuoy,
  handover: PackageCheck,
};

export function ProcessStep({ stage, number }: { stage: ProjectStage; number: number }) {
  const Icon = icons[stage.icon];
  const titleId = `stage-${stage.id}`;

  return (
    <li className="relative grid grid-cols-[2.75rem_1fr] gap-x-4 pb-10 last:pb-0 sm:gap-x-6">
      {/* Rail connecting the numbered markers */}
      <span aria-hidden="true" className="absolute top-11 bottom-0 left-[1.375rem] w-px bg-ink/15 [li:last-child_&]:hidden" />
      <span
        aria-hidden="true"
        className={`relative flex size-11 items-center justify-center rounded-full border font-display text-sm font-semibold ${
          stage.highlight ? "border-accent bg-accent text-paper" : "border-ink/20 bg-paper text-accent"
        }`}
      >
        {String(number).padStart(2, "0")}
      </span>

      <article
        aria-labelledby={titleId}
        className={
          stage.highlight
            ? "rounded-xl border border-accent/30 bg-accent-soft/60 p-5 sm:p-6"
            : "pt-1.5"
        }
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Icon aria-hidden="true" className="size-5 shrink-0 text-accent" />
          <h3 id={titleId} className="text-[1.35rem] font-semibold sm:text-2xl">
            <span className="sr-only">Step {number}: </span>
            {stage.title}
          </h3>
        </div>

        {stage.label && (
          <p className="mt-3 inline-block rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
            {stage.label}
          </p>
        )}

        <p className="mt-3 max-w-2xl leading-relaxed text-graphite">{stage.description}</p>

        {stage.note && <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-muted">{stage.note}</p>}

        {stage.list && (
          <div className="mt-4 max-w-2xl">
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

        <dl className="mt-5 grid max-w-2xl gap-3 border-t border-ink/10 pt-4 text-[0.95rem] sm:grid-cols-2 sm:gap-6">
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
    </li>
  );
}
