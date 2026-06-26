import type { Control, FieldPath, FieldValues } from "react-hook-form";
import FormCombobox from "@/components/forms/form-combobox";
import type { SelectOption } from "@/components/forms/select-combobox";

import { FlagImage } from "@/components/custom/flag-image";

import { type CurrencyData, CURRENCIES } from "@/routes/_data/currencies";

export function formatCurrencyOptions(data: CurrencyData[]): SelectOption[] {
  return data.map((currency) => ({
    value: currency.code,
    group: currency.isPopular ? "Popular" : "Other Currencies",
    searchLabel: `${currency.code} ${currency.name}`,
    // On the button trigger, only show flag and USD
    triggerLabel: (
      <span className="flex items-center gap-3">
        <FlagImage code={currency.code} className="size-5" />
        <span className="text-sm font-normal">{currency.code}</span>
      </span>
    ),
    // On the dropdown select open, show flag, code, and fullname in text-muted-foreground by the side
    label: (
      <span className="flex items-center gap-3 w-full">
        <FlagImage code={currency.code} className="size-5" />
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
  onChange?: (value: string) => void;
}

export function CurrencySelect<T extends FieldValues>({
  name,
  control,
  align = "end",
  disabled,
  className,
  onChange,
}: CurrencySelectProps<T>) {
  return (
    <FormCombobox
      name={name}
      control={control}
      align={align}
      disabled={disabled}
      className={className}
      options={CURRENCY_OPTIONS}
      onChange={onChange}
    />
  );
}
