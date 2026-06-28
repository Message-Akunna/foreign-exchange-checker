import type { PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const modalVariants = cva("w-full p-6", {
  variants: {
    size: {
      default: "sm:max-w-2xl",
      sm: "sm:max-w-sm",
      md: "sm:max-w-md",
      lg: "sm:max-w-lg",
      xl: "sm:max-w-xl",
      "2xl": "sm:max-w-2xl",
      "3xl": "sm:max-w-3xl",
      "4xl": "sm:max-w-4xl",
      "5xl": "sm:ax-w-5xl",
      full: "sm:max-w-[calc(100vw-2rem)]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface DialogModalProps extends PropsWithChildren {
  title: string;
  open: boolean;
  className?: string;
  description?: string;
  label?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  setOpen?: (open: boolean) => void;
  size?: VariantProps<typeof modalVariants>["size"];
}

export const DialogModal = ({
  size,
  open,
  title,
  label,
  setOpen,
  footer,
  children,
  className,
  description,
  showCloseButton = false,
}: DialogModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen?.(open);
      }}
    >
      <DialogContent
        className={cn(modalVariants({ size }), className)}
        showCloseButton={showCloseButton}
      >
        <DialogHeader>
          {label && <div className="">{label}</div>}
          <DialogTitle className="text-xl font-medium">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm font-normal text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
