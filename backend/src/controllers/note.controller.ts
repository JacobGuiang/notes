import catchAsync from '@/utils/catchAsync';
import { Request, Response } from 'express';
import noteService from '@/services/note.service';
import { StatusCodes } from 'http-status-codes';

const createNote = catchAsync(async (req: Request, res: Response) => {
  const note = await noteService.createNote({
    ...req.body,
    user_id: req.user!.id,
  });
  res.status(StatusCodes.CREATED).send(note);
});

const getNotes = catchAsync(async (req: Request, res: Response) => {
  const notes = await noteService.getNotesByUserId(req.user!.id);
  res.send(notes);
});

const getNote = catchAsync(
  async (req: Request<{ noteId: number }>, res: Response) => {
    const note = await noteService.getNoteByNoteIdAndUserId(
      req.params.noteId,
      req.user!.id
    );
    res.send(note);
  }
);

const updateNote = catchAsync(
  async (req: Request<{ noteId: number }>, res: Response) => {
    const note = await noteService.updateNoteByNoteIdAndUserId(
      req.params.noteId,
      req.user!.id,
      req.body
    );
    res.send(note);
  }
);

const deleteNote = catchAsync(
  async (req: Request<{ noteId: number }>, res: Response) => {
    const note = await noteService.deleteNoteByNoteIdAndUserId(
      req.params.noteId,
      req.user!.id
    );
    res.status(StatusCodes.NO_CONTENT).send(note);
  }
);

export default { createNote, getNotes, getNote, updateNote, deleteNote };
