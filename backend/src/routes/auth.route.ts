import express from 'express';
import validate from '@/middlewares/validate';
import authValidation from '@/validations/auth.validation';
import userValidation from '@/validations/user.validation';
import authController from '@/controllers/auth.controller';

const router = express.Router();

router.post(
  '/register',
  validate(userValidation.createUser),
  authController.register
);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', authController.logout);

export default router;
