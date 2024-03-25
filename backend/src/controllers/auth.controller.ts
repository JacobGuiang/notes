import { StatusCodes } from 'http-status-codes';
import catchAsync from '@/utils/catchAsync';
import { authService, userService } from '@/services';
import { Request, Response } from 'express';

const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send({ user });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await authService.login(username, password);
  res.send({ user });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout();
  res.status(StatusCodes.NO_CONTENT).send();
});

export default { register, login, logout };
