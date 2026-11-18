"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitEnquiry } from "@/app/actions/enquiry";
import { buttonClasses } from "@/components/ui/button";
import { describedBy as sharedDescribedBy, FormField, inputClasses } from "@/components/ui/form-field";
import { BUDGET_OTHER, enquiryOptions } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { DeliveryFallback } from "@/components/delivery-fallback";
import {
  enquiryToText,
  initialEnquiryState,
  limits,
  readEnquiry,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryField,
} from "@/lib/enquiry";

function Field(props: { id: EnquiryField; label: string; optional?: boolean; error?: string; hint?: string; children: ReactNode }) {
  return <FormField prefix="enquiry" {...props} />;
}

const subscribeNoop = () => () => {};

/** WebMCP form annotations (spread, as React's types don't list these attributes yet). */
const webMcpTool: Record<string, string> = {
  toolname: "send_project_enquiry",
  tooldescription:
    "Send a website project enquiry to Hafiz MJ Digital: name, contact (email or phone), website type, project description, budget and timeline.",
};

/**
 * Budget range, with an "Other" choice that reveals a box for the visitor's own amount.
 * Rendered inside the keyed form, so it resets whenever the form does.
 */
function BudgetFields({
  defaultBudget,
  defaultOther,
  errors,
}: {
  defaultBudget: string;
  defaultOther: string;
  errors: EnquiryErrors;
}) {
  const [choice, setChoice] = useState(defaultBudget);
  const showOther = choice === BUDGET_OTHER;

  return (
    <div className="space-y-5">
      <Field id="budget" label="Approximate budget" optional error={errors.budget}>
        <select
          id="enquiry-budget"
          name="budget"
          value={choice}
          onChange={(event) => setChoice(event.target.value)}
          aria-invalid={Boolean(errors.budget)}
          aria-describedby={sharedDescribedBy("enquiry", "budget", errors.budget)}
          className={inputClasses}
        >
          <option value="">Prefer not to say</option>
          {enquiryOptions.budgets.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>
      {showOther && (
        <Field id="budgetOther" label="Your budget" error={errors.budgetOther} hint="For example RM1,500, or a range such as RM800 – RM1,200.">
          <input
            id="enquiry-budgetOther"
            name="budgetOther"
            required
            maxLength={limits.budgetOther}
            defaultValue={defaultOther}
            aria-invalid={Boolean(errors.budgetOther)}
            aria-describedby={sharedDescribedBy("enquiry", "budgetOther", errors.budgetOther, true)}
            className={inputClasses}
          />
        </Field>
      )}
    </div>
  );
}

export function EnquiryForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialEnquiryState);
  const [clientErrors, setClientErrors] = useState<EnquiryErrors | null>(null);
  const [dismissedAttempt, setDismissedAttempt] = useState(-1);
  // Native validation stays on until JavaScript can provide richer messages.
  const enhanced = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const started = useRef(false);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (state.attempt === 0) return;
    if (state.status === "success") trackEvent("enquiry_submitted");
    statusRef.current?.focus();
  }, [state.attempt, state.status]);

  const errors = clientErrors ?? state.errors ?? {};
  const values = state.status === "error" ? (state.values ?? {}) : {};
  const showSuccess = state.status === "success" && dismissedAttempt !== state.attempt;

  function onFirstInteraction() {
    if (started.current) return;
    started.current = true;
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
    trackEvent("enquiry_start");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const found = validateEnquiry(readEnquiry(new FormData(event.currentTarget)));
    if (Object.keys(found).length > 0) {
      event.preventDefault();
      setClientErrors(found);
      const first = Object.keys(found)[0];
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    } else {
      setClientErrors(null);
    }
  }

  const describedBy = (field: EnquiryField, hasHint = false) =>
    errors[field] ? `enquiry-${field}-error` : hasHint ? `enquiry-${field}-hint` : undefined;

  if (showSuccess) {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl bg-card p-8 text-ink focus:outline-none sm:p-10"
      >
        <CheckCircle2 aria-hidden="true" className="size-9 text-success" />
        <h3 className="mt-5 text-2xl font-semibold">Enquiry sent</h3>
        <p className="mt-3 max-w-md leading-relaxed text-graphite">
          {state.message ??
            "Thank you, your enquiry has been sent. I'll reply using the contact details you provided."}
        </p>
        <button
          type="button"
          onClick={() => setDismissedAttempt(state.attempt)}
          className="mt-8 text-sm font-semibold text-accent underline underline-offset-4"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      key={state.attempt}
      action={formAction}
      onSubmit={onSubmit}
      onFocus={onFirstInteraction}
      noValidate={enhanced}
      aria-describedby="enquiry-privacy"
      className="rounded-2xl bg-card p-6 text-ink sm:p-8"
      // WebMCP declarative tool: lets AI agents recognise this form as "send a project enquiry".
      {...webMcpTool}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name}>
          <input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            required
            maxLength={limits.name}
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={inputClasses}
          />
        </Field>

        <Field id="business" label="Business name" optional error={errors.business}>
          <input
            id="enquiry-business"
            name="business"
            autoComplete="organization"
            maxLength={limits.business}
            defaultValue={values.business}
            aria-invalid={Boolean(errors.business)}
            aria-describedby={describedBy("business")}
            className={inputClasses}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field
            id="contact"
            label="Email or WhatsApp number"
            error={errors.contact}
            hint="Whichever you'd prefer me to reply to."
          >
            <input
              id="enquiry-contact"
              name="contact"
              autoComplete="email"
              required
              maxLength={limits.contact}
              defaultValue={values.contact}
              aria-invalid={Boolean(errors.contact)}
              aria-describedby={describedBy("contact", true)}
              className={inputClasses}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field id="websiteType" label="What do you need?" error={errors.websiteType}>
            <select
              id="enquiry-websiteType"
              name="websiteType"
              required
              defaultValue={values.websiteType ?? ""}
              aria-invalid={Boolean(errors.websiteType)}
              aria-describedby={describedBy("websiteType")}
              className={inputClasses}
            >
              <option value="" disabled>
                Choose one
              </option>
              {enquiryOptions.websiteTypes.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id="message"
            label="Tell me about your project"
            error={errors.message}
            hint="What your business does, and what the website should help you achieve."
          >
            <textarea
              id="enquiry-message"
              name="message"
              rows={4}
              required
              minLength={limits.messageMin}
              maxLength={limits.message}
              defaultValue={values.message}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy("message", true)}
              className={`${inputClasses} min-h-28 resize-y`}
            />
          </Field>
        </div>

        <BudgetFields defaultBudget={values.budget ?? ""} defaultOther={values.budgetOther ?? ""} errors={errors} />

        <Field id="timeline" label="Desired timeline" optional error={errors.timeline}>
          <select
            id="enquiry-timeline"
            name="timeline"
            defaultValue={values.timeline ?? ""}
            aria-invalid={Boolean(errors.timeline)}
            aria-describedby={describedBy("timeline")}
            className={inputClasses}
          >
            <option value="">Not decided</option>
            {enquiryOptions.timelines.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Spam protection: a field people never see, and the time taken to fill the form. */}
      <div aria-hidden="true" inert className="absolute -left-[9999px] h-px w-px overflow-hidden print:hidden">
        <label htmlFor="website_url">Leave this field empty</label>
        <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="started_at" defaultValue="" />

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="focus:outline-none">
        {state.status === "error" && state.message && !clientErrors && (
          <div role="alert" className="mt-6 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-ink">
            <p>{state.message}</p>
            {!state.errors && (
              <DeliveryFallback
                whatsappMessage={`Hi Hafiz, I'd like to discuss a website project.\n\n${enquiryToText(state.values ?? {})}`}
                emailSubject="Website project enquiry"
                emailBody={enquiryToText(state.values ?? {})}
              />
            )}
          </div>
        )}
        {clientErrors && (
          <p role="alert" className="mt-6 text-sm text-danger">
            Please check the highlighted fields.
          </p>
        )}
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="enquiry-privacy" className="max-w-xs text-xs leading-relaxed text-muted">
          Your details are only used to reply to your enquiry. See the{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
            privacy notice
          </Link>
          .
        </p>
        <button type="submit" disabled={pending} className={buttonClasses("primary", "lg", "shrink-0")}>
          {pending ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send Enquiry
              <Send aria-hidden="true" className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
