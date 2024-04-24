import { StatusCodes } from 'http-status-codes';
import ApiError from '@/utils/ApiError';
import { NewUser, UserUpdate } from '@/types/db';
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

const getUserById = async (userId: number) => {
  return db
    .selectFrom('user')
    .select(['id', 'username'])
    .where('id', '=', userId)
    .executeTakeFirstOrThrow(() => {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    });
};

const updateUserById = async (userId: number, userUpdate: UserUpdate) => {
  if (userUpdate.username) {
    userUpdate.username = userUpdate.username.toLowerCase();
    if (
      await db
        .selectFrom('user')
        .select('id')
        .where('username', '=', userUpdate.username)
        .executeTakeFirst()
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Username already taken');
    }
  }

  if (userUpdate.password) {
    userUpdate.password = await bcrypt.hash(userUpdate.password, 8);
  }

  return db
    .updateTable('user')
    .set(userUpdate)
    .where('id', '=', userId)
    .returning(['id', 'username'])
    .executeTakeFirst();
};

const deleteUserById = (userId: number) => {
  return db
    .deleteFrom('user')
    .where('id', '=', userId)
    .returning(['id', 'username'])
    .executeTakeFirst();
};

export default {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
