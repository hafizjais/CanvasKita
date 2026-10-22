import type { ReactNode } from "react";

export const inputClasses =
  "block w-full rounded-lg border border-ink/20 bg-card px-3.5 py-3 text-base text-ink placeholder:text-muted/70 transition-colors hover:border-ink/40 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent aria-[invalid=true]:border-danger";

/** Label, control, hint and error for one form field. Element ids are `${prefix}-${id}`. */
export function FormField({
  prefix,
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  prefix: string;
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`${prefix}-${id}`} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${prefix}-${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${prefix}-${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria-describedby for a field: its error when present, otherwise its hint. */
export function describedBy(prefix: string, id: string, error?: string, hasHint = false) {
  return error ? `${prefix}-${id}-error` : hasHint ? `${prefix}-${id}-hint` : undefined;
}
