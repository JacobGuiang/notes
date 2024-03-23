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

  // describe('GET /user', () => {
  //   test('should return 200', async () => {
  //     await insertUsers([userOne, userTwo]);

  //     const res = await request(app).get('/users').send().expect(StatusCodes.OK);

  //     expect(res.body).toEqual(expect.any(Array));
  //     expect(res.body).toHaveLength(2);
  //     expect(res.body[0].username).toBe(userOne.username.toLowerCase());
  //   });
  // });

  // describe('GET /user/:userId', () => {
  //   test('should return 200 and the user object if data is ok', async () => {
  //     await insertUsers([userOne]);

  //     const dbUserOne = await db
  //       .selectFrom('user')
  //       .select('id')
  //       .where('username', '=', userOne.username.toLowerCase())
  //       .executeTakeFirstOrThrow();
  //     const userOneId = dbUserOne.id;

  //     const res = await request(app)
  //       .get(`/user/${userOneId}`)
  //       .send()
  //       .expect(StatusCodes.OK);

  //     expect(res.body).not.toHaveProperty('password');
  //     expect(res.body).toEqual({
  //       id: expect.anything(),
  //       username: userOne.username.toLowerCase(),
  //     });
  //   });
  // });
});
