// auth/hooks/use-sign-out.ts
import { useAuthStore } from "../auth-context";

export const useSignOut = () => {
  const store = useAuthStore();
  return () => store.signOut();
};
