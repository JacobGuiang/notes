import express from 'express';
import auth from '@/middlewares/auth';
import validate from '@/middlewares/validate';
import noteValidation from '@/validations/note.validation';
import noteController from '@/controllers/note.controller';

const router = express.Router();

router.use(auth);

router
  .route('/')
  .post(validate(noteValidation.createNote), noteController.createNote)
  .get(noteController.getNotes);

router
  .route('/:noteId')
  .get(validate(noteValidation.getNote), noteController.getNote)
  .patch(validate(noteValidation.updateNote), noteController.updateNote)
  .delete(validate(noteValidation.deleteNote), noteController.deleteNote);

export default router;
