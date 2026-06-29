import { Client, Account, TablesDB, ID, Query } from "appwrite";

const client = new Client();

if (typeof window !== "undefined") {
  client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
}

export const account = new Account(client);
export const db = new TablesDB(client);

export const APPWRITE_DB_ID = "6a4265e4001112d6fa4a";
export const APPWRITE_LOGS_COLLECTION_ID = "logs";
export const APPWRITE_FAVORITES_COLLECTION_ID = "favorites";

export { ID, Query };

export default client;
