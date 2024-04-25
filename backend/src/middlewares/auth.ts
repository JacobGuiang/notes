import config from '@/config/config';
import ApiError from '@/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const auth = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate');
  }
  jwt.verify(token as string, config.jwtSecret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token expired');
      }
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate');
    }
    const { user } = decoded as JwtPayload;
    req.user = user;
  });
  next();
};

export default auth;
