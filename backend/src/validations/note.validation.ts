import { z } from 'zod';

const noteId = z.coerce.number().int().positive();

const createNote = z.object({
  body: z.object({
    content: z.string(),
  }),
});
export type CreateNoteBody = z.infer<typeof createNote.shape.body>;

const getNote = z.object({
  params: z.object({
    noteId,
  }),
});

const updateNote = z.object({
  params: z.object({
    noteId,
  }),
  body: z.object({
    content: z.string(),
  }),
});

const deleteNote = z.object({
  params: z.object({
    noteId,
  }),
});

export default { createNote, getNote, updateNote, deleteNote };
