import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-provider";
import { getFavorites, addFavorite, removeFavorite } from "./apis";
import type { FavoritePair, FavoriteItem } from "./types";

/**
 * Hook to retrieve the list of favorited currency pairs.
 * Fetches user-specific favorites from Appwrite.
 */
export function useFavorites() {
  const { user } = useAuth();
  const userId = user?.$id;

  return useQuery<FavoriteItem[]>({
    queryKey: ["favorites", userId],
    queryFn: () => getFavorites(userId || ""),
    enabled: !!userId,
  });
}

/**
 * Mutation hook to toggle a currency pair favorite state in Appwrite database.
 */
export function useToggleFavoriteMutation() {
  const { user } = useAuth();
  const userId = user?.$id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pair: FavoritePair) => {
      if (!userId) throw new Error("User must be authenticated to modify favorites");

      const current = queryClient.getQueryData<FavoriteItem[]>(["favorites", userId]) || [];
      const exists = current.some((fav) => fav.pair === pair);

      if (exists) {
        await removeFavorite(userId, pair);
      } else {
        await addFavorite(userId, pair);
      }
      return pair;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });
}
