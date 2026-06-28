import * as React from "react";
import CurrencyInput, {
  type CurrencyInputProps,
} from "react-currency-input-field";
import { inputVariants } from "@/components/ui/input";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface AmountInputProps
  extends Omit<CurrencyInputProps, "onChange" | "value" | "onValueChange" | "size">,
    VariantProps<typeof inputVariants> {
  value?: string | number;
  onChange?: (value: string) => void;
}

export const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  ({ className, value, onChange, inputSize, ...props }, ref) => {
    return (
      <CurrencyInput
        ref={ref}
        value={value}
        onValueChange={(val) => {
          onChange?.(val ?? "");
        }}
        className={cn(inputVariants({ inputSize }), className)}
        decimalsLimit={6}
        allowNegativeValue={false}
        {...props}
      />
    );
  }
);

AmountInput.displayName = "AmountInput";
