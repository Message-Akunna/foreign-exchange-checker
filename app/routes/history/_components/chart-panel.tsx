import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChartPanelProps {
  currentPair: string;
  ratesLoading: boolean;
  lastVal: number;
  historyLoading: boolean;
  historyData?: { date: string; value: number }[];
  className?: string;
}

const formatValue = (val: number) => {
  return val.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
};

export function ChartPanel({
  currentPair,
  ratesLoading,
  lastVal,
  historyLoading,
  historyData,
  className,
}: ChartPanelProps) {
  return (
    <Card className={cn("flex flex-col h-[calc(100dvh-260px)] min-h-[300px] rounded-2.5xl p-0 overflow-hidden", className)}>
      <CardContent className="flex-1 flex flex-col p-5 space-y-5 overflow-hidden">
        {/* Header inside Chart Card */}
        <div className="flex items-center justify-between pb-4 shrink-0">
          <h3 className="text-base">{currentPair}</h3>
          <div className="text-xs text-muted-foreground">
            <span className="">
              {ratesLoading ? "..." : formatValue(lastVal)}
            </span>
            <span className="mx-2">•</span>
            <span>{format(new Date(), "MMM d, HH:mm")} CET</span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="flex-1 w-full text-sm min-h-[200px]">
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
                  opacity={0.5}
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
                  type="linear"
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
      </CardContent>
    </Card>
  );
}
