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
            
            -- storing user information
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );

            -- store movie information, this will be populated from the API.
            -- movie_id this can be the TMDB movie ID from API to ensure uniqueness
            CREATE TABLE IF NOT EXISTS movies (
                movie_id INTEGER PRIMARY KEY, 
                title TEXT NOT NULL,
                director TEXT,
                release_date TEXT,
                poster_path TEXT,
                overview TEXT,
                runtime INTEGER,
                vote_average REAL
            );

            -- store all possible genres
            CREATE TABLE IF NOT EXISTS genres (
                genre_id INTEGER PRIMARY KEY, -- Use the genre ID from the API
                name TEXT NOT NULL UNIQUE
            );

            -- link users to their movies, tracking watched and favorite status
            -- is_favorite and is_watched are booleans represented as integers (0 or 1)
            -- watched_date is the date when the user marked the movie as watched this is OPTIONAL
            CREATE TABLE IF NOT EXISTS user_movies (
                user_id INTEGER NOT NULL,
                movie_id INTEGER NOT NULL,
                is_favorite INTEGER NOT NULL DEFAULT 0,
                is_watched INTEGER NOT NULL DEFAULT 0,
                watched_date DATE, 
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
                PRIMARY KEY (user_id, movie_id)
            );

            -- link movies to their genres (a movie can have multiple genres)
            CREATE TABLE IF NOT EXISTS movie_genres (
                movie_id INTEGER NOT NULL,
                genre_id INTEGER NOT NULL,
                FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
                FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE,
                PRIMARY KEY (movie_id, genre_id)
            );

            -- link users to their favorite genres
            CREATE TABLE IF NOT EXISTS user_favorite_genres (
                user_id INTEGER NOT NULL,
                genre_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE,
                PRIMARY KEY (user_id, genre_id)
            );
            --history table to track watched movies with timestamps
            CREATE TABLE IF NOT EXISTS history (
                history_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                movie_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                watched_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
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
export function getDatabaseInstance() {
    if (!db) {
        // This indicates that initializeDatabase was never called, which is a programming error.
        throw new Error("The database has not been initialized. Please call initializeDatabase() first.");
    }
    return db;
}