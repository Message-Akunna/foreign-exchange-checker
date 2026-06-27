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
import { format, parseISO, getWeekOfMonth } from "date-fns";

interface ChartPanelProps {
  currentPair: string;
  ratesLoading: boolean;
  lastVal: number;
  historyLoading: boolean;
  historyData?: { date: string; value: number }[];
  timeframe: string;
  className?: string;
}

const formatValue = (val: number) => {
  return val.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
};

const formatXAxisTick = (dateStr: string, timeframe: string) => {
  try {
    const date = parseISO(dateStr);
    const tf = timeframe.toUpperCase();

    if (tf === "1W" || tf === "1M") {
      return format(date, "d MMM");
    }
    if (tf === "3M") {
      const week = getWeekOfMonth(date);
      const monthStr = format(date, "MMM");
      return `W${week} ${monthStr}`;
    }
    if (tf === "1Y") {
      return format(date, "MMM yy");
    }
    if (tf === "5Y") {
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const yearStr = format(date, "yy");
      return `Q${quarter} ${yearStr}`;
    }
    return format(date, "d MMM");
  } catch {
    return dateStr;
  }
};

const getXAxisInterval = (timeframe: string) => {
  const tf = timeframe.toUpperCase();
  if (tf === "1W") return 0; // show all
  if (tf === "1M") return 3; // approx 4 days apart (index spacing of 4)
  if (tf === "3M") return 4; // weekly (every 5 weekdays)
  if (tf === "1Y") return 19; // monthly (every 20 weekdays)
  if (tf === "5Y") return 129; // semi-annually (every 130 weekdays = 6 months)
  return "preserveEnd";
};

const formatTooltipLabel = (label: any) => {
  if (typeof label !== "string") return "";
  try {
    const date = parseISO(label);
    return format(date, "EEEE, MMMM d, yyyy");
  } catch {
    return String(label);
  }
};

export function ChartPanel({
  currentPair,
  ratesLoading,
  lastVal,
  historyLoading,
  historyData,
  timeframe,
  className,
}: ChartPanelProps) {
  return (
    <Card
      className={cn(
        "flex flex-col h-[calc(100dvh-260px)] min-h-80 rounded-2.5xl p-0 overflow-hidden",
        className
      )}
    >
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
        <div className="flex-1 w-full text-sm min-h-56">
          {historyLoading ? (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground animate-pulse">
              Loading Chart Data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={historyData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
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
                  tickFormatter={(val) => formatXAxisTick(val, timeframe)}
                  interval={getXAxisInterval(timeframe) as any}
                  minTickGap={25}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickLine={false}
                  axisLine={false}
                  stroke="var(--muted-foreground)"
                  width="auto"
                  dx="auto"
                  tickMargin={0}
                  tickFormatter={(val) => val.toFixed(4)}
                />
                <Tooltip
                  labelFormatter={formatTooltipLabel}
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
