jest.mock("../app/db/db");

import { getDb } from "../app/db/db";
import { deleteMovieById, getMovieById, getRecentMovies, inserMovie, MovieRow, searchMoviesByTitle } from "../app/db/movies";

const mockedGetDb = getDb as jest.MockedFunction<typeof getDb>;

describe("Movie database functions", () => {
  const mockDb = {
    runAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    getAllAsync: jest.fn(),
  };

  const sampleMovie: MovieRow = {
    movie_id: 101,
    title: "Inception",
    director: "Christopher Nolan",
    release_date: "2010-07-16",
    poster_path: "/poster.jpg",
    overview: "A mind-bending thriller",
    runtime: 148,
    vote_average: 8.8,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetDb.mockResolvedValue(mockDb as any);
  });

  // test for insert movie 
  test("insertMovie inserts a movie", async () => {
    mockDb.runAsync.mockResolvedValueOnce({});

    await inserMovie(sampleMovie);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO movies"),
      [
        sampleMovie.movie_id,
        sampleMovie.title,
        sampleMovie.director,
        sampleMovie.release_date,
        sampleMovie.poster_path,
        sampleMovie.overview,
        sampleMovie.runtime,
        sampleMovie.vote_average,
      ]
    );
  });

  // test for get movie by id
  test("getMovieById returns a movie", async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(sampleMovie);

    const movie = await getMovieById(101);

    expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM movies WHERE movie_id = ?"),
      [101]
    );
    expect(movie).toEqual(sampleMovie);
  });

  // test for search movies by title
  test("searchMoviesByTitle returns matching movies", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([sampleMovie]);

    const results = await searchMoviesByTitle("Inception");

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM movies WHERE title LIKE ?"),
      ["%Inception%"]
    );
    expect(results).toEqual([sampleMovie]);
  });

  // test for get recent movies
  test("getRecentMovies returns limited movies", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([sampleMovie]);

    const results = await getRecentMovies(5);

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining("ORDER BY release_date DESC LIMIT ?"),
      [5]
    );
    expect(results).toEqual([sampleMovie]);
  });

  // test for delete movie by id
  test("deleteMovieById deletes a movie", async () => {
    mockDb.runAsync.mockResolvedValueOnce({});

    await deleteMovieById(101);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM movies WHERE movie_id = ?"),
      [101]
    );
  });

  // test for delete movie by id when movie does not exist
  test("deleteMovieById handles non-existent movie gracefully", async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 0 });

    await expect(deleteMovieById(999)).resolves.not.toThrow();

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM movies WHERE movie_id = ?"),
      [999]
    );
  });

  // test for get movie by id when movie does not exist
  test("getMovieById returns null for non-existent movie", async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null);

    const movie = await getMovieById(999);

    expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM movies WHERE movie_id = ?"),
      [999]
    );
    expect(movie).toBeNull();
  });

  // test for duplicate movie insertion
  test("insertMovie handles duplicate movie insertion gracefully", async () => {
    const error = new Error("SQLITE_CONSTRAINT: UNIQUE constraint failed: movies.movie_id");
    mockDb.runAsync.mockRejectedValueOnce(error); 
    await expect(inserMovie(sampleMovie)).rejects.toThrow("SQLITE_CONSTRAINT: UNIQUE constraint failed: movies.movie_id");

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO movies"),
      [
        sampleMovie.movie_id,
        sampleMovie.title,
        sampleMovie.director,
        sampleMovie.release_date,
        sampleMovie.poster_path,
        sampleMovie.overview,
        sampleMovie.runtime,
        sampleMovie.vote_average,
      ]
    );  
  });
});