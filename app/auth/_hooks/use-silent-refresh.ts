import { useEffect } from "react";
import { useAuthStore } from "../auth-context";

export const useSilentRefresh = () => {
  const store = useAuthStore();

  useEffect(() => {
    const id = setInterval(async () => {
      const state = store.getSnapshot();
      if (!state.refreshToken || !state.expiresAt) return;

      if (state.expiresAt - Date.now() < 60_000) {
        try {
          // call refresh endpoint
          store.updateToken("new-token", 3600);
        } catch {
          store.signOut();
        }
      }
    }, 15_000);

    return () => clearInterval(id);
  }, [store]);
};
