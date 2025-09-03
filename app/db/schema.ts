import * as SQLite from "expo-sqlite";

// this is in charge of "opening the db"
export async function openDatabase() {
  return await SQLite.openDatabaseAsync("app.db");
}
// this is in charge of creating the tables 
export async function setUpDataBase(){
    const db = await openDatabase();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
    `);

    return db;
}