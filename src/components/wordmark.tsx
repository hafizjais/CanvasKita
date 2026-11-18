import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * The "canvas kita." logo. The supplied artwork is white on a transparent
 * background, so it suits the dark header and footer as is; `tone="dark"`
 * turns it black for use on light backgrounds such as printed documents.
 */
export function Wordmark({ tone = "light", className = "h-6" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Image
      src="/canvas-kita-logo.png"
      alt={siteConfig.name}
      width={871}
      height={133}
      priority
      className={`w-auto ${className} ${tone === "dark" ? "brightness-0" : ""}`}
    />
  );
}
