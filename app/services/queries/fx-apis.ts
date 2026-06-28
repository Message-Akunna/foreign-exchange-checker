import { Axios } from "@/lib/axios";
import { FX_API_KEYS } from "./fx-keys";
import { VALID_CURRENCIES } from "./fx-constants";
import type { LatestRatesResponse, HistoricalRatesResponse } from "./fx-types";

/**
 * Fetches all active currencies supported by the API.
 * Converts the array list into a standard code-to-name dictionary map.
 *
 * @returns Map of currency codes to full currency names
 */
export const getCurrencies = async (): Promise<Record<string, string>> => {
  const raw = await Axios.get<Array<{ iso_code: string; name: string }>>(
    FX_API_KEYS.CURRENCIES
  );
  const map: Record<string, string> = {};
  for (const item of raw) {
    map[item.iso_code] = item.name;
  }
  return map;
};

/**
 * Fetches latest spot exchange rates with baseCurrency rebased.
 * Converts the v2 rates array output into the standard LatestRatesResponse shape.
 *
 * @param base - Base currency code (e.g. "USD")
 * @returns Formatted LatestRatesResponse object
 */
export const getLatestRates = async (
  base: string
): Promise<LatestRatesResponse> => {
  const safeBase = VALID_CURRENCIES.has(base.toUpperCase())
    ? base.toUpperCase()
    : "USD";
  const raw = await Axios.get<
    Array<{ date: string; base: string; quote: string; rate: number }>
  >(`${FX_API_KEYS.RATES}?base=${safeBase}`);

  const rates: Record<string, number> = {};
  let latestDate = new Date().toISOString().split("T")[0];

  for (const item of raw) {
    rates[item.quote] = item.rate;
    latestDate = item.date;
  }

  return {
    amount: 1,
    base: safeBase,
    date: latestDate,
    rates,
  };
};

/**
 * Fetches historical rates for the specified range, base currency, and symbols list.
 * Converts the flat array output into a nested map sorted by date.
 *
 * @param startDate - Start date of query range (YYYY-MM-DD)
 * @param endDate - End date of query range (YYYY-MM-DD)
 * @param base - Base currency code
 * @param symbols - Comma-separated quote currency symbols to fetch
 * @returns Formatted HistoricalRatesResponse object
 */
export const getHistoricalRates = async (
  startDate: string,
  endDate: string,
  base: string,
  symbols: string
): Promise<HistoricalRatesResponse> => {
  const safeBase = VALID_CURRENCIES.has(base.toUpperCase())
    ? base.toUpperCase()
    : "USD";
  const safeSymbols = symbols
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => VALID_CURRENCIES.has(s))
    .join(",");

  const raw = await Axios.get<
    Array<{ date: string; base: string; quote: string; rate: number }>
  >(
    `${FX_API_KEYS.RATES}?from=${startDate}&to=${endDate}&base=${safeBase}&quotes=${safeSymbols}`
  );

  const rates: Record<string, Record<string, number>> = {};
  for (const item of raw) {
    if (!rates[item.date]) {
      rates[item.date] = {};
    }
    rates[item.date][item.quote] = item.rate;
  }

  return {
    amount: 1,
    base: safeBase,
    start_date: startDate,
    end_date: endDate,
    rates,
  };
};
