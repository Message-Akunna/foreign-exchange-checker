import type * as React from "react"
// lib
import type { Control, FieldPath, FieldValues } from "react-hook-form"
// components
import { FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import FormController from "./form-controller"

type CheckboxProps = React.ComponentProps<typeof Checkbox>

type FormCheckboxProps<T extends FieldValues> = Omit<
  CheckboxProps,
  "checked" | "onCheckedChange"
> & {
  name: FieldPath<T>
  control: Control<T>
  label?: React.ReactNode
  description?: React.ReactNode
}

export const FormCheckbox = <T extends FieldValues>({
  id,
  name,
  control,
  label,
  className,
  description,
  ...checkboxProps
}: FormCheckboxProps<T>) => {
  const inputId = id ?? name

  return (
    <FormController
      name={name}
      label={label}
      control={control}
      description={description}
      className={className as string}
      render={({ field, fieldState }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            {...checkboxProps}
            id={inputId}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
          />

          {label && (
            <FieldLabel
              htmlFor={inputId}
              className="cursor-pointer text-muted-foreground text-sm"
            >
              {label}
            </FieldLabel>
          )}
        </div>
      )}
    />
  )
}
