import config from './config';
import express from 'express';
import Logger from './loaders/logger';

async function startServer() {
  const app = express();

  app.get('/', (_req, res) => {
    res.send('Hello World!');
  });

  app
    .listen(config.port, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on('error', (err) => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
