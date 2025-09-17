import { getDb } from "./db";

export type MovieGenreRow = {
    movie_id: number;
    genre_id: number;
};

// insert a movie genre into the database
export async function insertMovieGenre(movieGenre: MovieGenreRow): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `INSERT INTO movie_genres (movie_id, genre_id)
         VALUES (?, ?)
         ON CONFLICT(movie_id, genre_id) DO NOTHING`,
        [movieGenre.movie_id, movieGenre.genre_id]
    );
}

// insert multiple movie genres into the database
export async function insertMultipleMovieGenres(movieGenres: MovieGenreRow[]): Promise<void> {
    const db = await getDb();
    for (const movieGenre of movieGenres) {
        await db.runAsync(
            `INSERT INTO movie_genres (movie_id, genre_id)
             VALUES (?, ?)
             ON CONFLICT(movie_id, genre_id) DO NOTHING`,
            [movieGenre.movie_id, movieGenre.genre_id]
        );
    }
}

// get all movie genres for a movie
export async function getAllMovieGenresForMovie(movieId: number): Promise<MovieGenreRow[]> {
    const db = await getDb();
    return await db.getAllAsync(
        `SELECT * FROM movie_genres WHERE movie_id = ?`,
        [movieId]
    );
}

// get all movies for a genre
export async function getAllMoviesForGenre(genreId: number): Promise<MovieGenreRow[]> {
    const db = await getDb();
    return await db.getAllAsync(
        `SELECT * FROM movie_genres WHERE genre_id = ?`,
        [genreId]
    );
}

// delete a specific movie genre link
// genre link is referrring to the link between a movie and a genre
export async function deleteMovieGenre(movieId: number, genreId: number): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `DELETE FROM movie_genres WHERE movie_id = ? AND genre_id = ?`,
        [movieId, genreId]
    );
}