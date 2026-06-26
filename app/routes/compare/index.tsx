// icons
import { Star } from "lucide-react";
// lib
import { toast } from "sonner";
// services
import { CURRENCIES } from "@/routes/_data/currencies";
import { toggleFavorite } from "@/services/redux/fx-slice";
import { useExchangeRates } from "@/services/queries/fx-queries";
// components
import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/custom/flag-image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// redux
import { useAppDispatch, useAppSelector } from "@/services/redux";
// utils
import { cn } from "@/lib/utils";

export default function ComparePage() {
  const dispatch = useAppDispatch();
  const amount = useAppSelector((state) => state.fx.amount);
  const sendCurrency = useAppSelector((state) => state.fx.sendCurrency);
  const receiveCurrency = useAppSelector((state) => state.fx.receiveCurrency);
  const favorites = useAppSelector((state) => state.fx.favorites);

  // Fetch real-time exchange rates with sendCurrency as base
  const { data: rates, isLoading } = useExchangeRates(sendCurrency);

  // Filter comparison currencies: exclude base and chosen received currency
  const targetCurrencies = CURRENCIES.filter(
    (currency) =>
      currency.code !== sendCurrency && currency.code !== receiveCurrency
  );

  const formattedAmount = Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const handleToggleFavorite = (pair: string) => {
    dispatch(toggleFavorite(pair));
    const isFavorited = favorites.includes(pair);
    toast.success(
      isFavorited
        ? `Removed ${pair} from favorites`
        : `Added ${pair} to favorites`
    );
  };

  return (
    <Card className="space-y-5 py-5 gap-0">
      {/* Header Info */}
      <CardHeader className="flex items-center justify-between px-5">
        <div className="flex items-center gap-2 uppercase">
          <span className="text-muted-foreground text-sm">MULTI-CURRENCY</span>
          <span className="text-foreground text-base">
            {formattedAmount} FROM {sendCurrency}
          </span>
        </div>
        <div className="text-sm uppercase text-muted-foreground">
          {targetCurrencies.length} PAIRS
        </div>
      </CardHeader>

      {/* Comparisons List */}
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground animate-pulse font-mono text-sm">
            Fetching comparison rates...
          </div>
        ) : (
          targetCurrencies.map((target) => {
            const info = rates?.[target.code];
            const rate = info?.rate ?? 1.0;
            const calculated = Number(amount || 0) * rate;

            // Formatted Value logic
            const isZeroDecimal = ["JPY", "BDT"].includes(target.code);
            const formattedValue = calculated.toLocaleString("en-US", {
              minimumFractionDigits: isZeroDecimal ? 0 : 2,
              maximumFractionDigits: isZeroDecimal ? 0 : 2,
            });

            // Formatted Rate logic
            const formattedRate = rate.toLocaleString("en-US", {
              minimumFractionDigits:
                rate >= 100 ? (target.code === "INR" ? 3 : 2) : 4,
              maximumFractionDigits: 4,
            });

            const pair = `${sendCurrency}/${target.code}`;
            const isFavorited = favorites.includes(pair);

            return (
              <div
                key={target.code}
                // onClick={() => handleToggleFavorite(pair)}
                className="flex items-center justify-between px-4 py-3 bg-accent border  hover:bg-secondary transition-all rounded-lg gap-5 cursor-pointer"
              >
                {/* Left Side: Flag & Currency Details */}
                <div className="flex items-center gap-5">
                  <FlagImage
                    code={target.code}
                    className="size-6 rounded-full border border-border/30"
                  />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm leading-4 text-foreground">
                      {target.code}
                    </span>
                    <span className="text-xs leading-3.5 text-muted-foreground">
                      {target.name}
                    </span>
                  </div>
                </div>

                {/* Right Side: Converted Amount, Rate & Star Toggle */}
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-base leading-4.5 text-foreground">
                      {formattedValue}
                    </span>
                    <span className="text-[10px] leading-2.5 text-muted-foreground">
                      @ {formattedRate}
                    </span>
                  </div>

                  {/* Favorite Toggle Button */}
                  <Button
                    type="button"
                    size="icon-sm"
                    className="cursor-pointer"
                    onClick={() => handleToggleFavorite(pair)}
                    variant={isFavorited ? "outline-primary" : "outline"}
                  >
                    <Star
                      className={cn(
                        "size-4",
                        isFavorited ? "fill-primary text-primary" : "fill-none"
                      )}
                    />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
