import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, ArrowLeftRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/services/redux";
import {
  setAmount,
  setSendCurrency,
  setReceiveCurrency,
  swapCurrencies,
  toggleFavorite,
  addLog,
} from "@/services/redux/fx-slice";
import { useExchangeRates } from "@/services/queries/fx-queries";
import { FormAmount } from "@/components/forms/form-amount";
import { CurrencySelect } from "./currency-select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const formSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && num > 0;
    },
    { message: "Enter a positive number" }
  ),
  receiveAmount: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && num > 0;
    },
    { message: "Enter a positive number" }
  ),
  sendCurrency: z.string(),
  receiveCurrency: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function ConverterForm() {
  const dispatch = useAppDispatch();
  const reduxAmount = useAppSelector((state) => state.fx.amount);
  const sendCurrency = useAppSelector((state) => state.fx.sendCurrency);
  const receiveCurrency = useAppSelector((state) => state.fx.receiveCurrency);
  const favorites = useAppSelector((state) => state.fx.favorites);

  // React Query fetch for conversion rate
  const { data: rates, isLoading } = useExchangeRates(sendCurrency);

  const currentPair = `${sendCurrency}/${receiveCurrency}`;
  const isFavorited = favorites.includes(currentPair);

  // Compute conversion rate
  const rateInfo = rates?.[receiveCurrency];
  const conversionRate = rateInfo?.rate ?? 0.853;

  const { control, watch, setValue, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: reduxAmount,
      receiveAmount: (Number(reduxAmount || "0") * conversionRate).toFixed(2),
      sendCurrency: sendCurrency,
      receiveCurrency: receiveCurrency,
    },
  });

  const watchedAmount = watch("amount");
  const watchedReceiveAmount = watch("receiveAmount");
  const watchedSendCurrency = watch("sendCurrency");
  const watchedReceiveCurrency = watch("receiveCurrency");

  // Sync local RHF states to Redux when they change
  React.useEffect(() => {
    if (watchedAmount) {
      dispatch(setAmount(watchedAmount));
    }
  }, [watchedAmount, dispatch]);

  React.useEffect(() => {
    if (watchedSendCurrency && watchedSendCurrency !== sendCurrency) {
      dispatch(setSendCurrency(watchedSendCurrency));
    }
  }, [watchedSendCurrency, sendCurrency, dispatch]);

  React.useEffect(() => {
    if (watchedReceiveCurrency && watchedReceiveCurrency !== receiveCurrency) {
      dispatch(setReceiveCurrency(watchedReceiveCurrency));
    }
  }, [watchedReceiveCurrency, receiveCurrency, dispatch]);

  // Sync Redux state back to local RHF if changed elsewhere (e.g. from favorites page click or swap)
  React.useEffect(() => {
    setValue("amount", reduxAmount);
    const computed = Number(reduxAmount || "0") * conversionRate;
    setValue("receiveAmount", computed.toFixed(2));
    setValue("sendCurrency", sendCurrency);
    setValue("receiveCurrency", receiveCurrency);
  }, [reduxAmount, sendCurrency, receiveCurrency, setValue, conversionRate]);

  // Keep receiveAmount in sync with amount when conversionRate or amount changes
  React.useEffect(() => {
    if (!watchedAmount) {
      if (watchedReceiveAmount !== "") {
        setValue("receiveAmount", "");
      }
      return;
    }
    const sendVal = Number(watchedAmount);
    if (Number.isNaN(sendVal)) return;

    const computed = sendVal * conversionRate;
    const currentReceive = Number(watchedReceiveAmount || "0");
    if (Math.abs(currentReceive - computed) > 0.01) {
      setValue("receiveAmount", computed.toFixed(2));
    }
  }, [conversionRate, watchedAmount, watchedReceiveAmount, setValue]);

  const handleSendAmountChange = (val: string) => {
    const num = Number(val);
    if (!num || Number.isNaN(num)) {
      setValue("receiveAmount", "");
      return;
    }
    const computed = num * conversionRate;
    setValue("receiveAmount", computed.toFixed(2));
  };

  const handleReceiveAmountChange = (val: string) => {
    const num = Number(val);
    if (!num || Number.isNaN(num) || conversionRate === 0) {
      setValue("amount", "");
      return;
    }
    const computed = num / conversionRate;
    setValue("amount", computed.toFixed(2));
  };

  const handleSwap = () => {
    dispatch(swapCurrencies());
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(currentPair));
    if (isFavorited) {
      toast.success(`Removed ${currentPair} from favorites`);
    } else {
      toast.success(`Added ${currentPair} to favorites`);
    }
  };

  const onSubmit = (data: FormValues) => {
    const sendVal = Number(data.amount);
    const receiveVal = Number(data.receiveAmount);
    if (Number.isNaN(sendVal) || sendVal <= 0) return;

    dispatch(
      addLog({
        amount: sendVal,
        sendCurrency,
        receiveCurrency,
        rate: conversionRate,
        result: sendVal * conversionRate,
      })
    );

    const formattedReceive = receiveVal.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    toast.success(
      `Logged conversion: ${sendVal} ${sendCurrency} to ${formattedReceive} ${receiveCurrency}`
    );
  };

  return (
    <Card className="w-full border-0 rounded-3.5xl p-0">
      <form id="converter-form" onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 p-5">
          {/* Send Field */}
          <div className="flex flex-col bg-accent border border-border rounded-2.5xl p-5 gap-5 justify-between">
            <p className="text-sm text-muted-foreground uppercase">Send</p>
            <div className="flex items-center justify-between gap-4">
              <FormAmount
                control={control}
                name="amount"
                variant="display"
                className="text-foreground"
                placeholder="0.00"
                onChange={handleSendAmountChange}
              />
              <div className="shrink-0">
                <CurrencySelect
                  control={control}
                  name="sendCurrency"
                  align="end"
                />
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:pt-0">
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={handleSwap}
              className="shrink-0 transition-transform active:scale-95"
              title="Swap Currencies"
            >
              <ArrowLeftRight className="size-5 text-foreground" />
            </Button>
          </div>

          {/* Receive Field */}
          <div className="flex flex-col bg-accent border border-border rounded-2.5xl p-5 gap-5 justify-between">
            <p className="text-sm text-muted-foreground uppercase">Receive</p>
            <div className="flex items-center justify-between gap-4">
              <FormAmount
                control={control}
                name="receiveAmount"
                variant="display"
                className={cn(
                  "text-primary",
                  isLoading && "text-primary/40 animate-pulse"
                )}
                placeholder={isLoading ? "..." : "0.00"}
                onChange={handleReceiveAmountChange}
              />
              <div className="shrink-0">
                <CurrencySelect
                  control={control}
                  name="receiveCurrency"
                  align="end"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </form>

      {/* Conversion Rate subtext & Action buttons */}
      <CardFooter className="border-t border-dashed bg-card p-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
          <div className="text-xs">
            1 {sendCurrency} ={" "}
            {isLoading
              ? "..."
              : `${conversionRate.toFixed(4)} ${receiveCurrency}`}
          </div>
          <div className="flex items-center gap-2">
            {/* Favorite button */}
            <Button
              size="sm"
              type="button"
              className="uppercase"
              onClick={handleToggleFavorite}
              variant={isFavorited ? "primary" : "outline-primary"}
            >
              <Star className={cn("size-3.5", isFavorited && "fill-current")} />
              {isFavorited ? "Favorited" : "Favorite"}
            </Button>

            {/* Log Conversion button */}
            <Button
              size="sm"
              type="submit"
              form="converter-form"
              className="uppercase"
              variant="outline-primary"
            >
              Log Conversion
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
