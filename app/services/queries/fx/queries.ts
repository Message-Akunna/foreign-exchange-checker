import { useQuery } from "@tanstack/react-query";
import { VALID_CURRENCIES } from "./constants";
import { calculateDateRange, formatRateInfo } from "./helpers";
import { getCurrencies, getLatestRates, getHistoricalRates } from "./apis";
import type { HistoricalRatesResponse } from "./types";

/**
 * React Query hook to fetch supported currencies mapping.
 *
 * @returns React Query result containing currencies map
 */
export function useCurrencies() {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: () => getCurrencies(),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * React Query hook to fetch latest exchange rates and daily differences.
 *
 * @param baseCurrency - Base currency code (e.g. "USD")
 * @returns React Query result containing Record<string, RateInfo> rates map
 */
export function useExchangeRates(baseCurrency: string) {
  const safeBase = VALID_CURRENCIES.has(baseCurrency.toUpperCase())
    ? baseCurrency.toUpperCase()
    : "USD";
  return useQuery({
    queryKey: ["rates", safeBase],
    queryFn: async () => {
      const latest = await getLatestRates(safeBase);

      const latestDate = new Date(latest.date);
      const start = new Date(latestDate);
      start.setDate(latestDate.getDate() - 5);
      const startStr = start.toISOString().split("T")[0];
      const endStr = latest.date;

      let history: HistoricalRatesResponse | undefined;
      try {
        history = await getHistoricalRates(
          startStr,
          endStr,
          safeBase,
          Object.keys(latest.rates).join(",")
        );
      } catch (err) {
        console.error(
          "Failed to fetch previous rates for change calculations:",
          err
        );
      }

      return formatRateInfo(latest, history);
    },
    staleTime: 60 * 1000,
  });
}

/**
 * React Query hook to fetch historical currency pair timeline range.
 *
 * @param pair - Currency code pair string (e.g. "USD/EUR")
 * @param timeframe - Timeframe selection string (1W, 1M, 3M, 1Y, 5Y)
 * @returns React Query result containing ChartPoint coordinate array
 */
export function useHistoricalData(pair: string, timeframe: string) {
  return useQuery({
    queryKey: ["history", pair, timeframe],
    queryFn: async () => {
      const [base, target] = pair.split("/");
      if (
        !base ||
        !target ||
        !VALID_CURRENCIES.has(base.toUpperCase()) ||
        !VALID_CURRENCIES.has(target.toUpperCase())
      ) {
        return [];
      }

      const { startDate, endDate } = calculateDateRange(timeframe);
      const res = await getHistoricalRates(startDate, endDate, base, target);

      const data: { date: string; value: number }[] = [];
      const dates = Object.keys(res.rates).sort();

      for (const dateStr of dates) {
        const val = res.rates[dateStr][target.toUpperCase()];
        if (val !== undefined) {
          data.push({
            date: dateStr,
            value: val,
          });
        }
      }
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
