"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitQuoteEnquiry } from "@/app/actions/quote-enquiry";
import { buttonClasses } from "@/components/ui/button";
import { describedBy, FormField, inputClasses } from "@/components/ui/form-field";
import { trackEvent } from "@/lib/analytics";
import { limits } from "@/lib/enquiry";
import {
  initialQuoteEnquiryState,
  readQuoteEnquiry,
  validateQuoteEnquiry,
  type QuoteEnquiryErrors,
} from "@/lib/quote/enquiry";

const PREFIX = "quote";
const subscribeNoop = () => () => {};

type Props = {
  /** The selection as a query string; the server recalculates the estimate from it. */
  selectionQuery: string;
  reference: string;
  requiresDescription: boolean;
};

export function QuoteEnquiryForm({ selectionQuery, reference, requiresDescription }: Props) {
  const [state, formAction, pending] = useActionState(submitQuoteEnquiry, initialQuoteEnquiryState);
  const [clientErrors, setClientErrors] = useState<QuoteEnquiryErrors | null>(null);
  const enhanced = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.attempt === 0) return;
    if (state.status === "success") trackEvent("quote_enquiry_submitted");
    statusRef.current?.focus();
  }, [state.attempt, state.status]);

  const errors = clientErrors ?? state.errors ?? {};
  const values = state.status === "error" ? (state.values ?? {}) : {};

  function onFirstInteraction() {
    if (started.current) return;
    started.current = true;
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
    trackEvent("quote_enquiry_start");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const found = validateQuoteEnquiry(readQuoteEnquiry(new FormData(event.currentTarget)), requiresDescription);
    if (Object.keys(found).length > 0) {
      event.preventDefault();
      setClientErrors(found);
      event.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
    } else {
      setClientErrors(null);
    }
  }

  if (state.status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl border border-ink/12 bg-card p-7 focus:outline-none sm:p-9">
        <CheckCircle2 aria-hidden="true" className="size-9 text-success" />
        <h3 className="mt-5 text-2xl font-semibold">Enquiry sent</h3>
        <p className="mt-3 max-w-md leading-relaxed text-graphite">
          {state.message ?? "Thank you, your enquiry has been sent. I'll reply using the contact details you provided."}
        </p>
      </div>
    );
  }

  const notesLabel = requiresDescription ? "What does the system need to do?" : "Anything else I should know?";
  const notesHint = requiresDescription
    ? "Who will use it, the main tasks it must handle, and any tools it should connect to."
    : "Your business, deadlines, or features you're unsure about.";

  return (
    <form
      key={state.attempt}
      action={formAction}
      onSubmit={onSubmit}
      onFocus={onFirstInteraction}
      noValidate={enhanced}
      aria-describedby="quote-privacy"
      className="rounded-2xl border border-ink/12 bg-card p-6 sm:p-8"
    >
      <input type="hidden" name="selection" value={selectionQuery} />
      <input type="hidden" name="reference" value={reference} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField prefix={PREFIX} id="name" label="Your name" error={errors.name}>
          <input
            id="quote-name"
            name="name"
            autoComplete="name"
            required
            maxLength={limits.name}
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy(PREFIX, "name", errors.name)}
            className={inputClasses}
          />
        </FormField>
        <FormField prefix={PREFIX} id="business" label="Business name" optional error={errors.business}>
          <input
            id="quote-business"
            name="business"
            autoComplete="organization"
            maxLength={limits.business}
            defaultValue={values.business}
            aria-invalid={Boolean(errors.business)}
            aria-describedby={describedBy(PREFIX, "business", errors.business)}
            className={inputClasses}
          />
        </FormField>
        <div className="sm:col-span-2">
          <FormField
            prefix={PREFIX}
            id="contact"
            label="Email or WhatsApp number"
            error={errors.contact}
            hint="Whichever you'd prefer me to reply to."
          >
            <input
              id="quote-contact"
              name="contact"
              autoComplete="email"
              required
              maxLength={limits.contact}
              defaultValue={values.contact}
              aria-invalid={Boolean(errors.contact)}
              aria-describedby={describedBy(PREFIX, "contact", errors.contact, true)}
              className={inputClasses}
            />
          </FormField>
        </div>
        <div className="sm:col-span-2">
          <FormField
            prefix={PREFIX}
            id="notes"
            label={notesLabel}
            optional={!requiresDescription}
            error={errors.notes}
            hint={notesHint}
          >
            <textarea
              id="quote-notes"
              name="notes"
              rows={4}
              required={requiresDescription}
              minLength={requiresDescription ? limits.messageMin : undefined}
              maxLength={limits.message}
              defaultValue={values.notes}
              aria-invalid={Boolean(errors.notes)}
              aria-describedby={describedBy(PREFIX, "notes", errors.notes, true)}
              className={`${inputClasses} min-h-28 resize-y`}
            />
          </FormField>
        </div>
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="quote-website_url">Leave this field empty</label>
        <input id="quote-website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="started_at" defaultValue="" />

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="focus:outline-none">
        {clientErrors ? (
          <p role="alert" className="mt-6 text-sm text-danger">
            Please check the highlighted fields.
          </p>
        ) : (
          state.status === "error" &&
          state.message && (
            <p role="alert" className="mt-6 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm">
              {state.message}
            </p>
          )
        )}
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="quote-privacy" className="max-w-xs text-xs leading-relaxed text-muted">
          Your estimate {reference} is attached automatically. Details are only used to reply. See the{" "}
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
              Send Estimate Enquiry
              <Send aria-hidden="true" className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
