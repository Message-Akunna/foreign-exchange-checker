import * as React from "react";
import { useAppSelector } from "@/services/redux";
import {
  useExchangeRates,
  useHistoricalData,
} from "@/services/queries/fx-queries";
import { StatsGrid } from "./_components/stats-grid";
import { TimeframeSelector } from "./_components/timeframe-selector";
import { ChartPanel } from "./_components/chart-panel";

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

  const statsData = [
    {
      title: "Open",
      value: ratesLoading ? "..." : formatValue(openVal),
    },
    {
      title: "Last",
      value: ratesLoading ? "..." : formatValue(lastVal),
    },
    {
      title: "Change",
      value: ratesLoading
        ? "..."
        : `${isPositive ? "+" : ""}${changeVal.toFixed(4)}`,
      valueClassName: isPositive ? "text-success" : "text-destructive",
    },
    {
      title: "% Change",
      value: ratesLoading ? (
        "..."
      ) : (
        <span className="flex items-center gap-1">
          <span>{isPositive ? "▲" : "▼"}</span>
          <span>
            {isPositive ? "+" : ""}
            {pctChangeVal.toFixed(2)}%
          </span>
        </span>
      ),
      valueClassName: isPositive ? "text-success" : "text-destructive",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats Cards & Timeframe Selector Row */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        {/* Stats Grid */}
        <StatsGrid cards={statsData} />

        {/* Timeframe Selector Button Group */}
        <TimeframeSelector
          value={timeframe}
          onChange={setTimeframe}
          className="lg:self-end shrink-0"
        />
      </div>

      {/* Chart Panel */}
      <ChartPanel
        currentPair={currentPair}
        ratesLoading={ratesLoading}
        lastVal={lastVal}
        historyLoading={historyLoading}
        historyData={historyData}
      />
    </div>
  );
}
