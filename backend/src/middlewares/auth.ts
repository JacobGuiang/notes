import config from '@/config/config';
import ApiError from '@/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'please authenticate');
  }
  jwt.verify(token as string, config.jwtSecret, (err, decoded) => {
    if (err) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'please authenticate');
    }
    const { user } = decoded as JwtPayload;
    req.user = user;
  });
  next();
};

export default auth;
