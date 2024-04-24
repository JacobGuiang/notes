import userService from '@/services/user.service';
import catchAsync from '@/utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send(user);
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user!.id);
  res.send(user);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserById(req.user!.id, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.deleteUserById(req.user!.id);
  res.status(StatusCodes.NO_CONTENT).send(user);
});

export default { createUser, getUser, updateUser, deleteUser };
