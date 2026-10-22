import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { pricing } from "../../config/pricing.ts";
import { buildWhatsAppUrl } from "../whatsapp.ts";
import { calculateEstimate } from "./calculate.ts";
import { formatMYR, toSen } from "./money.ts";
import { normalizeSelection, selectionForPackage, selectionFromSearchParams, selectionToSearchParams, switchPackage } from "./selection.ts";
import { createReference, estimateToWhatsAppMessage, isValidReference } from "./summary.ts";
import type { PricedEstimate, QuoteSelection } from "./types.ts";

const RM = toSen;

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
  test("each priced package defaults to its base price only", () => {
    const expected = { landing: 170, portfolio: 240, business: 380, ecommerce: 600, booking: 440 } as const;
    for (const [id, price] of Object.entries(expected)) {
      const estimate = priced(selectionForPackage(id as keyof typeof expected));
      assert.equal(estimate.oneTimeTotal, RM(price), id);
      assert.equal(estimate.oneTime.length, 1, id);
      assert.equal(estimate.oneTimeIsMinimum, false, id);
      assert.equal(estimate.monthlyTotal, 0, id);
    }
  });

  test("no package selected gives an empty estimate", () => {
    assert.equal(calculateEstimate({}).status, "empty");
    assert.equal(calculateEstimate({ packageId: "nonsense" as never }).status, "empty");
  });
});

describe("pages and products", () => {
  test("pages within the package are free; extra pages are RM30 each", () => {
    assert.equal(priced({ packageId: "business", pages: 5 }).oneTimeTotal, RM(380));
    const estimate = priced({ packageId: "business", pages: 8 });
    const extra = estimate.oneTime.find((line) => line.id === "extraPages");
    assert.equal(extra?.amount, RM(90));
    assert.equal(estimate.oneTimeTotal, RM(380 + 90));
    assertTotalsMatchLines(estimate);
  });

  test("page counts are clamped to the package limits", () => {
    assert.equal(normalizeSelection({ packageId: "business", pages: 2 }).pages, 5);
    assert.equal(normalizeSelection({ packageId: "business", pages: 999 }).pages, 30);
    assert.equal(normalizeSelection({ packageId: "landing", pages: 4 }).pages, 1);
    assert.equal(normalizeSelection({ packageId: "business", pages: Number.NaN }).pages, 5);
  });

  test("extra products are charged per started block of ten", () => {
    assert.equal(priced({ packageId: "ecommerce", products: 10 }).oneTimeTotal, RM(600));
    assert.equal(priced({ packageId: "ecommerce", products: 20 }).oneTimeTotal, RM(600 + 24));
    assert.equal(priced({ packageId: "ecommerce", products: 21 }).oneTimeTotal, RM(600 + 48));
    assert.equal(normalizeSelection({ packageId: "business", products: 50 }).products, 0);
  });
});

describe("add-ons", () => {
  test("multiple fixed add-ons are itemised and summed", () => {
    const estimate = priced({
      packageId: "business",
      addOns: ["copywriting", "blogCms", "enhancedSeo", "googleAnalytics", "metaPixel"],
    });
    assert.equal(estimate.oneTimeTotal, RM(380 + 90 + 70 + 80 + 30 + 36));
    assert.equal(estimate.oneTime.length, 6);
    assertTotalsMatchLines(estimate);
  });

  test("second language is 30% of the base package only, not of extras", () => {
    const estimate = priced({ packageId: "business", pages: 7, addOns: ["secondLanguage", "copywriting"] });
    const language = estimate.oneTime.find((line) => line.id === "secondLanguage");
    assert.equal(language?.amount, RM(114)); // 30% of RM380
    assert.equal(estimate.oneTimeTotal, RM(380 + 60 + 114 + 90));
    assert.equal(priced({ packageId: "landing", addOns: ["secondLanguage"] }).oneTimeTotal, RM(170 + 51));
  });

  test("a feature included in a package is never charged again", () => {
    const estimate = priced({ packageId: "ecommerce", addOns: ["paymentGateway"] });
    assert.equal(estimate.oneTimeTotal, RM(600));
    assert.ok(!estimate.oneTime.some((line) => line.id === "paymentGateway"));
  });

  test("unavailable add-ons are dropped", () => {
    assert.deepEqual(normalizeSelection({ packageId: "portfolio", addOns: ["paymentGateway"] }).addOns, []);
    assert.equal(priced({ packageId: "booking", addOns: ["paymentGateway"] }).oneTimeTotal, RM(440 + 80));
  });

  test("duplicate add-on ids are charged once", () => {
    const estimate = priced({ packageId: "business", addOns: ["googleAnalytics", "googleAnalytics"] });
    assert.equal(estimate.oneTimeTotal, RM(380 + 30));
  });

  test("starting-price add-ons mark the total as a minimum", () => {
    const estimate = priced({ packageId: "business", addOns: ["newsletterCrm"] });
    assert.equal(estimate.oneTimeTotal, RM(440));
    assert.equal(estimate.oneTimeIsMinimum, true);
  });

  test("page-limited add-ons flag pages beyond five for separate quotation", () => {
    const estimate = priced({ packageId: "business", pages: 8, addOns: ["copywriting"] });
    assert.equal(estimate.oneTimeTotal, RM(380 + 90 + 90));
    assert.equal(estimate.quotedSeparately.length, 1);
    assert.equal(estimate.oneTimeIsMinimum, true);
  });
});

describe("recurring maintenance", () => {
  test("maintenance is monthly and never added to the project total", () => {
    const estimate = priced({ packageId: "portfolio", addOns: ["maintenance"] });
    assert.equal(estimate.oneTimeTotal, RM(240));
    assert.equal(estimate.monthlyTotal, RM(30));
    assert.equal(estimate.recurring.length, 1);
    assert.equal(estimate.firstYearTotal, RM(240 + 30 * 12));
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
  test("expedited adds 25% of the one-time subtotal and excludes maintenance", () => {
    const estimate = priced({ packageId: "business", pages: 6, addOns: ["googleAnalytics", "maintenance"], expedited: true });
    const subtotal = 380 + 30 + 30;
    assert.equal(estimate.oneTime.find((line) => line.id === "expedited")?.amount, RM(subtotal * 0.25));
    assert.equal(estimate.oneTimeTotal, RM(subtotal * 1.25));
    assert.equal(estimate.monthlyTotal, RM(30));
    assertTotalsMatchLines(estimate);
  });

  test("expedited is ignored where it isn't offered", () => {
    assert.equal(priced({ packageId: "ecommerce", expedited: true }).oneTimeTotal, RM(600));
  });

  test("complex booking requirements are quoted separately, not priced", () => {
    const estimate = priced({ packageId: "booking", complexScheduling: true });
    assert.equal(estimate.oneTimeTotal, RM(440));
    assert.equal(estimate.quotedSeparately[0]?.amount, null);
    assert.equal(estimate.oneTimeIsMinimum, true);
    assert.equal(normalizeSelection({ packageId: "business", complexScheduling: true }).complexScheduling, false);
  });
});

describe("custom systems", () => {
  test("custom systems require a detailed quotation and have no total", () => {
    const estimate = calculateEstimate({ packageId: "custom", pages: 10, addOns: ["copywriting"], expedited: true });
    assert.equal(estimate.status, "requiresQuotation");
    assert.ok(!("oneTimeTotal" in estimate));
    if (estimate.status === "requiresQuotation") assert.equal(estimate.startingFrom, RM(pricing.packages.custom.basePrice));
  });
});

describe("switching and URL round trips", () => {
  test("switching package keeps compatible choices and drops the rest", () => {
    const business = normalizeSelection({ packageId: "business", pages: 9, addOns: ["paymentGateway", "copywriting"], expedited: true });
    const store = switchPackage(business, "ecommerce");
    assert.deepEqual(store.addOns, ["copywriting"]);
    assert.equal(store.expedited, false);
    assert.equal(store.pages, 9);
    assert.equal(store.products, 10);
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
});

describe("formatting, references and WhatsApp", () => {
  test("ringgit formatting is exact", () => {
    assert.equal(formatMYR(RM(1900)), "RM1,900");
    assert.equal(formatMYR(123456), "RM1,234.56");
    assert.equal(formatMYR(RM(0.1) + RM(0.2)), "RM0.30");
  });

  test("reference numbers are dated and well-formed", () => {
    const reference = createReference(new Date(2026, 9, 22), () => 0.5);
    assert.match(reference, /^HMJ-261022-[A-Z0-9]{4}$/);
    assert.ok(isValidReference(reference));
  });

  test("the WhatsApp message is concise, complete and correctly encoded", () => {
    const estimate = calculateEstimate({ packageId: "business", pages: 7, addOns: ["copywriting", "maintenance"] });
    const message = estimateToWhatsAppMessage(estimate, "HMJ-261022-ABCD");
    assert.match(message, /Business Website \(estimate HMJ-261022-ABCD\)/);
    assert.match(message, /7 pages/);
    assert.match(message, /One-time estimate: From RM530\./); // copywriting covers 5 of 7 pages
    assert.match(message, /Monthly: RM30\/month/);
    assert.ok(message.length < 400);

    const url = buildWhatsAppUrl("+60 11-6306 3150", message);
    assert.ok(url?.startsWith("https://wa.me/601163063150?text="));
    assert.equal(decodeURIComponent(url!.split("?text=")[1]), message);
    assert.ok(!/[\s&#]/.test(url!.split("?text=")[1]));
    assert.equal(buildWhatsAppUrl("123", message), null);
  });

  test("custom-system WhatsApp messages ask for a quotation without a price", () => {
    const message = estimateToWhatsAppMessage(calculateEstimate({ packageId: "custom" }));
    assert.match(message, /quotation/);
    assert.doesNotMatch(message, /RM/);
  });
});
