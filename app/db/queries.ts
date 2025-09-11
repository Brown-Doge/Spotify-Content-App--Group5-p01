import bcrypt from 'bcryptjs';
import { getDatabase } from './schema';

async function getDb() {
  const db = await getDatabase();
  return db;
}

// User row type definition
type UserRow = {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
};

// creating a user with a hashed password 
export async function addUser(firstName: string, lastName: string, username: string, email: string, password: string) 
{
  const db = await getDb();
  // hashing password before being stored
  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = await db.runAsync(
    `INSERT INTO users (first_name, last_name, username, email, password)
     VALUES (?, ?, ?, ?, ?)`,
    [firstName, lastName, username, email, hashedPassword]
  );
  // for now to verify if user was indead created
  console.log("New user id:", result.lastInsertRowId)

}
// fetch all users
export async function getAllUsers() {
  const db = await getDb();
  return await db.getAllAsync(`SELECT user_id, first_name, last_name, username, email FROM users ORDER BY user_id DESC`);
}
// Get user by ID
export async function getUserById(userId: number) {
  const db = await getDb();
  return await db.getFirstAsync(`SELECT user_id, first_name, last_name, username, email FROM users WHERE user_id = ?`, [userId]);
}

// Will be used to verify log in
export async function verifyLogin(identifier: string, password: string) {
    const db = await getDb();
    // will find a user with either username or email
    const user = await db.getFirstAsync(`SELECT * FROM users WHERE username = ? OR email = ?`, [identifier, identifier]);
    if (!user) {
        console.log("User not found");
        return null;
    }
    // here we will compate the passwords
    const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    console.log("Invalid password");
    return null;
  }
  // omit so password is not returned
  const { password: _omit, ...verifiedUser } = user;
  console.log("User verified:", verifiedUser);
  return verifiedUser;
}
