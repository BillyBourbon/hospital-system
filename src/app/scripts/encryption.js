import bcrpyt from 'bcryptjs';
import { dbGet } from './database.js';

// Hashes a plaintext password to compare with the database
const hashPassword = async (plainTextPassword, saltRounds = 12) => {
  const salt = await bcrpyt.genSalt(saltRounds);
  const hash = await bcrpyt.hash(plainTextPassword, salt);
  return hash;
};

// Verifies if a users email matches the database. returns a status and a user object where successful
const verifyUsersPassword = async ({
  email,
  roleId,
  plainTextPassword,
  userId,
}) => {
  let query;
  if (email && roleId)
    query = `select UserID, RoleID, Password from users Where Email = '${email}' AND RoleID = ${roleId}`;
  if (userId)
    query = `select UserID, RoleID, Password from users Where UserID = '${userId}'`;
  // Console.log(query)
  const { rows } = await dbGet(query);
  // Console.log(rows)
  if (rows.length === 0) return { status: false, message: 'No Account Found' };

  // Console.log(rows[0])

  const { Password: hash, UserID } = rows[0];

  const user = {
    id: UserID,
    role: roleId,
    email: email,
  };

  if (await bcrpyt.compare(plainTextPassword, hash)) {
    return { status: true, user: user };
  } else return { status: false, message: 'Incorrect Credentials' };
};

export { hashPassword, verifyUsersPassword };
