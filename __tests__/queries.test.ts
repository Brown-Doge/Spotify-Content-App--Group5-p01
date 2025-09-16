// making sure jest replaces db things with a mock

jest.mock("bcryptjs");
jest.mock("../lib/db/schema");
import bcrypt from 'bcryptjs';
import { addUser, getUserById, verifyLogin } from '../lib/db/queries';
import { getDatabase } from '../lib/db/schema';

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

            // this is the function we are testing
            await addUser("Tesing", "Dummy", "testuser101", "testing101@gmail.com", password);

            // checking if the password was hashed correctly
            expect(mockedBcrypt.hashSync).toHaveBeenCalledWith(password, 10);

            // checking if the db query was called with correct parameters
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
            // when a unique constraint fails
            mockDb.runAsync.mockRejectedValue(new Error("UNIQUE constraint failed: users.username"));

            // we expect the function to throw an error when we try to add a user with an existing username
            await expect(addUser("Test", "User", "existinguser", "testing101@gmail.com", "testPassword")
            ).rejects.toThrow("UNIQUE constraint failed: users.username");
        });
    });
    describe("verifyLogin Testing", () => {
        test("returns user data if login is successful login", async () => {
            // imaginary user data in the database
            const imaginaryUser = {
                user_id: 1,
                first_name: "Test",
                last_name: "Dummy",
                username: "TestDummy101",
                email: "testing101@gmail.com",
                password: "hashed_password"
            };
            // mock the database to return the imaginary user when queried
            mockDb.getFirstAsync.mockResolvedValue(imaginaryUser);
            mockedBcrypt.compareSync.mockReturnValue(true);

            // this is the function we are testing
            const result = await verifyLogin("TestDummy101", "hashed_password");

            // checking if the db query was called with correct parameters
            expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
                expect.stringContaining("SELECT * FROM users WHERE username = ? OR email = ?"),
                ["TestDummy101", "TestDummy101"]
            );
            expect(mockedBcrypt.compareSync).toHaveBeenCalledWith("hashed_password", imaginaryUser.password);
            // checking if the result matches the imaginary user data without the password
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
            // imaginary user data in the database 
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
            // checking if the password comparison was done correctly
            expect(result).toBeNull();
        });
        test("returns null if user is not found", async () => {
            mockDb.getFirstAsync.mockResolvedValue(null);
            const result = await verifyLogin("nonexistentuser", "any_password");
            // checking if the function returns null when user is not found
            expect(result).toBeNull();
        });
    });
    describe("getUserById Testing", () => {
        test("returns selected fields for a given user ID", async () => {
            // imaginary user data in the database
            const imaginaryUser = {
                user_id: 1,
                first_name: "Test",
                last_name: "Dummy",
                username: "TestDummy101",
                email: "testing101@gmail.com"
            };
            mockDb.getFirstAsync.mockResolvedValue(imaginaryUser);

            // getting user by ID of ID[1]
            const result = await getUserById(1);

            // checking if the db query was called with correct parameters
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