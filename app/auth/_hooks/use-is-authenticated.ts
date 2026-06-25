// auth/hooks/use-is-authenticated.ts
import { useSyncExternalStore } from "react";
import { useAuthStore } from "../auth-context";

export const useIsAuthenticated = () => {
  const store = useAuthStore();

  useSyncExternalStore(store.subscribe, store.getSnapshot);

  return store.isAuthenticated();
};
