import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Pagination as PaginationPrimitive,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * A single link entry as returned by Laravel's `->links()` paginator.
 * Present on LengthAwarePaginator but not SimplePaginator.
 */
export interface PaginatorLink {
  url: string | null;
  label: string;
  active: boolean;
}

/**
 * Minimal paginator metadata accepted by this component.
 */
export interface PaginatorMeta {
  current_page: number;
  last_page: number;
  per_page?: number;
  from?: number | null;
  to?: number | null;
  total?: number;
  prev_page_url: string | null;
  next_page_url: string | null;
  links?: PaginatorLink[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Merges existing browser query params into a paginator URL so that
 * active filters/searches are preserved across page changes.
 */
function withPreservedParams(url: string): string {
  if (!url) return "";
  try {
    const target = new URL(
      url,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost"
    );
    if (typeof window !== "undefined") {
      const current = new URLSearchParams(window.location.search);
      current.forEach((value, key) => {
        if (!target.searchParams.has(key)) {
          target.searchParams.append(key, value);
        }
      });
    }
    return target.pathname + target.search;
  } catch (_e) {
    return url;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PaginationProps {
  /** Paginator metadata. */
  meta: PaginatorMeta;
  /**
   * When true, the "Showing X–Y of Z" summary is rendered above the controls.
   * Requires `from`, `to`, and `total` to be present in `meta`.
   * @default false
   */
  showSummary?: boolean;
  /** Extra class names applied to the root `<nav>` element. */
  className?: string;
}

/**
 * A fully React Router-aware pagination component.
 */
export function Pagination({
  meta,
  className,
  showSummary = false,
}: PaginationProps) {
  // Nothing to paginate.
  if (meta.last_page <= 1) return null;

  const hasPrev = !!meta.prev_page_url;
  const hasNext = !!meta.next_page_url;

  /** Numbered links, stripping the Previous and Next sentinel entries. */
  const pageLinks = meta.links?.filter(
    (link) => link.label !== "&laquo; Previous" && link.label !== "Next &raquo;"
  );

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row justify-between items-center gap-3",
        className
      )}
    >
      {/* Optional "Showing X–Y of Z results" summary */}
      {showSummary &&
        meta.from != null &&
        meta.to != null &&
        meta.total != null && (
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{meta.from}</span> to{" "}
            <span className="font-medium">{meta.to}</span> of{" "}
            <span className="font-medium">{meta.total}</span> results
          </p>
        )}

      <PaginationPrimitive className="justify-end w-auto grow">
        <PaginationContent>
          {/* ── Previous ── */}
          <PaginationItem>
            {hasPrev ? (
              <Link
                to={withPreservedParams(meta.prev_page_url ?? "")}
                aria-label="Go to previous page"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "pl-1.5!"
                )}
              >
                <ChevronLeftIcon className="size-4" />
                <span className="hidden sm:block">Previous</span>
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "cursor-not-allowed opacity-50 pl-1.5!"
                )}
              >
                <ChevronLeftIcon className="size-4" />
                <span className="hidden sm:block">Previous</span>
              </span>
            )}
          </PaginationItem>

          {/* ── Numbered pages (LengthAwarePaginator) ── */}
          {pageLinks ? (
            pageLinks.map((link, index) => {
              // Stable key: URL is unique per page; use label+index for ellipsis spans.
              const key = link.url ?? `ellipsis-${index}`;
              // Labels from Laravel are plain numbers or '...' — safe to render as text.
              const label = link.label.replace(/&hellip;/g, "\u2026");

              // Ellipsis — no URL and not active
              if (!link.url && !link.active) {
                return (
                  <PaginationItem key={key}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={key}>
                  {link.url ? (
                    <Link
                      to={withPreservedParams(link.url)}
                      aria-current={link.active ? "page" : undefined}
                      className={cn(
                        buttonVariants({
                          variant: link.active ? "default" : "outline",
                          size: "icon",
                        }),
                        "min-w-9"
                      )}
                    >
                      {label}
                    </Link>
                  ) : (
                    <span
                      aria-current="page"
                      className={cn(
                        buttonVariants({ variant: "default", size: "icon" }),
                        "min-w-9"
                      )}
                    >
                      {label}
                    </span>
                  )}
                </PaginationItem>
              );
            })
          ) : (
            /* ── Simple fallback: Page X of Y ── */
            <PaginationItem>
              <span className="px-3 text-sm text-muted-foreground">
                Page {meta.current_page} of {meta.last_page}
              </span>
            </PaginationItem>
          )}

          {/* ── Next ── */}
          <PaginationItem>
            {hasNext ? (
              <Link
                to={withPreservedParams(meta.next_page_url ?? "")}
                aria-label="Go to next page"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "pr-1.5!"
                )}
              >
                <span className="hidden sm:block">Next</span>
                <ChevronRightIcon className="size-4" />
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "cursor-not-allowed opacity-50 pr-1.5!"
                )}
              >
                <span className="hidden sm:block">Next</span>
                <ChevronRightIcon className="size-4" />
              </span>
            )}
          </PaginationItem>
        </PaginationContent>
      </PaginationPrimitive>
    </div>
  );
}

export { Pagination as InertiaPagination };
