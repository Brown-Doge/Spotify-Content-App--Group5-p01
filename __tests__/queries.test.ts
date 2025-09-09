// making sure jest replaces db things with a mock

jest.mock("bcryptjs");
jest.mock("../app/db/schema");
import bcrypt from 'bcryptjs';
import { addUser, getUserById, verifyLogin } from '../app/db/queries';
import { getDatabase } from '../app/db/schema';

const mockedGetDatabase = getDatabase as jest.MockedFunction<typeof getDatabase>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('Database Query Functions TEsts', () => {
    const mockDb = {
        runAsync: jest.fn(),
        getFirstAsync: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockedGetDatabase.mockResolvedValue(mockDb as any);
    });

    describe(" addUser TEsting", () => {
        test("inster a new user and hash entered password", async () => {
            const password = "testPassword";
            const hashedPassword = "hashed_password";
            mockedBcrypt.hashSync.mockReturnValue(hashedPassword);
            mockDb.runAsync.mockResolvedValue({ lastInsertRowId: 1 });

            await addUser("Tesing", "Dummy", "testuser101", "testing101@gmail.com", password);

            expect(mockedBcrypt.hashSync).toHaveBeenCalledWith(password, 10);

            expect(mockDb.runAsync).toHaveBeenCalledWith(
                expect.stringContaining("INSERT INTO users"),
                expect.arrayContaining([
                    "Tesing",
                    "Dummy",
                    "testuser101",
                    "testing101@gmail.com",
                    hashedPassword
                ])
            );
        });

        it("adding a user fails if username or email already exists", async () => {
            mockedBcrypt.hashSync.mockReturnValue("hashed_password");
            mockDb.runAsync.mockRejectedValue(new Error("UNIQUE constraint failed: users.username"));

            await expect(addUser("Test", "User", "existinguser", "testing101@gmail.com", "testPassword")
            ).rejects.toThrow("UNIQUE constraint failed: users.username");
        });
    });
    describe("verifyLogin Testing", () => {
        test("returns user data if login is successful login", async () => {
            const imaginaryUser = {
                user_id: 1,
                first_name: "Test",
                last_name: "Dummy",
                username: "TestDummy101",
                email: "testing101@gmail.com",
                password: "hashed_password"
            };
            mockDb.getFirstAsync.mockResolvedValue(imaginaryUser);
            mockedBcrypt.compareSync.mockReturnValue(true);

            const result = await verifyLogin("TestDummy101", "hashed_password");

            expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
                expect.stringContaining("SELECT * FROM users WHERE username = ? OR email = ?"),
                ["TestDummy101", "TestDummy101"]
            );
            expect(mockedBcrypt.compareSync).toHaveBeenCalledWith("hashed_password", imaginaryUser.password);
            expect(result).toMatchObject({
                user_id: 1,
                first_name: "Test",
                last_name: "Dummy",
                username: "TestDummy101",
                email: "testing101@gmail.com"
            });
            expect(result).not.toHaveProperty("password");
        });
        test("returns null if password is incorrect", async () => {
            mockDb.getFirstAsync.mockResolvedValue({
                user_id: 1,
                first_name: "Test",
                last_name: "Dummy",
                username: "TestDummy101",
                email: "testing101@gmail.com",
                password: "hashed_password"
            });
            mockedBcrypt.compareSync.mockReturnValue(false);
            const result = await verifyLogin("TestDummy101", "wrong_password");
            expect(result).toBeNull();
        });
        test("returns null if user is not found", async () => {
            mockDb.getFirstAsync.mockResolvedValue(null);
            const result = await verifyLogin("nonexistentuser", "any_password");
            expect(result).toBeNull();
        });
    });
    describe("getUserById Testing", () => {
        test("returns selected fields for a given user ID", async () => {
            const imaginaryUser = {
                user_id: 1,
                first_name: "Test",
                last_name: "Dummy",
                username: "TestDummy101",
                email: "testing101@gmail.com"
            };
            mockDb.getFirstAsync.mockResolvedValue(imaginaryUser);

            const result = await getUserById(1);

            expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
                expect.stringContaining("SELECT user_id, first_name, last_name, username, email FROM users WHERE user_id = ?"),
                [1]
            );
            expect(result).toMatchObject(imaginaryUser);
            // ensuring password is not included
            expect(result).not.toHaveProperty("password");
        });
        test("returns null if user ID does not exist", async () => {
            mockDb.getFirstAsync.mockResolvedValue(null);
            const result = await getUserById(1234556678);
            expect(result).toBeNull();
        });
  });
});