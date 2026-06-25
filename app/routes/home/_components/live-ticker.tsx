import { cn } from "@/lib/utils";

interface TickerItem {
  pair: string;
  rate: string;
  change: string;
  isPositive: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
  { pair: "USD/JPY", rate: "157.91", change: "+0.04%", isPositive: true },
  { pair: "GBP/USD", rate: "1.3575", change: "-0.22%", isPositive: false },
  { pair: "USD/CHF", rate: "0.9898", change: "+0.13%", isPositive: true },
  { pair: "EUR/GBP", rate: "0.8633", change: "+0.11%", isPositive: true },
  { pair: "AUD/USD", rate: "0.7208", change: "+0.08%", isPositive: true },
  { pair: "USD/CAD", rate: "1.3815", change: "+0.04%", isPositive: true },
];

export function LiveTicker() {
  return (
    <div className="flex w-full items-stretch bg-card text-xs font-mono select-none overflow-hidden">
      {/* Label */}
      <div className="flex items-center gap-2 bg-primary px-4 py-3 font-medium tracking-wider text-primary-foreground uppercase shrink-0">
        <span className="relative flex size-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75" />
          <span className="relative inline-flex rounded-full size-1.5 bg-primary-foreground" />
        </span>
        Live Markets
      </div>

      {/* Sliding track */}
      <div className="flex flex-1 items-center overflow-x-auto no-scrollbar">
        <div className="flex animate-infinite-scroll whitespace-nowrap items-center">
          {/* Double items for continuous loop */}
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div
              key={`${item.pair}-${idx}`}
              className="flex items-center gap-2.5 shrink-0 border-r px-3 py-3 last:border-0"
            >
              <span className="text-muted-foreground font-normal">
                {item.pair}
              </span>
              <span className="text-foreground font-medium">{item.rate}</span>
              <span
                className={cn(
                  "flex items-center gap-0.5 font-normal",
                  item.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {item.isPositive ? "▲" : "▼"} {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
