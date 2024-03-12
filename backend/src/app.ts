import config from './config';
import express from 'express';
import logger from './loaders/logger';
import loaders from './loaders';

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });

  app
    .listen(config.port, () => {
      logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on('error', (err) => {
      logger.error(err);
      process.exit(1);
    });
}

startServer();
