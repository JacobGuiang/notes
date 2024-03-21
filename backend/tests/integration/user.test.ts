import request from 'supertest';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import app from '@/app';
import setupTestDB from '../utils/setupTestDb';
import { userOne, userTwo, insertUsers } from '../fixtures/user.fixture';
import { NewUser } from '@/types/db';
import db from '@/config/db';

setupTestDB();

describe('User routes', () => {
  describe('POST /users', () => {
    let newUser: NewUser;

    beforeEach(() => {
      newUser = {
        username: faker.string.alphanumeric(8),
        password: 'Password1!',
      };
    });

    test('should return 201 and successfully create new user if data is ok', async () => {
      const res = await request(app)
        .post('/user')
        .send(newUser)
        .expect(StatusCodes.CREATED);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: expect.anything(),
        username: newUser.username.toLowerCase(),
      });

      const dbUser = await db
        .selectFrom('user')
        .selectAll()
        .where('id', '=', res.body.id)
        .executeTakeFirstOrThrow();
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser.username).toBe(newUser.username.toLowerCase());
    });
  });
});
