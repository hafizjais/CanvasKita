/** "Hafiz MJ Digital", with a real space so it reads and copies correctly. */
export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "dark" ? "text-ink" : "text-on-dark";
  return (
    <span className={`font-display text-[1.06rem] leading-none tracking-[-0.02em] whitespace-nowrap ${text}`}>
      <span className="font-bold">Hafiz MJ</span> <span className="font-normal opacity-75">Digital</span>
      <span aria-hidden="true" className="ml-[0.2em] inline-block size-[0.32em] bg-accent-bright" />
    </span>
  );
}
