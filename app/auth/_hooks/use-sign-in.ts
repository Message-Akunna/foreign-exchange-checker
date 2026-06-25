import { useAuthStore } from "../auth-context";
import type { AuthState } from "../_types";

export const useSignIn = () => {
  const store = useAuthStore();

  return (payload: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    auth: AuthState["auth"];
    rememberMe?: boolean;
  }) => {
    store.signIn(payload);
  };
};
