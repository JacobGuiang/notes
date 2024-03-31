import setupTestDB from '../utils/setupTestDb';
import getCookie from '../utils/getCookie';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import app from '@/app';
import { StatusCodes } from 'http-status-codes';
import { NewUser } from '@/types/db';
import db from '@/config/db';
import { userOne, insertUsers } from '../fixtures/user.fixture';

setupTestDB();

describe('Auth routes', () => {
  beforeEach(async () => {
    await db.deleteFrom('user').execute();
  });

  describe('POST /auth/register', () => {
    let newUser: NewUser;
    beforeEach(() => {
      newUser = {
        username: faker.string.alphanumeric(8),
        password: 'Password1!',
      };
    });

    test('should return 201 and successfully register user if data is ok', async () => {
      const res = await request(app)
        .post('/auth/register')
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
        .post('/auth/register')
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
        .post('/auth/register')
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
        .post('/auth/register')
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
        .post('/auth/register')
        .send(newUser)
        .expect(StatusCodes.BAD_REQUEST);

      newUser.password = '1111111';

      await request(app)
        .post('/auth/register')
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

  describe('POST /auth/login', () => {
    test('should return 200 and login user if username and password match', async () => {
      await insertUsers([userOne]);
      const credentials = {
        username: userOne.username,
        password: userOne.password,
      };

      const res = await request(app)
        .post('/auth/login')
        .send(credentials)
        .expect(StatusCodes.OK);

      expect(res.body).toEqual({
        id: expect.anything(),
        username: userOne.username.toLowerCase(),
      });

      const cookies = res.get('Set-Cookie');
      expect(cookies).toBeDefined();
      expect(cookies![0].startsWith('token=s%3')).toBe(true);
    });

    test('should return 401 error if there are no users with that username', async () => {
      const credentials = {
        username: userOne.username,
        password: userOne.password,
      };

      const res = await request(app)
        .post('/auth/login')
        .send(credentials)
        .expect(StatusCodes.UNAUTHORIZED);

      // expect token cookie to be cleared
      const tokenCookie = res.headers['set-cookie'][0];
      expect(tokenCookie.startsWith('token=;')).toBe(true);
    });

    test('should return 401 error if password is wrong', async () => {
      await insertUsers([userOne]);
      const credentials = {
        username: userOne.username,
        password: 'wrongPassword1!',
      };

      const res = await request(app)
        .post('/auth/login')
        .send(credentials)
        .expect(StatusCodes.UNAUTHORIZED);

      // expect token cookie to be cleared
      const tokenCookie = res.headers['set-cookie'][0];
      expect(tokenCookie.startsWith('token=;')).toBe(true);
    });
  });

  describe('POST /auth/logout', () => {
    test('should return 204 and clear token cookie', async () => {
      await insertUsers([userOne]);
      const credentials = {
        username: userOne.username,
        password: userOne.password,
      };

      const cookie = await getCookie(credentials);

      const res = await request(app)
        .post('/auth/logout')
        .set('Cookie', cookie)
        .expect(StatusCodes.NO_CONTENT);

      // expect token cookie to be cleared after logout
      expect(res.headers['set-cookie'][0]).not.toEqual(cookie[0]);
      expect(res.headers['set-cookie'][0].startsWith('token=;')).toBe(true);
    });
  });
});
