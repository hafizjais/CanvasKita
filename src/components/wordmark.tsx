import { BrandMark } from "@/components/brand-mark";

/** The HD mark beside "Hafiz MJ Digital", with a real space so the name reads and copies correctly. */
export function Wordmark({ tone = "light" }: { tone?: "dark" | "light" }) {
  const text = tone === "dark" ? "text-ink" : "text-on-dark";
  return (
    <span className={`flex items-center gap-2.5 font-display text-[1.06rem] leading-none tracking-[-0.02em] whitespace-nowrap ${text}`}>
      <BrandMark className="h-7 w-auto shrink-0" />
      <span>
        <span className="font-bold">Hafiz MJ</span> <span className="font-normal opacity-75">Digital</span>
      </span>
    </span>
  );
}
