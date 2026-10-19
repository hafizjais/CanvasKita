type Variant = "primary" | "secondary" | "accent" | "light" | "ghost-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold transition-[background-color,color,border-color,transform] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-accent",
  secondary: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  accent: "bg-accent text-paper hover:bg-ink",
  light: "bg-paper text-ink hover:bg-accent-soft",
  "ghost-light": "border border-on-dark/30 text-on-dark hover:border-on-dark hover:bg-on-dark hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.94rem]",
  lg: "h-13 px-6 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(" ");
}
