import { useEffect, useState } from "react";
import type { Table } from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import { useSearchParams } from "react-router";
import { Columns3, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface TableToolbarProps<TData> {
  table: Table<TData>;
  /**
   * Client-side column filter key (filters the current page only).
   * Use `searchParam` instead for server-driven search.
   */
  searchColumn?: string;
  /**
   * URL search param key that drives a server-side search.
   * When set, the input reads from and writes to this URL param with a
   * 600 ms debounce.
   */
  searchParam?: string;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
}

export function TableToolbar<TData>({
  table,
  searchColumn,
  searchParam,
  searchPlaceholder = "Search...",
  actions,
}: TableToolbarProps<TData>) {
  // ── Client-side filter value (searchColumn mode) ──────────────────────
  const clientSearchValue = searchColumn
    ? ((table.getColumn(searchColumn)?.getFilterValue() as string) ?? "")
    : "";

  // ── Server-side search param mode ─────────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParamValue = searchParam
    ? (searchParams.get(searchParam) ?? "")
    : "";

  const [inputValue, setInputValue] = useState(initialParamValue);
  const debouncedValue = useDebounce(inputValue, 600);

  // Sync input when the URL param changes externally (e.g. browser back/forward)
  useEffect(() => {
    if (searchParam) {
      setInputValue(searchParams.get(searchParam) ?? "");
    }
  }, [searchParam, searchParams]);

  // Fire update when debounced value settles
  useEffect(() => {
    if (!searchParam) return;
    // Skip the initial render — only fire when the value actually differs from the URL
    const current = searchParams.get(searchParam) ?? "";
    if (debouncedValue === current) return;

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedValue) {
          next.set(searchParam, debouncedValue);
        } else {
          next.delete(searchParam);
        }
        return next;
      },
      { replace: true }
    );
  }, [debouncedValue, searchParam, searchParams, setSearchParams]);

  const showSearch = Boolean(searchColumn || searchParam);

  return (
    <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {showSearch ? (
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            {searchParam ? (
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            ) : (
              <Input
                value={clientSearchValue}
                onChange={(e) =>
                  table.getColumn(searchColumn!)?.setFilterValue(e.target.value)
                }
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            )}
          </div>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            <Columns3 className="size-4" />
            Columns
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked) =>
                    column.toggleVisibility(Boolean(checked))
                  }
                >
                  {column.id.replaceAll("_", " ")}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
