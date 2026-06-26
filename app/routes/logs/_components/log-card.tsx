import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { getRelativeTime } from "@/helpers/relative-time";
import { ListItemCard } from "@/components/custom/list-item-card";

interface LogCardProps {
  log: {
    id: string;
    timestamp: string;
    amount: number;
    sendCurrency: string;
    receiveCurrency: string;
    rate: number;
    result: number;
  };
  onSelect: () => void;
  onDelete: () => void;
}

export function LogCard({ log, onSelect, onDelete }: LogCardProps) {
  const relativeTime = getRelativeTime(log.timestamp);

  const formattedSource = log.amount.toLocaleString("en-US", {
    minimumFractionDigits: log.amount % 1 === 0 && log.amount >= 10000 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  const isZeroDecimal = ["JPY", "BDT"].includes(log.receiveCurrency);
  const formattedResult = log.result.toLocaleString("en-US", {
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  });

  return (
    <ListItemCard onSelect={onSelect}>
      {/* Left Side: Time elapsed & Currency pair arrow */}
      <div className="flex items-center gap-5">
        <span className="text-xs text-muted-foreground w-12  leading-tight">
          {relativeTime}
        </span>
        <span className="text-sm font-semibold text-foreground  leading-tight">
          {log.sendCurrency} → {log.receiveCurrency}
        </span>
      </div>

      {/* Right Side: Source amount, Converted value, Trash delete button */}
      <div className="flex items-center gap-5 ">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground leading-tight">
            {formattedSource}
          </span>
          <span className="text-base font-bold text-primary leading-tight">
            {formattedResult}
          </span>
        </div>

        {/* Delete button */}
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </ListItemCard>
  );
}
