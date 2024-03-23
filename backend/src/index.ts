import app from './app';
import config from './config/config';
import logger from './config/logger';
import db from './config/db';

const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

const exitHandler = async () => {
  if (db) {
    await db.destroy();
    logger.info('Postgres pool closed');
  }
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGINT', exitHandler);

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received');
  if (db) {
    await db.destroy();
    logger.info('Postgres pool closed');
  }
  if (server) {
    server.close(() => {
      logger.info('Server closed');
    });
  }
});
