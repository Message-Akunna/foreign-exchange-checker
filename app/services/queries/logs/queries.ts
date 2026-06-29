import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-provider";
import { getLogs, addLog, deleteLog, clearLogs } from "./apis";
import type { ConversionLog, AddLogInput } from "./types";

/**
 * Hook to retrieve the list of conversion logs.
 * Fetches user-specific logs from Appwrite.
 */
export function useLogs() {
  const { user } = useAuth();
  const userId = user?.$id;

  return useQuery<ConversionLog[]>({
    queryKey: ["logs", userId],
    queryFn: () => getLogs(userId || ""),
    enabled: !!userId,
  });
}

/**
 * Mutation hook to add a conversion log entry in Appwrite.
 */
export function useAddLogMutation() {
  const { user } = useAuth();
  const userId = user?.$id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: AddLogInput) => {
      if (!userId) throw new Error("User must be authenticated to log a conversion");
      return await addLog(userId, log);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs", userId] });
    },
  });
}

/**
 * Mutation hook to clear all conversion log entries in Appwrite.
 */
export function useClearLogsMutation() {
  const { user } = useAuth();
  const userId = user?.$id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User must be authenticated to clear logs");
      await clearLogs(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs", userId] });
    },
  });
}

/**
 * Mutation hook to delete a specific conversion log entry by ID in Appwrite.
 */
export function useDeleteLogMutation() {
  const { user } = useAuth();
  const userId = user?.$id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteLog(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs", userId] });
    },
  });
}
