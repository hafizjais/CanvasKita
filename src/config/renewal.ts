/**
 * Annual renewal wording and pricing. Edit here; nothing else needs to change.
 *
 * Only publish a price you actually charge. Set `assistance.showPrice` to
 * false to hide the figure and keep the wording price-free.
 */
export const renewal = {
  title: "Your Website, Year After Year",
  description:
    "After launch, your domain and hosting arrangements may require annual renewal. I'll explain the applicable costs and renewal dates so you know what needs to be renewed to keep your website accessible.",

  items: [
    {
      id: "domain",
      title: "Domain renewal",
      body: "Keep your domain registration active.",
    },
    {
      id: "hosting",
      title: "Hosting renewal",
      body: "Maintain the hosting arrangement required by your website.",
    },
    {
      id: "maintenance",
      title: "Optional maintenance",
      body: "Request ongoing updates and technical assistance under a separate support arrangement.",
    },
  ],

  note: "Renewal charges depend on the domain extension, hosting provider, selected plan and technical setup. Any third-party costs will be explained before renewal.",

  assistance: {
    showPrice: true,
    /** Starting price in MYR per year. TODO: confirm this matches the service you offer. */
    fromPerYear: 48,
    /** Shown beside the price. Must not imply provider charges are covered. */
    wording: "Annual renewal assistance from RM{price}/year for eligible setups.",
    disclaimer:
      "Domain registration, paid hosting, premium integrations and other provider charges may be separate.",
  },

  cta: {
    label: "Ask About Renewal & Maintenance",
    whatsappMessage:
      "Hi Hafiz, I'd like to ask about domain and hosting renewal and optional website maintenance.",
    mailSubject: "Renewal & maintenance enquiry",
  },
} as const;

export function renewalAssistanceLine() {
  const { showPrice, fromPerYear, wording } = renewal.assistance;
  return showPrice ? wording.replace("{price}", String(fromPerYear)) : null;
}
