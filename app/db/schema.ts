import * as SQLite from "expo-sqlite";

// A variable to hold the database instance.
// Using 'any' for simplicity, but you can create a proper type for the opened database.
let db: any = null;

// This function will handle the database initialization.
export async function initializeDatabase() {
    // Only initialize if it hasn't been already.
    if (db) {
        return db;
    }

    try {
        // Open the database.
        const openedDb = await SQLite.openDatabaseAsync("app.db");

        // Use PRAGMA to enable foreign key constraints.
        await openedDb.execAsync(`
            PRAGMA journal_mode = WAL;
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

        console.log("Database initialized successfully.");
        db = openedDb; // Assign the opened database to our module-level variable.
        return db;
    } catch (error) {
        console.error("Database initialization error:", error);
        throw error;
    }
}

// This function provides a safe way to get the database instance.
export function getDatabase() {
    if (!db) {
        // This indicates that initializeDatabase was never called, which is a programming error.
        throw new Error("The database has not been initialized. Please call initializeDatabase() first.");
    }
    return db;
}