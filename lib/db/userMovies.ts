import { getDb } from "./db";

// is_favorite and is_watched are booleans represented as integers (0 or 1)
export type UserMovieRow = {
    user_id: number;
    movie_id: number;
    is_favorite: number;
    is_watched: number;
    // watched_date is the date when the user marked the movie as watched this is OPTIONAL
    watched_date?: string | null;
};

// insert a user movie into the database
export async function addUserMovie(userMovie: UserMovieRow): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `INSERT INTO user_movies (user_id, movie_id, is_favorite, is_watched, watched_date)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(user_id, movie_id) DO UPDATE SET
           is_favorite = excluded.is_favorite,
           is_watched = excluded.is_watched,
           watched_date = excluded.watched_date`,
        [
            userMovie.user_id,
            userMovie.movie_id,
            userMovie.is_favorite,
            userMovie.is_watched,
            userMovie.watched_date ?? null
        ]
    );
}

// mark a movie as watched by the user
export async function markMovieAsWatched(userMovie: UserMovieRow): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `UPDATE user_movies SET is_watched = 1, watched_date = ? WHERE user_id = ? AND movie_id = ?`,
        [userMovie.watched_date ?? null, userMovie.user_id, userMovie.movie_id]
    );
}

// remove a movie from the user's watched list
export async function removeMovieFromWatchedList(userMovie: UserMovieRow): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `UPDATE user_movies SET is_watched = 0, watched_date = NULL WHERE user_id = ? AND movie_id = ?`,
        [userMovie.user_id, userMovie.movie_id]
    );
}

// mark a movie as favorite by the user
export async function markMovieAsFavorite(userMovie: UserMovieRow): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `UPDATE user_movies SET is_favorite = 1 WHERE user_id = ? AND movie_id = ?`,
        [userMovie.user_id, userMovie.movie_id]
    );
}

// remove a movie from the user's favorite list
export async function removeMovieFromFavoriteList(userMovie: UserMovieRow): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `UPDATE user_movies SET is_favorite = 0 WHERE user_id = ? AND movie_id = ?`,
        [userMovie.user_id, userMovie.movie_id]
    );
}

// get all movies for a user
export async function getAllMoviesForUser(userId: number): Promise<UserMovieRow[]> {
    const db = await getDb();
    return await db.getAllAsync(
        `SELECT * FROM user_movies WHERE user_id = ?`,
        [userId]
    );
}

// get all favorite movies for a user
export async function getAllFavoriteMoviesForUser(userId: number): Promise<UserMovieRow[]> {
    const db = await getDb();
    return await db.getAllAsync(
        `SELECT * FROM user_movies WHERE user_id = ? AND is_favorite = 1`,
        [userId]
    );
}

// get all watched movies for a user 
export async function getAllWatchedMoviesForUser(userId: number): Promise<UserMovieRow[]> {
    const db = await getDb();
    return await db.getAllAsync(
        `SELECT * FROM user_movies WHERE user_id = ? AND is_watched = 1`,
        [userId]
    );
}

// delete a user movie by its ID
export async function deleteUserMovieById(userId: number, movieId: number): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `DELETE FROM user_movies WHERE user_id = ? AND movie_id = ?`,
        [userId, movieId]
    );
}