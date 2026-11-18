"use client";

import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

export type JourneyPhase = {
  id: string;
  title: string;
  summary: string;
  /** e.g. "Steps 01–02" */
  stepsLabel: string;
  keyPoints: string[];
  visual: ReactNode;
  /** The phase's original stages, rendered on the server. */
  details: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, "0");

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Four phase "platforms" that work as tabs: choosing one shows its stages in
 * the panel below. Arrow keys move between phases; on phones the platforms
 * form a swipeable row. All phase content is in the HTML; inactive panels are
 * only hidden.
 */
export function ProcessJourney({ phases }: { phases: JourneyPhase[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Phone carousel: the phase swiped into view becomes the selected one.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let timer: ReturnType<typeof setTimeout>;
    const settle = () => {
      if (list.scrollWidth <= list.clientWidth + 1) return;
      const padding = parseFloat(getComputedStyle(list).paddingLeft) || 0;
      let nearest = 0;
      tabs.current.forEach((tab, index) => {
        const item = tab?.parentElement;
        const current = tabs.current[nearest]?.parentElement;
        if (item && current && Math.abs(item.offsetLeft - padding - list.scrollLeft) < Math.abs(current.offsetLeft - padding - list.scrollLeft)) {
          nearest = index;
        }
      });
      setActive(nearest);
    };
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(settle, 140);
    };
    list.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      list.removeEventListener("scroll", onScroll);
    };
  }, []);

  function select(index: number, { focus = false } = {}) {
    const next = (index + phases.length) % phases.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus({ preventScroll: true });

    // Keep the chosen platform visible in the phone carousel without moving the page.
    const list = listRef.current;
    const item = tabs.current[next]?.parentElement;
    if (list && item && list.scrollWidth > list.clientWidth + 1) {
      const padding = parseFloat(getComputedStyle(list).paddingLeft) || 0;
      list.scrollTo({ left: item.offsetLeft - padding, behavior: reducedMotion() ? "auto" : "smooth" });
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: phases.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key], { focus: true });
  }

  function tilt(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse" || reducedMotion()) return;
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    el.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
  }

  function resetTilt(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.style.removeProperty("--rx");
    event.currentTarget.style.removeProperty("--ry");
  }

  const phase = phases[active];
  const navButton =
    "inline-flex size-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper";

  return (
    <div className="mt-12 sm:mt-14">
      <p className="mb-4 text-sm text-muted md:hidden" aria-hidden="true">
        Swipe through the four phases. Details for each appear below.
      </p>

      <ul
        ref={listRef}
        role="tablist"
        aria-label="Project phases"
        className="relative -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-5 pt-3 pb-8 [scroll-padding-inline:1.25rem] [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-4 lg:grid-cols-4 lg:gap-8"
      >
        {/* Path linking the platforms, filled up to the selected phase (desktop only). */}
        <li aria-hidden="true" role="presentation" className="pointer-events-none absolute top-[9.25rem] right-[12%] left-[12%] hidden lg:block">
          <span className="block border-t-2 border-dashed border-ink/20" />
          <span
            className="absolute top-0 left-0 block h-0.5 bg-accent transition-[width] duration-500"
            style={{ width: `${(active / (phases.length - 1)) * 100}%` }}
          />
        </li>

        {phases.map((item, index) => {
          const selected = index === active;
          return (
            <li key={item.id} role="presentation" className="journey-item w-[82vw] max-w-[22rem] shrink-0 snap-start md:w-auto md:max-w-none">
              <button
                ref={(el) => {
                  tabs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`phase-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`phase-panel-${item.id}`}
                aria-label={`Phase ${pad(index + 1)}: ${item.title}`}
                aria-describedby={`phase-summary-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                onPointerMove={tilt}
                onPointerLeave={resetTilt}
                className="journey-card group"
              >
                <span className="journey-3d flex items-start justify-between px-6 pt-5">
                  <span
                    className={`font-display text-5xl leading-none font-semibold tracking-tight transition-colors ${
                      // ink/55 keeps inactive numbers muted while meeting the 3:1 contrast minimum for large text.
                      selected ? "text-accent" : "text-ink/55"
                    }`}
                  >
                    {pad(index + 1)}
                  </span>
                  <span className="mt-1 rounded-full border border-ink/12 px-2.5 py-1 text-xs font-medium text-muted">
                    {item.stepsLabel}
                  </span>
                </span>

                <span className="journey-3d relative mx-auto mt-4 block aspect-[228/188] w-[88%] max-w-[17rem]">{item.visual}</span>

                <span className="block px-6 pb-6">
                  <span className="block font-display text-[1.35rem] leading-tight font-semibold">{item.title}</span>
                  <span id={`phase-summary-${item.id}`} className="mt-2 block text-[0.95rem] leading-relaxed text-muted">
                    {item.summary}
                  </span>
                  <span
                    className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${selected ? "text-accent" : "text-ink"}`}
                  >
                    {selected ? "Showing details below" : "Explore this phase"}
                    <ChevronDown
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-y-0.5"
                    />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-hidden="true" className="flex justify-center gap-2 md:hidden">
        {phases.map((item, index) => (
          <span
            key={item.id}
            className={`h-1.5 rounded-full transition-all ${index === active ? "w-6 bg-accent" : "w-1.5 bg-ink/20"}`}
          />
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-ink/12 bg-card p-6 shadow-[0_24px_48px_-36px_rgba(18,20,24,0.35)] sm:p-10">
        <div className="flex flex-col gap-6 border-b border-ink/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div aria-live="polite">
            <p className="text-sm font-semibold text-accent">
              Phase {pad(active + 1)} of {pad(phases.length)}
            </p>
            <h3 className="mt-1 text-[1.75rem] leading-tight font-semibold sm:text-[2.1rem]">{phase.title}</h3>
            <p className="mt-2 max-w-2xl leading-relaxed text-muted">{phase.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {phase.keyPoints.map((point) => (
                <li key={point} className="rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => select(active - 1)} disabled={active === 0} className={`${navButton} disabled:pointer-events-none disabled:opacity-35`}>
              <ArrowLeft aria-hidden="true" className="size-5" />
              <span className="sr-only">Previous phase</span>
            </button>
            <button
              type="button"
              onClick={() => select(active + 1)}
              disabled={active === phases.length - 1}
              className={`${navButton} disabled:pointer-events-none disabled:opacity-35`}
            >
              <ArrowRight aria-hidden="true" className="size-5" />
              <span className="sr-only">Next phase</span>
            </button>
          </div>
        </div>

        {phases.map((item, index) => (
          <div
            key={item.id}
            role="tabpanel"
            id={`phase-panel-${item.id}`}
            aria-labelledby={`phase-tab-${item.id}`}
            hidden={index !== active}
            className="pt-6 motion-safe:animate-rise"
          >
            {item.details}
          </div>
        ))}
      </div>
    </div>
  );
}
