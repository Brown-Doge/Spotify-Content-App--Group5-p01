import * as SQLite from "expo-sqlite";

// initialize the database and create tables if they don't exist 
const dbPromise = (async () => {
    // open the database
    const db = await SQLite.openDatabaseAsync("app.db");
    // create tables if they don't exist
    // PRAGMA foreign_keys to enable foreign key constraints
    await db.execAsync(`
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

// function to get the database instance
export async function getDatabase() {
    return dbPromise;
}