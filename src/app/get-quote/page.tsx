import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteBuilder, QuoteBuilderFallback } from "@/components/quote/quote-builder";

export const metadata: Metadata = {
  title: "Website Price Estimator",
  description:
    "Build your website plan and see an itemised price estimate in Malaysian ringgit: landing pages, business, portfolio, e-commerce and booking websites. No sign-up needed.",
  alternates: { canonical: "/get-quote" },
};

export default function GetQuotePage() {
  return (
    <div className="container-page py-12 sm:py-16 print:p-0">
      <header className="max-w-3xl print:hidden">
        <h1 className="text-[2.5rem] leading-[1.03] font-semibold sm:text-[3.4rem]">
          See what your website will cost.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Choose a website type, adjust the scope and add the features you need. The estimate updates as you go, and you
          don&rsquo;t need to share any contact details to see it.
        </p>
      </header>
      <div className="mt-12">
        <Suspense fallback={<QuoteBuilderFallback />}>
          <QuoteBuilder />
        </Suspense>
      </div>
    </div>
  );
}
