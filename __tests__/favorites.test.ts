// __tests__/favorites.test.ts


const mockDb = {
  runAsync: jest.fn<Promise<any>, [string, any[]]>(),
};

jest.mock("../app/db/schema", () => ({
  __esModule: true,
  getDatabaseInstance: jest.fn(() => mockDb),
}));

jest.mock("../app/db/auth", () => ({
  __esModule: true,
  getCurrentUserId: jest.fn(() => 123),
}));

// Import from favorites
import { setFavorite } from "../app/db/favorites";

beforeEach(() => {
  mockDb.runAsync.mockClear();
});

// Test that a logged in user can save a movie, should pass
test("logged-in user can favorite a movie", async () => {
  await setFavorite(
    { movie_id: 42, title: "The Dark Knight", poster_path: "/x.png" },
    true
  );


  const calls = mockDb.runAsync.mock.calls.map(([sql, params]) => [String(sql), params]);

  expect(calls).toEqual(
    expect.arrayContaining([
      // INSERT OR IGNORE into movies (be flexible on whitespace/columns)
      [expect.stringMatching(/INSERT\s+OR\s+IGNORE\s+INTO\s+movies/i), [42, "The Dark Knight", "/x.png"]],

      // UPDATE movies SET title = COALESCE(...), poster_path = COALESCE(...), WHERE movie_id = ?
      [expect.stringMatching(/UPDATE\s+movies\s+SET\s+title\s*=\s*COALESCE/i), ["The Dark Knight", "/x.png", 42]],

      // Ensure user_movies exists
      [expect.stringMatching(/INSERT\s+OR\s+IGNORE\s+INTO\s+user_movies/i), [123, 42]],

      // Mark as favorite
      [expect.stringMatching(/UPDATE\s+user_movies\s+SET\s+is_favorite\s*=\s*\?/i), [1, 123, 42]],
    ])
  );
});

