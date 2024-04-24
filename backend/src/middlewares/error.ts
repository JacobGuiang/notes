import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import config from '@/config/config';
import logger from '@/config/logger';
import ApiError from '@/utils/ApiError';
import { ErrorRequestHandler } from 'express';

const errorConverter: ErrorRequestHandler = (err, _req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode
      ? StatusCodes.BAD_REQUEST
      : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || getReasonPhrase(statusCode);
    error = new ApiError(statusCode, message, false, err.stack);
  }

  if (
    error.statusCode === StatusCodes.UNAUTHORIZED ||
    error.message === 'User not found'
  ) {
    res.clearCookie('token', { ...config.cookieOptions, signed: false });
  }

  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
