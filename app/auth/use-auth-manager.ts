import { useSignIn } from "./_hooks/use-sign-in";
import { useSignOut } from "./_hooks/use-sign-out";
import { useAuthDetails } from "./_hooks/use-auth-details";
import { useIdleLogout } from "./_hooks/use-idle-logout";
import { useSilentRefresh } from "./_hooks/use-silent-refresh";
import { useIsAuthenticated } from "./_hooks/use-is-authenticated";
import { useAuthStore } from "./auth-context";
import type { Session } from "./_types";

/* 
✔ No password
✔ No email
✔ No API knowledge
✔ Mutation-friendly
✔ Store-only responsibility
 */

export const useAuthManager = () => {
  const signIn = useSignIn();
  const signOut = useSignOut();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthDetails();

  useIdleLogout(isAuthenticated, 15 * 60 * 1000, signOut);
  useSilentRefresh();

  return {
    /** called from mutation.onSuccess */
    /** called from mutation.onSuccess */
    setSession: (session: Session) => {
      signIn(session);
    },

    clearSession: signOut,

    isAuthenticated,
    auth,
    user: auth?.user,
    refreshToken: useAuthStore().getSnapshot().refreshToken,
  };
};
