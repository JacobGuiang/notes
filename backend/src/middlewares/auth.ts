import config from '@/config/config';
import { ApiError } from '@/utils';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';

interface IDecoded {
  userId: number;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = cookieParser.signedCookie('token', config.cookieSecret);
  if (!token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate');
  }
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      res.clearCookie('token');
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate');
    }
    req.user = decoded as IDecoded;
  });
  next();
};

export default auth;
