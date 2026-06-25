import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/services/redux";
import { setSendCurrency, setReceiveCurrency } from "@/services/redux/fx-slice";
import { useExchangeRates } from "@/services/queries/fx-queries";
import { Select } from "@/components/forms/select";
import { FormMultiSelect } from "@/components/forms/form-multi-select";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const compareSchema = z.object({
  baseCurrency: z.string(),
  targetCurrencies: z
    .array(z.string())
    .min(1, "Select at least one currency to compare"),
});

type CompareFormValues = z.infer<typeof compareSchema>;

const CURRENCY_OPTIONS = [
  { value: "USD", label: "🇺🇸 USD", searchLabel: "USD" },
  { value: "EUR", label: "🇪🇺 EUR", searchLabel: "EUR" },
  { value: "GBP", label: "🇬🇧 GBP", searchLabel: "GBP" },
  { value: "JPY", label: "🇯🇵 JPY", searchLabel: "JPY" },
  { value: "CHF", label: "🇨🇭 CHF", searchLabel: "CHF" },
  { value: "AUD", label: "🇦🇺 AUD", searchLabel: "AUD" },
  { value: "CAD", label: "🇨🇦 CAD", searchLabel: "CAD" },
];

const MULTI_SELECT_OPTIONS = [
  { value: "USD", label: "🇺🇸 USD" },
  { value: "EUR", label: "🇪🇺 EUR" },
  { value: "GBP", label: "🇬🇧 GBP" },
  { value: "JPY", label: "🇯🇵 JPY" },
  { value: "CHF", label: "🇨🇭 CHF" },
  { value: "AUD", label: "🇦🇺 AUD" },
  { value: "CAD", label: "🇨🇦 CAD" },
];

export default function ComparePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentSendCurrency = useAppSelector((state) => state.fx.sendCurrency);
  const currentReceiveCurrency = useAppSelector(
    (state) => state.fx.receiveCurrency
  );

  const { control, watch, setValue } = useForm<CompareFormValues>({
    resolver: zodResolver(compareSchema),
    defaultValues: {
      baseCurrency: currentSendCurrency,
      targetCurrencies: [
        currentReceiveCurrency,
        ...["GBP", "JPY", "CAD"].filter(
          (c) => c !== currentSendCurrency && c !== currentReceiveCurrency
        ),
      ],
    },
  });

  const baseCurrency = watch("baseCurrency");
  const targetCurrencies = watch("targetCurrencies") || [];

  // Fetch rates for base currency
  const { data: rates, isLoading } = useExchangeRates(baseCurrency);

  const handleLoadInConverter = (target: string) => {
    dispatch(setSendCurrency(baseCurrency));
    dispatch(setReceiveCurrency(target));
    navigate("/history");
  };

  return (
    <div className="space-y-6">
      {/* Compare Inputs Card */}
      <div className="border border-border bg-card/30 rounded-2xl p-6 shadow-md space-y-4">
        <h3 className="text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase">
          Compare Setup
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-end">
          {/* Base Currency Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
              Base Currency
            </label>
            <Select
              options={CURRENCY_OPTIONS}
              value={baseCurrency}
              onChange={(val) => setValue("baseCurrency", val)}
              className="border border-border bg-card/50 rounded-lg min-h-[38px] font-mono font-semibold"
            />
          </div>

          {/* Target Currencies MultiSelect */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
              Compare Against
            </label>
            <FormMultiSelect
              control={control}
              name="targetCurrencies"
              options={MULTI_SELECT_OPTIONS.filter(
                (o) => o.value !== baseCurrency
              )}
              placeholder="Select currencies to compare..."
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Comparisons Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground animate-pulse font-mono text-sm">
            Fetching comparison rates...
          </div>
        ) : targetCurrencies.length === 0 ? (
          <div className="col-span-full py-12 border border-dashed border-border/80 rounded-2xl text-center text-muted-foreground font-mono text-sm">
            Select one or more target currencies above to see comparisons.
          </div>
        ) : (
          targetCurrencies.map((target) => {
            const info = rates?.[target];
            const rateVal = info?.rate ?? 1.0;
            const changeVal = info?.change ?? 0.0;
            const pctChangeVal = info?.pctChange ?? 0.0;
            const isPos = changeVal >= 0;

            return (
              <div
                key={target}
                className="border border-border/80 bg-card/20 rounded-xl p-5 shadow-sm space-y-4 hover:border-border transition-all flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold tracking-tight text-foreground">
                      {baseCurrency} / {target}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border",
                        isPos
                          ? "text-success bg-success/5 border-success/20"
                          : "text-destructive bg-destructive/5 border-destructive/20"
                      )}
                    >
                      {isPos ? (
                        <TrendingUp className="size-3" />
                      ) : (
                        <TrendingDown className="size-3" />
                      )}
                      {isPos ? "+" : ""}
                      {pctChangeVal.toFixed(2)}%
                    </span>
                  </div>

                  <div className="text-3xl font-mono font-bold tracking-tighter text-foreground pt-1">
                    {rateVal.toLocaleString("en-US", {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })}
                  </div>

                  <div className="text-[10px] font-mono text-muted-foreground pt-1">
                    Change: {isPos ? "+" : ""}
                    {changeVal.toFixed(4)}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLoadInConverter(target)}
                    className="w-full justify-between h-8 text-[10px] font-mono font-bold tracking-wider uppercase text-primary hover:text-primary hover:bg-primary/5 rounded-lg"
                  >
                    <span>Load in Converter</span>
                    <ExternalLink className="size-3" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
