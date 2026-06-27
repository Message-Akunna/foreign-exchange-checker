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
          "flex items-center justify-between p-5 shrink-0",
          headerClassName
        )}
      >
        {title}
        {headerRight && (
          <div className="flex items-center gap-4 shrink-0 text-sm">
            {headerRight}
          </div>
        )}
      </CardHeader>
      <CardContent
        className={cn(
          "flex-1 overflow-y-auto space-y-3 px-5 pb-5 pt-0",
          contentClassName
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
