import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { AmountInput } from "@/components/forms/amount-input";
import FormController from "./form-controller";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const formAmountVariants = cva("", {
  variants: {
    variant: {
      input: "",
      display:
        "!border-0 !bg-transparent disabled:bg-transparent !p-0 !text-[40px] !leading-none font-bold tracking-tight transition-all duration-300 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 outline-none focus:outline-none focus:ring-0",
    },
  },
  defaultVariants: {
    variant: "display",
  },
});

type FormAmountProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof AmountInput>,
  "value"
> &
  VariantProps<typeof formAmountVariants> & {
    name: FieldPath<T>;
    control: Control<T>;
    label?: string;
    description?: string;
  };

export const FormAmount = <T extends FieldValues>({
  name,
  control,
  label,
  className,
  description,
  variant,
  onChange,
  ...amountProps
}: FormAmountProps<T>) => {
  return (
    <FormController
      name={name}
      label={label}
      control={control}
      className={className}
      description={description}
      render={({ field, fieldState }) => (
        <AmountInput
          {...amountProps}
          {...field}
          value={field.value ?? ""}
          onChange={(val) => {
            field.onChange(val);
            onChange?.(val);
          }}
          className={cn(formAmountVariants({ variant }), className)}
          aria-invalid={fieldState.invalid}
        />
      )}
    />
  );
};
