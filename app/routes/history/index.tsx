import * as React from "react";
import { useAppSelector } from "@/services/redux";
import {
  useExchangeRates,
  useHistoricalData,
} from "@/services/queries/fx-queries";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIMEFRAMES = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

export default function HistoryPage() {
  const sendCurrency = useAppSelector((state) => state.fx.sendCurrency);
  const receiveCurrency = useAppSelector((state) => state.fx.receiveCurrency);

  const [timeframe, setTimeframe] = React.useState("1M");

  const currentPair = `${sendCurrency}/${receiveCurrency}`;

  // Fetch exchange rates and history
  const { data: rates, isLoading: ratesLoading } =
    useExchangeRates(sendCurrency);
  const { data: historyData, isLoading: historyLoading } = useHistoricalData(
    currentPair,
    timeframe
  );

  const rateInfo = rates?.[receiveCurrency];
  const openVal = rateInfo?.open ?? 0.8516;
  const lastVal = rateInfo?.last ?? 0.853;
  const changeVal = rateInfo?.change ?? 0.0014;
  const pctChangeVal = rateInfo?.pctChange ?? 0.16;

  const isPositive = changeVal >= 0;

  const formatValue = (val: number) => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards & Timeframe Selector Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 max-w-3xl">
          {/* Open Card */}
          <div className="bg-card/40 border border-border/80 rounded-xl p-3.5 flex flex-col justify-between min-h-[70px]">
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
              Open
            </span>
            <span className="text-lg font-mono font-bold text-foreground">
              {ratesLoading ? "..." : formatValue(openVal)}
            </span>
          </div>

          {/* Last Card */}
          <div className="bg-card/40 border border-border/80 rounded-xl p-3.5 flex flex-col justify-between min-h-[70px]">
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
              Last
            </span>
            <span className="text-lg font-mono font-bold text-foreground">
              {ratesLoading ? "..." : formatValue(lastVal)}
            </span>
          </div>

          {/* Change Card */}
          <div className="bg-card/40 border border-border/80 rounded-xl p-3.5 flex flex-col justify-between min-h-[70px]">
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
              Change
            </span>
            <span
              className={cn(
                "text-lg font-mono font-bold",
                isPositive ? "text-success" : "text-destructive"
              )}
            >
              {ratesLoading
                ? "..."
                : `${isPositive ? "+" : ""}${changeVal.toFixed(4)}`}
            </span>
          </div>

          {/* % Change Card */}
          <div className="bg-card/40 border border-border/80 rounded-xl p-3.5 flex flex-col justify-between min-h-[70px]">
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
              % Change
            </span>
            <span
              className={cn(
                "text-lg font-mono font-bold flex items-center gap-1",
                isPositive ? "text-success" : "text-destructive"
              )}
            >
              {ratesLoading ? (
                "..."
              ) : (
                <>
                  <span>{isPositive ? "▲" : "▼"}</span>
                  <span>
                    {isPositive ? "+" : ""}
                    {pctChangeVal.toFixed(2)}%
                  </span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Timeframe Selector Button Group */}
        <div className="flex bg-card/40 border border-border/80 p-0.5 rounded-lg w-fit self-end shrink-0">
          {TIMEFRAMES.map((tf) => (
            <Button
              key={tf}
              variant="ghost"
              onClick={() => setTimeframe(tf)}
              className={cn(
                "h-7 px-3 text-[10px] font-bold font-mono rounded-md hover:bg-muted/40 transition-all",
                timeframe === tf
                  ? "bg-card text-foreground border border-border/60 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Panel */}
      <div className="border border-border bg-card/30 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-4">
        {/* Header inside Chart Card */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h3 className="text-sm font-mono font-bold text-foreground">
            {currentPair}
          </h3>
          <div className="text-[11px] font-mono text-muted-foreground">
            <span className="text-foreground font-semibold">
              {ratesLoading ? "..." : formatValue(lastVal)}
            </span>
            <span className="mx-2">•</span>
            <span>
              {new Date().toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}{" "}
              CET
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-[300px] w-full mt-2 font-mono text-[10px]">
          {historyLoading ? (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground animate-pulse">
              Loading Chart Data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={historyData}
                margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="historyGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="oklch(0.9157 0.2054 121.64)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.9157 0.2054 121.64)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  opacity={0.15}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  stroke="var(--muted-foreground)"
                  dy={10}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickLine={false}
                  axisLine={false}
                  stroke="var(--muted-foreground)"
                  dx={-10}
                  tickFormatter={(val) => val.toFixed(4)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.205 0 0)",
                    borderColor: "oklch(1 0 0 / 10%)",
                    borderRadius: "8px",
                    color: "oklch(0.985 0 0)",
                    fontFamily: "var(--font-mono)",
                  }}
                  itemStyle={{ color: "oklch(0.9157 0.2054 121.64)" }}
                  labelStyle={{ color: "oklch(0.708 0 0)" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(0.9157 0.2054 121.64)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#historyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
