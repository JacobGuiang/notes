import express from 'express';
import userRouter from './user.route';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/users',
    router: userRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

router.get('/', (_req, res) => {
  res.status(StatusCodes.OK).end();
});

export default router;
