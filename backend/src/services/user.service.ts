import { StatusCodes } from 'http-status-codes';
import ApiError from '@/utils/ApiError';
import { NewUser } from '@/types/db';
import db from '@/config/db';
import bcrypt from 'bcryptjs';

const createUser = async (user: NewUser) => {
  if (
    await db
      .selectFrom('user')
      .select('id')
      .where('username', '=', user.username)
      .executeTakeFirst()
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Username already taken');
  }

  user.password = await bcrypt.hash(user.password, 8);

  return db
    .insertInto('user')
    .values(user)
    .returning(['id', 'username'])
    .executeTakeFirstOrThrow();
};

// const getUsers = async () => {
//   return db.selectFrom('user').select(['id', 'username']).execute();
// };

// const getUserById = async (userId: number) => {
//   return db
//     .selectFrom('user')
//     .select(['id', 'username'])
//     .where('id', '=', userId)
//     .executeTakeFirst();
// };

// const getUserByUsername = async (username: string) => {
//   return db
//     .selectFrom('user')
//     .select(['id', 'username'])
//     .where('username', '=', username.toLowerCase())
//     .executeTakeFirst();
// };

// const updateUserById = async (userId: number, userUpdate: UserUpdate) => {
//   const user = await getUserById(userId);

//   if (!user) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
//   }

//   if (userUpdate.username) {
//     userUpdate.username = userUpdate.username.toLowerCase();
//     if (
//       await db
//         .selectFrom('user')
//         .select('id')
//         .where('username', '=', userUpdate.username)
//         .executeTakeFirst()
//     ) {
//       throw new ApiError(StatusCodes.BAD_REQUEST, 'Username already taken');
//     }
//   }

//   if (userUpdate.password) {
//     userUpdate.password = await bcrypt.hash(userUpdate.password, 8);
//   }

//   return db
//     .updateTable('user')
//     .set(userUpdate)
//     .where('id', '=', userId)
//     .returning(['id', 'username'])
//     .executeTakeFirst();
// };

// const deleteUserById = async (userId: number) => {
//   const user = await getUserById(userId);

//   if (!user) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
//   }

//   return db
//     .deleteFrom('user')
//     .where('id', '=', userId)
//     .returning(['id', 'username'])
//     .executeTakeFirst();
// };

export default {
  createUser,
  // getUsers,
  // getUserById,
  // getUserByUsername,
  // updateUserById,
  // deleteUserById,
};
