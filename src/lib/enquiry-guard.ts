import "server-only";
import { headers } from "next/headers";

/** Spam and abuse checks shared by every form on the site. */

const MIN_FILL_TIME_MS = 3000;
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

// Best-effort, per server instance. Serverless platforms may run several
// instances, so this slows down abuse rather than guaranteeing a hard limit.
const recentSubmissions = new Map<string, number[]>();

/** A filled honeypot field, or a form completed faster than a person could. */
export function looksLikeSpam(formData: FormData) {
  const honeypot = String(formData.get("website_url") ?? "");
  const startedAt = Number(formData.get("started_at") ?? 0);
  return Boolean(honeypot) || (startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS);
}

export async function isRateLimited() {
  const requestHeaders = await headers();
  const key =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";

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

export const rateLimitMessage =
  "You've sent several enquiries in a short time. Please wait a few minutes and try again.";
