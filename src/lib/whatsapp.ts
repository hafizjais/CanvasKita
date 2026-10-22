const WHATSAPP_NUMBER = /^[1-9]\d{7,14}$/;

/** Builds a wa.me link with an encoded message, or null for an invalid number. */
export function buildWhatsAppUrl(rawNumber: string, message: string) {
  const number = rawNumber.replace(/\D/g, "");
  if (!WHATSAPP_NUMBER.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
