"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

/**
 * A horizontally scrolling row with scroll snapping, previous/next buttons and
 * a visible scrollbar. It works by touch, trackpad, mouse wheel (Shift), the
 * scrollbar, the arrow buttons and the keyboard (focus the row, then use the
 * left and right arrow keys). Children should be <li> elements.
 */
export function ScrollRow({ label, children }: { label: string; children: ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const listId = useId();

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  function scrollByCard(direction: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * step, behavior: reduced ? "auto" : "smooth" });
  }

  const button =
    "inline-flex size-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-35";

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted" aria-hidden="true">
          Swipe or scroll to see more
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => scrollByCard(-1)} disabled={edges.start} aria-controls={listId} className={button}>
            <ChevronLeft aria-hidden="true" className="size-5" />
            <span className="sr-only">Previous projects</span>
          </button>
          <button type="button" onClick={() => scrollByCard(1)} disabled={edges.end} aria-controls={listId} className={button}>
            <ChevronRight aria-hidden="true" className="size-5" />
            <span className="sr-only">Next projects</span>
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        id={listId}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="relative -mx-5 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth px-5 pt-2 pb-6 [scroll-padding-inline:1.25rem] [scrollbar-color:var(--color-ink)_transparent] [scrollbar-width:thin] motion-reduce:scroll-auto sm:-mx-8 sm:px-8 sm:[scroll-padding-inline:2rem] lg:-mx-10 lg:px-10 lg:[scroll-padding-inline:2.5rem]"
      >
        <ul className="flex w-max gap-6">{children}</ul>
      </div>
    </div>
  );
}
