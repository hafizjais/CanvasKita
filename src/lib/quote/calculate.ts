import { addOnIds, pricing, type AddOnPricing } from "../../config/pricing.ts";
import { formatMYR, percentOf, toSen } from "./money.ts";
import { normalizeSelection } from "./selection.ts";
import type { Estimate, LineItem, QuoteSelection } from "./types.ts";

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/**
 * Prices a selection. Pure and deterministic: the same selection always gives
 * the same estimate, on the server and in the browser.
 *
 * Rules:
 * - Only one-time items count toward the project total. Monthly items are
 *   listed separately and never added to it.
 * - Add-ons included in a package, or unavailable for it, are never charged
 *   (normalizeSelection removes them first).
 * - Items that need review are listed with no price ("quoted separately").
 */
export function calculateEstimate(input: Partial<QuoteSelection>): Estimate {
  const selection = normalizeSelection(input);
  const { packageId } = selection;
  if (!packageId) return { status: "empty" };

  const pkg = pricing.packages[packageId];
  const base = toSen(pkg.basePrice);

  const oneTime: LineItem[] = [];
  const recurring: LineItem[] = [];
  const quotedSeparately: LineItem[] = [];
  const notes: string[] = [];

  oneTime.push({
    id: "package",
    label: pkg.name,
    detail:
      pkg.includedPages > 1
        ? `Base package, includes ${plural(pkg.includedPages, "page")}${pkg.includedProducts ? ` and ${plural(pkg.includedProducts, "product listing")}` : ""}`
        : "Base package, one responsive page",
    amount: base,
  });

  const extraPages = Math.max(0, selection.pages - pkg.includedPages);
  if (extraPages > 0) {
    oneTime.push({
      id: "extraPages",
      label: "Additional pages",
      detail: `${extraPages} × ${formatMYR(toSen(pricing.extraPagePrice))}`,
      amount: extraPages * toSen(pricing.extraPagePrice),
    });
  }

  const extraProducts = Math.max(0, selection.products - pkg.includedProducts);
  if (extraProducts > 0) {
    const blocks = Math.ceil(extraProducts / pricing.extraProducts.blockSize);
    oneTime.push({
      id: "extraProducts",
      label: "Additional product listings",
      detail: `${blocks} × ${pricing.extraProducts.blockSize} listings at ${formatMYR(toSen(pricing.extraProducts.price))}`,
      amount: blocks * toSen(pricing.extraProducts.price),
    });
  }

  for (const id of addOnIds) {
    if (!selection.addOns.includes(id)) continue;
    const addOn: AddOnPricing = pricing.addOns[id];

    if (addOn.kind === "monthly") {
      recurring.push({ id, label: addOn.label, detail: "Per month", amount: toSen(addOn.amount) });
      continue;
    }

    const amount = addOn.kind === "percent" ? percentOf(base, addOn.amount) : toSen(addOn.amount);
    const detail =
      addOn.kind === "percent"
        ? `${addOn.amount}% of the ${formatMYR(base)} base package`
        : addOn.isStartingPrice
          ? "Starting price, confirmed once the platform is known"
          : undefined;
    oneTime.push({ id, label: addOn.label, detail, amount, isStartingPrice: addOn.isStartingPrice });

    if (addOn.coversPages && selection.pages > addOn.coversPages) {
      quotedSeparately.push({
        id: `${id}-extraPages`,
        label: `${addOn.label} beyond ${addOn.coversPages} pages`,
        detail: `${selection.pages - addOn.coversPages} more page${selection.pages - addOn.coversPages === 1 ? "" : "s"}`,
        amount: null,
      });
    }
  }

  if (selection.complexScheduling) {
    quotedSeparately.push({
      id: "complexScheduling",
      label: "Complex scheduling",
      detail: "Multiple staff, rooms or locations, or custom booking rules",
      amount: null,
    });
  }
  if (selection.advancedCommerce) {
    quotedSeparately.push({
      id: "advancedCommerce",
      label: "Additional payment gateways or advanced shipping",
      amount: null,
    });
  }

  if (selection.expedited) {
    const subtotal = oneTime.reduce((sum, line) => sum + (line.amount ?? 0), 0);
    oneTime.push({
      id: "expedited",
      label: "Expedited delivery",
      detail: `${pricing.expedited.percent}% of the ${formatMYR(subtotal)} project subtotal`,
      amount: percentOf(subtotal, pricing.expedited.percent),
      isStartingPrice: oneTime.some((line) => line.isStartingPrice),
    });
    notes.push("Expedited delivery is subject to availability and confirmed with the schedule.");
  }

  if (selection.addOns.includes("secondLanguage")) {
    notes.push("Second language support covers building the second version; translation is not included.");
  }
  if (packageId === "ecommerce") {
    notes.push("Payment gateway and shipping setup depend on what the chosen commerce platform supports.");
  }

  const oneTimeTotal = oneTime.reduce((sum, line) => sum + (line.amount ?? 0), 0);
  const monthlyTotal = recurring.reduce((sum, line) => sum + (line.amount ?? 0), 0);
  const oneTimeIsMinimum = oneTime.some((line) => line.isStartingPrice) || quotedSeparately.length > 0;

  return {
    status: "priced",
    packageId,
    packageName: pkg.name,
    selection,
    oneTime,
    oneTimeTotal,
    oneTimeIsMinimum,
    recurring,
    monthlyTotal,
    firstYearTotal: monthlyTotal > 0 && !oneTimeIsMinimum ? oneTimeTotal + monthlyTotal * 12 : null,
    quotedSeparately,
    notes,
    timelineWeeks: pkg.timelineWeeks,
  };
}

export function describeTimeline(weeks: [number, number] | null) {
  if (!weeks) return "Confirmed after discovery";
  const [min, max] = weeks;
  return min === max ? `About ${plural(min, "week")}` : `About ${min}–${max} weeks`;
}
