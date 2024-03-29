import db from '@/config/db';
import { faker } from '@faker-js/faker';
import { CreateNoteBody } from '@/validations/note.validation';

const noteOne = {
  content: faker.string.alphanumeric(8),
};

const noteTwo = {
  content: faker.string.alphanumeric(8),
};

const insertNotes = async (newNote: CreateNoteBody[], userId: number) => {
  // insert notes individually instead of all at once to make updated_at different
  newNote.map(
    async (newNote) =>
      await db
        .insertInto('note')
        .values({
          content: newNote.content,
          user_id: userId,
        })
        .execute()
  );
};

export { noteOne, noteTwo, insertNotes };
