import FormController from "@/components/forms/form-controller"
import { Input, type InputProps } from "@/components/ui/input"
import type { Control, FieldValues, Path } from "react-hook-form"

interface FormInputProps<T extends FieldValues>
  extends Omit<InputProps, "value" | "onChange" | "defaultValue"> {
  control: Control<T>
  name: Path<T>
  label?: string
  description?: string
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  className,
  description,
  ...props
}: FormInputProps<T>) {
  return (
    <FormController
      name={name}
      label={label}
      control={control}
      className={className}
      description={description}
      render={({ field, fieldState }) => (
        <Input {...props} {...field} aria-invalid={fieldState.invalid} />
      )}
    />
  )
}
