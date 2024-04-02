import config from './config/config';
import express from 'express';
import pino from 'pino-http';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimiter from './middlewares/rateLimiter';
import { errorConverter, errorHandler } from './middlewares/error';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import ApiError from './utils/ApiError';
import routes from './routes';
import cookieParser from 'cookie-parser';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: number; username: string };
  }
}

const app = express();

if (config.env !== 'test') {
  app.use(pino());
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://jacobguiang.github.io'],
    credentials: true,
  })
);
app.options('*', cors());

app.use(cookieParser(config.cookieSecret));

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/auth', rateLimiter);
}

// api routes
app.use('/', routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(
    new ApiError(StatusCodes.NOT_FOUND, getReasonPhrase(StatusCodes.NOT_FOUND))
  );
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
