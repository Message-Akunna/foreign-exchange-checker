import * as React from "react";
// lib
import {
  formatNumeral,
  type FormatNumeralOptions,
  // NumeralThousandGroupStyles,
} from "cleave-zen";
// shadcn
import { Input } from "@/components/ui/input";
// utils
import { cn } from "@/lib/utils";

export declare enum NumeralThousandGroupStyles {
  THOUSAND = "thousand",
  LAKH = "lakh",
  WAN = "wan",
  NONE = "none",
}

interface AmountInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: string | number;
  onChange?: (value: string) => void; // raw numeric value
  options?: FormatNumeralOptions;
}

const DEFAULT_OPTIONS: FormatNumeralOptions = {
  delimiter: ",",
  numeralThousandsGroupStyle: NumeralThousandGroupStyles.THOUSAND,
};

export const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  ({ className, value, onChange, options, ...props }, ref) => {
    const config = React.useMemo<FormatNumeralOptions>(
      () => ({ ...DEFAULT_OPTIONS, ...options }),
      [options]
    );

    const formattedValue = React.useMemo(() => {
      if (value === undefined || value === null || value === "") return "";
      return formatNumeral(String(value), config);
    }, [value, config]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatNumeral(event.target.value, config);
      const raw = formatted.replaceAll(config.delimiter ?? ",", "");
      onChange?.(raw);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={formattedValue}
        onChange={handleChange}
        className={cn(className)}
        {...props}
      />
    );
  }
);

AmountInput.displayName = "AmountInput";
