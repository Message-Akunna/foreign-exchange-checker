import * as React from "react";
// lib
import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// icons
import { Star } from "lucide-react";
import { CopyLinkButton } from "./copy-link-button";
import { ArrowDownUpIcon } from "@animateicons/react/lucide";
// hooks
import { useSearchParamGroup } from "@/hooks/use-search-param-group";
import { useAppDispatch, useAppSelector } from "@/services/redux";
import { useAuth } from "@/providers/auth-provider";
// redux slice
import {
  setAmount,
  swapCurrencies,
  setSendCurrency,
  setReceiveCurrency,
} from "@/services/redux/fx-slice";
// components
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/custom/icon-button";
import { CurrencySelect } from "./currency-select";
import { FormAmount } from "@/components/forms/form-amount";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
// queries
import { useExchangeRates } from "@/services/queries/fx";
import {
  useFavorites,
  useToggleFavoriteMutation,
} from "@/services/queries/favorites";
import { useAddLogMutation } from "@/services/queries/logs";
// utils
import { cn } from "@/lib/utils";

const formSchema = z.object({
  amount: z.string().refine(
    (val) => {
      if (val === "") return true;
      const num = Number(val);
      return !Number.isNaN(num) && num >= 0;
    },
    { message: "Enter a positive number or zero" }
  ),
  receiveAmount: z.string().refine(
    (val) => {
      if (val === "") return true;
      const num = Number(val);
      return !Number.isNaN(num) && num >= 0;
    },
    { message: "Enter a positive number or zero" }
  ),
  sendCurrency: z.string(),
  receiveCurrency: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function ConverterForm() {
  const dispatch = useAppDispatch();
  const { executeProtectedAction } = useAuth();
  const reduxAmount = useAppSelector((state) => state.fx.amount);
  const sendCurrency = useAppSelector((state) => state.fx.sendCurrency);
  const receiveCurrency = useAppSelector((state) => state.fx.receiveCurrency);
  const { data: favorites = [] } = useFavorites();
  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const addLogMutation = useAddLogMutation();

  // React Query fetch for conversion rate
  const { data: rates, isLoading } = useExchangeRates(sendCurrency);

  const currentPair = `${sendCurrency}/${receiveCurrency}`;
  const isFavorited = favorites.some((fav) => fav.pair === currentPair);

  // Compute conversion rate
  const rateInfo = rates?.[receiveCurrency];
  const conversionRate = rateInfo?.rate ?? 1.0;

  const [params, setParams] = useSearchParamGroup<{
    amount: string | null;
    send: string | null;
    receive: string | null;
  }>();
  const hasHydrated = React.useRef(false);

  // 1. Initial Hydration from URL Search Parameters
  React.useEffect(() => {
    if (hasHydrated.current) return;

    const querySend = params.send;
    const queryReceive = params.receive;
    const queryAmount = params.amount;

    if (querySend) {
      dispatch(setSendCurrency(querySend));
    } else {
      dispatch(setSendCurrency("USD"));
    }
    if (queryAmount !== null) {
      dispatch(setAmount(queryAmount));
    }

    if (queryReceive) {
      dispatch(setReceiveCurrency(queryReceive));
    } else {
      dispatch(setReceiveCurrency("GBP"));
    }

    hasHydrated.current = true;
  }, [dispatch, params.send, params.receive, params.amount]);

  // 2. URL Search Parameters Synchronization
  React.useEffect(() => {
    if (!hasHydrated.current) return;

    setParams({
      amount: reduxAmount || null,
      send: sendCurrency || null,
      receive: receiveCurrency || null,
    });
  }, [reduxAmount, sendCurrency, receiveCurrency, setParams]);

  const { control, watch, setValue, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: reduxAmount,
      receiveAmount:
        reduxAmount === ""
          ? ""
          : (Number(reduxAmount || "0") * conversionRate).toFixed(2),
      sendCurrency: sendCurrency,
      receiveCurrency: receiveCurrency,
    },
  });

  const watchedAmount = watch("amount");
  const watchedReceiveAmount = watch("receiveAmount");

  // Sync Redux state back to local RHF if changed elsewhere (e.g. from favorites page click or swap)
  React.useEffect(() => {
    setValue("amount", reduxAmount);
    if (reduxAmount === "") {
      setValue("receiveAmount", "");
    } else {
      const computed = Number(reduxAmount) * conversionRate;
      setValue("receiveAmount", computed.toFixed(2));
    }
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
    dispatch(setAmount(val));
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
      dispatch(setAmount(""));
      return;
    }
    const computed = num / conversionRate;
    setValue("amount", computed.toFixed(2));
    dispatch(setAmount(computed.toFixed(2)));
  };

  const handleSwap = () => {
    dispatch(swapCurrencies());
  };

  const handleToggleFavorite = () => {
    executeProtectedAction(() => {
      toggleFavoriteMutation.mutate(currentPair, {
        onSuccess: () => {
          if (isFavorited) {
            toast.success(`Removed ${currentPair} from favorites`);
          } else {
            toast.success(`Added ${currentPair} to favorites`);
          }
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to update favorite status");
        },
      });
    });
  };



  const onSubmit = (data: FormValues) => {
    executeProtectedAction(() => {
      const sendVal = Number(data.amount);
      const receiveVal = Number(data.receiveAmount);
      if (Number.isNaN(sendVal) || sendVal <= 0) return;

      addLogMutation.mutate(
        {
          amount: sendVal,
          sendCurrency,
          receiveCurrency,
          rate: conversionRate,
          result: sendVal * conversionRate,
        },
        {
          onSuccess: () => {
            const formattedReceive = receiveVal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            toast.success(
              `Logged conversion: ${sendVal} ${sendCurrency} to ${formattedReceive} ${receiveCurrency}`
            );
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to log conversion");
          },
        }
      );
    });
  };

  return (
    <Card className="w-full border-0 rounded-3.5xl p-0 gap-0">
      <CardContent className="p-5">
        <form
          id="converter-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6"
        >
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
                  onChange={(val) => dispatch(setSendCurrency(val))}
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
              <ArrowDownUpIcon className="size-5 text-foreground md:rotate-90" />
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
                  onChange={(val) => dispatch(setReceiveCurrency(val))}
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      {/* Conversion Rate subtext & Action buttons */}
      <CardFooter className="border-t border-dashed bg-card py-4 px-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
          <div className="text-xs">
            1 {sendCurrency} ={" "}
            {isLoading
              ? "..."
              : `${conversionRate.toFixed(4)} ${receiveCurrency}`}
          </div>
          <div className="flex items-center gap-2">
            {/* Favorite button */}
            <IconButton
              size="sm"
              type="button"
              className="uppercase"
              onClick={handleToggleFavorite}
              variant={isFavorited ? "primary" : "outline-primary"}
              loading={toggleFavoriteMutation.isPending}
              disabled={toggleFavoriteMutation.isPending}
              icon={
                <Star
                  className={cn("size-3.5", isFavorited && "fill-current")}
                />
              }
            >
              {isFavorited ? "Favorited" : "Favorite"}
            </IconButton>

            {/* Log Conversion button */}
            <IconButton
              size="sm"
              type="submit"
              form="converter-form"
              className="uppercase"
              variant="outline-primary"
              loading={addLogMutation.isPending}
              disabled={addLogMutation.isPending}
            >
              Log Conversion
            </IconButton>

            {/* Share Conversion button */}
            <CopyLinkButton className="uppercase" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
