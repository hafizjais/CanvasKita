import type { AddOnId, PackageId } from "../../config/pricing.ts";

export type { AddOnId, PackageId };

/** What the visitor has chosen. Plain data, safe to put in a URL. */
export type QuoteSelection = {
  packageId: PackageId | null;
  /** Total standard content pages wanted, including those in the package. */
  pages: number;
  /** Total initial product listings wanted (e-commerce). */
  products: number;
  addOns: AddOnId[];
  /** Booking: multiple staff, rooms or locations, or custom booking rules. */
  complexScheduling: boolean;
  /** E-commerce: extra payment gateways or advanced shipping rules. */
  advancedCommerce: boolean;
};

export type LineItem = {
  id: string;
  label: string;
  detail?: string;
  /** Amount in sen. null means "quoted separately" and is never added to a total. */
  amount: number | null;
  /** The amount is a starting price; the final figure is confirmed after review. */
  isStartingPrice?: boolean;
};

export type Estimate =
  | {
      status: "empty";
    }
  | {
      status: "priced";
      packageId: PackageId;
      packageName: string;
      selection: QuoteSelection;
      oneTime: LineItem[];
      /** Sum of priced one-time lines, in sen. */
      oneTimeTotal: number;
      /** True when the one-time total includes a starting price or excludes separately quoted items. */
      oneTimeIsMinimum: boolean;
      recurring: LineItem[];
      /** Monthly recurring total in sen. */
      monthlyTotal: number;
      /** Project + 12 months of recurring costs, only when every figure is fixed. */
      firstYearTotal: number | null;
      /** Items that need a separate quotation, shown without a price. */
      quotedSeparately: LineItem[];
      notes: string[];
      timelineWeeks: [number, number] | null;
    };

export type PricedEstimate = Extract<Estimate, { status: "priced" }>;
