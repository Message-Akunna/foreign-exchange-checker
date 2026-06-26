type QueryValue = string | number | boolean | null | undefined;

/**
 * Builds a URL string from the current location, applying the given
 * key/value updates to the search params.
 *
 * - `null`, `undefined`, `''`, or `false` removes the key.
 * - All other values are stringified and set.
 */
export function buildUrl(updates: Record<string, QueryValue>): string {
  if (typeof window === "undefined") {
    return "";
  }

  const params = new URLSearchParams(window.location.search);

  for (const [key, value] of Object.entries(updates)) {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === false
    ) {
      params.delete(key);
      continue;
    }

    params.set(key, String(value));
  }

  const query = params.toString();

  return `${window.location.pathname}${query ? `?${query}` : ""}`;
}

/**
 * Navigates to the current page with updated search params,
 * preserving scroll position and state by modifying the browser history.
 */
export function updateQuery(updates: Record<string, QueryValue>): void {
  if (typeof window === "undefined") {
    return;
  }

  const newUrl = buildUrl(updates);
  window.history.replaceState(null, "", newUrl);

  // Dispatch popstate event so that React Router and other listeners update
  window.dispatchEvent(new PopStateEvent("popstate"));
}
