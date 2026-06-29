import { db, APPWRITE_DB_ID, APPWRITE_FAVORITES_COLLECTION_ID, Query, ID } from "@/lib/appwrite";
import type { FavoritePair, FavoriteItem } from "./types";

/**
 * Fetches all favorited currency pairs for a specific user from Appwrite.
 *
 * @param userId - ID of the authenticated user
 * @returns Array of FavoriteItem objects
 */
export const getFavorites = async (userId: string): Promise<FavoriteItem[]> => {
  if (!userId) return [];
  const response = await db.listRows({
    databaseId: APPWRITE_DB_ID,
    tableId: APPWRITE_FAVORITES_COLLECTION_ID,
    queries: [Query.equal("userId", userId)],
  });
  return response.rows.map((row: any) => ({
    id: row.$id,
    pair: `${row.sendCurrency}/${row.receiveCurrency}`,
  }));
};

/**
 * Creates a new favorite pair row in the Appwrite database.
 *
 * @param userId - ID of the authenticated user
 * @param pair - Currency pair string (e.g. "USD/EUR")
 */
export const addFavorite = async (userId: string, pair: FavoritePair): Promise<any> => {
  if (!userId) return;
  const [sendCurrency, receiveCurrency] = pair.split("/");
  if (!sendCurrency || !receiveCurrency) return;
  return await db.createRow({
    databaseId: APPWRITE_DB_ID,
    tableId: APPWRITE_FAVORITES_COLLECTION_ID,
    rowId: ID.unique(),
    data: {
      userId,
      sendCurrency,
      receiveCurrency,
    },
  });
};

/**
 * Deletes favorite pair rows matching the specified pair for the user from Appwrite.
 *
 * @param userId - ID of the authenticated user
 * @param pair - Currency pair string
 */
export const removeFavorite = async (userId: string, pair: FavoritePair): Promise<void> => {
  if (!userId) return;
  const [sendCurrency, receiveCurrency] = pair.split("/");
  if (!sendCurrency || !receiveCurrency) return;

  const response = await db.listRows({
    databaseId: APPWRITE_DB_ID,
    tableId: APPWRITE_FAVORITES_COLLECTION_ID,
    queries: [
      Query.equal("userId", userId),
      Query.equal("sendCurrency", sendCurrency),
      Query.equal("receiveCurrency", receiveCurrency),
    ],
  });

  for (const row of response.rows) {
    await db.deleteRow({
      databaseId: APPWRITE_DB_ID,
      tableId: APPWRITE_FAVORITES_COLLECTION_ID,
      rowId: row.$id,
    });
  }
};
