import type * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface StatCardData {
  title: string;
  value: React.ReactNode;
  valueClassName?: string;
}

interface StatsGridProps {
  cards: StatCardData[];
  className?: string;
}

export function StatsGrid({ cards, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 max-w-2xl",
        className
      )}
    >
      {cards.map((card) => (
        <Card key={card.title} className="p-0 rounded-2.5xl">
          <CardContent className="flex flex-col gap-4 px-5 py-3">
            <div className="text-sm text-muted-foreground uppercase">
              {card.title}
            </div>
            <div className={cn("text-xl", card.valueClassName)}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
