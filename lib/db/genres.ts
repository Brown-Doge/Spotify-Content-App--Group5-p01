import { getDb } from "./db";

export type GenreRow = {
    genre_id: number;
    name: string;
};

// insert a genre into the database
export async function insertGenre(genre: GenreRow): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `INSERT INTO genres (genre_id, name)
         VALUES (?, ?)
         ON CONFLICT(genre_id) DO NOTHING`,
        [genre.genre_id, genre.name]
    );
}

// insert multiple genres into the database
// this is used to insert the genres from the API
export async function insertMultipleGenres(genres: GenreRow[]): Promise<void> {
    const db = await getDb();
    for (const genre of genres) {
        await db.runAsync(
            `INSERT INTO genres (genre_id, name)
             VALUES (?, ?)
             ON CONFLICT(genre_id) DO NOTHING`,
            [genre.genre_id, genre.name]
        );
    }
}

// get a genre by its ID
export async function getGenreById(genreId: number): Promise<GenreRow | null> {
    const db = await getDb();
    return await db.getFirstAsync(
        `SELECT * FROM genres WHERE genre_id = ?`,
        [genreId]
    );
}

// get all genres
export async function getAllGenres(): Promise<GenreRow[]> {
    const db = await getDb();
    return await db.getAllAsync(
        `SELECT * FROM genres`
    );
}

// delete a genre by its ID
export async function deleteGenreById(genreId: number): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `DELETE FROM genres WHERE genre_id = ?`,
        [genreId]
    );
}
