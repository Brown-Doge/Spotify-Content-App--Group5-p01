import * as SQLite from "expo-sqlite";

const dbPromise = (async () => {
    const db = await SQLite.openDatabaseAsync("app.db");
    await db.execAsync(`
        // to enable foreign key constraints

        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
    `);
    // other tables can be created here
    return db;
})();

export async function getDatabase() {
    return dbPromise;
}