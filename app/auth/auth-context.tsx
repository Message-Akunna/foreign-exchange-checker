import type React from "react";
import { createContext, useContext, useRef } from "react";
// auth
import { createAuthStore } from "./auth-store";
// axios
import { configureAxiosAuth } from "@/lib/axios";

type Store = ReturnType<typeof createAuthStore>;

const AuthContext = createContext<Store | null>(null);

export const useAuthStore = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider missing");
  }
  return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<Store | null>(null);

  if (ref.current === null) {
    const store = createAuthStore();

    //  bind axios once to auth store
    configureAxiosAuth({
      getAccessToken: () => store.getSnapshot().accessToken,
      logout: store.signOut,
    });

    ref.current = store;
  }

  return (
    <AuthContext.Provider value={ref.current}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
