"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Holds the exploded website layers and ties how far apart they float to
 * where the drawing sits on screen: fully exploded while its centre is in the
 * lower half of the viewport, assembled into one finished page as it rises
 * to the top. One rAF loop eases toward the
 * target and stops once it arrives; the DOM is written only when the value
 * changes. Reduced motion keeps the layers still in their exploded state.
 */
export function BlueprintStage({ layers, viewBox, label }: { layers: ReactNode[]; viewBox: string; label: string }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = 1;
    let target = 1;
    let frame = 0;
    let written = "";

    const write = (value: number) => {
      const next = value.toFixed(3);
      if (next !== written) {
        el.style.setProperty("--e", next);
        written = next;
      }
    };

    const readTarget = () => {
      if (motion.matches) return 1;
      const box = el.getBoundingClientRect();
      const centre = box.top + box.height / 2;
      return Math.min(1, Math.max(0, centre / (window.innerHeight / 2)));
    };

    const tick = () => {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.001) current = target;
      write(current);
      frame = current === target ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readTarget();
      if (motion.matches) {
        current = target;
        write(current);
        return;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motion.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motion.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <div
      ref={stage}
      role="img"
      aria-label={label}
      className="blueprint relative aspect-[352/285] w-full"
      style={{ "--e": 1 } as CSSProperties}
    >
      {layers.map((layer, index) => (
        <span key={index} className="blueprint-layer" style={{ "--i": index } as CSSProperties}>
          <span className="blueprint-enter">
            <svg viewBox={viewBox} className="size-full overflow-visible" aria-hidden="true">
              {layer}
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
