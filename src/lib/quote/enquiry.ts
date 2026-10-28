import { isValidContact, limits } from "@/lib/enquiry";

/** The estimate enquiry form: shared by the browser (instant feedback) and the server action. */

export const quoteEnquiryFields = ["name", "business", "contact", "notes"] as const;
export type QuoteEnquiryField = (typeof quoteEnquiryFields)[number];
export type QuoteEnquiryValues = Record<QuoteEnquiryField, string>;
export type QuoteEnquiryErrors = Partial<Record<QuoteEnquiryField, string>>;

export type QuoteEnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: QuoteEnquiryErrors;
  values?: Partial<QuoteEnquiryValues>;
  attempt: number;
};

export const initialQuoteEnquiryState: QuoteEnquiryState = { status: "idle", attempt: 0 };

export function readQuoteEnquiry(formData: FormData): QuoteEnquiryValues {
  return Object.fromEntries(
    quoteEnquiryFields.map((field) => [field, String(formData.get(field) ?? "").trim()]),
  ) as QuoteEnquiryValues;
}

export function validateQuoteEnquiry(values: QuoteEnquiryValues): QuoteEnquiryErrors {
  const errors: QuoteEnquiryErrors = {};

  if (!values.name) errors.name = "Please tell me your name.";
  else if (values.name.length > limits.name) errors.name = "Please shorten your name.";

  if (values.business.length > limits.business) errors.business = "Please shorten the business name.";

  if (!values.contact) errors.contact = "Add an email address or phone number so I can reply.";
  else if (!isValidContact(values.contact)) errors.contact = "Enter a valid email address or phone number.";

  if (values.notes.length > limits.message) errors.notes = `Please keep this under ${limits.message} characters.`;

  return errors;
}
