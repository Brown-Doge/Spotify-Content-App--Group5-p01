import { getDatabaseInstance } from "./schema";

export async function getDb() {
  return getDatabaseInstance();
}