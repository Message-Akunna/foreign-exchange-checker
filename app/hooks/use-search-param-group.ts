import { useSearchParams } from "react-router";
import { useCallback, useMemo } from "react";

type ParamValue = string | number | boolean | null | undefined;

/**
 * React Router v7 hook for managing a group of search parameters reactively.
 * Backed by searchParams, it allows reading and partial updates of URL query keys.
 */
export function useSearchParamGroup<T extends Record<string, ParamValue>>(
  defaultValues?: Partial<T>
) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract current values based on searchParams
  const values = useMemo(() => {
    const result = {} as Record<string, string | null>;
    for (const [key, val] of searchParams.entries()) {
      result[key] = val;
    }
    // Merge defaultValues if not present in searchParams
    if (defaultValues) {
      for (const [key, val] of Object.entries(defaultValues)) {
        if (result[key] === undefined || result[key] === null) {
          result[key] = val !== undefined && val !== null ? String(val) : null;
        }
      }
    }
    return result as Record<keyof T, string | null>;
  }, [searchParams, defaultValues]);

  // Function to perform partial updates on query params
  const setParams = useCallback(
    (updates: Partial<T> | ((prev: Partial<T>) => Partial<T>)) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const resolvedUpdates =
            typeof updates === "function"
              ? updates(values as unknown as Partial<T>)
              : updates;

          for (const [key, val] of Object.entries(resolvedUpdates)) {
            if (
              val === null ||
              val === undefined ||
              val === "" ||
              val === false
            ) {
              next.delete(key);
            } else {
              next.set(key, String(val));
            }
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams, values]
  );

  return [values, setParams] as const;
}
