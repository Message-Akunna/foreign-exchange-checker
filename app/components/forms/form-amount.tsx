import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { AmountInput } from '@/components/forms/amount-input';
import FormController from './form-controller';

type FormAmountProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof AmountInput>,
  'value' | 'onChange'
> & {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  description?: string;
};

export const CustomAmount = <T extends FieldValues>({
  name,
  control,
  label,
  className,
  description,
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
          value={field.value ?? ''}
          onChange={field.onChange}
          aria-invalid={fieldState.invalid}
        />
      )}
    />
  );
};
