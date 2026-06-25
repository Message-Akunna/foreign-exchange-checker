import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
  size?: "default" | "sm";
  className?: string;
  media?: ReactNode;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  size = "sm",
  className,
  media,
  confirmDisabled,
  cancelDisabled,
}: ConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn("border-border/40", className)}
        size={size}
      >
        <AlertDialogHeader>
          {media && (
            <AlertDialogMedia
              className={cn(
                variant === "destructive" &&
                  "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
              )}
            >
              {media}
            </AlertDialogMedia>
          )}
          <AlertDialogTitle className="">{title}</AlertDialogTitle>
          <AlertDialogDescription className="">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel?.();
              onOpenChange(false);
            }}
            disabled={cancelDisabled}
            variant="outline"
            className=" border-border/40"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            disabled={confirmDisabled}
            variant={variant}
            className=" font-semibold"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
