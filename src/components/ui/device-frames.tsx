import Image from "next/image";

type FrameProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** A restrained browser window showing a real website screenshot (1440×900). */
export function BrowserFrame({ src, alt, sizes, priority, className = "", domain }: FrameProps & { domain: string }) {
  return (
    <figure
      className={`overflow-hidden rounded-[10px] border border-ink/15 bg-card shadow-[0_1px_0_rgba(18,20,24,0.04),0_24px_48px_-28px_rgba(18,20,24,0.45)] ${className}`}
    >
      <div className="flex h-8 items-center gap-3 border-b border-ink/10 bg-paper-deep/70 px-3" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-ink/20" />
          <span className="size-2 rounded-full bg-ink/20" />
          <span className="size-2 rounded-full bg-ink/20" />
        </span>
        <span className="mx-auto max-w-[60%] truncate rounded-full bg-card px-3 py-0.5 text-[0.68rem] text-muted">
          {domain}
        </span>
        <span className="w-[42px]" />
      </div>
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={900}
        sizes={sizes}
        priority={priority}
        className="block h-auto w-full"
      />
    </figure>
  );
}

/** A phone outline showing a real mobile screenshot (390×844 viewport). */
export function PhoneFrame({ src, alt, sizes, priority, className = "" }: FrameProps) {
  return (
    <figure
      className={`rounded-[1.6rem] border border-ink/80 bg-ink p-[5px] shadow-[0_30px_50px_-24px_rgba(18,20,24,0.6)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={780}
        height={1688}
        sizes={sizes}
        priority={priority}
        className="block h-auto w-full rounded-[1.3rem]"
      />
    </figure>
  );
}
