import { useAppDispatch, useAppSelector } from "@/services/redux";
import { addLog, clearLogs, deleteLog } from "@/services/redux/fx-slice";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to retrieve the list of conversion logs.
 * Bridges Redux state to React Query for upcoming database migration.
 */
export function useLogs() {
  const logs = useAppSelector((state) => state.fx.logs);
  return useQuery({
    queryKey: ["logs"],
    queryFn: () => logs,
    initialData: logs,
  });
}

/**
 * Mutation hook to add a conversion log entry.
 */
export function useAddLogMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: {
      amount: number;
      sendCurrency: string;
      receiveCurrency: string;
      rate: number;
      result: number;
    }) => {
      dispatch(addLog(log));
      return log;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}

/**
 * Mutation hook to clear all conversion log entries.
 */
export function useClearLogsMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      dispatch(clearLogs());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}

/**
 * Mutation hook to delete a specific conversion log entry by ID.
 */
export function useDeleteLogMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      dispatch(deleteLog(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}
