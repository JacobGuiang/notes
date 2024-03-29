import userService from '@/services/user.service';
import catchAsync from '@/utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send(user);
});

const getUser = (req: Request, res: Response) => {
  res.send(req.user);
};

export default { createUser, getUser };
