import type { User, Role } from "@/services/auth/types";

export type AuthUser = User;

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  auth: {
    user: User;
    role: Role;
    hasPinEnabled: boolean;
  } | null;
  rememberMe?: boolean;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  auth: AuthState["auth"];
  rememberMe?: boolean;
  storage?: "local" | "session";
};
