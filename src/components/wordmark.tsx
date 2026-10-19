export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "dark" ? "text-ink" : "text-on-dark";
  return (
    <span className={`flex items-baseline gap-[0.35em] font-display text-[1.06rem] leading-none tracking-[-0.02em] ${text}`}>
      <span className="font-bold">Hafiz MJ</span>
      <span className="font-normal opacity-75">Digital</span>
      <span aria-hidden="true" className="size-[0.32em] self-end translate-y-[-0.12em] bg-accent-bright" />
    </span>
  );
}
