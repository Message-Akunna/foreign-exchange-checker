import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ID } from "appwrite";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { account } from "@/lib/appwrite";

/**
 * Hook to retrieve the current Appwrite session.
 */
export function useAuthUser() {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        return await account.get();
      } catch {
        // Appwrite throws 401 when no session exists
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // keep for 5 minutes
    retry: false,
  });
}

/**
 * Mutation hook to perform login.
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: any) => {
      return await account.createEmailPasswordSession({ email, password });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Successfully logged in!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to log in");
    },
  });
}

/**
 * Mutation hook to perform registration.
 */
export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password, name }: any) => {
      // Create user
      await account.create({ userId: ID.unique(), email, password, name });
      // Create session (auto login)
      return await account.createEmailPasswordSession({ email, password });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Account created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to register");
    },
  });
}

/**
 * Mutation hook to perform logout.
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      return await account.deleteSession({ sessionId: "current" });
    },
    onSuccess: async () => {
      queryClient.setQueryData(["auth-user"], null);
      toast.success("Successfully logged out");
      navigate("/history");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to log out");
    },
  });
}
