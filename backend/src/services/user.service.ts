import { StatusCodes } from 'http-status-codes';
import postgres from '@/config/postgres';
import ApiError from '@/utils/ApiError';
import format from 'pg-format';

interface userBody {
  username: string;
  password: string;
}

const createUser = async (userBody: userBody) => {
  userBody.username = userBody.username.toLowerCase();

  let res = await postgres.query(
    format('SELECT * FROM users WHERE username = %L', userBody.username)
  );

  if (res.rows.length > 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Username already taken');
  }

  res = await postgres.query(
    format(
      'INSERT (%L) INTO users VALUES (%L)',
      Object.keys(userBody),
      Object.values(userBody)
    )
  );

  return res.rows[0];
};
