import express from 'express';
import userRouter from './user.route';

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

export default router;
