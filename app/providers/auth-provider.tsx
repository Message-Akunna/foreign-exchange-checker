import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
  type ReactNode,
} from "react";
// lib
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router";
// queries
import {
  useAuthUser,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} from "@/services/queries/auth";

export interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<any>;
  loginWithGoogle: () => void;
  clearPendingAction: () => void;
  executeProtectedAction: (action: () => void) => void;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // 1. Fetch current user session
  const { data: user, isLoading } = useAuthUser();
  const isAuthenticated = !!user;

  // 2. Mutations
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  // 3. SSO Placeholder
  const loginWithGoogle = useCallback(() => {
    toast.info("Google OAuth login is currently disabled (placeholder).");
  }, []);

  // 4. Pending Action / Intent Pattern
  const executeProtectedAction = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action();
      } else {
        setPendingAction(() => action);
        navigate("/login", { state: { backgroundLocation: location } });
      }
    },
    [isAuthenticated, navigate, location]
  );

  const clearPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  // Run pending action automatically when authenticated
  const prevUserRef = useRef(user);
  useEffect(() => {
    if (user && !prevUserRef.current && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    prevUserRef.current = user;
  }, [user, pendingAction]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login: (email: string, password: string) =>
        loginMutation.mutateAsync({ email, password }),
      register: (email: string, password: string, name: string) =>
        registerMutation.mutateAsync({ email, password, name }),
      logout: () => logoutMutation.mutateAsync(),
      loginWithGoogle,
      executeProtectedAction,
      clearPendingAction,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      loginMutation,
      registerMutation,
      logoutMutation,
      loginWithGoogle,
      executeProtectedAction,
      clearPendingAction,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
