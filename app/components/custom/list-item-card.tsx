/** biome-ignore-all lint/a11y/noStaticElementInteractions: false positive */
import type * as React from "react";
import { cn } from "@/lib/utils";

interface ListItemCardProps extends React.ComponentPropsWithoutRef<"div"> {
  onSelect?: () => void;
}

export function ListItemCard({
  onSelect,
  children,
  className,
  ...props
}: ListItemCardProps) {
  const isClickable = Boolean(onSelect);

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      className={cn(
        "flex items-center justify-between p-3 lg:px-4 lg:py-4 bg-accent border hover:border-alt transition-all rounded-lg gap-2.5 lg:gap-5 focus:outline-none focus:ring-2 focus:ring-primary",
        isClickable && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
