"use server";

import { getContactEmail, getWhatsAppUrl } from "@/lib/contact";
import { deliverSubmission, deliveryFailureMessage } from "@/lib/enquiry-delivery";
import { isRateLimited, looksLikeSpam, rateLimitMessage } from "@/lib/enquiry-guard";
import { calculateEstimate } from "@/lib/quote/calculate";
import { readQuoteEnquiry, validateQuoteEnquiry, type QuoteEnquiryState } from "@/lib/quote/enquiry";
import { selectionFromSearchParams } from "@/lib/quote/selection";
import { createReference, describeTotal, estimateToText, isValidReference } from "@/lib/quote/summary";

export async function submitQuoteEnquiry(previous: QuoteEnquiryState, formData: FormData): Promise<QuoteEnquiryState> {
  const attempt = previous.attempt + 1;
  const values = readQuoteEnquiry(formData);

  if (looksLikeSpam(formData)) {
    return { status: "success", attempt };
  }

  // The estimate is recalculated here from the selected options, so the
  // prices in the enquiry always come from the pricing configuration.
  const estimate = calculateEstimate(selectionFromSearchParams(new URLSearchParams(String(formData.get("selection") ?? ""))));
  if (estimate.status === "empty") {
    return { status: "error", message: "Please choose a website type before sending.", values, attempt };
  }

  const errors = validateQuoteEnquiry(values);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values, attempt };
  }

  if (await isRateLimited()) {
    return { status: "error", message: rateLimitMessage, values, attempt };
  }

  const submittedReference = String(formData.get("reference") ?? "");
  const reference = isValidReference(submittedReference) ? submittedReference : createReference(new Date());
  const summary = estimateToText(estimate, reference);

  const result = await deliverSubmission({
    subject: `Estimate enquiry ${reference}: ${estimate.packageName}, ${describeTotal(estimate)} — ${values.name}`,
    heading: `Estimate enquiry ${reference}`,
    rows: [
      ["Name", values.name],
      ["Business", values.business],
      ["Contact", values.contact],
      ["Notes", values.notes],
      ["Estimate", summary],
    ],
    payload: { type: "estimate", reference, ...values, packageId: estimate.packageId, estimate: summary },
    contact: values.contact,
  });

  if (!result.ok) {
    if (result.reason === "not_configured" && process.env.NODE_ENV !== "production") {
      console.warn("[quote-enquiry] No delivery method configured. Received:", values, `\n${summary}`);
    }
    return {
      status: "error",
      message: deliveryFailureMessage(result.reason, Boolean(getWhatsAppUrl() || getContactEmail())),
      values,
      attempt,
    };
  }

  return {
    status: "success",
    message: `Thank you, your enquiry and estimate ${reference} have been sent. I'll reply using the contact details you provided.`,
    attempt,
  };
}
