"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ArrowLeft, ArrowRight, MessageCircle, Minus, Plus, Printer, RotateCcw } from "lucide-react";
import { EstimateDocument } from "@/components/quote/estimate-document";
import { EstimateSummary } from "@/components/quote/estimate-summary";
import { QuoteEnquiryForm } from "@/components/quote/quote-enquiry-form";
import { buttonClasses } from "@/components/ui/button";
import { packageIds, pricing, type AddOnId, type PackageId } from "@/config/pricing";
import { servicePackages } from "@/data/packages";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/contact";
import { calculateEstimate } from "@/lib/quote/calculate";
import { formatMYR, toSen } from "@/lib/quote/money";
import {
  emptySelection,
  isAddOnAvailable,
  selectionForPackage,
  selectionFromSearchParams,
  selectionToSearchParams,
  switchPackage,
} from "@/lib/quote/selection";
import { addDays, createReference, describeTotal, estimateToText, estimateToWhatsAppMessage, formatDate } from "@/lib/quote/summary";
import type { QuoteSelection } from "@/lib/quote/types";

type StepId = "type" | "scope" | "addons" | "estimate" | "enquiry";
type EstimateDoc = { reference: string; issuedAt: Date };

const stepLabels: Record<StepId, string> = {
  type: "Website type",
  scope: "Requirements",
  addons: "Features & add-ons",
  estimate: "Your estimate",
  enquiry: "Send enquiry",
};

const addOnGroups: { title: string; ids: AddOnId[] }[] = [
  { title: "Content & language", ids: ["copywriting", "secondLanguage", "blogCms"] },
  { title: "Marketing & tracking", ids: ["enhancedSeo", "googleAnalytics", "metaPixel", "newsletterCrm"] },
  { title: "Payments", ids: ["paymentGateway"] },
  { title: "Ongoing support", ids: ["maintenance"] },
];

function newDoc(): EstimateDoc {
  const issuedAt = new Date();
  const random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
  return { reference: createReference(issuedAt, random), issuedAt };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function addOnPrice(id: AddOnId) {
  const addOn = pricing.addOns[id];
  if (addOn.kind === "monthly") return `${formatMYR(toSen(addOn.amount))}/month`;
  return `${"isStartingPrice" in addOn && addOn.isStartingPrice ? "From " : ""}${formatMYR(toSen(addOn.amount))}`;
}

/* ------------------------------------------------------------------ */

function NumberField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  hint,
  onCommit,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  hint: string;
  onCommit: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  const parsed = Number(draft);
  const valid = draft.trim() !== "" && Number.isInteger(parsed) && parsed >= min && parsed <= max;
  const error = valid ? undefined : `Enter a whole number from ${min} to ${max}.`;

  function set(next: number) {
    const clamped = Math.min(max, Math.max(min, next));
    setDraft(String(clamped));
    onCommit(clamped);
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="mt-2 flex w-fit items-stretch rounded-lg border border-ink/20 bg-card has-[input[aria-invalid=true]]:border-danger">
        <button
          type="button"
          onClick={() => set((valid ? parsed : value) - step)}
          disabled={valid && parsed <= min}
          className="flex w-11 items-center justify-center rounded-l-lg text-ink hover:bg-ink/5 disabled:opacity-35"
        >
          <Minus aria-hidden="true" className="size-4" />
          <span className="sr-only">Decrease {label.toLowerCase()}</span>
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            const next = Number(event.target.value);
            if (event.target.value.trim() !== "" && Number.isInteger(next) && next >= min && next <= max) onCommit(next);
          }}
          onBlur={() => set(draft.trim() !== "" && Number.isFinite(parsed) ? Math.round(parsed) : value)}
          aria-invalid={!valid}
          aria-describedby={`${id}-${valid ? "hint" : "error"}`}
          className="w-16 border-x border-ink/15 bg-transparent py-2.5 text-center text-lg font-semibold tabular-nums [appearance:textfield] focus:outline-none focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => set((valid ? parsed : value) + step)}
          disabled={valid && parsed >= max}
          className="flex w-11 items-center justify-center rounded-r-lg text-ink hover:bg-ink/5 disabled:opacity-35"
        >
          <Plus aria-hidden="true" className="size-4" />
          <span className="sr-only">Increase {label.toLowerCase()}</span>
        </button>
      </div>
      {valid ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function OptionRow({
  checked,
  disabled,
  onChange,
  title,
  description,
  price,
  note,
  type = "checkbox",
  name,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  title: string;
  description?: string;
  price?: string;
  note?: string;
  type?: "checkbox" | "radio";
  name?: string;
}) {
  return (
    <label
      className={`flex gap-3.5 rounded-xl border p-4 transition-colors ${
        disabled ? "border-ink/10 bg-paper-deep/40" : "cursor-pointer border-ink/15 bg-card hover:border-ink/40"
      } has-checked:border-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-1 size-[1.1rem] shrink-0 accent-[var(--color-accent)] focus:outline-none"
      />
      <span className="flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="font-semibold">{title}</span>
          {price && <span className="text-sm font-semibold whitespace-nowrap text-accent tabular-nums">{price}</span>}
        </span>
        {description && <span className="mt-1 block text-sm leading-relaxed text-muted">{description}</span>}
        {note && <span className="mt-1.5 block text-sm text-graphite">{note}</span>}
      </span>
    </label>
  );
}

function StepHeading({ id, children, intro }: { id: string; children: ReactNode; intro?: ReactNode }) {
  return (
    <div className="mb-7">
      <h2 id={id} tabIndex={-1} className="text-[1.75rem] leading-tight font-semibold focus:outline-none sm:text-[2rem]">
        {children}
      </h2>
      {intro && <p className="mt-2 max-w-xl leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function QuoteBuilder() {
  const searchParams = useSearchParams();
  const [selection, setSelection] = useState<QuoteSelection>(() => selectionFromSearchParams(searchParams));
  const [step, setStep] = useState<StepId>(() => (searchParams.get("package") ? "scope" : "type"));
  const [doc, setDoc] = useState<EstimateDoc | null>(null);
  const [typeError, setTypeError] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigated = useRef(false);
  const uid = useId();

  const estimate = useMemo(() => calculateEstimate(selection), [selection]);
  const steps: StepId[] = ["type", "scope", "addons", "estimate", "enquiry"];
  const stepIndex = Math.max(0, steps.indexOf(step));
  const pkg = selection.packageId ? pricing.packages[selection.packageId] : null;

  // Keep the URL in step with the selection so an estimate can be bookmarked or shared.
  useEffect(() => {
    const query = selectionToSearchParams(selection).toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, [selection]);

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (!navigated.current) return;
    panelRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    document.getElementById(`${uid}-${step}`)?.focus({ preventScroll: true });
  }, [step, uid]);

  // Printing from the browser menu still produces a complete, referenced estimate.
  useEffect(() => {
    const onBeforePrint = () => flushSync(() => setDoc((current) => current ?? newDoc()));
    window.addEventListener("beforeprint", onBeforePrint);
    return () => window.removeEventListener("beforeprint", onBeforePrint);
  }, []);

  function update(next: QuoteSelection) {
    setSelection(next);
    setDoc(null); // a changed estimate gets a new reference
  }

  function goTo(next: StepId) {
    if (next !== "type" && !selection.packageId) {
      setTypeError(true);
      document.getElementById(`${uid}-type-options`)?.querySelector("input")?.focus();
      return;
    }
    if (next === "estimate" || next === "enquiry") {
      setDoc((current) => current ?? newDoc());
      if (next === "estimate") trackEvent("quote_estimate_viewed", { package: selection.packageId ?? "" });
    }
    navigated.current = true;
    setStep(next);
  }

  function choosePackage(id: PackageId) {
    setTypeError(false);
    update(selection.packageId ? switchPackage(selection, id) : selectionForPackage(id));
    trackEvent("quote_package_selected", { package: id });
  }

  function toggleAddOn(id: AddOnId) {
    const addOns = selection.addOns.includes(id) ? selection.addOns.filter((a) => a !== id) : [...selection.addOns, id];
    update({ ...selection, addOns });
  }

  function reset() {
    update({ ...emptySelection });
    setTypeError(false);
    navigated.current = true;
    setStep("type");
  }

  function print() {
    flushSync(() => setDoc((current) => current ?? newDoc()));
    trackEvent("quote_printed", { package: selection.packageId ?? "" });
    window.print();
  }

  const whatsappUrl = doc ? getWhatsAppUrl(estimateToWhatsAppMessage(estimate, doc.reference)) : null;
  const headingId = `${uid}-${step}`;

  /* --------------------------------------------------------------- */

  const typeStep = (
    <section aria-labelledby={headingId}>
      <StepHeading id={headingId} intro="Pick the closest match. You can change it at any time without losing compatible choices.">
        What kind of website do you need?
      </StepHeading>
      <fieldset aria-describedby={typeError ? `${uid}-type-error` : undefined}>
        <legend className="sr-only">Website type</legend>
        <div id={`${uid}-type-options`} className="grid gap-3 sm:grid-cols-2">
          {packageIds.map((id) => {
            const option = pricing.packages[id];
            return (
              <label
                key={id}
                className="flex cursor-pointer flex-col rounded-xl border border-ink/15 bg-card p-4 transition-colors hover:border-ink/40 has-checked:border-ink has-checked:bg-paper has-checked:shadow-[inset_0_0_0_1px_var(--color-ink)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent sm:p-5"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-display text-lg leading-snug font-semibold">{option.name}</span>
                  <input
                    type="radio"
                    name={`${uid}-package`}
                    value={id}
                    checked={selection.packageId === id}
                    onChange={() => choosePackage(id)}
                    className="mt-1 size-[1.1rem] shrink-0 accent-[var(--color-accent)] focus:outline-none"
                  />
                </span>
                <span className="mt-1 text-sm text-accent">
                  From {formatMYR(toSen(option.basePrice))}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted">{servicePackages[id].summary}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {typeError && (
        <p id={`${uid}-type-error`} role="alert" className="mt-4 text-sm text-danger">
          Choose a website type to continue.
        </p>
      )}
    </section>
  );

  const scopeStep = pkg && selection.packageId && (
    <section aria-labelledby={headingId}>
      <>
          <StepHeading id={headingId} intro={`The ${pkg.name} includes ${pkg.includedPages === 1 ? "one page" : `${pkg.includedPages} pages`}${pkg.includedProducts ? ` and ${pkg.includedProducts} product listings` : ""}. Adjust the scope to suit your business.`}>
            Configure your requirements
          </StepHeading>
          <div className="space-y-8">
            {pkg.maxPages > 1 ? (
              <NumberField
                key={`pages-${selection.packageId}`}
                id={`${uid}-pages`}
                label="Standard content pages"
                value={selection.pages}
                min={pkg.includedPages}
                max={pkg.maxPages}
                hint={`${pkg.includedPages} included. Extra pages are ${formatMYR(toSen(pricing.extraPagePrice))} each. Need more than ${pkg.maxPages}? Contact me for a quotation.`}
                onCommit={(pages) => update({ ...selection, pages })}
              />
            ) : (
              <div className="rounded-xl border border-ink/12 bg-card p-5 text-sm leading-relaxed text-graphite">
                <p className="font-semibold text-ink">Single page, up to seven content sections</p>
                <p className="mt-1">Need several pages? A Business or Portfolio Website will suit you better.</p>
              </div>
            )}

            {selection.packageId === "ecommerce" && (
              <>
                <NumberField
                  key="products"
                  id={`${uid}-products`}
                  label="Initial product listings"
                  value={selection.products}
                  min={pkg.includedProducts}
                  max={pricing.extraProducts.max}
                  step={pricing.extraProducts.blockSize}
                  hint={`${pkg.includedProducts} included. Additional listings are ${formatMYR(toSen(pricing.extraProducts.price))} per ${pricing.extraProducts.blockSize}.`}
                  onCommit={(products) => update({ ...selection, products })}
                />
                <OptionRow
                  checked={selection.advancedCommerce}
                  onChange={() => update({ ...selection, advancedCommerce: !selection.advancedCommerce })}
                  title="More than one payment gateway, or advanced shipping rules"
                  description="One gateway and basic shipping are included. Anything beyond that is reviewed first."
                  price="Quoted separately"
                />
              </>
            )}

            {selection.packageId === "booking" && (
              <>
                <fieldset>
                  <legend className="text-sm font-semibold">How will bookings work?</legend>
                  <div className="mt-3 grid gap-3">
                    <OptionRow
                      type="radio"
                      name={`${uid}-scheduling`}
                      checked={!selection.complexScheduling}
                      onChange={() => update({ ...selection, complexScheduling: false })}
                      title="One calendar or service list"
                      description="A single schedule with standard availability and confirmations."
                      price="Included"
                    />
                    <OptionRow
                      type="radio"
                      name={`${uid}-scheduling`}
                      checked={selection.complexScheduling}
                      onChange={() => update({ ...selection, complexScheduling: true })}
                      title="Multiple staff, rooms or locations, or custom rules"
                      description="For example, per-staff calendars, room capacity or variable durations."
                      price="Quoted separately"
                    />
                  </div>
                </fieldset>
                <OptionRow
                  checked={selection.addOns.includes("paymentGateway")}
                  onChange={() => toggleAddOn("paymentGateway")}
                  title="Take payments or deposits when customers book"
                  description="Sets up one payment gateway. The same option appears under add-ons."
                  price={addOnPrice("paymentGateway")}
                />
              </>
            )}
          </div>
      </>
    </section>
  );

  const addonsStep = pkg && selection.packageId && (
    <section aria-labelledby={headingId}>
      <StepHeading id={headingId} intro="Everything is optional. Features already in your package are marked as included.">
        Features &amp; add-ons
      </StepHeading>
      <div className="space-y-8">
        {addOnGroups.map((group) => {
          const visible = group.ids.filter(
            (id) =>
              isAddOnAvailable(id, selection.packageId) ||
              (pricing.packages[selection.packageId!].includedAddOns as AddOnId[]).includes(id),
          );
          if (!visible.length) return null;
          return (
            <fieldset key={group.title}>
              <legend className="text-xs font-semibold tracking-[0.1em] text-muted uppercase">{group.title}</legend>
              <div className="mt-3 grid gap-3">
                {visible.map((id) => {
                  const addOn = pricing.addOns[id];
                  const included = !isAddOnAvailable(id, selection.packageId);
                  const covers = "coversPages" in addOn ? addOn.coversPages : undefined;
                  const overLimit = covers && selection.pages > covers && selection.addOns.includes(id);
                  return (
                    <OptionRow
                      key={id}
                      checked={included || selection.addOns.includes(id)}
                      disabled={included}
                      onChange={() => toggleAddOn(id)}
                      title={addOn.label}
                      description={addOn.description}
                      price={included ? "Included" : addOnPrice(id)}
                      note={
                        overLimit
                          ? `Covers ${covers} of your ${selection.pages} pages; the other ${selection.pages - covers} are quoted separately.`
                          : addOn.kind === "monthly"
                            ? "Billed monthly and kept separate from the project estimate."
                            : undefined
                      }
                    />
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>
    </section>
  );

  const estimateStep = doc && estimate.status === "priced" && (
    <section aria-labelledby={headingId}>
      <StepHeading
        id={headingId}
        intro={
          <>
            Estimate <strong className="text-ink">{doc.reference}</strong>, issued {formatDate(doc.issuedAt)} and valid
            until {formatDate(addDays(doc.issuedAt, pricing.estimate.validityDays))}, subject to confirmation.
          </>
        }
      >
        Your estimate
      </StepHeading>
      <div className="rounded-2xl border border-ink/12 bg-card p-5 sm:p-7">
        <p className="mb-5 font-display text-xl font-semibold">{estimate.packageName}</p>
        <EstimateSummary estimate={estimate} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        A preliminary estimate, not a binding quotation. Hosting, third-party subscriptions, payment processing
        fees and taxes are not included; the printable version lists every exclusion and assumption.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={print} className={buttonClasses("secondary", "md")}>
          <Printer aria-hidden="true" className="size-4" />
          Print or Save as PDF
        </button>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("accent", "md")}
            onClick={() => trackEvent("whatsapp_click", { location: "quote_estimate" })}
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            Send via WhatsApp
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </section>
  );

  const enquiryStep = doc && selection.packageId && (
    <section aria-labelledby={headingId}>
      <StepHeading
        id={headingId}
        intro={`Send estimate ${doc.reference} with your details and I'll reply to discuss it. No commitment.`}
      >
        Send your enquiry
      </StepHeading>
      <QuoteEnquiryForm
        selectionQuery={selectionToSearchParams(selection).toString()}
        reference={doc.reference}
        estimateText={estimateToText(estimate, doc.reference)}
        whatsappMessage={estimateToWhatsAppMessage(estimate, doc.reference)}
      />
      {whatsappUrl && (
        <p className="mt-5 text-sm text-muted">
          Prefer WhatsApp?{" "}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink underline decoration-accent underline-offset-4"
            onClick={() => trackEvent("whatsapp_click", { location: "quote_enquiry" })}
          >
            Send this estimate on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
          </a>
          . The message opens in WhatsApp for you to review before sending.
        </p>
      )}
    </section>
  );

  const content: Record<StepId, ReactNode> = {
    type: typeStep,
    scope: scopeStep,
    addons: addonsStep,
    estimate: estimateStep,
    enquiry: enquiryStep,
  };

  const nextStep = steps[stepIndex + 1];
  const previousStep = steps[stepIndex - 1];
  const nextLabel = nextStep === "estimate" ? "View Estimate" : nextStep === "enquiry" ? "Send as Enquiry" : "Continue";

  return (
    <>
      <div className="grid gap-10 print:hidden lg:grid-cols-12 lg:gap-12" ref={panelRef} style={{ scrollMarginTop: "6rem" }}>
        <div className="lg:col-span-8">
          {/* Progress */}
          <nav aria-label="Estimate steps">
            <p className="text-sm text-muted sm:hidden">
              Step {stepIndex + 1} of {steps.length} · <span className="font-semibold text-ink">{stepLabels[step]}</span>
            </p>
            <div className="mt-2 h-1 rounded-full bg-ink/10 sm:hidden" aria-hidden="true">
              <div className="h-1 rounded-full bg-accent transition-[width]" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
            </div>
            <ol className="hidden gap-2 sm:flex sm:flex-wrap">
              {steps.map((id, index) => {
                const current = id === step;
                const reachable = id === "type" || Boolean(selection.packageId);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => goTo(id)}
                      disabled={!reachable}
                      aria-current={current ? "step" : undefined}
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                        current
                          ? "border-ink bg-ink text-paper"
                          : "border-ink/15 text-graphite hover:border-ink/50 disabled:cursor-not-allowed disabled:opacity-45"
                      }`}
                    >
                      <span className="font-display text-xs font-semibold tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                      {stepLabels[id]}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Running total on small screens (not fixed, so it never covers controls) */}
          {selection.packageId && (
            <div className="mt-5 flex items-baseline justify-between gap-4 rounded-xl bg-paper-deep/70 px-4 py-3 lg:hidden" aria-live="polite">
              <span className="text-sm text-muted">Current estimate</span>
              <span className="text-right">
                <span className="font-display text-lg font-semibold">{describeTotal(estimate)}</span>
                {estimate.status === "priced" && estimate.monthlyTotal > 0 && (
                  <span className="block text-xs text-muted">+ {formatMYR(estimate.monthlyTotal)}/month</span>
                )}
              </span>
            </div>
          )}

          <div className="mt-8">{content[step]}</div>

          {/* Back / next */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink/12 pt-6">
            {previousStep ? (
              <button type="button" onClick={() => goTo(previousStep)} className={buttonClasses("secondary", "md")}>
                <ArrowLeft aria-hidden="true" className="size-4" />
                Back
              </button>
            ) : (
              <span />
            )}
            {nextStep && (
              <button type="button" onClick={() => goTo(nextStep)} className={buttonClasses("primary", "md")}>
                {nextLabel}
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside aria-labelledby={`${uid}-summary`} className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24 rounded-2xl border border-ink/12 bg-card p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={`${uid}-summary`} className="text-lg font-semibold">
                Your estimate
              </h2>
              {selection.packageId && <span className="text-xs text-muted">MYR</span>}
            </div>
            {pkg && <p className="mt-1 text-sm text-muted">{pkg.name}</p>}
            <div className="mt-5" aria-live="polite">
              <EstimateSummary estimate={estimate} variant="compact" />
            </div>
            {selection.packageId && (
              <>
                <p className="mt-5 border-t border-ink/10 pt-4 text-xs leading-relaxed text-muted">
                  A preliminary estimate, not a quotation. No account or contact details are needed to see it.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
                >
                  <RotateCcw aria-hidden="true" className="size-3.5" />
                  Start over
                </button>
              </>
            )}
          </div>
        </aside>

        {selection.packageId && (
          <div className="lg:hidden">
            <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
              <RotateCcw aria-hidden="true" className="size-3.5" />
              Start over
            </button>
          </div>
        )}
      </div>

      {doc && estimate.status !== "empty" && (
        <div className="hidden print:block">
          <EstimateDocument estimate={estimate} reference={doc.reference} issuedAt={doc.issuedAt} />
        </div>
      )}
    </>
  );
}

/**
 * Shown in the prerendered page until the estimator starts (a fraction of a
 * second), and as a usable price list if JavaScript is unavailable.
 */
export function QuoteBuilderFallback() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-semibold">Starting prices</h2>
      <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
        {packageIds.map((id) => (
          <li key={id} className="flex justify-between gap-4 py-3">
            <span className="font-semibold">{pricing.packages[id].name}</span>
            <span>From {formatMYR(toSen(pricing.packages[id].basePrice))}</span>
          </li>
        ))}
      </ul>
      <noscript>
        <p className="mt-4 text-muted">
          The interactive estimator needs JavaScript. You can still use the enquiry form on the homepage.
        </p>
      </noscript>
    </div>
  );
}
