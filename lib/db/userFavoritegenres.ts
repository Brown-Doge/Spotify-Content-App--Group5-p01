import { getDb } from "./db";

export type UserFavoriteGenre = {
    user_id: number;
    genre_id: number;
}

// add a favorite genre for a user
export async function addUserFavoriteGenre(user_id: number, genre_id: number): Promise<void> {
    const db = await getDb();
    await db.runAsync(
        `INSERT OR IGNORE INTO user_favorite_genres (user_id, genre_id) VALUES (?, ?)`,
        [user_id, genre_id]
    );
}

// add multiple favorite genres for a user
export async function addUserFavoriteGenres(user_id: number, genre_ids: number[]): Promise<void> {
  const db = await getDb();
  for (const mult of genre_ids) {
    await db.runAsync(
      `INSERT INTO user_favorite_genres (user_id, genre_id)
       VALUES (?, ?)
       ON CONFLICT(user_id, genre_id) DO NOTHING`,
      [user_id, mult]
    );
  }
}

// get all favorite genres for a user
export async function getFavoriteGenresForUser(user_id: number): Promise<UserFavoriteGenre[]> {
  const db = await getDb();
  return (await db.getAllAsync(
    `SELECT * FROM user_favorite_genres WHERE user_id = ?`,
    [user_id]
  )) as UserFavoriteGenre[];
}

// get all users who favor a specific genre
export async function getUsersForFavoriteGenre(genre_id: number): Promise<UserFavoriteGenre[]> {
  const db = await getDb();
  return (await db.getAllAsync(
    `SELECT * FROM user_favorite_genres WHERE genre_id = ?`,
    [genre_id]
  )) as UserFavoriteGenre[];
}


// remove a favorite genre for a user
export async function removeUserFavoriteGenre(user_id: number, genre_id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `DELETE FROM user_favorite_genres WHERE user_id = ? AND genre_id = ?`,
    [user_id, genre_id]
  );
}

// remove all favorite genres for a user
export async function clearFavoriteGenresForUser(user_id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `DELETE FROM user_favorite_genres WHERE user_id = ?`,
    [user_id]
  );
}