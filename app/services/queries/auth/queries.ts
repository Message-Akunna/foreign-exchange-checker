import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { getAuthUser, login, register, logout } from "./apis";
import type { LoginInput, RegisterInput } from "./types";

/**
 * Hook to retrieve the current Appwrite session.
 */
export function useAuthUser() {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: getAuthUser,
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
    mutationFn: (credentials: LoginInput) => login(credentials),
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
    mutationFn: (data: RegisterInput) => register(data),
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
    mutationFn: logout,
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
