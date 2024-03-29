import express from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import noteRouter from './note.route';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/users',
    router: userRouter,
  },
  {
    path: '/users/me/notes',
    router: noteRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

router.get('/', (_req, res) => {
  res.status(StatusCodes.OK).end();
});

export default router;
