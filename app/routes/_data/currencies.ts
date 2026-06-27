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
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿", isPopular: false },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷", isPopular: false },
  { code: "BGN", name: "Bulgarian Lev", flag: "🇧🇬", isPopular: false },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷", isPopular: false },
  { code: "CZK", name: "Czech Koruna", flag: "🇨🇿", isPopular: false },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰", isPopular: false },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰", isPopular: false },
  { code: "HUF", name: "Hungarian Forint", flag: "🇭🇺", isPopular: false },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩", isPopular: false },
  { code: "ILS", name: "Israeli New Shekel", flag: "🇮🇱", isPopular: false },
  { code: "ISK", name: "Icelandic Króna", flag: "🇮🇸", isPopular: false },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷", isPopular: false },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽", isPopular: false },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾", isPopular: false },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴", isPopular: false },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭", isPopular: false },
  { code: "PLN", name: "Polish Złoty", flag: "🇵🇱", isPopular: false },
  { code: "RON", name: "Romanian Leu", flag: "🇷🇴", isPopular: false },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪", isPopular: false },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", isPopular: false },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭", isPopular: false },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦", isPopular: false },
];

