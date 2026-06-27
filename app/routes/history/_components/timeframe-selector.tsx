import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export const TIMEFRAMES = ["1W", "1M", "3M", "1Y", "5Y"] as const;

interface TimeframeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimeframeSelector({
  value,
  onChange,
  className,
}: TimeframeSelectorProps) {
  return (
    <ToggleGroup
      size="sm"
      spacing={1}
      value={[value]}
      className={cn(
        "text-muted-foreground bg-card p-0.5 rounded-md",
        className
      )}
      onValueChange={(val) => {
        if (val && val.length > 0) onChange(val[0]);
      }}
    >
      {TIMEFRAMES.map((timeframe) => (
        <ToggleGroupItem
          key={timeframe}
          value={timeframe}
          className="rounded-md flex size-12 flex-col items-center justify-center text-base"
          aria-label={`Toggle ${timeframe}`}
        >
          {timeframe}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
