import { Select, type SelectOption } from "@/components/forms/select";
import FormController from "@/components/forms/form-controller";
import type { Control, FieldValues, Path } from "react-hook-form";

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  options: SelectOption[];
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  selectClassName?: string;
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  description,
  options,
  searchable,
  searchPlaceholder,
  disabled,
  className,
  selectClassName,
}: FormSelectProps<T>) {
  return (
    <FormController
      name={name}
      label={label}
      control={control}
      description={description}
      className={className}
      render={({ field, fieldState }) => (
        <Select
          {...field}
          options={options}
          placeholder={placeholder}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          disabled={disabled}
          className={selectClassName}
          onChange={field.onChange}
          aria-invalid={fieldState.invalid}
        />
      )}
    />
  );
}
