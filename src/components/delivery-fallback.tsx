import { getMailtoUrl, getWhatsAppUrl } from "@/lib/contact";

/**
 * Shown when an enquiry can't be delivered: the same message, pre-filled for
 * WhatsApp or email, so the visitor doesn't have to retype it. Nothing is
 * sent until they choose to send it themselves.
 */
export function DeliveryFallback({
  whatsappMessage,
  emailSubject,
  emailBody,
}: {
  whatsappMessage: string;
  emailSubject: string;
  emailBody: string;
}) {
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);
  const mailtoUrl = getMailtoUrl(emailSubject, emailBody);
  if (!whatsappUrl && !mailtoUrl) return null;

  return (
    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-semibold">
      {whatsappUrl && (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          Send it on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
      {mailtoUrl && (
        <a href={mailtoUrl} className="underline underline-offset-4">
          Send it by email
        </a>
      )}
      <span className="w-full text-xs font-normal text-muted">Your message is filled in for you.</span>
    </p>
  );
}
