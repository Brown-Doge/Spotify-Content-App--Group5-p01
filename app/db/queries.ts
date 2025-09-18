import bcrypt from 'bcryptjs';
import { getDb } from "./db";

bcrypt.setRandomFallback((len: number) => {
  const array: number[] = [];
  for (let i = 0; i < len; i++) {
    array.push(Math.floor(Math.random() * 256));
  }
  return array;
});

// User row type definition
type UserRow = {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
};

// public user data without sensitive fields
type PublicUserRow = Omit<UserRow, 'password'>;

// create a user with a hashed password
export async function addUser(
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string
): Promise<void> {
  const db = await getDb();
  // hashing password before storing
  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = await db.runAsync(
    `INSERT INTO users (first_name, last_name, username, email, password)
     VALUES (?, ?, ?, ?, ?)`,
    [firstName, lastName, username, email, hashedPassword]
  );
  // for now to verify if user was indead created
  console.log('New user id:', result.lastInsertRowId);
}

// fetch all users (without passwords)
export async function getAllUsers(): Promise<PublicUserRow[]> {
  const db = await getDb();
  return await db.getAllAsync(
    `SELECT user_id, first_name, last_name, username, email FROM users ORDER BY user_id DESC`
  );
}

// get user by ID (without password)
export async function getUserById(userId: number): Promise<PublicUserRow | null> {
  const db = await getDb();
  return await db.getFirstAsync(
    `SELECT user_id, first_name, last_name, username, email FROM users WHERE user_id = ?`,
    [userId]
  );
}

// verify login by username or email
export async function verifyLogin(
  identifier: string,
  password: string
): Promise<PublicUserRow | null> {
  const db = await getDb();
  // find a user with either username or email
  const user = (await db.getFirstAsync(
    `SELECT * FROM users WHERE username = ? OR email = ?`,
    [identifier, identifier]
  )) as UserRow | null;
  if (!user) {
    console.log('User not found');
    return null;
  }
  // compare passwords
  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    console.log('Invalid password');
    return null;
  }
  // omit password from returned user
  const { password: _omit, ...verifiedUser } = user;
  console.log('User verified:', verifiedUser);
  return verifiedUser as PublicUserRow;
}
