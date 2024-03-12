import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import pino from 'pino-http';

export default ({ app }: { app: express.Application }) => {
  app.use(pino());

  app.get('/status', (_req, res) => {
    res.status(200).end();
  });

  app.head('/status', (_req, res) => {
    res.status(200).end();
  });

  app.use(cors());

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not Found' }).end();
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(((err, _req, res, _next) => {
    res.status(500).json({ error: err });
  }) as ErrorRequestHandler);
};
