import { MultiSelect, type MultiSelectProps } from '@/components/forms/multi-select';
import FormController from '@/components/forms/form-controller';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface FormMultiSelectProps<T extends FieldValues>
  extends Omit<MultiSelectProps, 'defaultValue' | 'onValueChange'> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
}

export function FormMultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  ...props
}: FormMultiSelectProps<T>) {
  return (
    <FormController
      name={name}
      label={label}
      control={control}
      description={description}
      className={className}
      render={({ field, fieldState }) => (
        <MultiSelect
          {...props}
          defaultValue={field.value || []}
          onValueChange={field.onChange}
          aria-invalid={fieldState.invalid}
        />
      )}
    />
  );
}
