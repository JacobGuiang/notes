import userService from '@/services/user.service';
import catchAsync from '@/utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import ApiError from '@/utils/ApiError';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send(user);
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUsers();
  res.send(result);
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(Number(req.params.userId));
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserById(
    Number(req.params.userId),
    req.body
  );
  res.send(user);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUserById(Number(req.params.userId));
  res.status(StatusCodes.NO_CONTENT).send();
});

export default { createUser, getUsers, getUser, updateUser, deleteUser };
