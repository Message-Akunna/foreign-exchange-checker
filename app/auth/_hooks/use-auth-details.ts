import { useSyncExternalStore } from "react";
import { useAuthStore } from "../auth-context";
import type { AuthState } from "../_types";

export const useAuthDetails = () => {
  const store = useAuthStore();
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  return state.auth as AuthState["auth"];
};
