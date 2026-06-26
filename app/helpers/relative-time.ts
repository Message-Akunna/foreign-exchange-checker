import { differenceInHours, differenceInMinutes, format } from "date-fns";

export function getRelativeTime(timestamp: string | Date): string {
  try {
    const logDate = new Date(timestamp);
    if (Number.isNaN(logDate.getTime())) {
      return typeof timestamp === "string" ? timestamp : "";
    }

    const now = new Date();

    if (logDate > now) {
      return "1M";
    }

    const diffMins = differenceInMinutes(now, logDate);
    if (diffMins < 60) {
      return `${Math.max(1, diffMins)}M`;
    }

    const diffHours = differenceInHours(now, logDate);
    if (diffHours < 24) {
      return `${diffHours}H`;
    }

    return format(logDate, "d MMM");
  } catch {
    return typeof timestamp === "string" ? timestamp : "";
  }
}
