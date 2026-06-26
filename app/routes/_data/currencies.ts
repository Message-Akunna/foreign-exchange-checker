export interface CurrencyData {
  code: string;
  name: string;
  flag: string;
  isPopular: boolean;
}

export const CURRENCIES: CurrencyData[] = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", isPopular: true },
  { code: "EUR", name: "Euro", flag: "🇪🇺", isPopular: true },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", isPopular: true },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", isPopular: false },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", isPopular: false },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", isPopular: false },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", isPopular: false },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", isPopular: false },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", isPopular: false },
  { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩", isPopular: false },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿", isPopular: false },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷", isPopular: false },
];
