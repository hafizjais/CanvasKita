"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitEnquiry } from "@/app/actions/enquiry";
import { buttonClasses } from "@/components/ui/button";
import { enquiryOptions } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { getContactEmail, getWhatsAppUrl } from "@/lib/contact";
import {
  initialEnquiryState,
  limits,
  readEnquiry,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryField,
} from "@/lib/enquiry";

const inputClasses =
  "block w-full rounded-lg border border-ink/20 bg-card px-3.5 py-3 text-base text-ink placeholder:text-muted/70 transition-colors hover:border-ink/40 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent aria-[invalid=true]:border-danger";

function Field({
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  id: EnquiryField;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`enquiry-${id}`} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`enquiry-${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`enquiry-${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const subscribeNoop = () => () => {};

export function EnquiryForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialEnquiryState);
  const [clientErrors, setClientErrors] = useState<EnquiryErrors | null>(null);
  const [dismissedAttempt, setDismissedAttempt] = useState(-1);
  // Native validation stays on until JavaScript can provide richer messages.
  const enhanced = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const started = useRef(false);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const whatsappUrl = getWhatsAppUrl();
  const email = getContactEmail();

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

        <Field id="budget" label="Approximate budget" optional error={errors.budget}>
          <select
            id="enquiry-budget"
            name="budget"
            defaultValue={values.budget ?? ""}
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={describedBy("budget")}
            className={inputClasses}
          >
            <option value="">Prefer not to say</option>
            {enquiryOptions.budgets.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>

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
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website_url">Leave this field empty</label>
        <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="started_at" defaultValue="" />

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="focus:outline-none">
        {state.status === "error" && state.message && !clientErrors && (
          <div role="alert" className="mt-6 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-ink">
            <p>{state.message}</p>
            {!state.errors && (whatsappUrl || email) && (
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-semibold">
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    Message me on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="underline underline-offset-4">
                    Email {email}
                  </a>
                )}
              </p>
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
