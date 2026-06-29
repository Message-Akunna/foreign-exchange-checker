import { db, APPWRITE_DB_ID, APPWRITE_LOGS_COLLECTION_ID, Query, ID } from "@/lib/appwrite";
import type { ConversionLog, AddLogInput } from "./types";

/**
 * Fetches all conversion logs for a specific user from Appwrite, ordered by creation date descending.
 *
 * @param userId - ID of the authenticated user
 * @returns Array of ConversionLog objects
 */
export const getLogs = async (userId: string): Promise<ConversionLog[]> => {
  if (!userId) return [];
  const response = await db.listRows({
    databaseId: APPWRITE_DB_ID,
    tableId: APPWRITE_LOGS_COLLECTION_ID,
    queries: [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
    ],
  });
  return response.rows.map((row: any) => ({
    id: row.$id,
    timestamp: row.$createdAt || row.$updatedAt || new Date().toISOString(),
    amount: row.amount,
    sendCurrency: row.sendCurrency,
    receiveCurrency: row.receiveCurrency,
    rate: row.rate,
    result: row.result,
  }));
};

/**
 * Creates a new conversion log entry in Appwrite.
 *
 * @param userId - ID of the authenticated user
 * @param data - Log details to persist
 */
export const addLog = async (userId: string, data: AddLogInput): Promise<any> => {
  if (!userId) return;
  return await db.createRow({
    databaseId: APPWRITE_DB_ID,
    tableId: APPWRITE_LOGS_COLLECTION_ID,
    rowId: ID.unique(),
    data: {
      userId,
      amount: data.amount,
      sendCurrency: data.sendCurrency,
      receiveCurrency: data.receiveCurrency,
      rate: data.rate,
      result: data.result,
    },
  });
};

/**
 * Deletes a specific conversion log by its row ID from Appwrite.
 *
 * @param rowId - Document/Row ID to delete
 */
export const deleteLog = async (rowId: string): Promise<void> => {
  await db.deleteRow({
    databaseId: APPWRITE_DB_ID,
    tableId: APPWRITE_LOGS_COLLECTION_ID,
    rowId,
  });
};

/**
 * Deletes all conversion logs for a specific user from Appwrite.
 *
 * @param userId - ID of the authenticated user
 */
export const clearLogs = async (userId: string): Promise<void> => {
  if (!userId) return;
  const response = await db.listRows({
    databaseId: APPWRITE_DB_ID,
    tableId: APPWRITE_LOGS_COLLECTION_ID,
    queries: [Query.equal("userId", userId)],
  });

  for (const row of response.rows) {
    await db.deleteRow({
      databaseId: APPWRITE_DB_ID,
      tableId: APPWRITE_LOGS_COLLECTION_ID,
      rowId: row.$id,
    });
  }
};
