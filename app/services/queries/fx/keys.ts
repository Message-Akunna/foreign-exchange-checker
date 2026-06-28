/**
 * URL endpoint paths relative to the Axios base URL (e.g. /v2)
 */
export const FX_API_KEYS = {
  /** Path to get active currency details */
  CURRENCIES: "/currencies",
  /** Path to query latest or historical rates */
  RATES: "/rates",
} as const;
