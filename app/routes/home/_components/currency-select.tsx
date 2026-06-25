import type { Control, FieldPath, FieldValues } from "react-hook-form";
import FormCombobox from "@/components/forms/form-combobox";
import type { SelectOption } from "@/components/forms/select-combobox";

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
];

export function formatCurrencyOptions(data: CurrencyData[]): SelectOption[] {
  return data.map((currency) => ({
    value: currency.code,
    group: currency.isPopular ? "Popular" : "Other Currencies",
    searchLabel: `${currency.code} ${currency.name}`,
    // On the button trigger, only show flag (in circular container) and USD
    triggerLabel: (
      <span className="flex items-center gap-3">
        <span className="flex items-center justify-center size-5 rounded-full overflow-hidden bg-accent text-4xl leading-none shrink-0 select-none">
          {currency.flag}
        </span>
        <span className="text-sm font-normal">{currency.code}</span>
      </span>
    ),
    // On the dropdown select open, show flag, code, and fullname in text-muted-foreground by the side
    label: (
      <span className="flex items-center gap-3 w-full">
        <span className="flex items-center justify-center size-5 rounded-full overflow-hidden bg-accent text-4xl leading-none shrink-0 select-none">
          {currency.flag}
        </span>
        <span className="text-sm font-normal">{currency.code}</span>
        <span className="text-xs text-muted-foreground ml-1 font-normal">
          {currency.name}
        </span>
      </span>
    ),
  }));
}

export const CURRENCY_OPTIONS = formatCurrencyOptions(CURRENCIES);

interface CurrencySelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  align?: "start" | "center" | "end";
  disabled?: boolean;
  className?: string;
}

export function CurrencySelect<T extends FieldValues>({
  name,
  control,
  align = "end",
  disabled,
  className,
}: CurrencySelectProps<T>) {
  return (
    <FormCombobox
      name={name}
      control={control}
      align={align}
      disabled={disabled}
      className={className}
      options={CURRENCY_OPTIONS}
    />
  );
}
