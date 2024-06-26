import express from 'express';
import auth from '@/middlewares/auth';
import validate from '@/middlewares/validate';
import userValidation from '@/validations/user.validation';
import userController from '@/controllers/user.controller';

const router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser);

router
  .route('/me')
  .get(auth, userController.getUser)
  .patch(auth, validate(userValidation.updateUser), userController.updateUser)
  .delete(auth, userController.deleteUser);

export default router;
