import setupTestDB from '../utils/setupTestDb';
import { noteOne, noteTwo, insertNotes } from '../fixtures/note.fixture';
import { userOne, insertUsers } from '../fixtures/user.fixture';
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

    const res = await request(app)
      .post('/auth/login')
      .send(credentials)
      .expect(StatusCodes.OK);
    cookie = res.headers['set-cookie'];
    userId = res.body.id;
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

      // expect token cookie to be cleared
      const tokenCookie = res.headers['set-cookie'][0];
      expect(tokenCookie.startsWith('token=;')).toBe(true);
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

      // expect token cookie to be cleared
      const tokenCookie = res.headers['set-cookie'][0];
      expect(tokenCookie.startsWith('token=;')).toBe(true);
    });
  });

  describe('', () => {
    let noteId: number;

    beforeEach(async () => {
      await insertNotes([noteOne], userId);

      const dbNote = await db
        .selectFrom('note')
        .select('id')
        .where('content', '=', noteOne.content)
        .executeTakeFirstOrThrow();
      noteId = dbNote.id;
    });

    describe('GET /users/me/notes/:noteId', () => {
      test('should return 200', async () => {
        const dbNote = await db
          .selectFrom('note')
          .selectAll()
          .where('id', '=', noteId)
          .executeTakeFirstOrThrow();

        const res = await request(app)
          .get(`/users/me/notes/${noteId}`)
          .set('Cookie', cookie)
          .expect(StatusCodes.OK);

        expect(JSON.stringify(dbNote)).toEqual(JSON.stringify(res.body));
      });

      test('should return 401 error if not authenticated', async () => {
        const res = await request(app)
          .get(`/users/me/notes/${noteId}`)
          .expect(StatusCodes.UNAUTHORIZED);

        // expect token cookie to be cleared
        const tokenCookie = res.headers['set-cookie'][0];
        expect(tokenCookie.startsWith('token=;')).toBe(true);
      });
    });

    describe('PATCH /users/me/notes/:noteId', () => {
      test('should return 200 and successfully update note if authenticated', async () => {
        const noteUpdate = {
          content: faker.string.alphanumeric(8),
        };

        const res = await request(app)
          .patch(`/users/me/notes/${noteId}`)
          .send(noteUpdate)
          .set('Cookie', cookie);

        const dbNote = await db
          .selectFrom('note')
          .selectAll()
          .where('id', '=', noteId)
          .executeTakeFirstOrThrow();

        expect(JSON.stringify(dbNote)).toEqual(JSON.stringify(res.body));
      });

      test('should return 401 error if not authenticated', async () => {
        const noteUpdate = {
          content: faker.string.alphanumeric(8),
        };

        const res = await request(app)
          .patch(`/users/me/notes/${noteId}`)
          .send(noteUpdate)
          .expect(StatusCodes.UNAUTHORIZED);

        const dbNote = await db
          .selectFrom('note')
          .selectAll()
          .where('id', '=', noteId)
          .executeTakeFirstOrThrow();
        expect(dbNote.content).toEqual(noteOne.content);

        // expect token cookie to be cleared
        const tokenCookie = res.headers['set-cookie'][0];
        expect(tokenCookie.startsWith('token=;')).toBe(true);
      });
    });

    describe('DELETE /users/me/notes/:noteId', () => {
      test('should return 204 and delete note if authenticated', async () => {
        await request(app)
          .delete(`/users/me/notes/${noteId}`)
          .set('Cookie', cookie)
          .expect(StatusCodes.NO_CONTENT);

        const dbNote = await db
          .selectFrom('note')
          .selectAll()
          .where('id', '=', noteId)
          .executeTakeFirst();
        expect(dbNote).toBeUndefined();
      });

      test('should return 401 error if not authenticated', async () => {
        const res = await request(app)
          .delete(`/users/me/notes/${noteId}`)
          .expect(StatusCodes.UNAUTHORIZED);

        const dbNote = await db
          .selectFrom('note')
          .selectAll()
          .where('id', '=', noteId)
          .executeTakeFirst();
        expect(dbNote).toBeDefined();

        // expect token cookie to be cleared
        const tokenCookie = res.headers['set-cookie'][0];
        expect(tokenCookie.startsWith('token=;')).toBe(true);
      });
    });
  });
});
