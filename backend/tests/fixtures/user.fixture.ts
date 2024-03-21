import db from '@/config/db';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { User } from '@/types/db';

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

const insertUsers = async (users: User[]) => {
  await db
    .insertInto('user')
    .values(users.map((user) => ({ ...user, password: hashedPassword })))
    .execute();
};

export { userOne, userTwo, insertUsers };
