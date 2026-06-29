import { cn } from "@/lib/utils";
import Marquee from "react-fast-marquee";
import { useExchangeRates } from "@/services/queries/fx";
import { Skeleton } from "@/components/ui/skeleton";

const SafeMarquee =
  (Marquee as any).default?.default || (Marquee as any).default || Marquee;

export function LiveTicker() {
  const { data: rates, isLoading, isError } = useExchangeRates("USD");

  const getTickerItems = () => {
    if (!rates) {
      return [];
    }

    const pairs = [
      {
        pair: "USD/JPY",
        getRates: () => ({
          rate: rates.JPY?.rate ?? 0,
          pctChange: rates.JPY?.pctChange ?? 0,
        }),
      },
      {
        pair: "GBP/USD",
        getRates: () => {
          const rateGbp = rates.GBP?.rate ?? 1;
          const rate = 1 / rateGbp;
          const prev = 1 / (rates.GBP?.open ?? 1);
          const pctChange = prev > 0 ? ((rate - prev) / prev) * 100 : 0;
          return { rate, pctChange };
        },
      },
      {
        pair: "USD/CHF",
        getRates: () => ({
          rate: rates.CHF?.rate ?? 0,
          pctChange: rates.CHF?.pctChange ?? 0,
        }),
      },
      {
        pair: "EUR/GBP",
        getRates: () => {
          const rateEur = rates.EUR?.rate ?? 1;
          const rateGbp = rates.GBP?.rate ?? 1;
          const rate = rateGbp / rateEur;
          const prev = (rates.GBP?.open ?? 1) / (rates.EUR?.open ?? 1);
          const pctChange = prev > 0 ? ((rate - prev) / prev) * 100 : 0;
          return { rate, pctChange };
        },
      },
      {
        pair: "AUD/USD",
        getRates: () => {
          const rateAud = rates.AUD?.rate ?? 1;
          const rate = 1 / rateAud;
          const prev = 1 / (rates.AUD?.open ?? 1);
          const pctChange = prev > 0 ? ((rate - prev) / prev) * 100 : 0;
          return { rate, pctChange };
        },
      },
      {
        pair: "USD/CAD",
        getRates: () => ({
          rate: rates.CAD?.rate ?? 0,
          pctChange: rates.CAD?.pctChange ?? 0,
        }),
      },
    ];

    return pairs.map(({ pair, getRates }) => {
      const { rate, pctChange } = getRates();
      const isPositive = pctChange >= 0;
      return {
        pair,
        rate: rate > 0 ? rate.toFixed(4) : "...",
        change:
          rate > 0 ? `${isPositive ? "+" : ""}${pctChange.toFixed(2)}%` : "...",
        isPositive,
      };
    });
  };

  const tickerItems = getTickerItems();

  return (
    <div className="flex w-full items-stretch bg-card text-xs overflow-hidden sticky top-0 z-20 border-y border-background">
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
        {isLoading ? (
          <div className="flex flex-1 items-center gap-6 px-5 py-3">
            {Array.from({ length: 6 }).map((_, index) => {
              const widths = ["w-24", "w-28", "w-24", "w-26", "w-24", "w-28"];
              return (
                <Skeleton
                  key={`ticker-skeleton-${index}`}
                  className={cn("h-6 rounded-none shrink-0", widths[index % widths.length])}
                />
              );
            })}
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center px-5 py-3 text-destructive gap-2 text-xs font-normal">
            <span>⚠️</span>
            <span>Failed to load live exchange rates.</span>
          </div>
        ) : (
          <SafeMarquee
            speed={40}
            pauseOnHover={true}
            className="flex animate-infinite-scroll whitespace-nowrap items-center"
          >
            {/* Double items for continuous loop */}
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div key={`${item.pair}-${idx}`} className="">
                <div className="relative flex items-center gap-2.5 shrink-0 px-5 py-3 border-r! border-border! last:border-0">
                  <span className="text-muted-foreground font-normal">
                    {item.pair}
                  </span>
                  <span className="text-foreground font-medium">
                    {item.rate}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 font-normal",
                      item.isPositive ? "text-success" : "text-destructive"
                    )}
                  >
                    {item.isPositive ? "▲" : "▼"} {item.change}
                  </span>
                </div>
              </div>
            ))}
          </SafeMarquee>
        )}
      </div>
    </div>
  );
}
