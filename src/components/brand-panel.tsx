import { Bot, Globe } from "lucide-react";

/** Brand orange taken from the design; used only in this panel. */
const orange = "text-[#d06a10]";

/** The "HD" monogram: a white H beside an orange D, drawn in SVG so it stays sharp. */
function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="150 140 960 970" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="hd-orange" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#f6a98f" />
          <stop offset="0.45" stopColor="#e5803f" />
          <stop offset="1" stopColor="#b9540c" />
        </linearGradient>
        <linearGradient id="hd-white" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9eef5" />
        </linearGradient>
        <clipPath id="hd-d">
          <path d="M588 148 L920 322 C1040 392 1100 500 1100 610 C1100 765 1010 865 890 925 L562 1102 V912 L710 838 L852 770 C905 735 928 680 928 612 C928 540 895 495 840 465 L588 335 Z" />
        </clipPath>
      </defs>
      {/* H */}
      <path d="M160 265 L338 162 V1035 L160 945 Z" fill="#fff" />
      <path d="M338 570 L640 415 L710 452 V835 L562 912 V632 L338 745 Z" fill="url(#hd-white)" />
      {/* D */}
      <path d="M588 148 L920 322 C1040 392 1100 500 1100 610 C1100 765 1010 865 890 925 L562 1102 V912 L710 838 L852 770 C905 735 928 680 928 612 C928 540 895 495 840 465 L588 335 Z" fill="url(#hd-orange)" />
      <path
        clipPath="url(#hd-d)"
        d="M905 500 C1010 580 1090 660 1110 760 C1060 880 990 910 890 925 L600 1085 C690 920 790 760 928 640 Z"
        fill="#a84a08"
        opacity="0.45"
      />
    </svg>
  );
}

const services = [
  { label: "Website Development", icon: Globe },
  { label: "AI Automation Solutions", icon: Bot },
];

export function BrandPanel() {
  return (
    <div className="on-dark relative flex items-center justify-center overflow-hidden rounded-3xl bg-charcoal px-6 py-14 text-on-dark sm:px-12 sm:py-20">
      {/* Faint grid, purely decorative */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--color-on-dark)_1px,transparent_1px),linear-gradient(90deg,var(--color-on-dark)_1px,transparent_1px)] [background-size:40px_40px]"
      />

      <div className="relative flex flex-col items-center text-center">
        <Monogram className="h-28 w-auto sm:h-36" />

        <p className="mt-8 font-display text-[1.9rem] leading-none font-semibold tracking-[-0.02em] whitespace-nowrap xs:text-[2.3rem] sm:text-[3rem]">
          Hafiz MJ <span className={`${orange} font-normal`}>Digital Lab</span>
        </p>

        <p className="mt-7 flex items-center gap-4 text-[0.7rem] tracking-[0.3em] text-on-dark-muted uppercase xs:text-xs sm:text-sm">
          Websites
          <span aria-hidden="true" className="size-1.5 rounded-full bg-on-dark-muted" />
          Automation
        </p>

        <p className="mt-6 max-w-xs leading-relaxed tracking-wide text-on-dark-muted sm:max-w-sm sm:text-lg">
          Modern websites and digital solutions for your business.
        </p>

        <ul className="mt-10 grid grid-cols-2 divide-x divide-line-dark">
          {services.map(({ label, icon: Icon }) => (
            <li key={label} className="flex w-36 flex-col items-center gap-2.5 px-3 text-sm font-medium sm:w-44 sm:px-6">
              <Icon aria-hidden="true" className={`size-9 sm:size-10 ${orange}`} strokeWidth={1.5} />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
