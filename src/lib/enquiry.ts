import { enquiryOptions } from "@/config/site";

/** Shared by the form (instant feedback) and the server action (authoritative). */

export const enquiryFields = [
  "name",
  "business",
  "contact",
  "websiteType",
  "message",
  "budget",
  "timeline",
] as const;

export type EnquiryField = (typeof enquiryFields)[number];
export type EnquiryValues = Record<EnquiryField, string>;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: EnquiryErrors;
  values?: Partial<EnquiryValues>;
  /** Increments on every server response so the form can remount with values. */
  attempt: number;
};

export const initialEnquiryState: EnquiryState = { status: "idle", attempt: 0 };

export const limits = {
  name: 100,
  business: 120,
  contact: 120,
  message: 2000,
  messageMin: 15,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s\-()]{8,20}$/;

export function readEnquiry(formData: FormData): EnquiryValues {
  return Object.fromEntries(
    enquiryFields.map((field) => [field, String(formData.get(field) ?? "").trim()]),
  ) as EnquiryValues;
}

export function validateEnquiry(values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!values.name) errors.name = "Please tell me your name.";
  else if (values.name.length > limits.name) errors.name = "Please shorten your name.";

  if (values.business.length > limits.business) errors.business = "Please shorten the business name.";

  if (!values.contact) errors.contact = "Add an email address or phone number so I can reply.";
  else if (values.contact.length > limits.contact || !(EMAIL.test(values.contact) || PHONE.test(values.contact)))
    errors.contact = "Enter a valid email address or phone number.";

  if (!(enquiryOptions.websiteTypes as readonly string[]).includes(values.websiteType))
    errors.websiteType = "Choose the option closest to what you need.";

  if (values.message.length < limits.messageMin)
    errors.message = "A sentence or two about your business and what you need will help.";
  else if (values.message.length > limits.message)
    errors.message = `Please keep this under ${limits.message} characters.`;

  if (values.budget && !(enquiryOptions.budgets as readonly string[]).includes(values.budget))
    errors.budget = "Choose one of the options.";

  if (values.timeline && !(enquiryOptions.timelines as readonly string[]).includes(values.timeline))
    errors.timeline = "Choose one of the options.";

  return errors;
}

export function isEmail(value: string) {
  return EMAIL.test(value);
}
