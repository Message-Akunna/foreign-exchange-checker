import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FxCardProps {
  title: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  heightOffset?: number;
}

/**
 * Reusable full-height flex-layout Card container.
 * Calculates dynamic height relative to viewport height and keeps content scrollable.
 */
export function FxCard({
  title,
  headerRight,
  children,
  className,
  headerClassName,
  contentClassName,
  heightOffset = 128,
}: FxCardProps) {
  return (
    <Card
      className={cn("flex flex-col py-0 gap-0 overflow-hidden mt-5", className)}
      style={{ maxHeight: `calc(100dvh - ${heightOffset}px)` }}
    >
      <CardHeader
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 p-4 lg:p-5 shrink-0 text-nowrap",
          headerClassName
        )}
      >
        {title}
        {headerRight && (
          <div className="flex items-center gap-4 shrink-0 text-nowrap text-sm">
            {headerRight}
          </div>
        )}
      </CardHeader>
      <CardContent
        className={cn(
          "flex-1 overflow-y-auto space-y-3 px-4 pb-4 lg:px-5 lg:pb-5 pt-0",
          contentClassName
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
