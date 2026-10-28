import { AnnualRenewalSection } from "@/components/process/annual-renewal-section";
import { PhaseVisual } from "@/components/process/phase-visual";
import { ProcessCta } from "@/components/process/process-cta";
import { ProcessJourney, type JourneyPhase } from "@/components/process/process-journey";
import { StageDetail } from "@/components/process/stage-detail";
import { processIntro, projectPhases, projectStages } from "@/data/project-process";

const pad = (n: number) => String(n).padStart(2, "0");

export function Process() {
  const phases: JourneyPhase[] = projectPhases.map((phase) => {
    const stages = phase.stageIds.map((id) => {
      const index = projectStages.findIndex((stage) => stage.id === id);
      return { stage: projectStages[index], number: index + 1 };
    });
    const first = stages[0].number;
    const last = stages[stages.length - 1].number;

    return {
      id: phase.id,
      title: phase.title,
      summary: phase.summary,
      keyPoints: phase.keyPoints,
      stepsLabel: first === last ? `Step ${pad(first)}` : `Steps ${pad(first)}–${pad(last)}`,
      visual: <PhaseVisual kind={phase.visual} />,
      details: (
        <div className={stages.length > 1 ? "grid gap-8 lg:grid-cols-2 lg:gap-12" : "max-w-3xl"}>
          {stages.map(({ stage, number }) => (
            <StageDetail key={stage.id} stage={stage} number={number} />
          ))}
        </div>
      ),
    };
  });

  return (
    <section aria-labelledby="process-title" className="overflow-x-clip py-20 sm:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 id="process-title" className="text-[2.3rem] leading-[1.05] font-semibold sm:text-5xl">
            {processIntro.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{processIntro.body}</p>
        </div>

        <ProcessJourney phases={phases} />
        <ProcessCta />
        <AnnualRenewalSection />
      </div>
    </section>
  );
}
