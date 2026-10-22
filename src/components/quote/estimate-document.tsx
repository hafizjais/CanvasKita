import type { ReactNode } from "react";
import { pricing } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { servicePackages } from "@/data/packages";
import { getContactEmail, getWhatsAppUrl } from "@/lib/contact";
import { describeTimeline } from "@/lib/quote/calculate";
import { formatMYR } from "@/lib/quote/money";
import { addDays, describeTotal, formatDate } from "@/lib/quote/summary";
import type { Estimate, LineItem } from "@/lib/quote/types";

const amountText = (line: LineItem, suffix = "") =>
  line.amount === null ? "Quoted separately" : `${line.isStartingPrice ? "From " : ""}${formatMYR(line.amount)}${suffix}`;

function formatPhone(digits: string) {
  return digits.startsWith("60") ? `+60 ${digits.slice(2, 4)}-${digits.slice(4, 8)} ${digits.slice(8)}` : `+${digits}`;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7 break-inside-avoid">
      <h2 className="border-b border-ink/20 pb-1.5 text-[10pt] font-semibold tracking-[0.1em] text-muted uppercase">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/**
 * The estimate as a printable A4 document. It is only displayed when printing
 * (the browser's "Save as PDF" produces the PDF), so it uses plain, print-safe
 * styles.
 */
export function EstimateDocument({
  estimate,
  reference,
  issuedAt,
}: {
  estimate: Estimate;
  reference: string;
  issuedAt: Date;
}) {
  if (estimate.status === "empty") return null;

  const validUntil = addDays(issuedAt, pricing.estimate.validityDays);
  const inclusions = servicePackages[estimate.packageId].features;
  const whatsapp = getWhatsAppUrl() ? formatPhone(siteConfig.contact.whatsappNumber.replace(/\D/g, "")) : null;
  const email = getContactEmail();
  const { revisionRounds, postLaunchSupport } = pricing.estimate;

  return (
    <article className="mx-auto max-w-[180mm] bg-white text-[10.5pt] leading-normal text-ink">
      <header className="flex items-start justify-between gap-8 border-b-2 border-ink pb-5">
        <div>
          <p className="font-display text-[16pt] leading-none">
            <span className="font-bold">Hafiz MJ</span> <span>Digital</span>
          </p>
          <p className="mt-2 text-[9pt] text-muted">{siteConfig.positioning}</p>
        </div>
        <dl className="shrink-0 text-right text-[9pt]">
          <div>
            <dt className="inline text-muted">Reference </dt>
            <dd className="inline font-semibold">{reference}</dd>
          </div>
          <div>
            <dt className="inline text-muted">Issued </dt>
            <dd className="inline">{formatDate(issuedAt)}</dd>
          </div>
          <div>
            <dt className="inline text-muted">Valid until </dt>
            <dd className="inline">{formatDate(validUntil)}</dd>
          </div>
        </dl>
      </header>

      <h1 className="mt-6 text-[20pt] leading-tight font-semibold">Preliminary website estimate</h1>
      <p className="mt-1 text-muted">
        {estimate.packageName}
        {estimate.status === "priced" && estimate.selection.pages > 1 ? ` · ${estimate.selection.pages} pages` : ""}
        {estimate.status === "priced" && estimate.selection.products ? ` · ${estimate.selection.products} products` : ""}
      </p>

      {estimate.status === "requiresQuotation" ? (
        <Section title="Pricing">
          <p className="text-[13pt] font-semibold">Requires detailed quotation</p>
          <p className="mt-2">
            Custom systems are priced after a discovery and technical scope review. Projects of this kind usually start
            from {formatMYR(estimate.startingFrom)}. This is a guide only, not a total or a quotation.
          </p>
        </Section>
      ) : (
        <>
          <Section title="Itemised scope and pricing (one-time)">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[9pt] text-muted">
                  <th className="pb-1 font-semibold">Item</th>
                  <th className="pb-1 text-right font-semibold">Amount (MYR)</th>
                </tr>
              </thead>
              <tbody>
                {[...estimate.oneTime, ...estimate.quotedSeparately].map((line) => (
                  <tr key={line.id} className="border-t border-ink/15 align-top">
                    <td className="py-1.5 pr-4">
                      {line.label}
                      {line.detail && <span className="block text-[9pt] text-muted">{line.detail}</span>}
                    </td>
                    <td className="py-1.5 text-right whitespace-nowrap tabular-nums">{amountText(line)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ink">
                  <th className="pt-2 text-left">One-time project estimate</th>
                  <td className="pt-2 text-right text-[13pt] font-semibold whitespace-nowrap tabular-nums">
                    {describeTotal(estimate)}
                  </td>
                </tr>
              </tfoot>
            </table>
            {estimate.oneTimeIsMinimum && (
              <p className="mt-2 text-[9pt] text-muted">
                Some items are priced from a minimum or quoted separately; the final figure is confirmed in the formal
                quotation.
              </p>
            )}
          </Section>

          <Section title="Recurring costs (separate from the project estimate)">
            {estimate.recurring.length ? (
              <table className="w-full border-collapse">
                <tbody>
                  {estimate.recurring.map((line) => (
                    <tr key={line.id} className="border-t border-ink/15">
                      <td className="py-1.5">{line.label}</td>
                      <td className="py-1.5 text-right tabular-nums">{amountText(line, " per month")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No recurring services selected.</p>
            )}
            {estimate.firstYearTotal !== null && (
              <p className="mt-2">
                Estimated first-year cost (project plus 12 months): <strong>{formatMYR(estimate.firstYearTotal)}</strong>
              </p>
            )}
          </Section>
        </>
      )}

      <div className="grid grid-cols-2 gap-x-8">
        <Section title="Package inclusions">
          <ul className="list-disc space-y-0.5 pl-4">
            {inclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
        <Section title="Timeline and support">
          <p>
            <span className="text-muted">Indicative timeline: </span>
            {estimate.status === "priced" ? `${describeTimeline(estimate.timelineWeeks)} from receipt of content` : "Confirmed after discovery"}
          </p>
          <p className="mt-1">
            <span className="text-muted">Revisions: </span>
            {revisionRounds !== null ? `${revisionRounds} rounds included` : "Confirmed in the formal quotation"}
          </p>
          <p className="mt-1">
            <span className="text-muted">Post-launch support: </span>
            {postLaunchSupport ?? "Confirmed in the formal quotation"}
          </p>
        </Section>
      </div>

      {estimate.status === "priced" && estimate.notes.length > 0 && (
        <Section title="Notes">
          <ul className="list-disc space-y-0.5 pl-4">
            {estimate.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Section>
      )}

      <div className="grid grid-cols-2 gap-x-8">
        <Section title="Not included">
          <ul className="list-disc space-y-0.5 pl-4 text-[9.5pt]">
            {pricing.exclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
        <Section title="Assumptions">
          <ul className="list-disc space-y-0.5 pl-4 text-[9.5pt]">
            {pricing.assumptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Next steps">
        <ol className="list-decimal space-y-0.5 pl-4">
          <li>Send this estimate (reference {reference}) through the website or WhatsApp.</li>
          <li>We discuss your requirements and confirm the scope.</li>
          <li>You receive a formal written quotation for approval.</li>
          <li>Work is scheduled once the quotation is accepted.</li>
        </ol>
      </Section>

      <footer className="mt-8 break-inside-avoid border-t-2 border-ink pt-4 text-[9pt] leading-relaxed">
        <p>
          <strong>This is a preliminary estimate, not a final or binding quotation.</strong> It is based on the options
          selected online and is valid for {pricing.estimate.validityDays} days from the issue date, subject to
          confirmation. Final scope and pricing are set out in a formal quotation.
        </p>
        <p className="mt-2 text-muted">
          {siteConfig.name}
          {whatsapp ? ` · WhatsApp ${whatsapp}` : ""}
          {email ? ` · ${email}` : ""}
        </p>
      </footer>
    </article>
  );
}
