import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ConversionLog {
  id: string;
  timestamp: string;
  amount: number;
  sendCurrency: string;
  receiveCurrency: string;
  rate: number;
  result: number;
}

export interface FxState {
  amount: string;
  sendCurrency: string;
  receiveCurrency: string;
  favorites: string[]; // e.g. ["USD/EUR", "USD/JPY"]
  logs: ConversionLog[];
}

const initialState: FxState = {
  amount: "1000",
  sendCurrency: "USD",
  receiveCurrency: "EUR",
  favorites: ["USD/JPY", "GBP/USD", "USD/CHF", "EUR/GBP", "AUD/USD", "USD/CAD"],
  logs: [
    {
      id: "1",
      timestamp: "Jun 23, 2026, 04:00 AM",
      amount: 1000,
      sendCurrency: "USD",
      receiveCurrency: "EUR",
      rate: 0.853,
      result: 853.0,
    },
    {
      id: "2",
      timestamp: "Jun 22, 2026, 03:30 PM",
      amount: 500,
      sendCurrency: "GBP",
      receiveCurrency: "USD",
      rate: 1.3575,
      result: 678.75,
    },
  ],
};

export const fxSlice = createSlice({
  name: "fx",
  initialState,
  reducers: {
    setAmount: (state, action: PayloadAction<string>) => {
      state.amount = action.payload;
    },
    setSendCurrency: (state, action: PayloadAction<string>) => {
      state.sendCurrency = action.payload;
    },
    setReceiveCurrency: (state, action: PayloadAction<string>) => {
      state.receiveCurrency = action.payload;
    },
    swapCurrencies: (state) => {
      const temp = state.sendCurrency;
      state.sendCurrency = state.receiveCurrency;
      state.receiveCurrency = temp;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const pair = action.payload;
      const index = state.favorites.indexOf(pair);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(pair);
      }
    },
    addLog: (
      state,
      action: PayloadAction<Omit<ConversionLog, "id" | "timestamp">>
    ) => {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      const timestamp = date.toLocaleString("en-US", options);
      state.logs.unshift({
        id: Math.random().toString(36).substring(2, 9),
        timestamp,
        ...action.payload,
      });
    },
    clearLogs: (state) => {
      state.logs = [];
    },
  },
});

export const {
  setAmount,
  setSendCurrency,
  setReceiveCurrency,
  swapCurrencies,
  toggleFavorite,
  addLog,
  clearLogs,
} = fxSlice.actions;

export default fxSlice.reducer;
