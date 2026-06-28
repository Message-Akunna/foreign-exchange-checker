import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { DialogModal } from "@/components/custom/dialog-modal";
import { useAuth } from "@/providers/auth-provider";

interface AuthModalProps {
  children: ReactNode;
}

export function AuthModal({ children }: AuthModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearPendingAction } = useAuth();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      clearPendingAction();
      const backgroundLocation = location.state?.backgroundLocation;
      if (backgroundLocation) {
        navigate(backgroundLocation.pathname + backgroundLocation.search, {
          replace: true,
        });
      } else {
        navigate("/history", { replace: true });
      }
    }
  };

  const isRegister = location.pathname.startsWith("/register");

  return (
    <DialogModal
      open={true}
      setOpen={handleOpenChange}
      title={isRegister ? "Create an account" : "Welcome back"}
      description={
        isRegister
          ? "Enter your details to create your account"
          : "Enter your email to sign in to your account"
      }
      size="md"
      className="bg-background border border-border rounded-3xl"
      showCloseButton={true}
    >
      {children}
    </DialogModal>
  );
}
