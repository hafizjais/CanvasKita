"use server";

import { headers } from "next/headers";
import { getContactEmail, getWhatsAppUrl } from "@/lib/contact";
import { deliverEnquiry } from "@/lib/enquiry-delivery";
import { readEnquiry, validateEnquiry, type EnquiryState } from "@/lib/enquiry";

const MIN_FILL_TIME_MS = 3000;
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

// Best-effort, per server instance. Serverless platforms may run several
// instances, so this slows down abuse rather than guaranteeing a hard limit.
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const timestamps = (recentSubmissions.get(key) ?? []).filter((time) => now - time < RATE_LIMIT.windowMs);
  if (timestamps.length >= RATE_LIMIT.max) {
    recentSubmissions.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  recentSubmissions.set(key, timestamps);
  if (recentSubmissions.size > 5000) recentSubmissions.clear();
  return false;
}

export async function submitEnquiry(previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const attempt = previous.attempt + 1;
  const values = readEnquiry(formData);

  // Spam checks. Bots get a normal-looking success so they don't adapt.
  const honeypot = String(formData.get("website_url") ?? "");
  const startedAt = Number(formData.get("started_at") ?? 0);
  const tooFast = startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS;
  if (honeypot || tooFast) {
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

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: "You've sent several enquiries in a short time. Please wait a few minutes and try again.",
      values,
      attempt,
    };
  }

  const result = await deliverEnquiry(values);

  if (!result.ok) {
    if (result.reason === "not_configured" && process.env.NODE_ENV !== "production") {
      console.warn("[enquiry] No delivery method configured. Received:", values);
    }
    const alternative = getWhatsAppUrl() || getContactEmail() ? "use one of the contact options below" : "try again later";
    return {
      status: "error",
      message:
        result.reason === "not_configured"
          ? `Online enquiries aren't connected yet, so your message wasn't sent. Please ${alternative}.`
          : `Something went wrong and your message wasn't sent. Please try again, or ${alternative}.`,
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
