import { getDb } from "../../lib/db/db";

const apiKey = process.env.MOVIE_API_KEY;

export type MovieRow = {
    // movie_id is the TMDB movie ID from API to ensure uniqueness
    movie_id: number;
    title: string;
    director?: string | null;
    release_date?: string | null;
    poster_path?: string | null;
    overview?: string | null;
    runtime?: number | null;
    vote_average?: number | null;
};

// this is where we insert a movie into the database
export async function inserMovie(movie: MovieRow): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `INSERT INTO movies (movie_id, title, director, release_date, poster_path, overview, runtime, vote_average)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(movie_id) DO NOTHING`,
         // parameters for the insert
        [
            movie.movie_id,
            movie.title,
            movie.director ?? null,
            movie.release_date ?? null,
            movie.poster_path ?? null,
            movie.overview ?? null,
            movie.runtime ?? null,
            movie.vote_average ?? null,
        ]
    );
}

// get a movie by its ID
export async function getMovieById(movieId: number): Promise<MovieRow | null> {
    const db = await getDb();
    return await db.getFirstAsync(
        `SELECT * FROM movies WHERE movie_id = ?`,
        [movieId]
    );
}

//search for movies by title
// probably wont use this since we are using the API to search for movies
export async function searchMoviesByTitle(title: string): Promise<MovieRow[]> {
    const db = await getDb();
    return await db.getAllAsync(
        `SELECT * FROM movies WHERE title LIKE ?`,
        [`%${title}%`]
    );
}

// get the most recent movies that were added to the database
export async function getRecentMovies(limit = 15): Promise<MovieRow[]> {
    const db = await getDb();
    return await db.getAllAsync(
        `SELECT * FROM movies ORDER BY release_date DESC LIMIT ?`,
        [limit]
    );
}

// delete a movie by its ID
export async function deleteMovieById(movieId: number): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `DELETE FROM movies WHERE movie_id = ?`,
        [movieId]
    );
}