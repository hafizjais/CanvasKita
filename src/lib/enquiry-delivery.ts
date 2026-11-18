import "server-only";
import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";
import { budgetText, isEmail, type EnquiryValues } from "@/lib/enquiry";

/**
 * Sends a form submission using whichever method is configured, in this order:
 *   1. SMTP              (SMTP_HOST + SMTP_USER + SMTP_PASS + ENQUIRY_TO_EMAIL
 *                        [+ SMTP_PORT, ENQUIRY_FROM_EMAIL]), e.g. a Hostinger
 *                        Email mailbox on smtp.hostinger.com
 *   2. Resend email API  (RESEND_API_KEY + ENQUIRY_TO_EMAIL [+ ENQUIRY_FROM_EMAIL])
 *   3. Webhook           (ENQUIRY_WEBHOOK_URL), e.g. Make, Zapier, n8n or a
 *                        Google Apps Script that writes to a sheet
 * If none is set, nothing is sent and the visitor is told so.
 */

export type DeliveryResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

export type Submission = {
  subject: string;
  heading: string;
  /** Label/value pairs for the email body. */
  rows: [label: string, value: string][];
  /** Flat JSON sent to the webhook. */
  payload: Record<string, unknown>;
  /** The visitor's contact detail; used as reply-to when it is an email address. */
  contact: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

const asText = (rows: Submission["rows"]) => rows.map(([label, value]) => `${label}: ${value || "—"}`).join("\n");

function asHtml(heading: string, rows: Submission["rows"]) {
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#555c66;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value || "—")}</td></tr>`,
    )
    .join("");
  return `<h2 style="font-family:sans-serif">${escapeHtml(heading)}</h2><table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">${body}</table>`;
}

function isSmtpConfigured() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, ENQUIRY_TO_EMAIL } = process.env;
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && ENQUIRY_TO_EMAIL);
}

export function isDeliveryConfigured() {
  return Boolean(
    isSmtpConfigured() ||
      (process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL) ||
      process.env.ENQUIRY_WEBHOOK_URL,
  );
}

export async function deliverSubmission(submission: Submission): Promise<DeliveryResult> {
  const { RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL, ENQUIRY_WEBHOOK_URL } = process.env;
  const { subject, heading, rows, payload, contact } = submission;

  try {
    if (isSmtpConfigured() && ENQUIRY_TO_EMAIL) {
      const port = Number(process.env.SMTP_PORT) || 465;
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        // 465 uses implicit TLS; other ports (e.g. 587) upgrade with STARTTLS.
        secure: port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      });
      await transport.sendMail({
        // The sender must be the authenticated mailbox, or Hostinger rejects the message.
        from: ENQUIRY_FROM_EMAIL || `${siteConfig.name} <${process.env.SMTP_USER}>`,
        to: ENQUIRY_TO_EMAIL.split(",").map((email) => email.trim()),
        replyTo: isEmail(contact) ? contact : undefined,
        subject,
        text: asText(rows),
        html: asHtml(heading, rows),
      });
      return { ok: true };
    }

    if (RESEND_API_KEY && ENQUIRY_TO_EMAIL) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: ENQUIRY_FROM_EMAIL || `${siteConfig.name} <onboarding@resend.dev>`,
          to: ENQUIRY_TO_EMAIL.split(",").map((email) => email.trim()),
          reply_to: isEmail(contact) ? contact : undefined,
          subject,
          text: asText(rows),
          html: asHtml(heading, rows),
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
        body: JSON.stringify({ subject, submittedAt: new Date().toISOString(), ...payload }),
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

const enquiryLabels: Record<Exclude<keyof EnquiryValues, "budgetOther">, string> = {
  name: "Name",
  business: "Business",
  contact: "Contact",
  websiteType: "Website needed",
  message: "Project description",
  budget: "Budget",
  timeline: "Timeline",
};

/** The general project enquiry form on the homepage. */
export function deliverEnquiry(values: EnquiryValues) {
  // A typed-in budget replaces the "Other" choice, so the recipient sees one clear value.
  const { budgetOther, ...rest } = values;
  void budgetOther;
  const delivered = { ...rest, budget: budgetText(values) };
  return deliverSubmission({
    subject: `New enquiry: ${values.websiteType} — ${values.name}${values.business ? ` (${values.business})` : ""}`,
    heading: "New project enquiry",
    rows: (Object.keys(enquiryLabels) as (keyof typeof enquiryLabels)[]).map((key) => [enquiryLabels[key], delivered[key]]),
    payload: delivered,
    contact: values.contact,
  });
}

/** Honest wording when delivery isn't possible. */
export function deliveryFailureMessage(reason: "not_configured" | "failed", hasAlternative: boolean) {
  const alternative = hasAlternative ? "use one of the contact options below" : "try again later";
  return reason === "not_configured"
    ? `Online enquiries aren't connected yet, so your message wasn't sent. Please ${alternative}.`
    : `Something went wrong and your message wasn't sent. Please try again, or ${alternative}.`;
}
