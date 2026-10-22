"use server";

import { getContactEmail, getWhatsAppUrl } from "@/lib/contact";
import { deliverEnquiry, deliveryFailureMessage } from "@/lib/enquiry-delivery";
import { isRateLimited, looksLikeSpam, rateLimitMessage } from "@/lib/enquiry-guard";
import { readEnquiry, validateEnquiry, type EnquiryState } from "@/lib/enquiry";

export async function submitEnquiry(previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const attempt = previous.attempt + 1;
  const values = readEnquiry(formData);

  // Bots get a normal-looking success so they don't adapt.
  if (looksLikeSpam(formData)) {
    return { status: "success", attempt };
  }

  const errors = validateEnquiry(values);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors,
      values,
      attempt,
    };
  }

  if (await isRateLimited()) {
    return { status: "error", message: rateLimitMessage, values, attempt };
  }

  const result = await deliverEnquiry(values);

  if (!result.ok) {
    if (result.reason === "not_configured" && process.env.NODE_ENV !== "production") {
      console.warn("[enquiry] No delivery method configured. Received:", values);
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
    message: "Thank you, your enquiry has been sent. I'll reply using the contact details you provided.",
    attempt,
  };
}
