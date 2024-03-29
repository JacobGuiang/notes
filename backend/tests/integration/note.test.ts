import setupTestDB from '../utils/setupTestDb';
import {
  noteOne,
  noteTwo,
  insertNotes,
  userOne,
  insertUsers,
} from '../fixtures';
import app from '@/app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';
import { CreateNoteBody } from '@/validations/note.validation';
import db from '@/config/db';

setupTestDB();

describe('Note routes', () => {
  let cookie: string;
  let userId: number;

  beforeAll(async () => {
    await insertUsers([userOne]);
    const credentials = {
      username: userOne.username,
      password: userOne.password,
    };

    const loginRes = await request(app)
      .post('/auth/login')
      .send(credentials)
      .expect(StatusCodes.OK);
    cookie = loginRes.headers['set-cookie'];
    userId = loginRes.body.id;
  });

  beforeEach(async () => {
    await db.deleteFrom('note').execute();
  });

  describe('POST /users/me/notes', () => {
    let newNote: CreateNoteBody;

    beforeEach(async () => {
      newNote = {
        content: faker.string.alphanumeric(8),
      };
    });

    test('should return 201 and successfully create new note if authenticated', async () => {
      const res = await request(app)
        .post('/users/me/notes')
        .send(newNote)
        .set('Cookie', cookie)
        .expect(StatusCodes.CREATED);

      expect(res.body).toMatchObject({
        id: expect.anything(),
        content: newNote.content,
        user_id: userId,
      });

      const dbNote = await db
        .selectFrom('note')
        .selectAll()
        .where('id', '=', res.body.id)
        .executeTakeFirstOrThrow();

      expect(JSON.stringify(dbNote)).toEqual(JSON.stringify(res.body));
    });

    test('should return 401 error if not authenticated', async () => {
      const res = await request(app)
        .post('/users/me/notes')
        .send(newNote)
        .expect(StatusCodes.UNAUTHORIZED);

      expect(res.body).toEqual({
        code: StatusCodes.UNAUTHORIZED,
        message: 'Please authenticate',
      });
    });
  });

  describe('GET /users/me/notes', () => {
    test('should return 200 and correct notes', async () => {
      await insertNotes([noteOne, noteTwo], userId);

      const res = await request(app)
        .get('/users/me/notes')
        .set('Cookie', cookie)
        .expect(StatusCodes.OK);
      expect(res.body).toHaveLength(2);

      const dbNoteTwo = await db
        .selectFrom('note')
        .selectAll()
        .where('content', '=', noteTwo.content)
        .executeTakeFirstOrThrow();
      expect(JSON.stringify(res.body[0])).toEqual(JSON.stringify(dbNoteTwo));
    });

    test('should return 401 error if not authenticated', async () => {
      const res = await request(app)
        .get('/users/me/notes')
        .expect(StatusCodes.UNAUTHORIZED);

      expect(res.body).toEqual({
        code: StatusCodes.UNAUTHORIZED,
        message: 'Please authenticate',
      });
    });
  });
});
