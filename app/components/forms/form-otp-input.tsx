import type { Control, FieldPath, FieldValues } from "react-hook-form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { cn } from "@/lib/utils"
import FormController from "./form-controller"
import type { Field } from "@/components/ui/field"

type FormOtpInputProps<T extends FieldValues> = {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  description?: string
  maxLength?: number
  className?: string
  otpClassName?: string
  groupClassName?: string
  slotClassName?: string
  orientation?: React.ComponentProps<typeof Field>["orientation"]
}

function FormOtpInput<T extends FieldValues>({
  name,
  control,
  label,
  description,
  maxLength = 6,
  className,
  otpClassName,
  groupClassName,
  slotClassName,
  orientation,
}: FormOtpInputProps<T>) {
  return (
    <FormController
      name={name}
      label={label}
      control={control}
      description={description}
      orientation={orientation}
      className={className}
      render={({ field, fieldState }) => (
        <InputOTP
          maxLength={maxLength}
          {...field}
          className={otpClassName}
          aria-invalid={fieldState.invalid}
        >
          <InputOTPGroup
            className={cn(
              "gap-2.5 justify-between w-full *:data-[slot=input-otp-slot]:size-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border",
              groupClassName
            )}
          >
            {Array.from({ length: maxLength }).map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className={slotClassName}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      )}
    />
  )
}

export default FormOtpInput
