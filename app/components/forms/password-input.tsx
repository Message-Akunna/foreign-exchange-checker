import React from 'react';
// icons
import { Circle } from 'lucide-react';
import { EyeIcon, EyeOffIcon, CheckIcon } from '@animateicons/react/lucide';
// shadcn
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group';
// utils
import { cn } from '@/lib/utils';

// Define checklist rules
export const passwordChecklist = [
  {
    label: 'At least 8 characters',
    validate: (value: string) => value.length >= 8,
  },
  {
    label: 'Contains a number',
    validate: (value: string) => /\d/.test(value),
  },
  {
    label: 'Contains an uppercase letter',
    validate: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: 'Contains a lowercase letter',
    validate: (value: string) => /[a-z]/.test(value),
  },
  {
    label: 'Contains a special character',
    validate: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
  },
];

// Helper function to check if all password rules are met
export const areAllPasswordRulesMet = (value: string | undefined | null): boolean => {
  if (typeof value !== 'string') return false;
  return passwordChecklist.every((rule) => rule.validate(value));
};

interface PasswordRuleCheckerProps {
  value: string;
  className?: string;
  showOnlyUnmet?: boolean; // If true, only show rules that aren't met
  hideWhenAllMet?: boolean; // If true, hide the component when all rules are met (default: true)
}

export const PasswordRuleChecker = ({
  value,
  className,
  showOnlyUnmet = false,
  hideWhenAllMet = true,
}: PasswordRuleCheckerProps) => {
  // Check if all rules are met
  const allRulesMet = React.useMemo(() => {
    return areAllPasswordRulesMet(value);
  }, [value]);

  // Filter rules based on showOnlyUnmet prop
  const rulesToShow = showOnlyUnmet
    ? passwordChecklist.filter((rule) => !rule.validate(value))
    : passwordChecklist;

  // Don't render if value is empty, or all rules are met and hideWhenAllMet is true, or all rules are met and showOnlyUnmet is true
  if (!value || (allRulesMet && hideWhenAllMet) || (allRulesMet && showOnlyUnmet)) {
    return null;
  }

  return (
    <ul className={cn('space-y-1', className)}>
      {rulesToShow.map((rule, index) => {
        const isValid = rule.validate(value);
        return (
          <li
            key={index}
            className={cn(
              'text-sm flex items-center gap-1',
              isValid ? 'text-green-600' : 'text-destructive'
            )}
          >
            {isValid ? <CheckIcon className="size-3" /> : <Circle className="size-3" />}
            <span>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
};
PasswordRuleChecker.displayName = 'PasswordRuleChecker';

// The 'ref' prop is included in React.ComponentProps<"input">
interface PasswordInputProps extends React.ComponentProps<'input'> {
  checklist?: boolean; // New prop to control checklist visibility
  wrapperClassName?: string;
}

const PasswordInput = ({
  className,
  checklist = false,
  wrapperClassName,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const disabled = props.disabled;

  return (
    <div className={cn('space-y-1', wrapperClassName)}>
      <InputGroup>
        <InputGroupInput
          placeholder="Enter password"
          type={showPassword ? 'text' : 'password'}
          className={cn('hide-password-toggle', className)}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className="bg-transparent cursor-pointer"
            // Prevents input from losing focus on button click
            onMouseDown={(e) => e.preventDefault()}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword && !disabled ? (
              <EyeIcon className="size-4" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="size-4" aria-hidden="true" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {checklist && props.value && <PasswordRuleChecker value={props.value as string} />}

      {/* hides browsers password toggles */}
      <style>{`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
              visibility: hidden;
              pointer-events: none;
              display: none;
          }
      `}</style>
    </div>
  );
};

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
