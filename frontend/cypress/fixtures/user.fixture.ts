import { faker } from '@faker-js/faker';

const password = 'Password1!';

export const userOne = {
  username: faker.string.alphanumeric(8),
  password,
};

export const userTwo = {
  username: faker.string.alphanumeric(8),
  password,
};
