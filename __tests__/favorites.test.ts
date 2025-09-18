import { setFavorite } from "../app/db/favorites";

//creating a mock Db
const mockDb = {
  runAsync: jest.fn<Promise<any>, [string, any[]]>()
};

// connect to db and create user id from fake login
jest.mock("../app/db/schema", () => ({ getDatabase: () => mockDb }));
jest.mock("../app/db/auth", () => ({ getCurrentUserId: () => 123 })); 

beforeEach(() => {
  mockDb.runAsync.mockClear();
});

//What the test should be about
test("logged-in user can favorite a movie", async () => {
  await setFavorite(
    { movie_id: 42, title: "The Dark Knight", poster_path: "/x.png" },
    true
  );

  // Capture calls: 
  const calls = mockDb.runAsync.mock.calls.map(([sql, params]) => [String(sql), params]);

  // should equal the following below:
  expect(calls).toEqual(
    expect.arrayContaining([
      // upsertMovie: insert
      [expect.stringMatching(/INSERT OR IGNORE INTO movies/i), [42, "The Dark Knight", "/x.png"]],
      // upsertMovie: update with COALESCE
      [expect.stringMatching(/UPDATE movies SET title = COALESCE/i), ["The Dark Knight", "/x.png", 42]],
      // ensure user_movies row exists
      [expect.stringMatching(/INSERT OR IGNORE INTO user_movies/i), [123, 42]],
      // mark as favorite
      [expect.stringMatching(/UPDATE user_movies SET is_favorite = \?/i), [1, 123, 42]],
    ])
  );
});
