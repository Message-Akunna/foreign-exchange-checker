import { AUTH_KEYS, STORAGE_TYPES } from "@/services/auth/keys";
import type { AuthState, Session } from "./_types";

type Listener = () => void;

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  auth: null,
  rememberMe: false,
};

const load = (): AuthState => {
  try {
    const local = localStorage.getItem(AUTH_KEYS.TOKEN_STORAGE);
    const session = sessionStorage.getItem(AUTH_KEYS.TOKEN_STORAGE);
    const raw = local || session;
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
};

export const createAuthStore = () => {
  let state: AuthState = load();
  const listeners = new Set<Listener>();

  const emit = () =>
    listeners.forEach((listener) => {
      listener();
    });

  // cross-tab sync
  window.addEventListener("storage", (event) => {
    if (event.key === AUTH_KEYS.TOKEN_STORAGE) {
      state = load();
      emit();
    }
  });

  return {
    getSnapshot: () => state,

    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    signIn(payload: Session) {
      const { storage = STORAGE_TYPES.SESSION, ...rest } = payload;

      state = {
        accessToken: rest.accessToken,
        refreshToken: rest.refreshToken,
        expiresAt: Date.now() + rest.expiresIn * 1000,
        auth: rest.auth,
        rememberMe: !!rest.rememberMe,
      };

      if (storage === STORAGE_TYPES.LOCAL) {
        localStorage.setItem(AUTH_KEYS.TOKEN_STORAGE, JSON.stringify(state));
        sessionStorage.removeItem(AUTH_KEYS.TOKEN_STORAGE);
      } else {
        sessionStorage.setItem(AUTH_KEYS.TOKEN_STORAGE, JSON.stringify(state));
        localStorage.removeItem(AUTH_KEYS.TOKEN_STORAGE);
      }
      emit();
    },

    updateToken(accessToken: string, expiresIn: number) {
      state = {
        ...state,
        accessToken,
        expiresAt: Date.now() + expiresIn * 1000,
      };

      // Determine where it is currently stored
      const isLocal = !!localStorage.getItem(AUTH_KEYS.TOKEN_STORAGE);
      if (isLocal) {
        localStorage.setItem(AUTH_KEYS.TOKEN_STORAGE, JSON.stringify(state));
      } else {
        sessionStorage.setItem(AUTH_KEYS.TOKEN_STORAGE, JSON.stringify(state));
      }
      emit();
    },

    signOut() {
      // Check state for rememberMe, not storage location
      if (state.rememberMe) {
        const { refreshToken } = state;
        // Reset state but keep refreshToken for in-memory use (e.g. login page)
        // rememberMe is removed as requested
        state = { ...initialState, refreshToken };
        // Persist ONLY the refreshToken to localStorage
        // "every data should be cleared not even set to null"
        localStorage.setItem(
          AUTH_KEYS.TOKEN_STORAGE,
          JSON.stringify({ refreshToken })
        );
        sessionStorage.removeItem(AUTH_KEYS.TOKEN_STORAGE);
      } else {
        state = initialState;
        localStorage.removeItem(AUTH_KEYS.TOKEN_STORAGE);
        sessionStorage.removeItem(AUTH_KEYS.TOKEN_STORAGE);
      }
      emit();
    },

    isAuthenticated() {
      return (
        !!state.accessToken && !!state.expiresAt && state.expiresAt > Date.now()
      );
    },
  };
};
