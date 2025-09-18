import { getCurrentUserId } from "./auth";
import { getDatabase } from "./schema";
export type MovieBasic = {
  movie_id: number;
  title: string;
  poster_path?: string | null;
};

// inserting favorite movie into database 
async function upsertMovie(m: MovieBasic) {
  const db = getDatabase();
  await db.runAsync(
    `INSERT OR IGNORE INTO movies (movie_id, title, poster_path)
     VALUES (?, ?, ?)`,
    [m.movie_id, m.title, m.poster_path ?? null]
  );
  await db.runAsync(
    `UPDATE movies SET title = COALESCE(?, title),
                       poster_path = COALESCE(?, poster_path)
     WHERE movie_id = ?`,
    [m.title, m.poster_path ?? null, m.movie_id]
  );
}


export async function setFavorite(m: MovieBasic, isFav: boolean) {
  const db = getDatabase();
  const uid = getCurrentUserId(); 

  await upsertMovie(m);

  await db.runAsync(
    `INSERT OR IGNORE INTO user_movies (user_id, movie_id, is_favorite, is_watched)
     VALUES (?, ?, 0, 0)`,
    [uid, m.movie_id]
  );

  await db.runAsync(
    `UPDATE user_movies SET is_favorite = ? WHERE user_id = ? AND movie_id = ?`,
    [isFav ? 1 : 0, uid, m.movie_id]
  );
}

export async function isFavorite(movieId: number): Promise<boolean> {
  const db = getDatabase();
  const uid = getCurrentUserId();
  const row = await db.getFirstAsync(
    `SELECT is_favorite FROM user_movies WHERE user_id = ? AND movie_id = ?`,
    [uid, movieId]
  );
  return !!(row && row.is_favorite === 1);
}

// Lists out movies once user favorites
export async function getMyFavorites(): Promise<
  Array<{ movie_id: number; title: string; poster_path: string | null }>
> {
  const db = getDatabase();
  const uid = getCurrentUserId();
  return (
    (await db.getAllAsync(
      `SELECT m.movie_id, m.title, m.poster_path
       FROM user_movies um
       JOIN movies m ON m.movie_id = um.movie_id
       WHERE um.user_id = ? AND um.is_favorite = 1
       ORDER BY m.title`,
      [uid]
    )) ?? []
  );
}
