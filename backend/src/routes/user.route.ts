import express from 'express';
import validate from '@/middlewares/validate';
import userValidation from '@/validations/user.validation';
import userController from '@/controllers/user.controller';

const router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(userController.getUsers);

router
  .route('/:userId')
  .get(validate(userValidation.getUser), userController.getUser)
  .patch(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser);

export default router;
