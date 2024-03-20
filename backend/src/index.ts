import app from './app';
import config from './config/config';
import logger from './config/logger';
import postgres from './config/postgress';

const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  postgres.end();
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
