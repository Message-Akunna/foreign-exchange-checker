import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/services/redux";
import {
  toggleFavorite,
  setSendCurrency,
  setReceiveCurrency,
} from "@/services/redux/fx-slice";
import { useExchangeRates } from "@/services/queries/fx-queries";
import { EmptyState } from "@/components/custom/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ListItemCard } from "@/components/custom/list-item-card";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const favorites = useAppSelector((state) => state.fx.favorites);

  const handleSelectFavorite = (pair: string) => {
    const [base, target] = pair.split("/");
    if (base && target) {
      dispatch(setSendCurrency(base));
      dispatch(setReceiveCurrency(target));
      toast.success(`Active converter set to ${pair}`);
      navigate("/history");
    }
  };

  const handleRemoveFavorite = (pair: string) => {
    dispatch(toggleFavorite(pair));
    toast.success(`Removed ${pair} from favorites`);
  };

  if (favorites.length === 0) {
    return (
      <EmptyState
        className="py-12 border-dashed border border-border/80 bg-card/10 rounded-2xl min-h-[300px]"
        icon={<Star className="size-5 fill-current" />}
        title={
          <span className="text-base font-bold mt-2">No Favorites Saved</span>
        }
        description={
          <span className="text-xs max-w-xs mt-1 block">
            Toggle the favorite star in the converter widget to save currency
            pairs for quick access.
          </span>
        }
      />
    );
  }

  return (
    <Card className="space-y-5 py-5 gap-0">
      {/* Header Info */}
      <CardHeader className="flex items-center justify-between px-5">
        <div className="flex items-center gap-2 uppercase">
          <span className="text-sm">PINNED PAIRS</span>
        </div>
        <div className="text-xs uppercase text-muted-foreground">
          {favorites.length} FAVORITES
        </div>
      </CardHeader>

      {/* Comparisons List */}
      <CardContent className="space-y-3">
        {favorites.map((pair) => (
          <FavoriteCard
            key={pair}
            pair={pair}
            onSelect={() => handleSelectFavorite(pair)}
            onRemove={() => handleRemoveFavorite(pair)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

interface FavoriteCardProps {
  pair: string;
  onSelect: () => void;
  onRemove: () => void;
}

function FavoriteCard({ pair, onSelect, onRemove }: FavoriteCardProps) {
  const [base, target] = pair.split("/");
  const { data: rates, isLoading } = useExchangeRates(base || "USD");

  const info = target ? rates?.[target] : undefined;
  const rateVal = info?.rate ?? 1.0;
  const changeVal = info?.change ?? 0.0;
  const pctChangeVal = info?.pctChange ?? 0.0;
  const isPos = changeVal >= 0;

  // Rate formatting logic
  const formattedRate = rateVal.toLocaleString("en-US", {
    minimumFractionDigits:
      rateVal >= 100 ? (target === "INR" || target === "TRY" ? 3 : 2) : 4,
    maximumFractionDigits: 4,
  });

  return (
    <ListItemCard onSelect={onSelect}>
      {/* Left Side: Currency pair arrows */}
      <div className="text-sm font-semibold text-foreground flex items-center gap-2">
        <span>{base}</span>
        <span className="text-muted-foreground"> → </span>
        <span>{target}</span>
      </div>

      {/* Right Side: Rate value, Percent change and Active Star button */}
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-end gap-1.5">
          {isLoading ? (
            <span className="text-xs text-muted-foreground animate-pulse">
              Loading...
            </span>
          ) : (
            <>
              <span className="text-base leading-4.5 font-bold text-foreground">
                {formattedRate}
              </span>
              <span
                className={cn(
                  "text-[10px] leading-2.5 font-semibold",
                  isPos ? "text-success" : "text-destructive"
                )}
              >
                {isPos ? "▲" : "▼"} {isPos ? "+" : ""}
                {pctChangeVal.toFixed(2)}%
              </span>
            </>
          )}
        </div>

        {/* Favorite Star Toggle Button (always active since it is on the favorites page) */}
        <Button
          type="button"
          variant="outline-primary"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="cursor-pointer"
        >
          <Star className="size-4 fill-primary text-primary" />
        </Button>
      </div>
    </ListItemCard>
  );
}
