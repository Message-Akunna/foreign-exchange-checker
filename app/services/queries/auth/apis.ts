import { account, ID } from "@/lib/appwrite";
import type { LoginInput, RegisterInput } from "./types";

/**
 * Fetches the current authenticated user session from Appwrite.
 * Returns null if no active session exists.
 */
export const getAuthUser = async (): Promise<any> => {
  try {
    return await account.get();
  } catch {
    // Appwrite throws 401 when no session exists
    return null;
  }
};

/**
 * Creates a session for the user with email and password.
 */
export const login = async ({ email, password }: LoginInput): Promise<any> => {
  return await account.createEmailPasswordSession({ email, password });
};

/**
 * Registers a new user and creates an active session.
 */
export const register = async ({
  email,
  password,
  name,
}: RegisterInput): Promise<any> => {
  // Create user
  await account.create({
    userId: ID.unique(),
    email,
    password,
    name,
  });
  // Create session (auto login)
  return await account.createEmailPasswordSession({ email, password });
};

/**
 * Deletes the current session.
 */
export const logout = async (): Promise<any> => {
  return await account.deleteSession({ sessionId: "current" });
};
