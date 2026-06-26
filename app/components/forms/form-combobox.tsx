import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  SelectCombobox,
  type SelectOption,
} from "@/components/forms/select-combobox";
import FormController from "@/components/forms/form-controller";

type FormComboboxProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  description?: string;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
  align?: "start" | "center" | "end";
  onChange?: (value: string) => void;
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
  disabled,
  align,
  onChange,
}: FormComboboxProps<T>) {
  return (
    <FormController
      name={name}
      label={label}
      control={control}
      description={description}
      className={className}
      render={({
        field: { value, onChange: fieldOnChange, disabled: fieldDisabled },
        fieldState,
      }) => (
        <SelectCombobox
          value={value}
          onChange={(val) => {
            fieldOnChange(val);
            onChange?.(val);
          }}
          disabled={disabled ?? fieldDisabled}
          options={options}
          placeholder={placeholder}
          searchable={true}
          searchPlaceholder={searchPlaceholder}
          aria-invalid={fieldState.invalid}
          align={align}
        />
      )}
    />
  );
}

export default FormCombobox;
