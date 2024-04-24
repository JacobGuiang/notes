import { StatusCodes } from 'http-status-codes';
import catchAsync from '@/utils/catchAsync';
import authService from '@/services/auth.service';
import userService from '@/services/user.service';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@/config/config';

const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send(user);
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await authService.login(username, password);
  const token = jwt.sign(
    { user: { id: user.id, username: user.username } },
    config.jwtSecret,
    {
      expiresIn: '1h',
    }
  );
  res.cookie('token', token, config.cookieOptions);
  res.send(user);
});

const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie('token', { ...config.cookieOptions, signed: false });
  res.status(StatusCodes.NO_CONTENT).send();
});

export default { register, login, logout };
