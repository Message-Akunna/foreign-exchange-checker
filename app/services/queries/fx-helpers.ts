import type {
  RateInfo,
  LatestRatesResponse,
  HistoricalRatesResponse,
} from "./fx-types";

/**
 * Calculates start and end ISO date strings relative to today
 * based on the provided timeframe selector string.
 *
 * @param timeframe - Timeframe identifier ("1W", "1M", "3M", "1Y", "5Y")
 * @returns Object containing startDate and endDate strings in YYYY-MM-DD format
 */
export function calculateDateRange(timeframe: string): {
  startDate: string;
  endDate: string;
} {
  const end = new Date();
  const start = new Date();

  switch (timeframe) {
    case "1W":
      start.setDate(end.getDate() - 7);
      break;
    case "1M":
      start.setMonth(end.getMonth() - 1);
      break;
    case "3M":
      start.setMonth(end.getMonth() - 3);
      break;
    case "1Y":
      start.setFullYear(end.getFullYear() - 1);
      break;
    case "5Y":
      start.setFullYear(end.getFullYear() - 5);
      break;
    default:
      start.setMonth(end.getMonth() - 1);
  }

  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

/**
 * Formats a raw LatestRatesResponse alongside an optional HistoricalRatesResponse
 * into a structured dictionary mapping currency codes to RateInfo stats objects.
 *
 * Calculates the exact change and pctChange using previous business day rates
 * from the historical response.
 *
 * @param latest - The latest spot rates response
 * @param history - Range history rates containing the previous business day
 * @returns Map of target currency codes to structured RateInfo objects
 */
export const formatRateInfo = (
  latest: LatestRatesResponse,
  history?: HistoricalRatesResponse
): Record<string, RateInfo> => {
  const rates: Record<string, RateInfo> = {};

  let prevRates: Record<string, number> | undefined;
  if (history?.rates) {
    const dates = Object.keys(history.rates).sort();
    if (dates.length >= 2) {
      const prevDate = dates[dates.length - 2];
      prevRates = history.rates[prevDate];
    } else if (dates.length === 1) {
      prevRates = history.rates[dates[0]];
    }
  }

  for (const [curr, rate] of Object.entries(latest.rates)) {
    const open = prevRates?.[curr] ?? rate;
    const change = rate - open;
    const pctChange = open > 0 ? (change / open) * 100 : 0;

    rates[curr] = {
      rate,
      open,
      last: rate,
      change,
      pctChange,
      high: rate,
      low: rate,
    };
  }

  // Self reference base currency
  rates[latest.base] = {
    rate: 1,
    open: 1,
    last: 1,
    change: 0,
    pctChange: 0,
    high: 1,
    low: 1,
  };

  return rates;
};
