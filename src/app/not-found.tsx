import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow">Page not found</p>
      <h1 className="mt-5 max-w-xl text-[2.4rem] leading-tight font-semibold sm:text-5xl">
        This page doesn&rsquo;t exist, or has moved.
      </h1>
      <p className="mt-4 max-w-lg text-lg text-muted">
        Head back to the homepage to see recent work, or get in touch about your project.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={buttonClasses("primary", "lg")}>
          Back to homepage
        </Link>
        <Link href="/#contact" className={buttonClasses("secondary", "lg")}>
          Discuss your project
        </Link>
      </div>
    </div>
  );
}
