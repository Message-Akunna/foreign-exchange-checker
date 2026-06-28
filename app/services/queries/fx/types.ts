/**
 * Information regarding a currency exchange rate, including stats
 * derived relative to a baseline or historical comparison date.
 */
export interface RateInfo {
  /** The latest raw conversion rate */
  rate: number;
  /** The conversion rate at the beginning of the comparative range */
  open: number;
  /** The latest raw conversion rate (alias for rate) */
  last: number;
  /** The absolute change in value (rate - open) */
  change: number;
  /** The percentage change in value relative to open */
  pctChange: number;
  /** The range high rate */
  high: number;
  /** The range low rate */
  low: number;
}

/**
 * Standard API response structure for the latest exchange rates.
 */
export interface LatestRatesResponse {
  /** Base amount rebased to */
  amount: number;
  /** ISO code of the base currency */
  base: string;
  /** The publication date of the rates (YYYY-MM-DD) */
  date: string;
  /** Map of target currency codes to exchange rates */
  rates: Record<string, number>;
}

/**
 * API response structure for time-series range historical rates.
 */
export interface HistoricalRatesResponse {
  /** Base amount rebased to */
  amount: number;
  /** ISO code of the base currency */
  base: string;
  /** Start date of the range query (YYYY-MM-DD) */
  start_date: string;
  /** End date of the range query (YYYY-MM-DD) */
  end_date: string;
  /** Nested map of dates (YYYY-MM-DD) to quote rates objects */
  rates: Record<string, Record<string, number>>;
}
