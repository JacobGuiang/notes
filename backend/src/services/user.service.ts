import { StatusCodes } from 'http-status-codes';
import ApiError from '@/utils/ApiError';
import { NewUser } from '@/types/db';
import { db } from '@/config/db';

const createUser = async (user: NewUser) => {
  user.username = user.username.toLowerCase();

  if (
    await db
      .selectFrom('user')
      .selectAll()
      .where('username', '=', user.username)
      .executeTakeFirst()
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Username already taken');
  }

  return db
    .insertInto('user')
    .values(user)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export default { createUser };
