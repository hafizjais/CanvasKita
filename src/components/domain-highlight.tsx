import { Globe } from "lucide-react";
import { pricing } from "@/config/pricing";

/** The "custom domain included" message. Wording lives in pricing.customDomain. */
export function DomainHighlight({ variant }: { variant: "banner" | "badge" | "line" }) {
  const { label, description } = pricing.customDomain;

  if (variant === "badge") {
    return (
      <span className="mt-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
        <Globe aria-hidden="true" className="size-3.5" />
        {label}
      </span>
    );
  }

  if (variant === "line") {
    return (
      <p className="mt-4 flex items-center justify-between gap-4 rounded-lg bg-accent-soft px-3 py-2.5 text-sm">
        <span className="flex items-center gap-2 font-semibold text-accent">
          <Globe aria-hidden="true" className="size-4 shrink-0" />
          {label}
        </span>
        <span className="text-xs font-semibold text-accent">Included</span>
      </p>
    );
  }

  return (
    <div className="mt-10 flex items-start gap-4 rounded-xl border border-accent/30 bg-accent-soft/60 p-5 sm:items-center sm:p-6">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-paper">
        <Globe aria-hidden="true" className="size-5" />
      </span>
      <div>
        <p className="font-display text-lg leading-snug font-semibold">{label} with every plan</p>
        <p className="mt-0.5 text-[0.95rem] leading-relaxed text-graphite">{description}</p>
      </div>
    </div>
  );
}
