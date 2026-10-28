import { AnnualRenewalSection } from "@/components/process/annual-renewal-section";
import { ProjectProcessTimeline } from "@/components/process/project-process-timeline";

export function Process() {
  return (
    <section aria-labelledby="process-title" className="py-20 sm:py-28">
      <div className="container-page">
        <ProjectProcessTimeline />
        <AnnualRenewalSection />
      </div>
    </section>
  );
}
