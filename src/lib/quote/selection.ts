import { addOnIds, packageIds, pricing, type AddOnId, type PackageId } from "../../config/pricing.ts";
import type { QuoteSelection } from "./types.ts";

export const emptySelection: QuoteSelection = {
  packageId: null,
  pages: 0,
  products: 0,
  addOns: [],
  expedited: false,
  complexScheduling: false,
  advancedCommerce: false,
};

export function isPackageId(value: unknown): value is PackageId {
  return typeof value === "string" && (packageIds as string[]).includes(value);
}

export function isAddOnAvailable(addOn: AddOnId, packageId: PackageId | null) {
  if (!packageId) return false;
  return (
    (pricing.addOns[addOn].availableFor as PackageId[]).includes(packageId) &&
    !(pricing.packages[packageId].includedAddOns as AddOnId[]).includes(addOn)
  );
}

export function isExpeditedAvailable(packageId: PackageId | null) {
  return Boolean(packageId && pricing.expedited.availableFor.includes(packageId));
}

/** Sensible defaults for a package: its included pages and products, nothing extra. */
export function selectionForPackage(packageId: PackageId | null): QuoteSelection {
  if (!packageId) return { ...emptySelection };
  const pkg = pricing.packages[packageId];
  return {
    ...emptySelection,
    packageId,
    pages: pkg.includedPages,
    products: pkg.includedProducts,
  };
}

/** Moves to another package, keeping only the choices that still apply. */
export function switchPackage(current: QuoteSelection, packageId: PackageId): QuoteSelection {
  const next = selectionForPackage(packageId);
  return normalizeSelection({
    ...next,
    pages: Math.max(next.pages, Math.min(current.pages, pricing.packages[packageId].maxPages)),
    addOns: current.addOns,
    expedited: current.expedited,
  });
}

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const number = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

/**
 * Makes any selection safe to price: clamps numbers to the package's limits,
 * drops add-ons that are unavailable or already included, and clears options
 * that don't apply. Use it on anything from a URL, form or client.
 */
export function normalizeSelection(input: Partial<QuoteSelection>): QuoteSelection {
  const packageId = isPackageId(input.packageId) ? input.packageId : null;
  if (!packageId) return { ...emptySelection };

  const pkg = pricing.packages[packageId];
  const minPages = Math.max(1, pkg.includedPages);
  const isStore = pkg.includedProducts > 0;
  const addOns = Array.isArray(input.addOns) ? input.addOns : [];

  return {
    packageId,
    pages: clampInt(input.pages, minPages, pkg.maxPages, pkg.includedPages),
    products: isStore
      ? clampInt(input.products, pkg.includedProducts, pricing.extraProducts.max, pkg.includedProducts)
      : 0,
    addOns: addOnIds.filter((id) => addOns.includes(id) && isAddOnAvailable(id, packageId)),
    expedited: Boolean(input.expedited) && isExpeditedAvailable(packageId),
    complexScheduling: packageId === "booking" && Boolean(input.complexScheduling),
    advancedCommerce: packageId === "ecommerce" && Boolean(input.advancedCommerce),
  };
}

/** Short, readable query string, e.g. ?package=business&pages=7&addons=copywriting,googleAnalytics */
export function selectionToSearchParams(selection: QuoteSelection) {
  const params = new URLSearchParams();
  if (!selection.packageId) return params;
  params.set("package", selection.packageId);
  const pkg = pricing.packages[selection.packageId];
  if (selection.pages !== pkg.includedPages) params.set("pages", String(selection.pages));
  if (selection.products !== pkg.includedProducts) params.set("products", String(selection.products));
  if (selection.addOns.length) params.set("addons", selection.addOns.join(","));
  if (selection.expedited) params.set("expedited", "1");
  if (selection.complexScheduling) params.set("scheduling", "complex");
  if (selection.advancedCommerce) params.set("commerce", "advanced");
  return params;
}

export function selectionFromSearchParams(params: { get(name: string): string | null }): QuoteSelection {
  const packageId = params.get("package");
  if (!isPackageId(packageId)) return { ...emptySelection };
  const defaults = selectionForPackage(packageId);
  return normalizeSelection({
    packageId,
    pages: params.get("pages") ? Number(params.get("pages")) : defaults.pages,
    products: params.get("products") ? Number(params.get("products")) : defaults.products,
    addOns: (params.get("addons") ?? "").split(",").filter(Boolean) as AddOnId[],
    expedited: params.get("expedited") === "1",
    complexScheduling: params.get("scheduling") === "complex",
    advancedCommerce: params.get("commerce") === "advanced",
  });
}
