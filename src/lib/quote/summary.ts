import { pricing } from "../../config/pricing.ts";
import { describeTimeline } from "./calculate.ts";
import { formatMYR } from "./money.ts";
import type { Estimate } from "./types.ts";

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O, 1/I/L

/** e.g. HMJ-261022-7KQ4. Date-based with a random suffix; generated once per estimate. */
export function createReference(date: Date, random: () => number = Math.random) {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += ALPHABET[Math.floor(random() * ALPHABET.length)];
  return `${pricing.estimate.referencePrefix}-${yy}${mm}${dd}-${suffix}`;
}

export const isValidReference = (value: string) => /^[A-Z]{2,5}-\d{6}-[2-9A-HJ-NP-Z]{4}$/.test(value);

export function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const formatDate = (date: Date) => `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

/** The headline figure, worded honestly for each kind of estimate. */
export function describeTotal(estimate: Estimate) {
  if (estimate.status === "empty") return "Choose a website type";
  if (estimate.status === "requiresQuotation") return "Requires detailed quotation";
  return `${estimate.oneTimeIsMinimum ? "From " : ""}${formatMYR(estimate.oneTimeTotal)}`;
}

/** Plain-text estimate, used in enquiry emails and webhooks. */
export function estimateToText(estimate: Estimate, reference?: string) {
  if (estimate.status === "empty") return "No website type selected.";
  const lines = [reference ? `Estimate ${reference}` : "Estimate", `Package: ${estimate.packageName}`];

  if (estimate.status === "requiresQuotation") {
    lines.push(`Requires detailed quotation (projects start from ${formatMYR(estimate.startingFrom)})`);
    return lines.join("\n");
  }

  const { selection } = estimate;
  lines.push(`Pages: ${selection.pages}${selection.products ? ` · Products: ${selection.products}` : ""}`);
  lines.push("", "One-time:");
  for (const line of estimate.oneTime) {
    lines.push(`- ${line.label}: ${line.isStartingPrice ? "from " : ""}${formatMYR(line.amount ?? 0)}`);
  }
  for (const line of estimate.quotedSeparately) lines.push(`- ${line.label}: quoted separately`);
  lines.push(`One-time project estimate: ${describeTotal(estimate)}`);
  if (estimate.recurring.length) {
    lines.push("", "Monthly (separate from project total):");
    for (const line of estimate.recurring) lines.push(`- ${line.label}: ${formatMYR(line.amount ?? 0)}/month`);
  }
  if (estimate.firstYearTotal !== null) lines.push(`Estimated first-year cost: ${formatMYR(estimate.firstYearTotal)}`);
  lines.push(`Indicative timeline: ${describeTimeline(estimate.timelineWeeks)}`);
  return lines.join("\n");
}

/**
 * A concise WhatsApp message describing the estimate. Pass the result to
 * getWhatsAppUrl(), which URL-encodes it.
 */
export function estimateToWhatsAppMessage(estimate: Estimate, reference?: string) {
  if (estimate.status === "empty") {
    return "Hi Hafiz, I'd like to discuss a website project for my business.";
  }

  const ref = reference ? ` (estimate ${reference})` : "";

  if (estimate.status === "requiresQuotation") {
    return `Hi Hafiz, I'd like a quotation for a ${estimate.packageName}${ref}. Can we discuss my requirements?`;
  }

  const { selection } = estimate;
  const scope = [
    selection.pages > 1 ? `${selection.pages} pages` : null,
    selection.products ? `${selection.products} products` : null,
  ].filter(Boolean);
  const extras = [
    ...estimate.oneTime.filter((line) => !["package", "extraPages", "extraProducts"].includes(line.id)).map((l) => l.label),
    ...estimate.recurring.map((line) => line.label),
    ...estimate.quotedSeparately.map((line) => line.label),
  ];

  const parts = [
    `Hi Hafiz, I'd like to discuss a ${estimate.packageName}${ref}.`,
    scope.length ? `Scope: ${scope.join(", ")}.` : null,
    extras.length ? `Options: ${extras.join(", ")}.` : null,
    `One-time estimate: ${describeTotal(estimate)}.`,
    estimate.monthlyTotal ? `Monthly: ${formatMYR(estimate.monthlyTotal)}/month.` : null,
  ];
  return parts.filter(Boolean).join(" ");
}
