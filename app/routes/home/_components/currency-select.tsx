import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import FormCombobox from "@/components/forms/form-combobox";
import type { SelectOption } from "@/components/forms/select-combobox";
import { FlagImage } from "@/components/custom/flag-image";
import { useCurrencies } from "@/services/queries/fx-queries";

export interface CurrencyData {
  code: string;
  name: string;
  isPopular: boolean;
}

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
        <FlagImage code={currency.code} className="size-5" ssr={false} />
        <span className="text-sm font-normal">{currency.code}</span>
        <span className="text-xs text-muted-foreground ml-1 font-normal">
          {currency.name}
        </span>
      </span>
    ),
  }));
}

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
  const { data: currencies, isLoading } = useCurrencies();

  const options = React.useMemo(() => {
    if (!currencies) return [];

    const list: CurrencyData[] = Object.entries(currencies).map(([code, name]) => ({
      code,
      name,
      isPopular: ["USD", "EUR", "GBP"].includes(code.toUpperCase()),
    }));

    // Sort popular first, then alphabetically by code
    list.sort((a, b) => {
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return a.code.localeCompare(b.code);
    });

    return formatCurrencyOptions(list);
  }, [currencies]);

  return (
    <FormCombobox
      name={name}
      control={control}
      align={align}
      disabled={disabled || isLoading}
      className={className}
      options={options}
      onChange={onChange}
    />
  );
}
