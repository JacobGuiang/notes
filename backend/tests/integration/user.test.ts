import request from 'supertest';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import app from '@/app';
import setupTestDB from '../utils/setupTestDb';
import { userOne, insertUsers } from '../fixtures/user.fixture';
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
        .post('/users')
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

    test('should return 400 error if username is invalid', async () => {
      newUser.username = 'invalid user name';

      await request(app)
        .post('/users')
        .send(newUser)
        .expect(StatusCodes.BAD_REQUEST);

      const dbUser = await db
        .selectFrom('user')
        .selectAll()
        .where('username', '=', newUser.username.toLowerCase())
        .executeTakeFirst();
      expect(dbUser).toBeUndefined();
    });

    test('should return 400 error if username is already used', async () => {
      await insertUsers([userOne]);
      newUser.username = userOne.username;

      await request(app)
        .post('/users')
        .send(newUser)
        .expect(StatusCodes.BAD_REQUEST);

      const dbUser = await db
        .selectFrom('user')
        .selectAll()
        .where('username', '=', newUser.username.toLowerCase())
        .execute();
      expect(dbUser.length).toBe(1);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      newUser.password = 'Passw1!';

      await request(app)
        .post('/users')
        .send(newUser)
        .expect(StatusCodes.BAD_REQUEST);

      const dbUser = await db
        .selectFrom('user')
        .selectAll()
        .where('username', '=', newUser.username.toLowerCase())
        .executeTakeFirst();
      expect(dbUser).toBeUndefined();
    });

    test('should return 400 error if password does not have lower and uppercase letter, number, and symbol', async () => {
      newUser.password = 'password';

      await request(app)
        .post('/users')
        .send(newUser)
        .expect(StatusCodes.BAD_REQUEST);

      newUser.password = '1111111';

      await request(app)
        .post('/users')
        .send(newUser)
        .expect(StatusCodes.BAD_REQUEST);

      const dbUser = await db
        .selectFrom('user')
        .selectAll()
        .where('username', '=', newUser.username.toLowerCase())
        .executeTakeFirst();
      expect(dbUser).toBeUndefined();
    });
  });

  describe('GET /users/me', () => {
    test('should return 200 if authenticated', async () => {
      insertUsers([userOne]);
      const credentials = {
        username: userOne.username,
        password: userOne.password,
      };

      const loginRes = await request(app)
        .post('/auth/login')
        .send(credentials)
        .expect(StatusCodes.OK);
      const cookie = loginRes.headers['set-cookie'];

      const userRes = await request(app)
        .get('/users/me')
        .set('Cookie', cookie)
        .expect(200);

      expect(userRes.body).not.toHaveProperty('password');
      expect(userRes.body).toEqual({
        id: expect.anything(),
        username: userOne.username.toLowerCase(),
      });
    });

    test('should return 401 error if not authenticated', async () => {
      const res = await request(app)
        .get('/users/me')
        .expect(StatusCodes.UNAUTHORIZED);

      expect(res.body).toEqual({
        code: StatusCodes.UNAUTHORIZED,
        message: 'Please authenticate',
      });

      // expect token cookie to be cleared
      const tokenCookie = res.headers['set-cookie'][0];
      expect(tokenCookie.startsWith('token=;')).toBe(true);
    });
  });
});
