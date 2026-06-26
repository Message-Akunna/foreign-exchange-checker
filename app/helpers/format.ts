import { format } from "date-fns";

/**
 * Formats a date string into a short human-readable date.
 * Returns '—' for empty/null values.
 *
 * @example formatDate('2024-03-15') // 'Mar 15, 2024'
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  return format(new Date(value), "MMM d, yyyy");
}

/**
 * Formats a date string into a short human-readable date + time.
 * Returns '—' for empty/null values.
 *
 * @example formatDateTime('2024-03-15T14:30:00') // 'Mar 15, 2024, 2:30 PM'
 */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  return format(new Date(value), "MMM d, yyyy, h:mm a");
}

/**
 * Formats a decimal number as a percentage string, stripping trailing `.00`.
 *
 * @example formatAccuracy(87.5)  // '87.5%'
 * @example formatAccuracy(100)   // '100%'
 */
export function formatAccuracy(value: number): string {
  return `${value.toFixed(2).replace(/\.00$/, "")}%`;
}

/**
 * Formats bytes into a compact human-readable size label.
 */
export function formatBytes(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "—";
  }

  if (value === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1
  );
  const size = value / 1024 ** index;
  const digits = size >= 10 || index === 0 ? 0 : 1;

  return `${size.toFixed(digits)} ${units[index]}`;
}
