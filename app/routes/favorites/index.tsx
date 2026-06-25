import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/services/redux";
import {
  toggleFavorite,
  setSendCurrency,
  setReceiveCurrency,
} from "@/services/redux/fx-slice";
import { useExchangeRates } from "@/services/queries/fx-queries";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import {
  Star,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const favorites = useAppSelector((state) => state.fx.favorites);

  const handleSelectFavorite = (pair: string) => {
    const [base, target] = pair.split("/");
    if (base && target) {
      dispatch(setSendCurrency(base));
      dispatch(setReceiveCurrency(target));
      navigate("/history");
    }
  };

  const handleRemoveFavorite = (pair: string) => {
    dispatch(toggleFavorite(pair));
    toast.success(`Removed ${pair} from favorites`);
  };

  if (favorites.length === 0) {
    return (
      <Empty className="py-12 border-dashed border border-border/80 bg-card/10 rounded-2xl min-h-[300px]">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 text-primary"
          >
            <Star className="size-5 fill-current" />
          </EmptyMedia>
          <EmptyTitle className="text-base font-mono font-bold mt-2">
            No Favorites Saved
          </EmptyTitle>
          <EmptyDescription className="font-mono text-xs max-w-xs mt-1">
            Toggle the favorite star in the converter widget to save currency
            pairs for quick access.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((pair) => (
        <FavoriteCard
          key={pair}
          pair={pair}
          onSelect={() => handleSelectFavorite(pair)}
          onRemove={() => handleRemoveFavorite(pair)}
        />
      ))}
    </div>
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

  return (
    <div className="border border-border/80 bg-card/20 rounded-xl p-5 shadow-sm space-y-4 hover:border-border transition-all flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono font-bold tracking-tight text-foreground">
            {pair}
          </span>
          {!isLoading && info && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border",
                isPos
                  ? "text-success bg-success/5 border-success/20"
                  : "text-destructive bg-destructive/5 border-destructive/20"
              )}
            >
              {isPos ? (
                <TrendingUp className="size-2.5" />
              ) : (
                <TrendingDown className="size-2.5" />
              )}
              {isPos ? "+" : ""}
              {pctChangeVal.toFixed(2)}%
            </span>
          )}
        </div>

        <div className="text-3xl font-mono font-bold tracking-tighter text-foreground pt-1">
          {isLoading ? (
            <span className="text-base text-muted-foreground animate-pulse font-normal">
              Loading...
            </span>
          ) : (
            rateVal.toLocaleString("en-US", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })
          )}
        </div>

        {!isLoading && info && (
          <div className="text-[10px] font-mono text-muted-foreground">
            1 {base} = {rateVal.toFixed(4)} {target}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
        <Button
          variant="outline"
          size="sm"
          onClick={onSelect}
          className="flex-1 h-8 text-[10px] font-mono font-bold tracking-wider uppercase border border-border/80 hover:bg-muted gap-1.5"
        >
          <span>Use Pair</span>
          <ArrowUpRight className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
          title="Remove Favorite"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
