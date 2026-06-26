import { useSearchParams } from "react-router";
import { useCallback } from "react";

type ParamValue = string | null | undefined;
type ParamGroup = Record<string, ParamValue>;

type Options<T> = {
  /**
   * If `true`, the group is considered open only when **all** keys exist
   * in the URL. Default: any key present = open.
   */
  requireAll?: boolean;
  /**
   * Default values merged in when calling `open()` with no arguments.
   * Useful for dialogs that always need a fixed param to open.
   */
  defaults?: Partial<T>;
};

/**
 * React Router v7 hook for managing a group of URL search params as a single
 * logical UI state (dialogs, drawers, sheets, filters, etc.).
 *
 * Reads params from `useSearchParams()` and writes them via the search params setter.
 *
 * ------------------------------------------------------------
 * Definition of "open"
 * ------------------------------------------------------------
 * By default the group is open when **any** of the provided keys exist in
 * the URL. Pass `requireAll: true` to require every key to be present.
 *
 * ------------------------------------------------------------
 * URL behaviour
 * ------------------------------------------------------------
 * - `null` / `undefined` / `''` / `false` values remove the key from the URL.
 * - State is shareable, bookmarkable, and back/forward friendly.
 *
 * @template T  Shape of the param group (keys + string values).
 *
 * @param keys   Search param keys that belong to this group.
 * @param options  Optional configuration (see `Options<T>`).
 *
 * @returns `{ values, isOpen, set, open, close, toggle, handleOpen }`
 *
 * @example
 * // Basic dialog
 * const dialog = useSearchParamDialog(['dialog', 'id'] as const, {
 *   defaults: { dialog: 'edit' },
 * });
 *
 * <Dialog open={dialog.isOpen} onOpenChange={dialog.handleOpen} />
 *
 * // Open with a specific record
 * dialog.open({ id: '42' });
 *
 * // Read current values
 * const { id } = dialog.values;
 */
export function useSearchParamDialog<T extends ParamGroup>(
  keys: readonly (keyof T)[],
  options?: Options<T>
) {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ------------------------------------------------------------------
   * values — current param values (missing keys return null)
   * ------------------------------------------------------------------ */
  const values = keys.reduce(
    (acc, key) => {
      acc[key] = searchParams.get(String(key));
      return acc;
    },
    {} as Record<keyof T, string | null>
  );

  /* ------------------------------------------------------------------
   * isOpen
   * ------------------------------------------------------------------ */
  const isOpen = options?.requireAll
    ? keys.every((key) => searchParams.has(String(key)))
    : keys.some((key) => searchParams.has(String(key)));

  /* ------------------------------------------------------------------
   * set — partial update; null/undefined removes the key
   * ------------------------------------------------------------------ */
  const set = useCallback(
    (next: Partial<T>) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(next)) {
            if (
              value === null ||
              value === undefined ||
              value === "" ||
              value === false
            ) {
              newParams.delete(key);
            } else {
              newParams.set(key, String(value));
            }
          }
          return newParams;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  /* ------------------------------------------------------------------
   * open — applies defaults then any provided overrides
   * ------------------------------------------------------------------ */
  const open = useCallback(
    (next?: Partial<T>) => {
      set({
        ...(options?.defaults ?? {}),
        ...(next ?? {}),
      } as Partial<T>);
    },
    [set, options?.defaults]
  );

  /* ------------------------------------------------------------------
   * close — removes all group keys from the URL
   * ------------------------------------------------------------------ */
  const close = useCallback(() => {
    const cleared = keys.reduce(
      (acc, key) => {
        acc[String(key)] = null;
        return acc;
      },
      {} as Record<string, null>
    );
    set(cleared as Partial<T>);
  }, [keys, set]);

  /* ------------------------------------------------------------------
   * toggle / handleOpen
   * ------------------------------------------------------------------ */
  const toggle = useCallback(
    (next?: Partial<T>) => {
      isOpen ? close() : open(next);
    },
    [isOpen, close, open]
  );

  const handleOpen = useCallback(
    (state: boolean, next?: Partial<T>) => {
      state ? open(next) : close();
    },
    [open, close]
  );

  return { values, isOpen, set, open, close, toggle, handleOpen };
}
