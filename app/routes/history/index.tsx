import * as React from "react";
import { useAppSelector } from "@/services/redux";
import { useExchangeRates, useHistoricalData } from "@/services/queries/fx";
import { StatsGrid } from "./_components/stats-grid";
import { TimeframeSelector } from "./_components/timeframe-selector";
import { ChartPanel } from "./_components/chart-panel";

export default function HistoryPage() {
  const sendCurrency = useAppSelector((state: any) => state.fx.sendCurrency);
  const receiveCurrency = useAppSelector(
    (state: any) => state.fx.receiveCurrency
  );

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

  // Calculate range stats dynamically from historyData
  const points = historyData || [];
  const hasPoints = points.length > 0;

  const openVal = hasPoints ? points[0].value : (rateInfo?.open ?? 0);
  const lastVal = hasPoints
    ? points[points.length - 1].value
    : (rateInfo?.last ?? 0);

  const values = points.map((p) => p.value);
  const highVal = hasPoints ? Math.max(...values) : (rateInfo?.high ?? 0);
  const lowVal = hasPoints ? Math.min(...values) : (rateInfo?.low ?? 0);

  const changeVal = lastVal - openVal;
  const pctChangeVal = openVal > 0 ? (changeVal / openVal) * 100 : 0;
  const isPositive = changeVal >= 0;

  const formatValue = (val: number) => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const pctChangeNode =
    ratesLoading || historyLoading ? (
      "..."
    ) : (
      <span className="flex items-center gap-1">
        <span>{isPositive ? "▲" : "▼"}</span>
        <span>
          {isPositive ? "+" : ""}
          {pctChangeVal.toFixed(2)}%
        </span>
      </span>
    );

  const statsData = [
    {
      title: "Open",
      value: ratesLoading || historyLoading ? "..." : formatValue(openVal),
    },
    {
      title: "Last",
      value: ratesLoading || historyLoading ? "..." : formatValue(lastVal),
    },
    {
      title: "High",
      value: ratesLoading || historyLoading ? "..." : formatValue(highVal),
    },
    {
      title: "Low",
      value: ratesLoading || historyLoading ? "..." : formatValue(lowVal),
    },
    {
      title: "Change",
      value:
        ratesLoading || historyLoading
          ? "..."
          : `${isPositive ? "+" : ""}${changeVal.toFixed(4)}`,
      valueClassName: isPositive ? "text-success" : "text-destructive",
    },
    {
      title: "% Change",
      value: pctChangeNode,
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
        timeframe={timeframe}
      />
    </div>
  );
}
