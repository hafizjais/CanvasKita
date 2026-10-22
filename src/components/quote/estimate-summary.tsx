import { DomainHighlight } from "@/components/domain-highlight";
import { describeTimeline } from "@/lib/quote/calculate";
import { formatMYR } from "@/lib/quote/money";
import { describeTotal } from "@/lib/quote/summary";
import type { Estimate, LineItem } from "@/lib/quote/types";

function amountText(line: LineItem, suffix = "") {
  if (line.amount === null) return "Quoted separately";
  return `${line.isStartingPrice ? "From " : ""}${formatMYR(line.amount)}${suffix}`;
}

/**
 * The itemised estimate. "compact" is the running summary beside the
 * configurator; "full" is the review step. Every figure comes from the same
 * calculateEstimate() result, so the lines always add up to the totals.
 */
export function EstimateSummary({ estimate, variant = "full" }: { estimate: Estimate; variant?: "compact" | "full" }) {
  const compact = variant === "compact";

  if (estimate.status === "empty") {
    return (
      <div className="text-sm leading-relaxed text-muted">
        <p className="font-display text-lg font-semibold text-ink">No website type selected</p>
        <p className="mt-2">Choose a website type to see an itemised estimate. Prices update as you go.</p>
      </div>
    );
  }

  if (estimate.status === "requiresQuotation") {
    return (
      <div>
        <p className="text-sm text-muted">{estimate.packageName}</p>
        <p className="mt-2 font-display text-2xl leading-tight font-semibold">Requires detailed quotation</p>
        <p className="mt-3 text-sm leading-relaxed text-graphite">
          Custom systems are priced after a discovery and technical scope review. Projects usually start from{" "}
          {formatMYR(estimate.startingFrom)}, but that is a guide, not a total.
        </p>
        <DomainHighlight variant="line" />
      </div>
    );
  }

  const rowText = compact ? "text-sm" : "text-[0.95rem]";

  return (
    <div>
      <table className={`w-full border-collapse ${rowText}`}>
        <caption className="sr-only">One-time project costs</caption>
        <thead className={compact ? "sr-only" : ""}>
          <tr className="border-b border-ink/15 text-left text-xs tracking-[0.08em] text-muted uppercase">
            <th scope="col" className="pb-2 font-semibold">
              Item
            </th>
            <th scope="col" className="pb-2 text-right font-semibold">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {[...estimate.oneTime, ...estimate.quotedSeparately].map((line) => (
            <tr key={line.id} className="border-b border-ink/10 align-top">
              <th scope="row" className="py-2.5 pr-4 text-left font-normal">
                <span className="text-ink">{line.label}</span>
                {line.detail && !compact && <span className="mt-0.5 block text-xs text-muted">{line.detail}</span>}
              </th>
              <td
                className={`py-2.5 text-right whitespace-nowrap tabular-nums ${line.amount === null ? "text-muted italic" : "text-ink"}`}
              >
                {amountText(line)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="pt-4 text-left font-semibold">
              One-time project estimate
            </th>
            <td className="pt-4 text-right font-display text-xl font-semibold whitespace-nowrap">
              {describeTotal(estimate)}
            </td>
          </tr>
        </tfoot>
      </table>

      <DomainHighlight variant="line" />

      {estimate.oneTimeIsMinimum && (
        <p className="mt-2 text-xs leading-relaxed text-muted">
          A starting figure: some items are priced from a minimum or quoted separately after review.
        </p>
      )}

      {estimate.recurring.length > 0 && (
        <div className="mt-6 rounded-lg border border-ink/12 p-4">
          <p className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">Monthly, billed separately</p>
          <ul className={`mt-2 space-y-1.5 ${rowText}`}>
            {estimate.recurring.map((line) => (
              <li key={line.id} className="flex justify-between gap-4">
                <span>{line.label}</span>
                <span className="tabular-nums">{amountText(line, "/month")}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted">Not included in the one-time project estimate.</p>
        </div>
      )}

      {estimate.firstYearTotal !== null && (
        <p className={`mt-4 flex justify-between gap-4 ${rowText}`}>
          <span className="text-muted">First-year estimate (project + 12 months)</span>
          <span className="font-semibold tabular-nums">{formatMYR(estimate.firstYearTotal)}</span>
        </p>
      )}

      {!compact && (
        <>
          <p className="mt-6 flex justify-between gap-4 border-t border-ink/10 pt-4 text-[0.95rem]">
            <span className="text-muted">Indicative timeline</span>
            <span className="text-right">{describeTimeline(estimate.timelineWeeks)}, from receipt of content</span>
          </p>
          {estimate.notes.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm text-muted">
              {estimate.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
