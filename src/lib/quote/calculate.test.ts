import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { packageIds, pricing } from "../../config/pricing.ts";
import { buildWhatsAppUrl } from "../whatsapp.ts";
import { calculateEstimate } from "./calculate.ts";
import { formatMYR, toSen } from "./money.ts";
import { normalizeSelection, selectionForPackage, selectionFromSearchParams, selectionToSearchParams, switchPackage } from "./selection.ts";
import { createReference, estimateToWhatsAppMessage, isValidReference } from "./summary.ts";
import type { PricedEstimate, QuoteSelection } from "./types.ts";

/*
 * Expected figures are read from src/config/pricing.ts, so changing a price
 * never breaks these tests. They check the rules (included pages, no double
 * charging, separate recurring costs), not the numbers.
 */
const P = pricing.packages;
const A = pricing.addOns;
const base = (id: keyof typeof P) => toSen(P[id].basePrice);
const addOn = (id: keyof typeof A) => toSen(A[id].amount);
const extraPage = toSen(pricing.extraPagePrice);
const productBlock = toSen(pricing.extraProducts.price);
const percent = (sen: number, n: number) => Math.round((sen * n) / 100);

function priced(selection: Partial<QuoteSelection>): PricedEstimate {
  const estimate = calculateEstimate(selection);
  assert.equal(estimate.status, "priced");
  return estimate as PricedEstimate;
}

/** Every estimate's total must equal the sum of its displayed line items. */
function assertTotalsMatchLines(estimate: PricedEstimate) {
  const oneTime = estimate.oneTime.reduce((sum, line) => sum + (line.amount ?? 0), 0);
  const monthly = estimate.recurring.reduce((sum, line) => sum + (line.amount ?? 0), 0);
  assert.equal(estimate.oneTimeTotal, oneTime);
  assert.equal(estimate.monthlyTotal, monthly);
  assert.ok(estimate.quotedSeparately.every((line) => line.amount === null));
}

describe("base packages", () => {
  test("the five packages exist and are listed cheapest first", () => {
    assert.deepEqual([...packageIds].sort(), ["booking", "business", "ecommerce", "landing", "portfolio"]);
    const prices = packageIds.map((id) => P[id].basePrice);
    assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
  });

  test("each package defaults to its base price only", () => {
    for (const id of packageIds) {
      const estimate = priced(selectionForPackage(id));
      assert.equal(estimate.oneTimeTotal, base(id), id);
      assert.equal(estimate.oneTime.length, 1, id);
      assert.equal(estimate.oneTimeIsMinimum, false, id);
      assert.equal(estimate.monthlyTotal, 0, id);
    }
  });

  test("no package selected gives an empty estimate", () => {
    assert.equal(calculateEstimate({}).status, "empty");
    assert.equal(calculateEstimate({ packageId: "nonsense" as never }).status, "empty");
    assert.equal(calculateEstimate({ packageId: "custom" as never }).status, "empty");
  });
});

describe("pages and products", () => {
  test("pages within the package are free; extra pages are charged each", () => {
    const included = P.business.includedPages;
    assert.equal(priced({ packageId: "business", pages: included }).oneTimeTotal, base("business"));
    const estimate = priced({ packageId: "business", pages: included + 3 });
    const extra = estimate.oneTime.find((line) => line.id === "extraPages");
    assert.equal(extra?.amount, 3 * extraPage);
    assert.equal(estimate.oneTimeTotal, base("business") + 3 * extraPage);
    assertTotalsMatchLines(estimate);
  });

  test("page counts are clamped to the package limits", () => {
    assert.equal(normalizeSelection({ packageId: "business", pages: 1 }).pages, P.business.includedPages);
    assert.equal(normalizeSelection({ packageId: "business", pages: 999 }).pages, P.business.maxPages);
    assert.equal(normalizeSelection({ packageId: "landing", pages: 4 }).pages, 1);
    assert.equal(normalizeSelection({ packageId: "business", pages: Number.NaN }).pages, P.business.includedPages);
  });

  test("extra products are charged per started block", () => {
    const { includedProducts } = P.ecommerce;
    const { blockSize } = pricing.extraProducts;
    assert.equal(priced({ packageId: "ecommerce", products: includedProducts }).oneTimeTotal, base("ecommerce"));
    assert.equal(
      priced({ packageId: "ecommerce", products: includedProducts + blockSize }).oneTimeTotal,
      base("ecommerce") + productBlock,
    );
    assert.equal(
      priced({ packageId: "ecommerce", products: includedProducts + blockSize + 1 }).oneTimeTotal,
      base("ecommerce") + 2 * productBlock,
    );
    assert.equal(normalizeSelection({ packageId: "business", products: 50 }).products, 0);
  });
});

describe("add-ons", () => {
  test("multiple fixed add-ons are itemised and summed", () => {
    const ids = ["copywriting", "blogCms", "enhancedSeo", "googleAnalytics", "metaPixel"] as const;
    const estimate = priced({ packageId: "business", addOns: [...ids] });
    assert.equal(estimate.oneTimeTotal, base("business") + ids.reduce((sum, id) => sum + addOn(id), 0));
    assert.equal(estimate.oneTime.length, ids.length + 1);
    assertTotalsMatchLines(estimate);
  });

  test("second language is a percentage of the base package only, not of extras", () => {
    const pages = P.business.includedPages + 2;
    const estimate = priced({ packageId: "business", pages, addOns: ["secondLanguage", "copywriting"] });
    const language = estimate.oneTime.find((line) => line.id === "secondLanguage");
    const expected = percent(base("business"), A.secondLanguage.amount);
    assert.equal(language?.amount, expected);
    assert.equal(estimate.oneTimeTotal, base("business") + 2 * extraPage + expected + addOn("copywriting"));
    assert.equal(
      priced({ packageId: "landing", addOns: ["secondLanguage"] }).oneTimeTotal,
      base("landing") + percent(base("landing"), A.secondLanguage.amount),
    );
  });

  test("a feature included in a package is never charged again", () => {
    assert.ok((P.ecommerce.includedAddOns as string[]).includes("paymentGateway"));
    const estimate = priced({ packageId: "ecommerce", addOns: ["paymentGateway"] });
    assert.equal(estimate.oneTimeTotal, base("ecommerce"));
    assert.ok(!estimate.oneTime.some((line) => line.id === "paymentGateway"));
  });

  test("unavailable add-ons are dropped", () => {
    assert.deepEqual(normalizeSelection({ packageId: "portfolio", addOns: ["paymentGateway"] }).addOns, []);
    assert.equal(
      priced({ packageId: "booking", addOns: ["paymentGateway"] }).oneTimeTotal,
      base("booking") + addOn("paymentGateway"),
    );
  });

  test("duplicate add-on ids are charged once", () => {
    const estimate = priced({ packageId: "business", addOns: ["googleAnalytics", "googleAnalytics"] });
    assert.equal(estimate.oneTimeTotal, base("business") + addOn("googleAnalytics"));
  });

  test("starting-price add-ons mark the total as a minimum", () => {
    const estimate = priced({ packageId: "business", addOns: ["newsletterCrm"] });
    assert.equal(estimate.oneTimeTotal, base("business") + addOn("newsletterCrm"));
    assert.equal(estimate.oneTimeIsMinimum, true);
  });

  test("page-limited add-ons flag pages beyond their limit for separate quotation", () => {
    const covered = A.copywriting.coversPages;
    const pages = covered + 3;
    const estimate = priced({ packageId: "business", pages, addOns: ["copywriting"] });
    assert.equal(estimate.oneTimeTotal, base("business") + (pages - P.business.includedPages) * extraPage + addOn("copywriting"));
    assert.equal(estimate.quotedSeparately.length, 1);
    assert.equal(estimate.oneTimeIsMinimum, true);
  });
});

describe("recurring maintenance", () => {
  test("maintenance is monthly and never added to the project total", () => {
    const estimate = priced({ packageId: "portfolio", addOns: ["maintenance"] });
    assert.equal(estimate.oneTimeTotal, base("portfolio"));
    assert.equal(estimate.monthlyTotal, addOn("maintenance"));
    assert.equal(estimate.recurring.length, 1);
    assert.equal(estimate.firstYearTotal, base("portfolio") + addOn("maintenance") * 12);
  });

  test("no first-year figure when the project total is only a minimum", () => {
    const estimate = priced({ packageId: "business", addOns: ["maintenance", "newsletterCrm"] });
    assert.equal(estimate.firstYearTotal, null);
  });

  test("no first-year figure without recurring costs", () => {
    assert.equal(priced({ packageId: "business" }).firstYearTotal, null);
  });
});

describe("expedited delivery and complexity", () => {
  test("expedited adds a percentage of the one-time subtotal and excludes maintenance", () => {
    assert.ok(pricing.expedited.availableFor.includes("business"));
    const estimate = priced({
      packageId: "business",
      pages: P.business.includedPages + 1,
      addOns: ["googleAnalytics", "maintenance"],
      expedited: true,
    });
    const subtotal = base("business") + extraPage + addOn("googleAnalytics");
    const surcharge = percent(subtotal, pricing.expedited.percent);
    assert.equal(estimate.oneTime.find((line) => line.id === "expedited")?.amount, surcharge);
    assert.equal(estimate.oneTimeTotal, subtotal + surcharge);
    assert.equal(estimate.monthlyTotal, addOn("maintenance"));
    assertTotalsMatchLines(estimate);
  });

  test("expedited is ignored where it isn't offered", () => {
    const unavailable = packageIds.find((id) => !pricing.expedited.availableFor.includes(id));
    assert.ok(unavailable, "expected at least one package without expedited delivery");
    assert.equal(priced({ packageId: unavailable, expedited: true }).oneTimeTotal, base(unavailable));
  });

  test("complex booking requirements are quoted separately, not priced", () => {
    const estimate = priced({ packageId: "booking", complexScheduling: true });
    assert.equal(estimate.oneTimeTotal, base("booking"));
    assert.equal(estimate.quotedSeparately[0]?.amount, null);
    assert.equal(estimate.oneTimeIsMinimum, true);
    assert.equal(normalizeSelection({ packageId: "business", complexScheduling: true }).complexScheduling, false);
  });
});

describe("switching and URL round trips", () => {
  test("switching package keeps compatible choices and drops the rest", () => {
    const business = normalizeSelection({ packageId: "business", pages: 9, addOns: ["paymentGateway", "copywriting"], expedited: true });
    const store = switchPackage(business, "ecommerce");
    assert.deepEqual(store.addOns, ["copywriting"]);
    assert.equal(store.expedited, false);
    assert.equal(store.pages, 9);
    assert.equal(store.products, P.ecommerce.includedProducts);
    assert.equal(switchPackage(business, "landing").pages, 1);
  });

  test("a selection survives a URL round trip", () => {
    const selection = normalizeSelection({ packageId: "booking", pages: 7, addOns: ["paymentGateway", "maintenance"], complexScheduling: true });
    const params = selectionToSearchParams(selection);
    assert.deepEqual(selectionFromSearchParams(params), selection);
  });

  test("tampered URLs are cleaned", () => {
    const params = new URLSearchParams("package=landing&pages=-4&addons=paymentGateway,bogus,maintenance&expedited=1");
    const selection = selectionFromSearchParams(params);
    assert.deepEqual(selection.addOns, ["paymentGateway", "maintenance"]);
    assert.equal(selection.pages, 1);
    assert.equal(selection.expedited, true);
  });

  test("an old link to a removed package falls back to the empty selection", () => {
    assert.equal(selectionFromSearchParams(new URLSearchParams("package=custom")).packageId, null);
  });
});

describe("formatting, references and WhatsApp", () => {
  test("ringgit formatting is exact", () => {
    assert.equal(formatMYR(toSen(1900)), "RM1,900");
    assert.equal(formatMYR(123456), "RM1,234.56");
    assert.equal(formatMYR(toSen(0.1) + toSen(0.2)), "RM0.30");
  });

  test("reference numbers are dated and well-formed", () => {
    const reference = createReference(new Date(2026, 9, 22), () => 0.5);
    assert.match(reference, /^HMJ-261022-[A-Z0-9]{4}$/);
    assert.ok(isValidReference(reference));
  });

  test("the WhatsApp message is concise, complete and correctly encoded", () => {
    const pages = P.business.includedPages + 2;
    const estimate = calculateEstimate({ packageId: "business", pages, addOns: ["copywriting", "maintenance"] });
    const message = estimateToWhatsAppMessage(estimate, "HMJ-261022-ABCD");
    const total = base("business") + 2 * extraPage + addOn("copywriting");
    assert.match(message, /Business Website \(estimate HMJ-261022-ABCD\)/);
    assert.ok(message.includes(`${pages} pages`));
    // "From": copywriting covers fewer pages than the site has, so part of it is quoted separately.
    assert.ok(message.includes(`One-time estimate: From ${formatMYR(total)}.`), message);
    assert.ok(message.includes(`Monthly: ${formatMYR(addOn("maintenance"))}/month`), message);
    assert.ok(message.length < 400);

    const url = buildWhatsAppUrl("+60 11-6306 3150", message);
    assert.ok(url?.startsWith("https://wa.me/601163063150?text="));
    assert.equal(decodeURIComponent(url!.split("?text=")[1]), message);
    assert.ok(!/[\s&#]/.test(url!.split("?text=")[1]));
    assert.equal(buildWhatsAppUrl("123", message), null);
  });
});
