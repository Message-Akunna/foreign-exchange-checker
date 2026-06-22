import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { SelectOption } from '@/components/forms/select';
import { FormSelect } from './form-select';

type FormComboboxProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  description?: string;
  options: SelectOption[];
  className?: string;
};

function FormCombobox<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  searchPlaceholder,
  description,
  options,
  className,
}: FormComboboxProps<T>) {
  return (
    <FormSelect
      name={name}
      label={label}
      control={control}
      description={description}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      searchable={true}
      className={className}
    />
  );
}

export default FormCombobox;
