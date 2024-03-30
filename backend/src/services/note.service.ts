import { NewNote, NoteUpdate } from '@/types/db';
import db from '@/config/db';
import ApiError from '@/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { sql } from 'kysely';

const createNote = async (note: NewNote) => {
  return db
    .insertInto('note')
    .values({ ...note })
    .returningAll()
    .executeTakeFirstOrThrow();
};

const getNotesByUserId = async (userId: number) => {
  return db
    .selectFrom('note')
    .selectAll()
    .where('user_id', '=', userId)
    .orderBy('updated_at', 'desc')
    .execute();
};

const getNoteByNoteIdAndUserId = async (noteId: number, userId: number) => {
  return db
    .selectFrom('note')
    .selectAll()
    .where('id', '=', noteId)
    .where('user_id', '=', userId)
    .executeTakeFirst();
};

const updateNoteByNoteIdAndUserId = async (
  noteId: number,
  userId: number,
  noteUpdate: NoteUpdate
) => {
  const note = await getNoteByNoteIdAndUserId(noteId, userId);

  if (!note) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'note not found');
  }

  noteUpdate.updated_at = sql`now()`;
  Object.assign(note, noteUpdate);

  return db
    .updateTable('note')
    .set(note)
    .where('id', '=', noteId)
    .where('user_id', '=', userId)
    .returningAll()
    .executeTakeFirstOrThrow();
};

const deleteNoteByNoteIdAndUserId = async (noteId: number, userId: number) => {
  const note = await getNoteByNoteIdAndUserId(noteId, userId);

  if (!note) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'note not found');
  }

  return db
    .deleteFrom('note')
    .where('id', '=', noteId)
    .where('user_id', '=', userId)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export default {
  createNote,
  getNotesByUserId,
  getNoteByNoteIdAndUserId,
  updateNoteByNoteIdAndUserId,
  deleteNoteByNoteIdAndUserId,
};
