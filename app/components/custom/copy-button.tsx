import * as React from "react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { CopyIcon, CheckIcon } from "@animateicons/react/lucide";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface CopyButtonProps extends React.ComponentProps<typeof Button> {
  value: string;
  text?: string;
  successMessage?: string;
  icon?: React.ReactNode;
  copiedIcon?: React.ReactNode;
}

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      text,
      successMessage = "Copied to clipboard!",
      variant = "link",
      size,
      className,
      icon,
      copiedIcon,
      children,
      ...props
    },
    ref
  ) => {
    const [, copyToClipboard] = useCopyToClipboard();
    const [copied, setCopied] = React.useState(false);

    const handleCopy = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        copyToClipboard(value);
        setCopied(true);
        toast.success(successMessage);
        setTimeout(() => setCopied(false), 2000);
      },
      [value, copyToClipboard, successMessage]
    );

    const hasText = Boolean(text || children);
    const defaultSize = hasText ? "sm" : "icon-xs";
    const activeSize = size || defaultSize;

    return (
      <Button
        ref={ref}
        variant={variant}
        size={activeSize}
        className={cn("cursor-pointer gap-1.5", className)}
        onClick={handleCopy}
        {...props}
      >
        {copied ? (
          copiedIcon || <CheckIcon className="size-4 text-success" />
        ) : (
          icon || <CopyIcon className="size-4" />
        )}
        {text && <span>{text}</span>}
        {children}
      </Button>
    );
  }
);

CopyButton.displayName = "CopyButton";

export { CopyButton };
