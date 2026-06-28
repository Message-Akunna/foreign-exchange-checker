/**
 * Set of ISO currency codes dynamically validated.
 * Supports any 3-letter or 4-letter currency code.
 */
export const VALID_CURRENCIES = {
  has: (code: string | undefined | null): boolean => {
    if (!code) return false;
    return /^[A-Z]{3,4}$/i.test(code);
  },
};
