import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { PhoneInput, type PhoneData } from "@/components/forms/phone-input"
import FormController from "./form-controller"
import type { Field } from "../ui/field"

type FormPhoneInputProps<T extends FieldValues> = {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  placeholder?: string
  description?: string
  className?: string
  onPhoneChange?: (data: PhoneData | null) => void
  orientation?: React.ComponentProps<typeof Field>["orientation"]
}

function FormPhoneInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  description,
  onPhoneChange,
  orientation,
  className,
}: FormPhoneInputProps<T>) {
  return (
    <FormController
      name={name}
      control={control}
      label={label}
      description={description}
      orientation={orientation}
      className={className}
      render={({ field, fieldState }) => (
        <PhoneInput
          {...field}
          placeholder={placeholder}
          onPhoneChange={onPhoneChange}
          aria-invalid={fieldState.invalid}
        />
      )}
    />
  )
}

export default FormPhoneInput
