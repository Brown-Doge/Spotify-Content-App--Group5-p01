import { getDb } from "./db";

export type HistoryRow = {
    history_id: number;
    user_id: number;
    movie_id: number;
    title: string;
    watched_at: string;
};
export async function getUserHistory(userId: number): Promise<HistoryRow[]> {
    const db = await getDb();
    return await db.getAllAsync(
        `SELECT h.history_id, h.user_id, h.movie_id, m.title, h.watched_at
            FROM history h
                JOIN movies m ON h.movie_id = m.movie_id
            WHERE h.user_id = ?
            ORDER BY h.watched_at DESC`,
        [userId]
    );
}
export async function addUserHistory(userId: number, movieId: number): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `INSERT INTO history (user_id, movie_id, title, watched_at) 
         VALUES (?, ?, (SELECT title FROM movies WHERE movie_id = ?), CURRENT_TIMESTAMP)`,
        [userId, movieId, movieId]
    );
}
export async function deleteHistoryEntry(historyId: number): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `DELETE FROM history WHERE history_id = ?`,
        [historyId]
    );
}
export async function clearUserHistory(userId: number): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `DELETE FROM history WHERE user_id = ?`,
        [userId]
    );
}