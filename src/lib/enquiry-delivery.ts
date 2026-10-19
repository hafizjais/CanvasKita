import "server-only";
import { siteConfig } from "@/config/site";
import { isEmail, type EnquiryValues } from "@/lib/enquiry";

/**
 * Sends an enquiry using whichever method is configured:
 *   1. Resend email API  (RESEND_API_KEY + ENQUIRY_TO_EMAIL [+ ENQUIRY_FROM_EMAIL])
 *   2. Webhook           (ENQUIRY_WEBHOOK_URL), e.g. Make, Zapier, n8n or a
 *                        Google Apps Script that writes to a sheet
 * If neither is set, nothing is sent and the visitor is told so.
 */

export type DeliveryResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

const labels: Record<keyof EnquiryValues, string> = {
  name: "Name",
  business: "Business",
  contact: "Contact",
  websiteType: "Website needed",
  message: "Project description",
  budget: "Budget",
  timeline: "Timeline",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function asText(values: EnquiryValues) {
  return (Object.keys(labels) as (keyof EnquiryValues)[])
    .map((key) => `${labels[key]}: ${values[key] || "—"}`)
    .join("\n");
}

function asHtml(values: EnquiryValues) {
  const rows = (Object.keys(labels) as (keyof EnquiryValues)[])
    .map(
      (key) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5c5850;vertical-align:top">${labels[key]}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(values[key] || "—")}</td></tr>`,
    )
    .join("");
  return `<h2 style="font-family:sans-serif">New project enquiry</h2><table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">${rows}</table>`;
}

export function isDeliveryConfigured() {
  return Boolean(
    (process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL) || process.env.ENQUIRY_WEBHOOK_URL,
  );
}

export async function deliverEnquiry(values: EnquiryValues): Promise<DeliveryResult> {
  const { RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL, ENQUIRY_WEBHOOK_URL } = process.env;
  const subject = `New enquiry: ${values.websiteType} — ${values.name}${values.business ? ` (${values.business})` : ""}`;

  try {
    if (RESEND_API_KEY && ENQUIRY_TO_EMAIL) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: ENQUIRY_FROM_EMAIL || `${siteConfig.name} <onboarding@resend.dev>`,
          to: ENQUIRY_TO_EMAIL.split(",").map((email) => email.trim()),
          reply_to: isEmail(values.contact) ? values.contact : undefined,
          subject,
          text: asText(values),
          html: asHtml(values),
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) {
        console.error("[enquiry] Resend responded with", response.status, await response.text());
        return { ok: false, reason: "failed" };
      }
      return { ok: true };
    }

    if (ENQUIRY_WEBHOOK_URL) {
      const response = await fetch(ENQUIRY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, submittedAt: new Date().toISOString(), ...values }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) {
        console.error("[enquiry] Webhook responded with", response.status);
        return { ok: false, reason: "failed" };
      }
      return { ok: true };
    }
  } catch (error) {
    console.error("[enquiry] Delivery error", error);
    return { ok: false, reason: "failed" };
  }

  return { ok: false, reason: "not_configured" };
}
