export interface ConversionLog {
  id: string;
  timestamp: string;
  amount: number;
  sendCurrency: string;
  receiveCurrency: string;
  rate: number;
  result: number;
}

export interface AddLogInput {
  amount: number;
  sendCurrency: string;
  receiveCurrency: string;
  rate: number;
  result: number;
}
