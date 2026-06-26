import type * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { FlagImage } from "./flag-image";

interface ListItemCardProps {
  baseCurrency: string;
  targetCurrency: string;
  className?: string;
  children?: React.ReactNode;
}

export function ListItemCard({
  baseCurrency,
  targetCurrency,
  className,
  children,
}: ListItemCardProps) {
  return (
    <Card
      className={cn(
        "bg-card/30 border border-border hover:border-border/80 hover:bg-card/40 transition-all rounded-2xl p-0",
        className
      )}
    >
      <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5">
        {/* Left Side: Overlapping Flags & Currency Pair */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="flex -space-x-2 shrink-0">
            <FlagImage
              code={baseCurrency}
              className="size-6 border border-card z-10"
            />
            <FlagImage
              code={targetCurrency}
              className="size-6 border border-card z-0"
            />
          </div>
          <span className="text-sm font-mono font-bold tracking-tight text-foreground">
            {baseCurrency} / {targetCurrency}
          </span>
        </div>

        {/* Custom Inner Content & Actions */}
        {children}
      </CardContent>
    </Card>
  );
}
