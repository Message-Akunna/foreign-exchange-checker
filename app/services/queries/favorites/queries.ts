import { toggleFavorite } from "@/services/redux/fx-slice";
import { useAppDispatch, useAppSelector } from "@/services/redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to retrieve the list of favorited currency pairs.
 * Bridges Redux state to React Query for upcoming database migration.
 */
export function useFavorites() {
  const favorites = useAppSelector((state) => state.fx.favorites);
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => favorites,
    initialData: favorites,
  });
}

/**
 * Mutation hook to toggle a currency pair favorite state.
 */
export function useToggleFavoriteMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pair: string) => {
      dispatch(toggleFavorite(pair));
      return pair;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
