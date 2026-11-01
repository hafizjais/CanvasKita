import { useId } from "react";

const D_PATH =
  "M588 148 L920 322 C1040 392 1100 500 1100 610 C1100 765 1010 865 890 925 L562 1102 V912 L710 838 L852 770 C905 735 928 680 928 612 C928 540 895 495 840 465 L588 335 Z";

/** The "HD" monogram: a white isometric H beside an orange D, drawn in SVG so it stays sharp. */
export function BrandMark({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="150 140 960 970" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}-o`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#f6a98f" />
          <stop offset="0.45" stopColor="#e5803f" />
          <stop offset="1" stopColor="#b9540c" />
        </linearGradient>
        <linearGradient id={`${id}-w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e1e7ef" />
        </linearGradient>
        <clipPath id={`${id}-d`}>
          <path d={D_PATH} />
        </clipPath>
      </defs>
      <path d="M160 265 L338 162 V1035 L160 945 Z" fill="#ffffff" />
      <path d="M338 570 L640 415 L710 452 V835 L562 912 V632 L338 745 Z" fill={`url(#${id}-w)`} />
      <path d={D_PATH} fill={`url(#${id}-o)`} />
      <path
        clipPath={`url(#${id}-d)`}
        d="M905 500 C1010 580 1090 660 1110 760 C1060 880 990 910 890 925 L600 1085 C690 920 790 760 928 640 Z"
        fill="#a84a08"
        opacity="0.45"
      />
    </svg>
  );
}
