import request from 'supertest';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import app from '@/app';
import setupTestDB from '../utils/setupTestDb';
import getCookie from '../utils/getCookie';
import { userOne, insertUsers } from '../fixtures/user.fixture';
import { NewUser, User } from '@/types/db';
import db from '@/config/db';

setupTestDB();

describe('User routes', () => {
  beforeEach(async () => {
    await db.deleteFrom('user').execute();
  });

  describe('POST /users', () => {
    let newUser: NewUser;

    beforeEach(async () => {
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
      await insertUsers([userOne]);
      const credentials = {
        username: userOne.username,
        password: userOne.password,
      };

      const res = await request(app)
        .get('/users/me')
        .set('Cookie', await getCookie(credentials))
        .expect(200);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: expect.anything(),
        username: userOne.username.toLowerCase(),
      });
    });

    test('should return 401 error if not authenticated', async () => {
      const res = await request(app)
        .get('/users/me')
        .expect(StatusCodes.UNAUTHORIZED);

      // expect token cookie to be cleared
      const tokenCookie = res.headers['set-cookie'][0];
      expect(tokenCookie.startsWith('token=;')).toBe(true);
    });
  });

  describe('PATCH /users/me', () => {
    let cookie: string;

    beforeEach(async () => {
      await insertUsers([userOne]);
      const credentials = {
        username: userOne.username,
        password: userOne.password,
      };
      cookie = await getCookie(credentials);
    });

    test('should return 200 and successfully update user if data is ok', async () => {
      const userUpdate = {
        username: faker.string.alphanumeric(8),
        password: 'newPassword1!',
      };

      const res = await request(app)
        .patch('/users/me')
        .send(userUpdate)
        .set('Cookie', cookie)
        .expect(200);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: expect.anything(),
        username: userUpdate.username.toLowerCase(),
      });

      const dbUser = await db
        .selectFrom('user')
        .selectAll()
        .where('id', '=', res.body.id)
        .executeTakeFirstOrThrow();

      expect(dbUser.password).not.toBe(userOne.password);
      expect(dbUser.username).toBe(userUpdate.username.toLowerCase());
    });

    describe('should not update user in DB on error', () => {
      let dbUserBefore: User;

      beforeEach(async () => {
        dbUserBefore = await db
          .selectFrom('user')
          .selectAll()
          .where('username', '=', userOne.username.toLowerCase())
          .executeTakeFirstOrThrow();
      });

      afterEach(async () => {
        const dbUserAfter = await db
          .selectFrom('user')
          .selectAll()
          .where('username', '=', userOne.username.toLowerCase())
          .executeTakeFirstOrThrow();
        expect(dbUserBefore).toEqual(dbUserAfter);
      });

      test('should return 400 error if username is invalid', async () => {
        const userUpdate = { username: 'invalid user name' };

        await request(app)
          .patch('/users/me')
          .send(userUpdate)
          .set('Cookie', cookie)
          .expect(StatusCodes.BAD_REQUEST);
      });

      test('should return 400 error if username is already used', async () => {
        const userUpdate = { username: userOne.username };

        await request(app)
          .patch('/users/me')
          .send(userUpdate)
          .set('Cookie', cookie)
          .expect(StatusCodes.BAD_REQUEST);
      });

      test('should return 400 error if password length is less than 8 characters', async () => {
        const userUpdate = { password: 'Passw1!' };

        await request(app)
          .patch('/users/me')
          .send(userUpdate)
          .set('Cookie', cookie)
          .expect(StatusCodes.BAD_REQUEST);
      });

      test('should return 400 error if password does not have lower and uppercase letter, number, and symbol', async () => {
        const userUpdate = {
          password: 'password',
        };

        await request(app)
          .patch('/users/me')
          .send(userUpdate)
          .set('Cookie', cookie)
          .expect(StatusCodes.BAD_REQUEST);
      });

      test('should return 400 error if username and password not provided', async () => {
        await request(app)
          .patch('/users/me')
          .send({})
          .set('Cookie', cookie)
          .expect(StatusCodes.BAD_REQUEST);
      });

      test('should return 401 error if not authenticated', async () => {
        const userUpdate = {
          username: faker.string.alphanumeric(8),
          password: 'newPassword1!',
        };

        const res = await request(app)
          .patch('/users/me')
          .send(userUpdate)
          .expect(StatusCodes.UNAUTHORIZED);

        // expect token cookie to be cleared
        const tokenCookie = res.headers['set-cookie'][0];
        expect(tokenCookie.startsWith('token=;')).toBe(true);
      });
    });
  });

  describe('DELETE /users/me', () => {
    let newUser: NewUser;

    beforeEach(async () => {
      newUser = {
        username: faker.string.alphanumeric(8),
        password: 'Password1!',
      };
      await insertUsers([newUser]);
    });

    test('should return 204 and delete user if authenticated', async () => {
      const credentials = {
        username: newUser.username,
        password: newUser.password,
      };

      await request(app)
        .delete('/users/me')
        .set('Cookie', await getCookie(credentials))
        .expect(StatusCodes.NO_CONTENT);

      const dbUser = await db
        .selectFrom('user')
        .selectAll()
        .where('username', '=', newUser.username.toLowerCase())
        .executeTakeFirst();
      expect(dbUser).toBeUndefined();
    });

    test('should return 401 error if not authenticated', async () => {
      const res = await request(app)
        .delete('/users/me')
        .expect(StatusCodes.UNAUTHORIZED);

      const dbUser = await db
        .selectFrom('user')
        .selectAll()
        .where('username', '=', newUser.username.toLowerCase())
        .executeTakeFirst();
      expect(dbUser).toBeDefined();

      // expect token cookie to be cleared
      const tokenCookie = res.headers['set-cookie'][0];
      expect(tokenCookie.startsWith('token=;')).toBe(true);
    });
  });
});
