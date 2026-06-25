import { useQuery } from "@tanstack/react-query";

export interface RateInfo {
  rate: number;
  change: number;
  pctChange: number;
  open: number;
  last: number;
  high: number;
  low: number;
}

// Fixed mock rates based on USD base
const USD_RATES: Record<string, RateInfo> = {
  EUR: {
    rate: 0.853,
    change: 0.0014,
    pctChange: 0.16,
    open: 0.8516,
    last: 0.853,
    high: 0.8612,
    low: 0.8421,
  },
  JPY: {
    rate: 157.91,
    change: 0.06,
    pctChange: 0.04,
    open: 157.85,
    last: 157.91,
    high: 158.5,
    low: 157.2,
  },
  GBP: {
    rate: 0.7366,
    change: -0.0016,
    pctChange: -0.22,
    open: 0.7382,
    last: 0.7366,
    high: 0.742,
    low: 0.731,
  },
  CHF: {
    rate: 0.9898,
    change: 0.0013,
    pctChange: 0.13,
    open: 0.9885,
    last: 0.9898,
    high: 0.995,
    low: 0.983,
  },
  AUD: {
    rate: 1.3874,
    change: 0.0011,
    pctChange: 0.08,
    open: 1.3863,
    last: 1.3874,
    high: 1.398,
    low: 1.379,
  },
  CAD: {
    rate: 1.3815,
    change: 0.0006,
    pctChange: 0.04,
    open: 1.3809,
    last: 1.3815,
    high: 1.389,
    low: 1.374,
  },
  USD: {
    rate: 1.0,
    change: 0.0,
    pctChange: 0.0,
    open: 1.0,
    last: 1.0,
    high: 1.0,
    low: 1.0,
  },
};

// Generates dynamic rates relative to whatever base is chosen
export const getRatesForBase = (base: string): Record<string, RateInfo> => {
  const baseRateToUSD = USD_RATES[base]?.rate || 1;
  const rates: Record<string, RateInfo> = {};

  for (const [curr, usdInfo] of Object.entries(USD_RATES)) {
    if (curr === base) {
      rates[curr] = {
        rate: 1,
        change: 0,
        pctChange: 0,
        open: 1,
        last: 1,
        high: 1,
        low: 1,
      };
      continue;
    }
    // Calculate relative rate: e.g. base=EUR, target=JPY -> (157.91 / 0.8530)
    const rate = usdInfo.rate / baseRateToUSD;
    const open = usdInfo.open / baseRateToUSD;
    const change = rate - open;
    const pctChange = open > 0 ? (change / open) * 100 : 0;

    // Create realistic ranges
    const range = rate * 0.02;
    rates[curr] = {
      rate,
      change,
      pctChange,
      open,
      last: rate,
      high: rate + range * 0.4,
      low: rate - range * 0.6,
    };
  }
  return rates;
};

// Mock Historical Graph Data Generator
export const generateHistoricalData = (
  pair: string,
  timeframe: string
): { date: string; value: number }[] => {
  const [base, target] = pair.split("/");
  const baseRate =
    getRatesForBase(base || "USD")[target || "EUR"]?.rate || 0.853;

  let points = 30;
  let _labelFormat = "MMM dd";

  switch (timeframe) {
    case "1D":
      points = 24;
      _labelFormat = "HH:00";
      break;
    case "1W":
      points = 7;
      _labelFormat = "EEE";
      break;
    case "1M":
      points = 30;
      _labelFormat = "MMM dd";
      break;
    case "3M":
      points = 45;
      _labelFormat = "MMM dd";
      break;
    case "1Y":
      points = 12;
      _labelFormat = "MMM yy";
      break;
    case "5Y":
      points = 10;
      _labelFormat = "yyyy";
      break;
  }

  const data: { date: string; value: number }[] = [];
  const now = new Date();

  // Seed-based generation for deterministic curves per pair
  let seed = (pair.charCodeAt(0) || 1) + (pair.charCodeAt(1) || 2);
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Build a nice random walk starting from past back to current rate
  let currentVal = baseRate;
  const rawPoints: number[] = [];

  for (let i = 0; i < points; i++) {
    rawPoints.push(currentVal);
    // Random fluctuation: +/- 0.3% of base rate
    const change = (random() - 0.48) * 0.007 * baseRate;
    currentVal = currentVal + change;
  }

  // Reverse so the walk ends at currentVal (baseRate) at the present day
  rawPoints.reverse();

  for (let i = 0; i < points; i++) {
    const d = new Date(now);

    if (timeframe === "1D") {
      d.setHours(now.getHours() - (points - 1 - i));
    } else if (timeframe === "1W" || timeframe === "1M" || timeframe === "3M") {
      d.setDate(now.getDate() - (points - 1 - i));
    } else if (timeframe === "1Y") {
      d.setMonth(now.getMonth() - (points - 1 - i));
    } else if (timeframe === "5Y") {
      d.setFullYear(now.getFullYear() - (points - 1 - i));
    }

    let dateStr = "";
    if (timeframe === "1D") {
      dateStr = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });
    } else if (timeframe === "1W") {
      dateStr = d.toLocaleDateString("en-US", { weekday: "short" });
    } else if (timeframe === "1M" || timeframe === "3M") {
      dateStr = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (timeframe === "1Y") {
      dateStr = d.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
    } else {
      dateStr = d.getFullYear().toString();
    }

    data.push({
      date: dateStr,
      value: Number(rawPoints[i].toFixed(4)),
    });
  }

  return data;
};

// React Query Hook: Get Rates
export function useExchangeRates(baseCurrency: string) {
  return useQuery({
    queryKey: ["rates", baseCurrency],
    queryFn: async () => {
      // Simulate network lag
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getRatesForBase(baseCurrency);
    },
    staleTime: 60 * 1000,
  });
}

// React Query Hook: Get Historical Data
export function useHistoricalData(pair: string, timeframe: string) {
  return useQuery({
    queryKey: ["history", pair, timeframe],
    queryFn: async () => {
      // Simulate network lag
      await new Promise((resolve) => setTimeout(resolve, 400));
      return generateHistoricalData(pair, timeframe);
    },
    staleTime: 5 * 60 * 1000,
  });
}
