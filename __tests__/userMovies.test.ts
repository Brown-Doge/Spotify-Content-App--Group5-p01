jest.mock("../app/db/db");

import {
    addUserMovie,
    deleteUserMovieById,
    getAllFavoriteMoviesForUser,
    getAllMoviesForUser,
    getAllWatchedMoviesForUser,
    markMovieAsFavorite,
    markMovieAsWatched,
    removeMovieFromFavoriteList,
    removeMovieFromWatchedList,
    UserMovieRow
} from "../app/db/userMovies";

import { getDb } from "../app/db/db";

const mockedGetDb = getDb as jest.MockedFunction<typeof getDb>;

describe("UserMovies database functions", () => {
  const mockDb = {
    runAsync: jest.fn(),
    getAllAsync: jest.fn(),
  };

  const sampleUserMovie: UserMovieRow = {
    user_id: 1,
    movie_id: 101,
    is_favorite: 0,
    is_watched: 0,
    watched_date: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetDb.mockResolvedValue(mockDb as any);
  });

  test("addUserMovie inserts or updates a user-movie record", async () => {
    mockDb.runAsync.mockResolvedValueOnce({});

    await addUserMovie(sampleUserMovie);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO user_movies"),
      [
        sampleUserMovie.user_id,
        sampleUserMovie.movie_id,
        sampleUserMovie.is_favorite,
        sampleUserMovie.is_watched,
        sampleUserMovie.watched_date
      ]
    );
  });

  test("markMovieAsWatched updates a movie as watched", async () => {
    mockDb.runAsync.mockResolvedValueOnce({});

    await markMovieAsWatched({ ...sampleUserMovie, watched_date: "2025-09-17" });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE user_movies SET is_watched = 1"),
      ["2025-09-17", sampleUserMovie.user_id, sampleUserMovie.movie_id]
    );
  });

  test("removeMovieFromWatchedList sets is_watched to 0", async () => {
    mockDb.runAsync.mockResolvedValueOnce({});

    await removeMovieFromWatchedList(sampleUserMovie);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("SET is_watched = 0"),
      [sampleUserMovie.user_id, sampleUserMovie.movie_id]
    );
  });

  test("markMovieAsFavorite sets is_favorite to 1", async () => {
    mockDb.runAsync.mockResolvedValueOnce({});

    await markMovieAsFavorite(sampleUserMovie);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("SET is_favorite = 1"),
      [sampleUserMovie.user_id, sampleUserMovie.movie_id]
    );
  });

  test("removeMovieFromFavoriteList sets is_favorite to 0", async () => {
    mockDb.runAsync.mockResolvedValueOnce({});

    await removeMovieFromFavoriteList(sampleUserMovie);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("SET is_favorite = 0"),
      [sampleUserMovie.user_id, sampleUserMovie.movie_id]
    );
  });

  test("getAllMoviesForUser returns all movies", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([sampleUserMovie]);

    const results = await getAllMoviesForUser(1);

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM user_movies WHERE user_id = ?"),
      [1]
    );
    expect(results).toEqual([sampleUserMovie]);
  });

  test("getAllFavoriteMoviesForUser returns only favorites", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([{ ...sampleUserMovie, is_favorite: 1 }]);

    const results = await getAllFavoriteMoviesForUser(1);

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("is_favorite = 1"),
      [1]
    );
    expect(results).toEqual([{ ...sampleUserMovie, is_favorite: 1 }]);
  });

  test("getAllWatchedMoviesForUser returns only watched", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([{ ...sampleUserMovie, is_watched: 1 }]);

    const results = await getAllWatchedMoviesForUser(1);

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("is_watched = 1"),
      [1]
    );
    expect(results).toEqual([{ ...sampleUserMovie, is_watched: 1 }]);
  });

  test("deleteUserMovieById deletes a user-movie", async () => {
    mockDb.runAsync.mockResolvedValueOnce({});

    await deleteUserMovieById(1, 101);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM user_movies"),
      [1, 101]
    );
  });
});