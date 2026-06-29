import * as React from "react";
// icons
import { Star } from "lucide-react";
// lib
import { toast } from "sonner";
// services
import { useExchangeRates, useCurrencies } from "@/services/queries/fx";
import {
  useFavorites,
  useToggleFavoriteMutation,
} from "@/services/queries/favorites";
// components
import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/custom/flag-image";
import { FxCard } from "../_components/fx-card";
import { ListItemCard } from "@/components/custom/list-item-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/custom/empty-state";
// redux
import { useAppSelector } from "@/services/redux";
import { useAuth } from "@/providers/auth-provider";
// utils
import { cn } from "@/lib/utils";

export default function ComparePage() {
  const { executeProtectedAction } = useAuth();
  const amount = useAppSelector((state) => state.fx.amount);
  const sendCurrency = useAppSelector((state) => state.fx.sendCurrency);
  const receiveCurrency = useAppSelector((state) => state.fx.receiveCurrency);
  const { data: favorites = [] } = useFavorites();
  const toggleFavoriteMutation = useToggleFavoriteMutation();

  // Fetch dynamic currency list and rates
  const { data: rates, isLoading: ratesLoading } =
    useExchangeRates(sendCurrency);
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies();

  const isLoading = ratesLoading || currenciesLoading;

  // Filter comparison currencies: exclude base and chosen received currency
  const targetCurrencies = React.useMemo(() => {
    if (!currencies) return [];
    return Object.entries(currencies)
      .map(([code, name]) => ({ code, name }))
      .filter((c) => c.code !== sendCurrency && c.code !== receiveCurrency)
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [currencies, sendCurrency, receiveCurrency]);

  const isAmountEmpty = !amount || Number(amount) === 0;

  const formattedAmount = Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const handleToggleFavorite = (pair: string) => {
    executeProtectedAction(() => {
      const isFavorited = favorites.some((fav) => fav.pair === pair);
      toggleFavoriteMutation.mutate(pair, {
        onSuccess: () => {
          toast.success(
            isFavorited
              ? `Removed ${pair} from favorites`
              : `Added ${pair} to favorites`
          );
        },
        onError: (error: any) => {
          toast.error(error.message || `Failed to update favorite status`);
        },
      });
    });
  };

  if (isAmountEmpty) {
    return (
      <EmptyState
        className="py-12 border-dashed border border-border/80 bg-card/10 rounded-2xl min-h-[300px]"
        title={
          <span className="text-base font-bold mt-2">
            No comparison available.
          </span>
        }
        description={
          <span className="text-xs max-w-xs mt-1 block">
            Enter an amount in SEND above to see what your money is worth in
            other currencies.
          </span>
        }
      />
    );
  }

  return (
    <FxCard
      title={
        <div className="flex items-center gap-2 uppercase">
          <span className="text-muted-foreground text-sm">MULTI-CURRENCY</span>
          <span className="text-foreground text-base">
            {formattedAmount} FROM {sendCurrency}
          </span>
        </div>
      }
      headerRight={
        <div className="text-sm uppercase text-muted-foreground">
          {targetCurrencies.length} PAIRS
        </div>
      }
    >
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <ListItemCard key={index}>
              {/* Left Side: Flag & Currency Details skeleton */}
              <div className="flex items-center gap-5">
                <Skeleton className="size-6 rounded-full" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              {/* Right Side: Converted Amount, Rate & Star Toggle skeleton */}
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-end gap-1.5">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="size-8 rounded-md" />
              </div>
            </ListItemCard>
          ))
        : targetCurrencies.map((target) => {
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
            const isFavorited = favorites.some((fav) => fav.pair === pair);

            return (
              <ListItemCard key={target.code}>
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
              </ListItemCard>
            );
          })}
    </FxCard>
  );
}
