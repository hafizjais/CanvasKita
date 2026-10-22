/** Money helpers. All amounts are integer sen (RM1 = 100 sen). */

export const toSen = (ringgit: number) => Math.round(ringgit * 100);

/** Percentage of an amount in sen, rounded to the nearest sen. */
export const percentOf = (sen: number, percent: number) => Math.round((sen * percent) / 100);

/**
 * "RM1,900" or "RM1,234.50". Formats by hand so the server and the browser
 * always produce identical text, whatever the locale.
 */
export function formatMYR(sen: number) {
  const negative = sen < 0;
  const absolute = Math.abs(sen);
  const ringgit = Math.floor(absolute / 100);
  const cents = absolute % 100;
  const grouped = String(ringgit).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}RM${grouped}${cents ? `.${String(cents).padStart(2, "0")}` : ""}`;
}
