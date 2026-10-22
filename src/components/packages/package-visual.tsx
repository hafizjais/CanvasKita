import { BrowserFrame } from "@/components/ui/device-frames";
import type { PackageVisual as Visual } from "@/data/packages";

/**
 * A real site screenshot where one exists; otherwise a simple drawn layout of
 * what that kind of site contains, labelled as illustrative so it is never
 * mistaken for client work.
 */
export function PackageVisual({ visual, sizes, tone = "light" }: { visual: Visual; sizes: string; tone?: "light" | "dark" }) {
  if (visual.type === "screenshot") {
    return (
      <div>
        <BrowserFrame src={visual.src} alt={visual.alt} domain={visual.domain} sizes={sizes} />
        <p className={`mt-2 text-xs ${tone === "dark" ? "text-on-dark-muted" : "text-muted"}`}>
          Example: {visual.domain}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        aria-hidden="true"
        className={`overflow-hidden rounded-[10px] border ${
          tone === "dark" ? "border-on-dark/15 bg-graphite" : "border-ink/15 bg-card"
        }`}
      >
        <div
          className={`flex h-8 items-center gap-1.5 border-b px-3 ${
            tone === "dark" ? "border-on-dark/10 bg-ink/40" : "border-ink/10 bg-paper-deep/70"
          }`}
        >
          {[0, 1, 2].map((dot) => (
            <span key={dot} className={`size-2 rounded-full ${tone === "dark" ? "bg-on-dark/25" : "bg-ink/20"}`} />
          ))}
        </div>
        <div className="aspect-[16/10] p-[5%]">
          {visual.layout === "store" && <StoreLayout />}
          {visual.layout === "booking" && <BookingLayout />}
          {visual.layout === "system" && <SystemLayout />}
        </div>
      </div>
      <p className={`mt-2 text-xs ${tone === "dark" ? "text-on-dark-muted" : "text-muted"}`}>Illustrative layout</p>
    </div>
  );
}

const bar = "rounded-full bg-ink/12";

function StoreLayout() {
  return (
    <div className="flex h-full flex-col gap-[6%]">
      <div className="flex items-center justify-between">
        <span className={`h-2 w-1/5 ${bar}`} />
        <span className="flex items-center gap-1.5">
          <span className={`h-2 w-8 ${bar}`} />
          <span className="flex size-4 items-center justify-center rounded-full bg-accent text-[0.5rem] font-bold text-paper">
            2
          </span>
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-[4%]">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex flex-col gap-1">
            <span className={`flex-1 rounded-md ${index === 1 ? "bg-accent-soft" : "bg-paper-deep"}`} />
            <span className={`h-1.5 w-4/5 ${bar}`} />
            <span className="h-1.5 w-1/3 rounded-full bg-accent/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingLayout() {
  return (
    <div className="grid h-full grid-cols-[1.4fr_1fr] gap-[6%]">
      <div className="flex flex-col gap-2">
        <span className={`h-2 w-2/5 ${bar}`} />
        <div className="grid flex-1 grid-cols-7 gap-1">
          {Array.from({ length: 28 }, (_, index) => (
            <span
              key={index}
              className={`rounded-[3px] ${
                index === 17 ? "bg-accent" : [3, 9, 10, 22].includes(index) ? "bg-ink/8" : "bg-paper-deep"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className={`h-2 w-3/5 ${bar}`} />
        {["10:00", "11:30", "14:00", "16:30"].map((time, index) => (
          <span
            key={time}
            className={`rounded-md border px-2 py-1 text-[0.55rem] font-semibold ${
              index === 2 ? "border-accent bg-accent text-paper" : "border-ink/12 text-muted"
            }`}
          >
            {time}
          </span>
        ))}
        <span className="mt-auto h-5 rounded-full bg-ink" />
      </div>
    </div>
  );
}

function SystemLayout() {
  const box = "rounded-md border border-on-dark/20 bg-ink/50 px-2 py-1.5 text-[0.55rem] font-semibold text-on-dark/80";
  return (
    <div className="grid h-full grid-cols-[1fr_auto_1.3fr_auto_1fr] items-center gap-2">
      <div className="flex flex-col gap-2">
        <span className={box}>Customers</span>
        <span className={box}>Staff</span>
      </div>
      <span className="h-px w-4 bg-on-dark/30" />
      <div className="flex h-4/5 flex-col gap-1.5 rounded-lg border border-accent-bright/60 bg-ink/40 p-2">
        <span className="text-[0.55rem] font-semibold text-accent-bright">Your system</span>
        <span className="h-1.5 w-4/5 rounded-full bg-on-dark/20" />
        <span className="h-1.5 w-3/5 rounded-full bg-on-dark/20" />
        <div className="mt-auto grid grid-cols-3 gap-1">
          {[0, 1, 2].map((cell) => (
            <span key={cell} className="h-5 rounded bg-on-dark/10" />
          ))}
        </div>
      </div>
      <span className="h-px w-4 bg-on-dark/30" />
      <div className="flex flex-col gap-2">
        <span className={box}>Database</span>
        <span className={box}>Payments</span>
        <span className={box}>Your tools</span>
      </div>
    </div>
  );
}
