import { PasswordInput } from "@/components/forms/password-input"
import FormController from "@/components/forms/form-controller"
import type { Control, FieldValues, Path } from "react-hook-form"

type FormPasswordInputProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof PasswordInput>,
  "value" | "onChange" | "defaultValue"
> & {
  control: Control<T>
  name: Path<T>
  label?: string
  description?: string
}

export function FormPasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  ...props
}: FormPasswordInputProps<T>) {
  return (
    <FormController
      name={name}
      label={label}
      control={control}
      description={description}
      className={className}
      render={({ field, fieldState }) => (
        <PasswordInput
          {...props}
          {...field}
          aria-invalid={fieldState.invalid}
        />
      )}
    />
  )
}
