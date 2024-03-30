import db from '@/config/db';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { NewUser } from '@/types/db';

const password = 'Password1!';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  username: faker.string.alphanumeric(8),
  password,
};

const userTwo = {
  username: faker.string.alphanumeric(8),
  password,
};

const insertUsers = async (newUsers: NewUser[]) => {
  await db
    .insertInto('user')
    .values(
      newUsers.map((newUser) => ({
        username: newUser.username.toLowerCase(),
        password: hashedPassword,
      }))
    )
    .execute();
};

export { userOne, userTwo, insertUsers, hashedPassword };
