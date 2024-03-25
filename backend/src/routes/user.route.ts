import express from 'express';
import validate from '@/middlewares/validate';
import userValidation from '@/validations/user.validation';
import { userController } from '@/controllers';

const router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser);

// TODO
// NEED AUTH FIRST
// router
//   .route('/me')
//   .get(auth, validate(userValidation.getUser), userController.getUser)
//   .patch(auth, validate(userValidation.updateUser), userController.updateUser)
//   .delete(auth, validate(userValidation.deleteUser), userController.deleteUser);

export default router;
