jest.mock("../app/db/db"); 

import { getDb } from "../app/db/db";
import { deleteMovieGenre, getAllMovieGenresForMovie, getAllMoviesForGenre, insertMovieGenre, insertMultipleMovieGenres, MovieGenreRow } from "../app/db/movieGenres";


const mockedGetDb = getDb as jest.MockedFunction<typeof getDb>;

describe("MovieGenres database functions", () => {
  const mockDb = {
    runAsync: jest.fn(),
    getAllAsync: jest.fn(),
  };

  const sampleGenre: MovieGenreRow = { movie_id: 101, genre_id: 5 };
  const multipleGenres: MovieGenreRow[] = [
    { movie_id: 101, genre_id: 5 },
    { movie_id: 101, genre_id: 8 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetDb.mockResolvedValue(mockDb as any);
  });

  // test for insert movie-genre link
  test("insertMovieGenre inserts a movie-genre link", async () => {
    mockDb.runAsync.mockResolvedValueOnce({});

    await insertMovieGenre(sampleGenre);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO movie_genres"),
      [sampleGenre.movie_id, sampleGenre.genre_id]
    );
  });

  // test for insert multiple movie-genre links
  test("insertMultipleMovieGenres inserts multiple links", async () => {
    mockDb.runAsync.mockResolvedValue({});

    await insertMultipleMovieGenres(multipleGenres);

    expect(mockDb.runAsync).toHaveBeenCalledTimes(multipleGenres.length);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO movie_genres"),
      [101, 5]
    );
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO movie_genres"),
      [101, 8]
    );
  });

  // test for get all genres for a movie
  test("getAllMovieGenresForMovie returns all genres for a movie", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([sampleGenre]);

    const results = await getAllMovieGenresForMovie(101);

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM movie_genres WHERE movie_id = ?"),
      [101]
    );
    expect(results).toEqual([sampleGenre]);
  });

  // test for get all movies for a genre 
  test("getAllMoviesForGenre returns all movies for a genre", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([sampleGenre]);

    const results = await getAllMoviesForGenre(5);

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM movie_genres WHERE genre_id = ?"),
      [5]
    );
    expect(results).toEqual([sampleGenre]);
  });

  // test for delete movie-genre link
  test("deleteMovieGenre deletes a specific link", async () => {
    mockDb.runAsync.mockResolvedValueOnce({});

    await deleteMovieGenre(101, 5);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM movie_genres"),
      [101, 5]
    );
  });

  // test for non existent deletions
  test("deleteMovieGenre handles non-existent link gracefully", async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 0 });

    await deleteMovieGenre(999, 999); // assuming this link doesn't exist

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM movie_genres"),
      [999, 999]
    );
  });

  // test for inserting duplicate link
  test("insertMovieGenre handles duplicate link error", async () => {
    mockDb.runAsync.mockRejectedValueOnce(new Error("UNIQUE constraint failed: movie_genres.movie_id, movie_genres.genre_id"));

    await expect(insertMovieGenre(sampleGenre)).rejects.toThrow("UNIQUE constraint failed: movie_genres.movie_id, movie_genres.genre_id");

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO movie_genres"),
      [sampleGenre.movie_id, sampleGenre.genre_id]
    );
  });
});